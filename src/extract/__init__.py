"""Extract module - Article content extraction."""

from __future__ import annotations

import asyncio
import json
import logging
import re
import os
from typing import Optional

from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, BrowserConfig, CacheMode
from crawl4ai.extraction_strategy import LLMExtractionStrategy
from crawl4ai.async_configs import LLMConfig
from playwright.async_api import async_playwright
from pydantic import BaseModel, Field

from src.config import (
    FEATURED_NEWS_FILE,
    ARTICLES_DIR,
    GEMINI_API_KEY,
    GEMINI_MODEL_FLASH,
    REQUEST_DELAY_SEC,
)
from src.utils.io import load_json, save_json
from src.utils.api import call_llm_async

logger = logging.getLogger(__name__)


class NewsArticleSchema(BaseModel):
    title: str = Field(description="記事のメイン見出し")
    publish_date: str = Field(description="記事の公開日時")
    body_markdown: str = Field(description="本文のMarkdown")


async def precision_recovery_fallback(
    url: str,
    api_key: str,
    model_name: str,
    instruction: str,
    schema_str: str,
) -> str:
    """高精度コンテンツ復元（Playwright + LLM）"""
    logger.info(f"高精度復元モード: {url[:50]}...")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )
        page = await context.new_page()

        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            await asyncio.sleep(5)
            raw_text = await page.evaluate("() => document.body.innerText")

            for attempt in range(3):
                try:
                    messages = [
                        {
                            "role": "system",
                            "content": f"{instruction}\n\nスキーマ:\n{schema_str}",
                        },
                        {
                            "role": "user",
                            "content": f"以下から記事を抽出:\n\n{raw_text[:15000]}",
                        },
                    ]

                    response = await call_llm_async(
                        f"gemini/{model_name}",
                        messages,
                        api_key=api_key,
                    )

                    json_match = re.search(r"\{.*\}", response, re.DOTALL)
                    if json_match:
                        data = json.loads(json_match.group())
                        return data.get("body_markdown", raw_text)
                except Exception as e:
                    logger.warning(f"Attempt {attempt + 1} 失敗: {e}")
                    await asyncio.sleep(2)

            return raw_text
        finally:
            await browser.close()


def resolve_url_gnews(source_url: str) -> str:
    """GNewsDecoderで直リンクを取得"""
    try:
        from googlenewsdecoder import gnewsdecoder

        decoded = gnewsdecoder(source_url)
        if decoded.get("status"):
            return decoded["decoded_url"]
    except Exception as e:
        logger.warning(f"デコードエラー: {e}")
    return source_url


async def extract_article_content(
    url: str,
    crawler: AsyncWebCrawler,
    run_config: CrawlerRunConfig,
    api_key: str,
    model_name: str,
) -> tuple[str, str]:
    """單一記事を抽出"""
    # GNewsデコード
    final_url = resolve_url_gnews(url)

    try:
        result = await crawler.arun(url=final_url, config=run_config)

        content = ""
        status = "Crawl4AI"

        if result.success and result.extracted_content:
            try:
                data = json.loads(result.extracted_content)
                if isinstance(data, list) and len(data) > 0:
                    data = data[0]
                if isinstance(data, dict):
                    content = data.get("body_markdown", "")
            except:
                pass

        if not content or len(content) < 50:
            instruction = """あなたはプロのデータ抽出エンジニアです。
HTMLから記事を抽出してください。body_markdownに本文を含める。
有料記事の場合は PAYWALL_BLOCKED と記述。"""
            schema_str = json.dumps(
                NewsArticleSchema.model_json_schema(), ensure_ascii=False
            )
            content = await precision_recovery_fallback(
                final_url, api_key, model_name, instruction, schema_str
            )
            status = "PRP-Fallback"

        return content, status
    except Exception as e:
        logger.error(f"抽出エラー: {e}")
        return f"Scrape Error: {e}", "Error"


async def bulk_extract() -> list[dict]:
    """全記事の本文を抽出"""
    articles = load_json(FEATURED_NEWS_FILE)
    if not articles:
        logger.error(f"{FEATURED_NEWS_FILE}が見つかりません")
        return []

    os.makedirs(ARTICLES_DIR, exist_ok=True)
    logger.info(f"全 {len(articles)} 件の抽出を開始...")

    api_key = GEMINI_API_KEY
    model_name = GEMINI_MODEL_FLASH

    llm_config = LLMConfig(provider=f"gemini/{model_name}", api_token=api_key)
    instruction = """あなたはプロのデータ抽出エンジニアです。
HTMLから記事を抽出。body_markdownに本文。有料記事やログインが必要なら PAYWALL_BLOCKED"""

    extraction_strategy = LLMExtractionStrategy(
        llm_config=llm_config,
        schema=NewsArticleSchema.model_json_schema(),
        extraction_type="schema",
        instruction=instruction,
        input_format="markdown",
    )

    browser_config = BrowserConfig(headless=True, light_mode=True)
    run_config = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS,
        extraction_strategy=extraction_strategy,
        wait_until="domcontentloaded",
        magic=True,
        simulate_user=True,
    )

    async with AsyncWebCrawler(config=browser_config, verbose=False) as crawler:
        for i, article in enumerate(articles):
            title = article.get("title", "")
            source_url = article.get("link", "")
            logger.info(f"[{i + 1}/{len(articles)}] {title[:40]}...")

            content, status = await extract_article_content(
                source_url, crawler, run_config, api_key, model_name
            )

            aid = article.get("id")
            filename = f"{ARTICLES_DIR}/{aid}.md"

            md_text = f"# {title}\n\n**Source:** {article.get('site_name', 'Unknown')}\n**URL:** {source_url}\n**Mode:** {status}\n\n---\n\n{content}"

            with open(filename, "w", encoding="utf-8") as f:
                f.write(md_text)

            logger.info(f"保存完了 ({status}): {len(content)} 文字")
            await asyncio.sleep(REQUEST_DELAY_SEC)

    # featured_news.jsonを更新（デコード済みURLを保存）
    save_json(articles, FEATURED_NEWS_FILE)
    logger.info("抽出完了")
    return articles


if __name__ == "__main__":
    import os
    import logging

    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    asyncio.run(bulk_extract())

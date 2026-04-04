import asyncio
import json
import os
import re
import time
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, BrowserConfig, CacheMode
from crawl4ai.extraction_strategy import LLMExtractionStrategy
from crawl4ai.async_configs import LLMConfig
from playwright.async_api import async_playwright
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# .env をロード
load_dotenv()

class NewsArticle(BaseModel):
    # タイトル：短すぎず、記事の核心を突くもの
    title: str = Field(
        description="記事のメイン見出し。メディア名などは含めない純粋なタイトル。"
    )
    
    # 日付：フォーマットを固定して、後で計算しやすくする
    publish_date: str = Field(
        description="記事の公開日時（例: 2026-04-04）。不明な場合は 'Unknown'。"
    )
    
    # 本文：Markdown形式を指定
    body_markdown: str = Field(
        description="広告、メニュー、SNSリンクを完全に排除した本文。見出し(#)や箇条書き(-)を維持したMarkdown形式。"
    )

async def precision_recovery_fallback(url, api_key, model_name, instruction, schema):
    """【高度コンテンツ復元プロトコル】Playwright で構造を解析し、AI アナリストが整形する"""
    print(f"  ✨ [PRECISION RECOVERY] 構造解析 ＆ AI アーキテクトによる最適化中: {url[:50]}...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")
        page = await context.new_page()
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=45000)
            await asyncio.sleep(5) 
            raw_text = await page.evaluate("""() => document.body.innerText""")
            
            # AI で磨く (リトライ・ロジック付き)
            import litellm
            schema_str = json.dumps(schema, ensure_ascii=False)
            
            for attempt in range(3):
                try:
                    response = await litellm.acompletion(
                        model=f"gemini/{model_name}",
                        messages=[
                            {"role": "system", "content": f"{instruction}\n\n以下のスキーマに従ってJSONを出力してください:\n{schema_str}"},
                            {"role": "user", "content": f"以下のテキストから記事を抽出してください:\n\n{raw_text[:15000]}"} 
                        ],
                        api_key=api_key
                    )
                    data = json.loads(response.choices[0].message.content)
                    return data.get('body_markdown', raw_text)
                except litellm.RateLimitError:
                    wait_time = (attempt + 1) * 15
                    print(f"  ⚠️ レートリミット到達。{wait_time}秒待機して再試行します...")
                    await asyncio.sleep(wait_time)
                except Exception as e:
                    print(f"  ❌ AI構造最適化エラー: {e}")
                    return raw_text
            
            return raw_text
        except Exception as e:
            return f"Muddy Scrape Error: {e}"
        finally:
            await browser.close()

async def resolve_url_simple(google_url):
    """Googleニュースのリンクを直リンクに解決"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")
        page = await context.new_page()
        try:
            await page.goto(google_url, wait_until="domcontentloaded", timeout=20000)
            await asyncio.sleep(3)
            return page.url
        except:
            return google_url
        finally:
            await browser.close()

async def bulk_extract_hybrid():
    input_file = "featured_news.json"
    output_dir = "articles_md"
    
    # API設定
    api_key = os.getenv("GEMINI_API_KEY")
    model_name = os.getenv("GEMINI_MODEL_FLASH", "gemini-3.1-flash-lite-preview")

    with open(input_file, "r", encoding="utf-8") as f:
        articles = json.load(f)

    os.makedirs(output_dir, exist_ok=True)
    print(f"🚀 【ハイブリッド抽出】Crawl4AI + Precision Recovery Protocol を開始 (全 {len(articles)} 件)...")

    # AI設定
    llm_config = LLMConfig(provider=f"gemini/{model_name}", api_token=api_key)
    instruction = """あなたはプロのデータ抽出エンジニアです。提供されたHTMLから、指定されたスキーマに従ってニュース記事を抽出してください。

【鉄の掟】
1. 出力は純粋なJSONオブジェクトのみ。前置き（『はい、抽出しました』等）や末尾の解説は一切禁止。
2. body_markdown には、記事のメインコンテンツのみを含めること。サイト共通のヘッダー、フッター、関連記事リスト、広告、SNSシェアボタンは1文字たりとも含めてはいけません。
3. 本文中の画像や動画の埋め込みは無視し、テキスト情報の構造（見出し、リスト）をMarkdownで再現してください。
4. もし記事が有料会員限定などで本文が取得できない場合は、body_markdown を 'PAYWALL_BLOCKED' と記述してください。"""

    extraction_strategy = LLMExtractionStrategy(
        llm_config=llm_config,
        schema=NewsArticle.model_json_schema(),
        extraction_type="schema",
        instruction=instruction,
        input_format="markdown"
    )
    browser_config = BrowserConfig(headless=True, light_mode=True)
    run_config = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS, extraction_strategy=extraction_strategy,
        wait_until="domcontentloaded", magic=True, simulate_user=True
    )

    async with AsyncWebCrawler(config=browser_config, verbose=False) as crawler:
        for i, article in enumerate(articles):
            title = article['title']
            print(f"[{i+1}/{len(articles)}] 処理中: {title[:40]}...")
            
            final_url = await resolve_url_simple(article['link'])
            clean_title = re.sub(r'[\\/:*?\"<>|]', '', title).replace(' ', '_')
            filename = f"{output_dir}/{i+1:02d}_{clean_title[:50]}.md"

            content = ""
            status = "AI"

            try:
                # 第一段階: Crawl4AI
                result = await crawler.arun(url=final_url, config=run_config)
                if result.success and result.extracted_content:
                    try:
                        data = json.loads(result.extracted_content)
                        if isinstance(data, list) and len(data) > 0: data = data[0]
                        if isinstance(data, dict):
                            content = data.get('body_markdown', "")
                            # 必要に応じて日付等もここから取得可能
                    except: pass

                # 第二段階: Precision Recovery Protocol へのフォールバック判定 (50文字未満なら発動)
                if not content or len(content) < 50:
                    content = await precision_recovery_fallback(final_url, api_key, model_name, instruction, NewsArticle.model_json_schema())
                    status = "PRP-Optimized"
                
                # 保存
                md_text = f"# {title}\n\n**Source:** {article.get('site_name', 'Unknown')}\n**URL:** {final_url}\n**Mode:** {status}\n\n---\n\n{content}"
                with open(filename, "w", encoding="utf-8") as f:
                    f.write(md_text)
                print(f"  ✅ 保存完了 ({status}): {len(content)} 文字")
                    
            except Exception as e:
                print(f"  ❌ 失敗: {e}")
            
            await asyncio.sleep(5) # レートリミット (RPM 15) を考慮しつつ時短

if __name__ == "__main__":
    asyncio.run(bulk_extract_hybrid())

import asyncio
import json
import os
import re
import time
from googlenewsdecoder import gnewsdecoder
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, BrowserConfig, CacheMode
from crawl4ai.extraction_strategy import LLMExtractionStrategy
from crawl4ai.async_configs import LLMConfig
from playwright.async_api import async_playwright
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# .env をロード
load_dotenv()

class NewsArticle(BaseModel):
    title: str = Field(description="記事のメイン見出し。")
    publish_date: str = Field(description="記事の公開日時。")
    body_markdown: str = Field(description="本文のMarkdown。")

async def precision_recovery_fallback(url, api_key, model_name, instruction, schema):
    """【高度コンテンツ復元プロトコル】Playwright で構造を解析し、AI アナリストが整形する"""
    print(f"  ✨ [PRECISION RECOVERY] 構造解析 ＆ AI アーキテクトによる最適化中: {url[:50]}...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")
        page = await context.new_page()
        try:
            # networkidle を避け、domcontentloaded を使用
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            await asyncio.sleep(5) 
            raw_text = await page.evaluate("""() => document.body.innerText""")
            
            import litellm
            schema_str = json.dumps(schema, ensure_ascii=False)
            previous_error_msg = ""
            previous_bad_content = ""

            for attempt in range(3):
                try:
                    messages = [
                        {"role": "system", "content": f"{instruction}\n\n以下のスキーマに従ってJSONを出力してください:\n{schema_str}"},
                        {"role": "user", "content": f"以下のテキストから記事を抽出してください:\n\n{raw_text[:15000]}"} 
                    ]
                    
                    if attempt > 0 and previous_bad_content:
                        messages.append({"role": "assistant", "content": previous_bad_content})
                        messages.append({"role": "user", "content": f"❌ 前回の出力はJSONとして不正でした ({previous_error_msg})。純粋な '{{' から始まるJSONオブジェクトのみを再出力してください。"})
                    
                    response = await litellm.acompletion(
                        model=f"gemini/{model_name}",
                        messages=messages,
                        api_key=api_key
                    )
                    
                    content = response.choices[0].message.content
                    previous_bad_content = content
                    
                    json_match = re.search(r'\{.*\}', content, re.DOTALL)
                    if json_match:
                        json_str = json_match.group()
                        data = json.loads(json_str)
                        return data.get('body_markdown', raw_text)
                    else:
                        raise ValueError(f"AI response did not contain valid JSON")
                    
                except Exception as e:
                    previous_error_msg = str(e)
                    print(f"  ❌ AI構造最適化エラー (Attempt {attempt+1}): {e}", flush=True)
                    await asyncio.sleep(2)
            
            return raw_text
        except Exception as e:
            return f"Scrape Error: {e}"
        finally:
            await browser.close()

def resolve_url_gnews(source_url):
    """googlenewsdecoderを使用して直リンクをデコードする"""
    try:
        decoded = gnewsdecoder(source_url)
        if decoded.get("status"):
            return decoded["decoded_url"]
        else:
            print(f"  ⚠️ デコード失敗: {decoded.get('message')}")
            return source_url
    except Exception as e:
        print(f"  ⚠️ デコードエラー: {e}")
        return source_url

async def bulk_extract_gnews():
    input_file = "featured_news.json"
    output_dir = "articles_md"
    
    api_key = os.getenv("GEMINI_API_KEY")
    model_name = os.getenv("GEMINI_MODEL_FLASH", "gemini-3.1-flash-lite-preview")

    with open(input_file, "r", encoding="utf-8") as f:
        articles = json.load(f)

    os.makedirs(output_dir, exist_ok=True)
    print(f"🚀 【GNews Decoder ハイブリッド抽出】を開始 (全 {len(articles)} 件)...")

    llm_config = LLMConfig(provider=f"gemini/{model_name}", api_token=api_key)
    instruction = """あなたはプロのデータ抽出エンジニアです。提供されたHTMLから記事を抽出してください。
出力は純粋なJSONのみ。body_markdown に本文を含めてください。有料記事やログインが必要な場合は PAYWALL_BLOCKED と記述してください。"""

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
            source_url = article['link']
            print(f"[{i+1}/{len(articles)}] 処理中: {title[:40]}...")
            
            # Google News デコードを実行
            final_url = resolve_url_gnews(source_url)
            if final_url != source_url:
                print(f"  🔗 Decoded via GNewsDecoder: {final_url[:60]}...")
            
            article['link'] = final_url
            aid = article.get('id')
            filename = f"{output_dir}/{aid}.md"

            content = ""
            status = "AI"

            try:
                result = await crawler.arun(url=final_url, config=run_config)
                if result.success and result.extracted_content:
                    try:
                        data = json.loads(result.extracted_content)
                        if isinstance(data, list) and len(data) > 0: data = data[0]
                        if isinstance(data, dict):
                            content = data.get('body_markdown', "")
                    except: pass

                if not content or len(content) < 50:
                    content = await precision_recovery_fallback(final_url, api_key, model_name, instruction, NewsArticle.model_json_schema())
                    status = "PRP-Optimized"
                
                md_text = f"# {title}\n\n**Source:** {article.get('site_name', 'Unknown')}\n**URL:** {final_url}\n**Mode:** {status}\n\n---\n\n{content}"
                with open(filename, "w", encoding="utf-8") as f:
                    f.write(md_text)
                print(f"  ✅ 保存完了 ({status}): {len(content)} 文字")
                    
            except Exception as e:
                print(f"  ❌ 失敗: {e}")
            
            await asyncio.sleep(2) # デコード版は速いので待機短め
        
        print(f"📦 解決済みの直リンクを {input_file} に保存しています...")
        with open(input_file, "w", encoding="utf-8") as f:
            json.dump(articles, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    asyncio.run(bulk_extract_gnews())

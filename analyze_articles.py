import os
import json
import time
import glob
import litellm
from datetime import datetime
from dotenv import load_dotenv

# .envの読み込み
load_dotenv()

# Z.ai (GLM) 設定
ZAI_API_KEY = os.getenv("ZAI_API_KEY")
ZAI_BASE_URL = os.getenv("ZAI_BASE_URL")
ZAI_MODEL = f"openai/{os.getenv('ZAI_MODEL_large', 'glm-5.1')}"

def analyze_topic_integrated(topic_name, combined_content, is_grouped=False):
    """
    トピックに基づき、業界アナリストとして深掘り分析を行います。
    複数ソースがある場合は、それらを統合したインサイトを生成します。
    """
    system_instructions = """
あなたは伝説の自動車業界アナリストです。提供された「1つまたは複数の記事情報（Markdown）」を深く読み込み、業界人が唸るような鋭い分析を日本語で行ってください。

【分析の掟】
1. 3行要約 (summary_points):
   - 表面的な事実ではなく、業界を揺るがす「構造的要因」や「具体的な数字」を3点。
   - 複数ソースがある場合は、情報を統合して最も重要なポイントを抽出してください。
2. 業界インサイト (insight):
   - このトピックが将来の日本メーカー、中国メーカー、供給網、または充電インフラの覇権争いにどう影響するか。
   - 単なる要約ではなく、アナリストとしての「予測」や「懸念」を150文字程度で鋭く解説。
   - 複数ソースで視点が異なる場合は、その対立軸についても言及してください。

出力形式は必ず以下の純粋なJSON形式にしてください。
{
  "summary_points": ["核心1", "核心2", "核心3"],
  "insight": "鋭い業界解説..."
}
"""
    
    if is_grouped:
        user_input = f"トピック: {topic_name}\n\n以下は複数のソースから統合された情報です:\n\n{combined_content[:20000]}"
    else:
        user_input = f"トピック: {topic_name}\n\n記事本文Markdown:\n{combined_content[:15000]}"

    # GLM (via Z.ai) へのリクエスト
    for attempt in range(3):
        try:
            response = litellm.completion(
                model=ZAI_MODEL,
                messages=[
                    {"role": "system", "content": system_instructions},
                    {"role": "user", "content": user_input}
                ],
                api_key=ZAI_API_KEY,
                api_base=ZAI_BASE_URL
                # response_format={"type": "json_object"} # 互換性のために削除
            )
            
            # 生テキストのパースとクリーニング
            raw_content = response.choices[0].message.content.strip()
            clean_json_str = raw_content.replace("```json", "").replace("```", "").strip()
            
            return json.loads(clean_json_str)
        except litellm.RateLimitError:
            wait_time = (attempt + 1) * 60
            print(f"    ⚠️ レート制限 (RateLimitError): {wait_time}秒待機して再試行します...", flush=True)
            time.sleep(wait_time)
        except Exception as e:
            print(f"    ❌ AI分析エラー (Attempt {attempt+1}): {e}", flush=True)
            time.sleep(10 * (attempt + 1)) # エラー時は徐々に待機を増やす

    return {
        "summary_points": ["分析エラーが発生しました"],
        "insight": "リトライ上限に達したため分析結果の生成に失敗しました。"
    }

def get_md_content_by_id(article_id, input_dir):
    """
    IDを指定して Markdown ファイルを直接読み込みます。
    """
    filename = os.path.join(input_dir, f"{article_id}.md")
    if os.path.exists(filename):
        with open(filename, "r", encoding="utf-8") as f:
            return f.read()
    return ""

def main():
    input_dir = "articles_md"
    featured_json = "featured_news.json"
    grouped_json = "grouped_news.json"
    output_file = "final_reports.json"

    if not os.path.exists(grouped_json):
        print(f"Error: {grouped_json} が存在しません。group_news.py を先に実行してください。")
        return

    with open(featured_json, "r", encoding="utf-8") as f:
        original_articles = json.load(f)
    with open(grouped_json, "r", encoding="utf-8") as f:
        grouped_list = json.load(f)

    print(f"🚀 【統合分析フェーズ】{len(grouped_list)} つの戦略トピックを分析します (使用モデル: {ZAI_MODEL})", flush=True)
    
    final_reports = []

    for i, group in enumerate(grouped_list):
        topic_name = group["topic_name"]
        aids = group["article_ids"]
        is_grouped = group.get("is_grouped", False)

        print(f"\n[{i+1}/{len(grouped_list)}] 分析中: {topic_name} ({'統合' if is_grouped else '単独'})", flush=True)
        
        # 本文の収集・結合
        combined_content = ""
        for aid in aids:
            content = get_md_content_by_id(aid, input_dir)
            if is_grouped:
                combined_content += f"--- ソース記事(ID:{aid}) ---\n{content}\n\n"
            else:
                combined_content = content

        # 統合分析の実行
        analysis = analyze_topic_integrated(topic_name, combined_content, is_grouped)
        
        # データの統合（記事詳細を埋め込み、自己完結型に）
        report_item = {
            "topic_name": topic_name,
            "article_ids": aids,
            "articles": [a for a in original_articles if a.get("id") in aids],
            "is_grouped": is_grouped,
            "analysis": analysis
        }
        
        final_reports.append(report_item)
        
        # 逐次保存
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(final_reports, f, ensure_ascii=False, indent=4)
        
        print(f"    ✅ 分析完了", flush=True)
        time.sleep(3) # Z.ai への負荷調整 (レート制限対策)

    print(f"\n✨ インテリジェンス・ポートフォリオが完成しました！", flush=True)
    print(f"📄 最終成果物: {output_file}")

    # アーカイブ保存 (YYYY-MM-DD.json)
    today = datetime.now().strftime("%Y-%m-%d")
    archive_dir = "archive"
    os.makedirs(archive_dir, exist_ok=True)
    archive_file = os.path.join(archive_dir, f"{today}.json")
    
    with open(archive_file, "w", encoding="utf-8") as f:
        json.dump(final_reports, f, ensure_ascii=False, indent=4)
    print(f"📦 アーカイブ保存完了: {archive_file}", flush=True)

    # 追加：AIによる最終校閲（トピック名の整合性チェック）
    print(f"\n🧐 最終校閲（AIエディター）を実行中...")
    try:
        from verify_reports import verify_reports
        verify_reports()
    except Exception as e:
        print(f"⚠️ 校閲ステップでエラーが発生しました: {e}")

if __name__ == "__main__":
    main()

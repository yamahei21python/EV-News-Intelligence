import os
import json
import litellm
from dotenv import load_dotenv

# .envの読み込み
load_dotenv()

# Gemini 設定
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = f"gemini/{os.getenv('GEMINI_MODEL_FLASH', 'gemini-3.1-flash-lite-preview')}"

GROUPING_PROMPT = """
あなたはプロのニュース編集者です。
提供されたニュースのタイトルと内容冒頭のリストを確認し、**「完全に同じトピック（例：特定の企業の同じ決算発表、同じイベントに関する報道、同じ補助金返還問題）」**をグループ化してください。

【ルール】
1. 重複している話題のみグループ化し、分かりやすい `topic_name` をつけてください。
2. 独立した話題（地方ニュースや単独のトピック）は、無理にグループ化せず、そのまま単独の記事として扱ってください（単独の場合は topic_name は元の記事タイトルのままで構いません）。
3. グループ化する際は、複数の記事 ID を `article_ids` に含めてください。

【出力フォーマット】
必ず以下のJSONオブジェクト形式（"groups" というキーを持つ辞書型）でのみ出力してください。余計な解説は不要です。
{
  "groups": [
    {
      "topic_name": "ホンダ、四輪事業の赤字と戦略転換",
      "article_ids": [6, 42, 43, 45, 46],
      "is_grouped": true
    },
    {
      "topic_name": "福岡・直方市が公園にEV用充電器",
      "article_ids": [2],
      "is_grouped": false
    }
  ]
}
"""

def group_articles():
    input_dir = "articles_md"
    featured_json = "featured_news.json"
    output_file = "grouped_news.json"

    if not os.path.exists(featured_json):
        print(f"Error: {featured_json} が存在しません。")
        return

    with open(featured_json, "r", encoding="utf-8") as f:
        articles = json.load(f)

    print(f"🔍 全 {len(articles)} 件の記事を読み込み、名寄せ（グルーピング）を開始します...")

    # AIに渡す情報の構築
    ai_input_data = []
    for i, article in enumerate(articles):
        aid = article.get("id")
        title = article.get("title")
        
        # Markdown ファイルの冒頭を読み取る
        target_prefix = f"{i+1:02d}_"
        content_intro = "(本文なし)"
        
        # ファイルリストを取得して接頭辞で探す
        import glob
        md_files = glob.glob(os.path.join(input_dir, f"{target_prefix}*.md"))
        if md_files:
            with open(md_files[0], "r", encoding="utf-8") as f:
                content = f.read()
                # ペイウォール排除：PAYWALL_BLOCKED が含まれていたらスキップ
                if "PAYWALL_BLOCKED" in content:
                    print(f"  ⏭️ スキップ (有料記事): {title}")
                    continue
                content_intro = content[:500].replace("\n", " ") # 冒頭500文字

        ai_input_data.append({
            "id": aid,
            "title": title,
            "intro": content_intro
        })

    user_message = f"【記事データリスト】\n{json.dumps(ai_input_data, ensure_ascii=False, indent=2)}"

    try:
        response = litellm.completion(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": GROUPING_PROMPT},
                {"role": "user", "content": user_message}
            ],
            api_key=GEMINI_API_KEY,
            response_format={"type": "json_object"}
        )
        
        grouped_result = json.loads(response.choices[0].message.content.strip())
        
        # 配列であることを確認（AIがオブジェクトで包んでくる場合があるため）
        if isinstance(grouped_result, dict) and "groups" in grouped_result:
            grouped_result = grouped_result["groups"]
        elif isinstance(grouped_result, dict) and not isinstance(grouped_result, list):
            # キー名が不定の場合、最初のリストを取得
            for val in grouped_result.values():
                if isinstance(val, list):
                    grouped_result = val
                    break

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(grouped_result, f, ensure_ascii=False, indent=4)

        print(f"✨ 名寄せ完了！ {len(grouped_result)} 個のトピックに集約されました。")
        print(f"📄 結果保存先: {output_file}")

    except Exception as e:
        print(f"❌ AI名寄せエラー: {e}")

if __name__ == "__main__":
    group_articles()

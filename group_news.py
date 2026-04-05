import os
import json
import litellm
from dotenv import load_dotenv

# .envの読み込み
load_dotenv()

# Gemini 設定
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = f"gemini/{os.getenv('GEMINI_MODEL_FLASH', 'gemini-3.1-flash-lite-preview')}"

# Z.ai (GLM) 設定 (Fallback用)
ZAI_API_KEY = os.getenv("ZAI_API_KEY")
ZAI_BASE_URL = os.getenv("ZAI_BASE_URL")
ZAI_MODEL = f"openai/{os.getenv('ZAI_MODEL_large', 'glm-5.1')}"

GROUPING_PROMPT = """
あなたはプロのニュース編集者です。提供されたニュース記事をテーマごとに名寄せ（グルーピング）してください。

【重要：IDの取り扱い】
- 各記事には **6桁の数値 ID** が割り当てられています。
- 出力する `article_ids` は、必ず入力リストに存在する ID を **正確にそのまま** 使用してください。
- **IDを捏造したり、別の記事のIDを流用したりすることは絶対に禁止です。**
- IDの紐付けミスは、最終レポートの品質を致命的に損ないます。

【グルーピングのルール】
1. **「完全に同じ話題（例：特定の企業の同じ不祥事、同じイベント、同じ提携話）」**のみをグループ化し、適切な `topic_name` をつけてください。
2. 独立した話題（地方ニュースや単一のトピック）は、無理にグループ化せず、そのまま単一のトピックとして扱ってください。
3. `topic_name` について：
   - グループ化されたかどうかにかかわらず、**「15文字程度の極めて短いトピック名」**に要約してください。
   - 元の長いタイトルをそのまま使わないでください。
   - 業界人が一目で内容を把握できる、洗練された短いタイトルにしてください。
4. グループ化する場合、`is_grouped` を `true` に、単独の場合は `false` にしてください。

【出力フォーマット】
必ず以下のJSONオブジェクト形式でのみ出力してください。
{
  "groups": [
    {
      "topic_name": "万博EVバスの使用断念",
      "article_ids": [183926, 93369],
      "is_grouped": true
    },
    {
      "topic_name": "直方市が公園にEV充電器",
      "article_ids": [921504],
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
    for article in articles:
        aid = article.get("id")
        title = article.get("title")
        
        # Markdown ファイルの読み取り（IDベースに変更）
        md_file = os.path.join(input_dir, f"{aid}.md")
        content_intro = "(本文なし)"
        
        if os.path.exists(md_file):
            with open(md_file, "r", encoding="utf-8") as f:
                content = f.read()
                # 排除：有料記事または抽出失敗
                if "PAYWALL_BLOCKED" in content or "Scrape Error" in content:
                    reason = "有料記事" if "PAYWALL_BLOCKED" in content else "抽出失敗"
                    print(f"  ⏭️ スキップ ({reason}): {title}")
                    continue
                content_intro = content[:500].replace("\n", " ") # 冒頭500文字
        else:
            print(f"  ⚠️ 警告: 本文ファイルが見つかりません: {md_file}")

        ai_input_data.append({
            "id": aid,
            "title": title,
            "intro": content_intro
        })

    user_message = f"【記事データリスト】\n{json.dumps(ai_input_data, ensure_ascii=False, indent=2)}"

    grouped_result = None

    for attempt in range(3):
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
            break # 成功

        except (litellm.ServiceUnavailableError, litellm.RateLimitError) as e:
            wait_time = (attempt + 1) * 30
            print(f"  ⚠️ Gemini 一時的エラー ({type(e).__name__})。{wait_time}秒待機してリトライします({attempt+1}/3)...")
            time.sleep(wait_time)
        except Exception as e:
            print(f"  ❌ Gemini 予期せぬエラー: {e}")
            break

    if not grouped_result:
        print(f"  🔄 Gemini が 3 回失敗したため、Z.ai (GLM) にフォールバックします...")
        try:
            response = litellm.completion(
                model=ZAI_MODEL,
                messages=[
                    {"role": "system", "content": GROUPING_PROMPT},
                    {"role": "user", "content": user_message}
                ],
                api_key=ZAI_API_KEY,
                api_base=ZAI_BASE_URL
            )
            content = response.choices[0].message.content.strip()
            clean_json_str = content.replace("```json", "").replace("```", "").strip()
            grouped_result = json.loads(clean_json_str)
            print(f"  ✨ Z.ai によるリカバリに成功しました。")
        except Exception as e:
            print(f"  ❌ Z.ai へのフォールバックも失敗しました: {e}")
            return

    try:
        # 配列であることを確認（AIがオブジェクトで包んでくる場合があるため）
        if isinstance(grouped_result, dict) and "groups" in grouped_result:
            grouped_result = grouped_result["groups"]
        elif isinstance(grouped_result, dict) and not isinstance(grouped_result, list):
            # キー名が不定の場合、最初のリストを取得
            for val in grouped_result.values():
                if isinstance(val, list):
                    grouped_result = val
                    break

        # バリデーション: AIが返したIDが実際に入力したものかチェック
        all_input_ids = {a["id"] for a in ai_input_data}
        validated_groups = []
        
        for group in grouped_result:
            original_ids = group.get("article_ids", [])
            # 入力リストに存在するIDのみを残す
            valid_ids = [aid for aid in original_ids if aid in all_input_ids]
            
            if not valid_ids:
                print(f"  ⚠️ 警告: トピック '{group.get('topic_name')}' に有効なIDが含まれていないためスキップします。")
                continue
            
            if len(valid_ids) != len(original_ids):
                invalid_count = len(original_ids) - len(valid_ids)
                print(f"  ⚠️ 警告: トピック '{group.get('topic_name')}' から {invalid_count} 件の不正なIDを除外しました。")
            
            group["article_ids"] = valid_ids
            validated_groups.append(group)

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(validated_groups, f, ensure_ascii=False, indent=4)

        print(f"✨ 名寄せ完了！ {len(validated_groups)} 個のトピックに集約されました。")
        print(f"📄 結果保存先: {output_file}")

    except Exception as e:
        print(f"❌ AI名寄せエラー: {e}")

if __name__ == "__main__":
    group_articles()

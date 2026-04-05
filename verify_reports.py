import os
import json
import litellm
import time
from dotenv import load_dotenv

# .envの読み込み
load_dotenv()

# Gemini 設定
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = f"gemini/{os.getenv('GEMINI_MODEL_FLASH', 'gemini-3.1-flash-lite-preview')}"

BATCH_VERIFY_PROMPT = """
あなたはプロのニュース校閲者です。提供された「レポートのリスト」を読み、それぞれの「トピック名」が「記事内容」と一致しているか一括で確認してください。

【確認のルール】
1. 各トピック名が、紐付いている記事の内容を正しく要約しているか確認します。
2. もしトピック名が記事内容と無関係（例：記事はテスラの話なのにトピック名が地域ニュースになっている等）な場合は、正しいトピック名を再生成してください。
3. トピック名は **「15文字程度の極めて短いもの」** にしてください。
4. 全く問題がない場合は、元のトピック名をそのまま返してください。
5. 出力は必ず、入力された `id` を保持した純粋なJSON配列形式にしてください。

【出力フォーマット】
[
  {
    "id": number,
    "is_consistent": boolean, 
    "corrected_topic_name": "修正後の短いトピック名"
  },
  ...
]
"""

def verify_reports():
    report_file = "final_reports.json"
    if not os.path.exists(report_file):
        print(f"Error: {report_file} が見当たりません。")
        return

    with open(report_file, "r", encoding="utf-8") as f:
        reports = json.load(f)

    if not reports:
        print("検証対象のレポートがありません。")
        return

    print(f"🧐 {len(reports)} 件のレポートを AI エディターが一括校閲中...")
    
    # 待機時間の挿入 (ユーザー指定)
    print("  ⏳ APIクォータ調整のため 5秒間待機します...")
    time.sleep(5)

    # バッチ用の入力データ作成
    batch_input = []
    for i, report in enumerate(reports):
        articles_info = [{"title": a["title"], "summary": a.get("summary", "")[:100]} for a in report["articles"]]
        batch_input.append({
            "id": i,
            "topic_name": report["topic_name"],
            "articles": articles_info
        })

    # AI判定
    any_fixed = False
    try:
        response = litellm.completion(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": BATCH_VERIFY_PROMPT},
                {"role": "user", "content": json.dumps(batch_input, ensure_ascii=False)}
            ],
            api_key=GEMINI_API_KEY,
            response_format={"type": "json_object"} if "gemini" in MODEL_NAME else None
        )
        
        content = response.choices[0].message.content.strip()
        # Markdown block 除去
        if content.startswith("```json"): content = content[7:-3].strip()
        elif content.startswith("```"): content = content[3:-3].strip()
        
        results = json.loads(content)
        # 配列であることを確認（AIがオブジェクトで包んでくる場合があるための救済ロジック）
        if isinstance(results, dict) and "results" in results:
            results = results["results"]
        elif isinstance(results, dict) and not isinstance(results, list):
            # キー名が不定の場合、最初のリストを取得
            for val in results.values():
                if isinstance(val, list):
                    results = val
                    break
        
        if not isinstance(results, list):
            # それでもリストでなければ単体として扱う
            results = [results]

        # 結果の反映
        for res in results:
            idx = res.get("id")
            if idx is not None and idx < len(reports):
                if not res.get("is_consistent", True):
                    old_topic = reports[idx]["topic_name"]
                    new_topic = res.get("corrected_topic_name", old_topic)
                    if old_topic != new_topic:
                        print(f"  🚨 不一致を検知 (id:{idx}): '{old_topic}' -> '{new_topic}'")
                        reports[idx]["topic_name"] = new_topic
                        any_fixed = True

    except Exception as e:
        print(f"  ❌ 一括校閲エラー: {e}")
        return

    if any_fixed:
        with open(report_file, "w", encoding="utf-8") as f:
            json.dump(reports, f, ensure_ascii=False, indent=4)
        print("✨ レポートの整合性を修正し、保存しました。")
    else:
        print("✅ 全てのレポートで整合性が確認されました。")

if __name__ == "__main__":
    verify_reports()

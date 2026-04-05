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

SINGLE_VERIFY_PROMPT = """
あなたはプロのニュース校閲者です。提供された「1つのトピック」について、その「トピック名」が「記事内容」を正しく、かつ鋭く要約しているか確認してください。

【確認のルール】
1. トピック名が具体的で、記事の核心を突いているか確認します。
2. もしトピック名が曖昧（例：「〜の動向」「〜のまとめ」など）な場合や、内容と無関係な場合は、より具体的なトピック名を再生成してください。
3. トピック名は **「15文字程度の極めて短いもの」** にしてください。具体性（誰が何をどうした）を最優先してください。
4. 全く問題がない場合は、入力されたトピック名をそのまま返してください。

【出力フォーマット】
必ず以下のJSON形式でのみ出力してください。
{
  "is_consistent": boolean, 
  "corrected_topic_name": "修正後の短いトピック名"
}
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

    print(f"🧐 {len(reports)} 件のレポートを丁寧（順次）に校閲中...")
    
    any_fixed = False
    
    for i, report in enumerate(reports):
        current_topic = report["topic_name"]
        articles_info = [{"title": a["title"], "summary": a.get("summary", "")[:200]} for a in report["articles"]]
        
        print(f"  [{i+1}/{len(reports)}] チャレンジ中: {current_topic}", flush=True)

        user_input = {
            "topic_name": current_topic,
            "articles": articles_info
        }

        try:
            response = litellm.completion(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": SINGLE_VERIFY_PROMPT},
                    {"role": "user", "content": json.dumps(user_input, ensure_ascii=False)}
                ],
                api_key=GEMINI_API_KEY,
                response_format={"type": "json_object"} if "gemini" in MODEL_NAME else None
            )
            
            content = response.choices[0].message.content.strip()
            # Markdown block 除去
            if content.startswith("```json"): content = content[7:-3].strip()
            elif content.startswith("```"): content = content[3:-3].strip()
            
            res = json.loads(content)
            
            if not res.get("is_consistent", True):
                new_topic = res.get("corrected_topic_name", current_topic)
                if current_topic != new_topic:
                    print(f"    🚨 トピック名を修正: '{current_topic}' -> '{new_topic}'")
                    reports[i]["topic_name"] = new_topic
                    any_fixed = True
                    # 修正した場合は逐次保存（フリーズ対策）
                    with open(report_file, "w", encoding="utf-8") as f:
                        json.dump(reports, f, ensure_ascii=False, indent=4)
            
            # レート制限対策: 15回/分 (Gemini Free) のため、4秒以上の待機を推奨
            if i < len(reports) - 1:
                time.sleep(4)

        except Exception as e:
            print(f"    ❌ 校閲エラー (件数:{i+1}): {e}")
            # エラー時は少し長く待って続行
            time.sleep(10)
            continue

    if any_fixed:
        with open(report_file, "w", encoding="utf-8") as f:
            json.dump(reports, f, ensure_ascii=False, indent=4)
        print("✨ レポートの整合性を修正し、保存しました。")
    else:
        print("✅ 全てのレポートで整合性が確認されました。")

if __name__ == "__main__":
    verify_reports()

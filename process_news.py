import os
import json
import time
import litellm
from difflib import SequenceMatcher
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

# ロギング設定
litellm.telemetry = False # 不要な通信を抑制

def get_similarity(a, b):
    """2つの文字列の類似度を計算(0.0 - 1.0)"""
    return SequenceMatcher(None, a, b).ratio()

def normalize_title(title):
    """タイトルからメディア名やカッコ内のノイズを除去して純粋な見出しにする"""
    import re
    import unicodedata
    # 全角・半角の正規化
    t = unicodedata.normalize('NFKC', title)
    # 「 - メディア名」を削除
    t = t.split(" - ")[0]
    # カッコ（全角・半角）内のテキストを削除
    t = re.sub(r'（.*?）|\(.*?\)', '', t)
    # 末尾のメディア名をさらに強引に削除（。以降や、特定の末尾キーワード）
    t = re.sub(r'\|.*$', '', t)
    return t.strip()

def get_site_priority(site_name):
    """メディアごとの取得しやすさ・信頼性スコア"""
    priorities = {
        "Yahoo!ニュース": 100,
        "日本経済新聞": 90,
        "carview!": 80,
        "Merkmal": 75,
        "WEB CARTOP": 70,
        "Forbes JAPAN": 10, # ギャラリー形式でノイズが多いため優先度を最低に
    }
    return priorities.get(site_name, 50)

def is_major_media(site_name):
    """大手紙または主要メディアかどうかを判定"""
    # 1. 除外（テレビ局・動画・ポータル・非日本語の特定ワード）
    excluded_keywords = [
        "TBS", "日テレ", "テレビ朝日", "フジテレビ", "テレビ東京", "FNN", "NNN", "JNN", "ANN", "DIG",
        "ABEMA", "ニコニコ", "TRILL", "GUNOSY", "AU WEB", "Dメニュー", "MSN", "STRAIGHT PRESS",
        "SPEEDME.RU", "매일경제", "千葉テレビ放送", "KHB", "ｄメニューニュース", "KTV"
    ]
    if any(k in site_name.upper() for k in excluded_keywords):
        return False
    
    # 地方紙は一律排除せず、AIの文脈判断に委ねる（地域固有のインテリジェンス救済のため）
    return True

def deduplicate_articles(articles, threshold=0.7):
    """
    タイトルの類似度に基づき、重複記事を排除し、
    同時に「地方新聞」をフィルタリングします。
    """
    unique_articles_map = {} # 正規化タイトル -> 記事オブジェクト
    
    for article in articles:
        # 地方紙フィルタリング
        if not is_major_media(article["site_name"]):
            continue

        norm_title = normalize_title(article["title"])
        is_duplicate = False
        
        # 既存のユニーク記事リストと比較
        for key in list(unique_articles_map.keys()):
            if get_similarity(norm_title, key) > threshold:
                # 重複発見！優先度を比較して、高い方を残す
                current_exclusive = unique_articles_map[key]
                if get_site_priority(article["site_name"]) > get_site_priority(current_exclusive["site_name"]):
                    # 新しい記事の方が優先度が高いので差し替える
                    del unique_articles_map[key]
                    unique_articles_map[norm_title] = article
                is_duplicate = True
                break
        
        if not is_duplicate:
            unique_articles_map[norm_title] = article
    
    return list(unique_articles_map.values())

def create_only_title_json():
    """
    news_data.json からタイトル情報のみを抜き出した only_title.json を作成します。
    フェーズ1.5: 保存前に類似記事を排除（圧縮）します。
    """
    if not os.path.exists("news_data.json"):
        print("Error: news_data.json が見当たりません。")
        return None

    with open("news_data.json", "r", encoding="utf-8") as f:
        full_data = json.load(f)
    
    raw_articles = full_data.get("articles", [])
    print(f"🔍 全記事数: {len(raw_articles)} 件")

    # フェーズ1.5: 重複排除
    compressed_articles = deduplicate_articles(raw_articles)
    removed_count = len(raw_articles) - len(compressed_articles)
    print(f"✂️ フェーズ1.5完了: {removed_count} 件の類似記事を排除しました。")
    print(f"📦 判定対象（ユニーク記事）: {len(compressed_articles)} 件")

    only_titles = []
    for idx, article in enumerate(compressed_articles):
        # 圧縮後のリストにおけるIDを（元の値を保持して）引き継ぐ
        only_titles.append({
            "id": article.get("id"),
            "title": article["title"],
            "site_name": article["site_name"],
            "original_index": raw_articles.index(article) # 元データへの参照用
        })
    
    with open("only_title.json", "w", encoding="utf-8") as f:
        json.dump(only_titles, f, ensure_ascii=False, indent=4)
    
    print(f"✅ only_title.json (圧縮版) を作成しました。")
    return only_titles, compressed_articles

def process_news_with_ai(articles_to_process, original_articles):
    """
    AIにニュースの判定を依頼します。
    """
    featured_articles = []
    
    SYSTEM_PROMPT = """
# ミッション
あなたは、電気自動車（EV）および次世代モビリティ業界の未来を見通す、熟練の業界アナリスト兼ニュースエディターです。
入力されるEV関連ニュースの「タイトル」と「配信元（ソース）」を読み、業界エコシステムや将来の市場に与えるインパクトの大きさに基づいて、ニュースの重要度を1〜10点でスコアリングしてください。

# 判定プロセス（必ず以下の順序で思考すること）
【Step 1】配信元の確認（ノイズの除外）
- ソースが「地方紙（福井新聞、西日本新聞、信濃毎日新聞、カナロコ等）」や「テレビ局（TBS、日テレ、ANN等）」であるか確認する。
- 上記に該当し、かつ内容が「大手メーカー（テスラ、トヨタ、BYD等）の動向」や「政府の全体方針（共同通信の転載）」である場合、トピックの重要度に関わらず、スコアは機械的に【1〜2点】とする。

【Step 2】ローカル記事の救済判定
- 地方紙であっても、タイトルに「特定の県・市・地域名」「地元の実証実験」など、その地域固有の一次情報が含まれる場合は価値があるとみなし、【7〜9点】の評価を与える。

【Step 3】プロフェッショナルな一次情報の評価
- 日経、読売、朝日、ロイター、ブルームバーグ、専門誌などの記事は、以下の「高評価基準」に照らし合わせて【5〜10点】で評価する。

# 高評価基準（7〜10点の条件）
以下のテーマに該当するものは、業界のゲームチェンジャーとなるため高く評価してください。
1. Geopolitics & Policy (政策・関税・地政学的な戦略)
2. Supply Chain & Core Tech (全固体電池、半導体、サプライチェーンの再構築)
3. Data & Ecosystem (走行データの収益化、カーボンクレジット/J-クレジット等の制度連携、トークンエコノミー、充電インフラの標準化)
4. Strategic Shifts (大手企業のビジネスモデル転換、アライアンス構築)

# 低評価基準（1〜3点）
- 新型車の単なる発表、発売開始、個人の試乗レビュー。
- 大きな戦略変更を伴わない、日常的な株価変動や販売台数レポート。

# 出力フォーマット（厳守）
入力されたリストに対応する、純粋なJSON配列のみを出力してください。Markdownのコードブロック（```json）は不要です。
必ず「reason」で分析を行ってから「score」を算出してください。

[
  {
    "id": [入力のid],
    "primary_category": "[1〜4のカテゴリ名（英語）または 'Noise']",
    "reason": "[Step1〜3の判定理由と、業界へのインパクトを簡潔に説明（日本語50文字以内）]",
    "score": [1から100までの整数],
    "is_highly_important": boolean // スコア70以上、または独自の戦略的価値がある場合に true、それ以外はfalse
  }
]
"""

    total = len(articles_to_process)
    results_map = {}

    print(f"AI判定中... 全 {total} 件を一括送信（Gemini Context Window 最適化モード）")
    
    user_prompt = json.dumps(articles_to_process, ensure_ascii=False, indent=2)
    
    for attempt in range(3):
        try:
            response = litellm.completion(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                api_key=GEMINI_API_KEY
            )
            
            content = response.choices[0].message.content.strip()
            if content.startswith("```json"):
                content = content[7:-3].strip()
            elif content.startswith("```"):
                content = content[3:-3].strip()
                
            batch_results = json.loads(content)
            print(f"  ✅ AIから {len(batch_results)} 件の結果を受信しました。")
            for res in batch_results:
                results_map[res["id"]] = res
            
            print(f"  📊 results_map のサイズ: {len(results_map)}")
            break # 成功したらループを抜けてマッピングへ

        except (litellm.ServiceUnavailableError, litellm.RateLimitError) as e:
            wait_time = (attempt + 1) * 30
            print(f"  ⚠️ Gemini 一時的エラー ({type(e).__name__})。{wait_time}秒待機してリトライします({attempt+1}/3)...")
            time.sleep(wait_time)
        except Exception as e:
            print(f"  ❌ Gemini 予期せぬエラー: {e}")
            break # 深刻なエラーは即座に中断

    # --- Fallback to Z.ai ---
    if not results_map:
        print(f"  🔄 Gemini が 3 回失敗したため、Z.ai (GLM) にフォールバックします...")
        try:
            response = litellm.completion(
                model=ZAI_MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                api_key=ZAI_API_KEY,
                api_base=ZAI_BASE_URL
            )
            content = response.choices[0].message.content.strip()
            clean_json_str = content.replace("```json", "").replace("```", "").strip()
            batch_results = json.loads(clean_json_str)
            for res in batch_results:
                results_map[res["id"]] = res
            print(f"  ✨ Z.ai によるリカバリに成功しました。")
        except Exception as e:
            print(f"  ❌ Z.ai へのフォールバックも失敗しました: {e}")

    # 判定結果のマッピングと保存
    print(f"  🔧 最終マッピング開始 (対象: {len(original_articles)} 件, 結果マップ: {len(results_map)} 件)")
    for article in original_articles:
        aid = article.get("id")
        # 型の不一致(int vs str)を避けるため、念のため両方でチェックするか正規化する
        aid_key = aid
        if aid_key in results_map:
            article.update(results_map[aid_key])
            if article.get("is_highly_important") or article.get("score", 0) >= 70:
                featured_articles.append(article)
        elif str(aid) in results_map:
            article.update(results_map[str(aid)])
            if article.get("is_highly_important") or article.get("score", 0) >= 70:
                featured_articles.append(article)
    
    print(f"  🏁 抽出完了: {len(featured_articles)} 件の重要記事を選定しました。")

    with open("featured_news.json", "w", encoding="utf-8") as f:
        json.dump(featured_articles, f, ensure_ascii=False, indent=4)
    
    print(f"\n✨ 判定完了！重要ニュースとして {len(featured_articles)} 件を抽出しました。")

if __name__ == "__main__":
    result = create_only_title_json()
    if result:
        only_titles, compressed_list = result
        process_news_with_ai(only_titles, compressed_list)
        
        # 最後に校閲スクリプトを呼び出す予定（分析完了後）
        # os.system("python verify_reports.py")

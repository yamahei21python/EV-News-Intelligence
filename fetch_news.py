import feedparser
import json
from datetime import datetime

def fetch_ev_news_from_google_rss():
    # GoogleニュースのRSS URL
    # 検索クエリ: "EV", 期間: "when:1d" (より安定), 言語/地域: 日本語/日本
    rss_url = "https://news.google.com/rss/search?q=EV+when:1d&hl=ja&gl=JP&ceid=JP:ja"

    # RSSフィードを取得・解析
    print("Googleニュースから記事を取得中...")
    feed = feedparser.parse(rss_url)

    news_list = []

    for entry in feed.entries:
        # 各記事のデータを抽出
        title = entry.title
        link = entry.link
        published = entry.published
        # 要約（スニペット）の抽出。存在しない場合は空文字
        summary = entry.summary if 'summary' in entry else ""
        
        # サイト名（配信元）の取得
        # Google NewsのRSSは <source> タグにサイト名が入っています
        site_name = entry.source.title if 'source' in entry else "不明"

        # 辞書形式でリストに追加
        news_list.append({
            "title": title,
            "link": link,
            "published": published,
            "summary": summary,
            "site_name": site_name
        })

    return news_list

def save_to_json(data, filename="news_data.json"):
    """
    既存データを読み込み、重複を排除して新しい記事を追記します。
    """
    existing_articles = []
    if os.path.exists(filename):
        try:
            with open(filename, "r", encoding="utf-8") as f:
                content = json.load(f)
                existing_articles = content.get("articles", [])
        except Exception as e:
            print(f"⚠️ 既存ファイルの読み込みに失敗しました: {e}")

    # 重複チェック用のURLセット
    existing_links = {a["link"] for a in existing_articles}
    
    new_count = 0
    merged_articles = existing_articles.copy()
    
    # 新規記事を末尾に追加（URLが未登録のものだけ）
    for article in data:
        if article["link"] not in existing_links:
            merged_articles.append(article)
            existing_links.add(article["link"])
            new_count += 1

    # データの肥大化防止（最新の1,000件を残す）
    if len(merged_articles) > 1000:
        merged_articles = merged_articles[-1000:]

    output = {
        "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_count": len(merged_articles),
        "articles": merged_articles
    }
    
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=4)
    
    print(f"✨ 重複を除いた {new_count} 件の新着記事を追加しました。")
    print(f"📄 全記事数: {len(merged_articles)} -> {filename} に保存完了。")

if __name__ == "__main__":
    import os
    # スクリプトを実行してデータを取得
    articles = fetch_ev_news_from_google_rss()
    
    # データを保存（重複排除ロジック入り）
    save_to_json(articles)

    # 取得したデータをレビューするため、最初の3件をテスト表示
    if articles:
        for i, article in enumerate(articles[:3]):
            print(f"--- 記事 {i+1} ---")
            print(f"タイトル: {article['title']}")
            print(f"配信元  : {article['site_name']}")
            print(f"公開日時: {article['published']}")
            print(f"URL     : {article['link']}")
            print("-------------------")
    else:
        print("ニュースが見つかりませんでした。")

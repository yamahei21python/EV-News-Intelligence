"""Fetch module - RSS news acquisition."""

import feedparser
import hashlib
import logging
from datetime import datetime

from src.config import (
    NEWS_DATA_FILE,
    MAX_ARTICLES,
)
from src.utils.io import load_json, save_json
from src.types import NewsArticle

logger = logging.getLogger(__name__)


def generate_id(url: str) -> int:
    """URLから数値IDを生成"""
    return int(hashlib.md5(url.encode()).hexdigest(), 16) % 1000000


def fetch_ev_news_from_google_rss() -> list[dict]:
    """GoogleニュースRSSからEV相关新闻を取得"""
    rss_url = "https://news.google.com/rss/search?q=EV+when:1d&hl=ja&gl=JP&ceid=JP:ja"

    logger.info("Googleニュースから記事を取得中...")
    feed = feedparser.parse(rss_url)

    news_list = []
    for entry in feed.entries:
        news_list.append(
            {
                "id": generate_id(entry.link),
                "title": entry.title,
                "link": entry.link,
                "published": entry.published,
                "summary": entry.get("summary", ""),
                "site_name": entry.source.title if hasattr(entry, "source") else "不明",
            }
        )

    logger.info(f"{len(news_list)} 件の記事を取得")
    return news_list


def merge_articles(new_articles: list[dict], filename: str = NEWS_DATA_FILE) -> int:
    """既存データとマージ（重複排除）"""
    existing_articles = []
    if load_json(filename):
        existing_articles = load_json(filename).get("articles", [])

    existing_links = {a["link"] for a in existing_articles}
    merged = existing_articles.copy()
    new_count = 0

    for article in new_articles:
        if article["link"] not in existing_links:
            merged.append(article)
            existing_links.add(article["link"])
            new_count += 1

    # 最新1000件のみ保持
    if len(merged) > MAX_ARTICLES:
        merged = merged[-MAX_ARTICLES:]

    save_json(
        {
            "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "total_count": len(merged),
            "articles": merged,
        },
        filename,
    )

    logger.info(f"{new_count} 件追加。合計: {len(merged)}")
    return new_count


def run_fetch() -> list[dict]:
    """フェッチパイプライン実行"""
    articles = fetch_ev_news_from_google_rss()
    merge_articles(articles)
    return articles


if __name__ == "__main__":
    import logging

    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    run_fetch()

"""News fetch script - Entry point for RSS acquisition."""

import logging
from src.fetch import run_fetch, generate_id

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

if __name__ == "__main__":
    articles = run_fetch()

    if articles:
        for i, article in enumerate(articles[:3]):
            print(f"--- 記事 {article['id']} ---")
            print(f"タイトル: {article['title']}")
            print(f"配信元  : {article['site_name']}")
            print(f"公開日時: {article['published']}")
            print(f"URL     : {article['link']}")
            print("-------------------")
    else:
        print("ニュースが見つかりませんでした。")

"""Article grouping script - Topic-based grouping."""

import logging
from src.pipeline.group import group_articles

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

if __name__ == "__main__":
    groups = group_articles()
    print(f"✨ 名寄せ完了！ {len(groups)} 個のトピックに集約されました。")

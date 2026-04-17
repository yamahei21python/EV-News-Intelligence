"""Process module - AI scoring and filtering."""

import logging
from typing import Any

from src.config import (
    NEWS_DATA_FILE,
    ONLY_TITLE_FILE,
    FEATURED_NEWS_FILE,
    SIMILARITY_THRESHOLD,
)
from src.utils.io import load_json, save_json
from src.utils.text import (
    get_similarity,
    normalize_title,
    get_site_priority,
    is_major_media,
)
from src.utils.api import call_llm

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
あなたは熟練の業界アナリストです。
EVニュースの重要度を1〜10点でスコアリングしてください。

【判定基準】
1. 地方紙・テレビ局は【1〜2点】。ただし地域固有の一次情報は【7〜9点】
2. 日経・ロイター等专业メディアは【5〜10点】
3. 高評価: 政策・関税・サプライチェーン・戦略的提携
4. 低評価: 新型車発表・試乗レビュー・日常的な株価変動

【出力】JSON配列:
[
  {
    "id": [入力のid],
    "primary_category": "[カテゴリ名または'Noise']",
    "reason": "[判定理由 50文字以内]",
    "score": [1-100],
    "is_highly_important": boolean
  }
]
"""


def deduplicate_articles(
    articles: list[dict], threshold: float = SIMILARITY_THRESHOLD
) -> list[dict]:
    """類似記事を排除（圧縮）"""
    unique_map = {}

    for article in articles:
        if not is_major_media(article.get("site_name", "")):
            continue

        norm_title = normalize_title(article.get("title", ""))
        is_dup = False

        for key in list(unique_map.keys()):
            if get_similarity(norm_title, key) > threshold:
                if get_site_priority(article.get("site_name", "")) > get_site_priority(
                    unique_map[key].get("site_name", "")
                ):
                    del unique_map[key]
                    unique_map[norm_title] = article
                is_dup = True
                break

        if not is_dup:
            unique_map[norm_title] = article

    return list(unique_map.values())


def create_only_title_json() -> tuple[list[dict], list[dict]]:
    """only_title.json作成（重複排除後）"""
    data = load_json(NEWS_DATA_FILE)
    if not data:
        logger.error("news_data.jsonが見つかりません")
        return [], []

    raw_articles = data.get("articles", [])
    logger.info(f"全記事数: {len(raw_articles)} 件")

    compressed = deduplicate_articles(raw_articles)
    removed = len(raw_articles) - len(compressed)
    logger.info(f"類似排除: {removed} 件。判定対象: {len(compressed)} 件")

    only_titles = [
        {"id": a.get("id"), "title": a.get("title"), "site_name": a.get("site_name")}
        for a in compressed
    ]

    save_json(only_titles, ONLY_TITLE_FILE)
    return only_titles, compressed


def process_news_with_ai(
    only_titles: list[dict], original_articles: list[dict]
) -> list[dict]:
    """AIでニュースを判定・スコアリング"""
    import json

    featured = []
    results_map = {}

    user_prompt = json.dumps(only_titles, ensure_ascii=False, indent=2)
    result = call_llm(SYSTEM_PROMPT, user_prompt, {"type": "json_object"})

    if result:
        if isinstance(result, list):
            for r in result:
                results_map[r["id"]] = r
        elif isinstance(result, dict) and "groups" in result:
            for r in result.get("groups", []):
                results_map[r["id"]] = r

    for article in original_articles:
        aid = article.get("id")
        if aid in results_map:
            article.update(results_map[aid])
            if article.get("is_highly_important") or article.get("score", 0) >= 70:
                featured.append(article)
        elif str(aid) in results_map:
            article.update(results_map[str(aid)])
            if article.get("is_highly_important") or article.get("score", 0) >= 70:
                featured.append(article)

    save_json(featured, FEATURED_NEWS_FILE)
    logger.info(f"重要記事: {len(featured)} 件を抽出")
    return featured


def run_process() -> list[dict]:
    """プロセスパイプライン実行"""
    only_titles, compressed = create_only_title_json()
    if only_titles:
        return process_news_with_ai(only_titles, compressed)
    return []


if __name__ == "__main__":
    import logging

    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    run_process()

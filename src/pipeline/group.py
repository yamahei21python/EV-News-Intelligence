"""Group module - Article grouping by topic."""

import json
import logging
import time

from src.config import (
    ARTICLES_DIR,
    FEATURED_NEWS_FILE,
    GROUPED_NEWS_FILE,
    GEMINI_API_KEY,
    GEMINI_MODEL,
    REQUEST_DELAY_SEC,
)
from src.utils.io import load_json, save_json, read_text_file
from src.utils.api import call_llm

logger = logging.getLogger(__name__)

GROUPING_PROMPT = """
あなたは厳格なニュース編集長です。
ニュースを「戦略的なトピック」ごとに名寄せしてください。

【禁止】
- 曖昧なトピック名（動向、関連、市場、技術、まとめ等）
- 具体的な共通点がない記事同士のグループ化

【ルール】
1. 完全に同じ話題のみグループ化
2. 迷ったらグループ化しない（is_grouped: false）
3. トピック名は具体的（例：「万博EVバス使用断念」）

【出力】
{
  "groups": [
    {"topic_name": "...", "article_ids": [id1, id2], "is_grouped": true/false}
  ]
}
"""


def group_articles() -> list[dict]:
    """記事をトピックごとにグルーピング"""
    articles = load_json(FEATURED_NEWS_FILE)
    if not articles:
        logger.error(f"{FEATURED_NEWS_FILE}が見つかりません")
        return []

    logger.info(f"全 {len(articles)} 件をグルーピング...")

    # AI入力データの作成
    ai_input = []
    for article in articles:
        aid = article.get("id")
        title = article.get("title", "")

        md_file = f"{ARTICLES_DIR}/{aid}.md"
        content_intro = "(本文なし)"

        if read_text_file(md_file):
            content = read_text_file(md_file)
            if "PAYWALL_BLOCKED" in content or "Scrape Error" in content:
                continue
            content_intro = content[:500].replace("\n", " ")

        ai_input.append({"id": aid, "title": title, "intro": content_intro})

    result = call_llm(
        GROUPING_PROMPT,
        f"【記事リスト】\n{json.dumps(ai_input, ensure_ascii=False, indent=2)}",
        {"type": "json_object"},
    )

    if not result:
        logger.error("グルーピング失敗")
        return []

    # 結果のバリデーション
    if isinstance(result, dict) and "groups" in result:
        groups = result["groups"]
    else:
        for val in result.values():
            if isinstance(val, list):
                groups = val
                break

    # ID存在確認
    all_ids = {a["id"] for a in ai_input}
    validated = []
    for g in groups:
        valid_ids = [aid for aid in g.get("article_ids", []) if aid in all_ids]
        if valid_ids:
            g["article_ids"] = valid_ids
            validated.append(g)

    save_json(validated, GROUPED_NEWS_FILE)
    logger.info(f"{len(validated)} 個のトピックに集約")
    return validated


if __name__ == "__main__":
    import logging
    import json

    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    group_articles()

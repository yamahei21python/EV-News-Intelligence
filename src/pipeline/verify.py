"""Verify module - Report consistency check."""

from __future__ import annotations

import logging
from typing import Optional

from src.config import (
    FINAL_REPORTS_FILE,
    REQUEST_DELAY_SEC,
)
from src.utils.io import load_json, save_json
from src.utils.api import call_llm

logger = logging.getLogger(__name__)

VERIFY_PROMPT = """
あなたはプロのニュース校閱者です。
トピック名が記事内容を正しく要約しているか確認してください。

【ルール】
1. 曖昧なトピック名（動向、まとめ等）は修正
2. 15文字程度の具体名に
3. 問題なければ元のまま

【出力】
{
  "is_consistent": boolean,
  "corrected_topic_name": "修正後トピック名"
}
"""


def verify_report(report: dict) -> Optional[dict]:
    """單一レポートの整合性を検証"""
    topic = report.get("topic_name", "")
    articles = [
        {"title": a.get("title", ""), "summary": a.get("summary", "")[:200]}
        for a in report.get("articles", [])
    ]

    user_input = {"topic_name": topic, "articles": articles}
    result = call_llm(VERIFY_PROMPT, str(user_input), {"type": "json_object"})

    if result:
        return result
    return None


def run_verify() -> list[dict]:
    """校閱パイプライン実行"""
    reports = load_json(FINAL_REPORTS_FILE)
    if not reports:
        logger.error(f"{FINAL_REPORTS_FILE}が見つかりません")
        return []

    logger.info(f"{len(reports)} 件のレポートを校閱中...")
    import time

    any_fixed = False
    for i, report in enumerate(reports):
        logger.info(f"[{i + 1}/{len(reports)}] {report.get('topic_name', '')}")

        result = verify_report(report)

        if result and not result.get("is_consistent", True):
            new_topic = result.get("corrected_topic_name", report["topic_name"])
            if report["topic_name"] != new_topic:
                logger.info(f"修正: {report['topic_name']} -> {new_topic}")
                report["topic_name"] = new_topic
                any_fixed = True
                save_json(reports, FINAL_REPORTS_FILE)

        time.sleep(REQUEST_DELAY_SEC)

    if any_fixed:
        save_json(reports, FINAL_REPORTS_FILE)
        logger.info("整合性修正完了")
    else:
        logger.info("全レポート整合性OK")

    return reports


if __name__ == "__main__":
    import logging

    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    run_verify()

"""Archive module - Results archiving and date index."""

import logging
from datetime import datetime

from src.config import (
    FINAL_REPORTS_FILE,
    ARCHIVE_DIR,
    DATES_FILE,
)
from src.utils.io import load_json, save_json

logger = logging.getLogger(__name__)


def archive_results() -> str:
    """結果をアーカイブ保存"""
    reports = load_json(FINAL_REPORTS_FILE)
    if not reports:
        logger.error(f"{FINAL_REPORTS_FILE}が見つかりません")
        return ""

    today = datetime.now().strftime("%Y-%m-%d")
    archive_file = f"{ARCHIVE_DIR}/{today}.json"

    save_json(reports, archive_file)
    logger.info(f"アーカイブ保存: {archive_file}")

    # 日付インデックス更新
    import glob
    import os

    archive_files = sorted(glob.glob(f"{ARCHIVE_DIR}/*.json"), reverse=True)
    available_dates = [
        os.path.basename(f).replace(".json", "")
        for f in archive_files
        if os.path.basename(f) != "dates.json"
    ]

    save_json(available_dates, DATES_FILE)
    logger.info(f"日付インデックス更新: {len(available_dates)}件")

    return archive_file


if __name__ == "__main__":
    import logging

    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    archive_results()

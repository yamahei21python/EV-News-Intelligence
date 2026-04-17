"""Cleanup module - Pipeline cleanup utilities."""

import os
import shutil
import logging
from typing import Literal

from src.config import (
    FEATURED_NEWS_FILE,
    GROUPED_NEWS_FILE,
    ONLY_TITLE_FILE,
    ARTICLES_DIR,
    NEWS_DATA_FILE,
)

logger = logging.getLogger(__name__)

IntermediateFiles = [
    FEATURED_NEWS_FILE,
    GROUPED_NEWS_FILE,
    ONLY_TITLE_FILE,
]


def cleanup_pipeline(mode: Literal["morning", "evening"]) -> None:
    """パイプラインの実行モードに応じてファイルを掃除"""
    logger.info(f"クリーンアップ開始 (モード: {mode})")

    # 1. 中間JSONの削除
    for f in IntermediateFiles:
        if os.path.exists(f):
            os.remove(f)
            logger.info(f"削除: {f}")

    # 2. MDディレクトリ初期化
    if os.path.exists(ARTICLES_DIR):
        shutil.rmtree(ARTICLES_DIR)
        logger.info(f"削除: {ARTICLES_DIR}/")
    os.makedirs(ARTICLES_DIR, exist_ok=True)
    logger.info(f"初期化: {ARTICLES_DIR}/")

    # 3. モード別処理
    if mode == "evening":
        if os.path.exists(NEWS_DATA_FILE):
            os.remove(NEWS_DATA_FILE)
            logger.info("削除: news_data.json (18時リセット)")
    elif mode == "morning":
        logger.info("維持: news_data.json (06時まとめ用)")

    logger.info(f"クリーンアップ完了 ({mode})")

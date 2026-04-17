"""JSON/File I/O ユーティリティ"""

from __future__ import annotations

import json
import os
import logging
from typing import Any, Optional

logger = logging.getLogger(__name__)


def load_json(filepath: str) -> Any:
    """JSON ファイルを読み込む"""
    if not os.path.exists(filepath):
        logger.warning(f"ファイルが存在しません: {filepath}")
        return None

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"JSON読み込みエラー: {filepath} - {e}")
        return None


def save_json(data: Any, filepath: str, indent: int = 4) -> bool:
    """JSON ファイルを保存する"""
    try:
        os.makedirs(
            os.path.dirname(filepath) if os.path.dirname(filepath) else ".",
            exist_ok=True,
        )
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=indent)
        logger.info(f"保存完了: {filepath}")
        return True
    except Exception as e:
        logger.error(f"JSON保存エラー: {filepath} - {e}")
        return False


def read_text_file(filepath: str) -> Optional[str]:
    """テキストファイルを読み込む"""
    if not os.path.exists(filepath):
        return None
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        logger.error(f"テキスト読み込みエラー: {filepath} - {e}")
        return None


def write_text_file(content: str, filepath: str) -> bool:
    """テキストファイルを保存する"""
    try:
        os.makedirs(
            os.path.dirname(filepath) if os.path.dirname(filepath) else ".",
            exist_ok=True,
        )
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        return True
    except Exception as e:
        logger.error(f"テキスト保存エラー: {filepath} - {e}")
        return False

"""テキスト処理ユーティリティ"""

import re
import unicodedata
from difflib import SequenceMatcher


def get_similarity(a: str, b: str) -> float:
    """2つの文字列の類似度を計算 (0.0 - 1.0)"""
    return SequenceMatcher(None, a, b).ratio()


def normalize_title(title: str) -> str:
    """タイトルからメディア名やノイズを除去して純粋な見出しにする"""
    # 全角・半角の正規化
    t = unicodedata.normalize("NFKC", title)
    # 「 - メディア名」を削除
    t = t.split(" - ")[0]
    # カッコ（全角・半角）内のテキストを削除
    t = re.sub(r"（.*?）|\(.*?\)", "", t)
    # 末尾のメディア名をさらに強引に削除
    t = re.sub(r"\|.*$", "", t)
    return t.strip()


def get_site_priority(site_name: str) -> int:
    """メディアごとの取得しやすさ・信頼性スコア"""
    priorities = {
        "Yahoo!ニュース": 100,
        "日本経済新聞": 90,
        "carview!": 80,
        "Merkmal": 75,
        "WEB CARTOP": 70,
        "Forbes JAPAN": 10,
    }
    return priorities.get(site_name, 50)


def is_major_media(site_name: str) -> bool:
    """大手紙または主要メディアかどうかを判定"""
    excluded_keywords = [
        "TBS",
        "日テレ",
        "テレビ朝日",
        "フジテレビ",
        "テレビ東京",
        "FNN",
        "NNN",
        "JNN",
        "ANN",
        "DIG",
        "ABEMA",
        "ニコニコ",
        "TRILL",
        "GUNOSY",
        "AU WEB",
        "Dメニュー",
        "MSN",
        "STRAIGHT PRESS",
        "SPEEDME.RU",
        "매일경제",
        "千葉テレビ放送",
        "KHB",
        "ｄメニューニュース",
        "KTV",
    ]
    return not any(k in site_name.upper() for k in excluded_keywords)


def truncate_text(text: str, max_length: int) -> str:
    """テキストを指定長で切り詰め"""
    if len(text) <= max_length:
        return text
    return text[:max_length] + "..."


def strip_markdown_block(text: str) -> str:
    """Markdownコードブロックを除去"""
    if text.startswith("```json"):
        return text[7:-3].strip()
    if text.startswith("```"):
        return text[3:-3].strip()
    return text.strip()

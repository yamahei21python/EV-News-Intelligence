"""設定・定数定義"""

import os
from dotenv import load_dotenv

load_dotenv()

# API設定
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL_FLASH = os.getenv("GEMINI_MODEL_FLASH", "gemini-3.1-flash-lite-preview")
GEMINI_MODEL_PRO = os.getenv("GEMINI_MODEL_PRO", "gemini-2.0-pro")
GEMINI_MODEL = GEMINI_MODEL_FLASH  # 後方互換性のため
MODEL_NAME = f"gemini/{GEMINI_MODEL_FLASH}"

# ファイルパス
NEWS_DATA_FILE = "news_data.json"
ONLY_TITLE_FILE = "only_title.json"
FEATURED_NEWS_FILE = "featured_news.json"
GROUPED_NEWS_FILE = "grouped_news.json"
ARTICLES_DIR = "articles_md"
FINAL_REPORTS_FILE = "final_reports.json"
ARCHIVE_DIR = "archive"
DATES_FILE = "dates.json"

# 後方互換性（舊スクリプト用）
IntermediateFiles = ["featured_news.json", "grouped_news.json", "only_title.json"]

# 処理パラメータ
MAX_ARTICLES = 1000
SIMILARITY_THRESHOLD = 0.7
API_RETRY_COUNT = 3
API_RETRY_DELAY_BASE = 30
REQUEST_DELAY_SEC = 5

# ロギング
LOG_FORMAT = "%(asctime)s [%(levelname)s] %(message)s"

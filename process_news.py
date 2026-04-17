"""News processing script - AI scoring and filtering."""

import logging
from src.process import run_process

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

if __name__ == "__main__":
    featured = run_process()
    print(f"\n✨ 判定完了！重要ニュースとして {len(featured)} 件を抽出しました。")

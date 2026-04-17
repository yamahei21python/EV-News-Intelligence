"""Article analysis script - Integrated topic analysis."""

import logging
from src.pipeline.analyze import run_analyze

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

if __name__ == "__main__":
    reports = run_analyze()
    print(f"\n✨ インテリジェンス・ポートフォリオが完成しました！")
    print(f"📄 最終成果物: {len(reports)} 件のレポート")

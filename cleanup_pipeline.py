"""Cleanup pipeline script."""

import argparse
import logging
from src.pipeline.cleanup import cleanup_pipeline

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="EV News Pipeline Cleanup Script")
    parser.add_argument(
        "--mode",
        choices=["morning", "evening"],
        required=True,
        help="morning (06:00) or evening (18:00)",
    )
    args = parser.parse_args()

    cleanup_pipeline(args.mode)

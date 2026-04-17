"""Report verification script - Consistency check."""

import logging
from src.pipeline.verify import run_verify

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

if __name__ == "__main__":
    run_verify()

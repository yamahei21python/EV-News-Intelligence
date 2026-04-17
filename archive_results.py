"""Archive script - Results archiving."""

import logging
from src.pipeline.archive import archive_results

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

if __name__ == "__main__":
    archive_results()

"""Article content extraction script - Bulk scraping."""

import asyncio
import logging
from src.extract import bulk_extract

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

if __name__ == "__main__":
    asyncio.run(bulk_extract())

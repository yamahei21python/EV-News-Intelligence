"""LLM API 呼び出し共通化"""

from __future__ import annotations

import json
import time
import logging
from typing import Any, Optional

import litellm

from src.config import (
    GEMINI_API_KEY,
    MODEL_NAME,
    GEMINI_MODEL_FLASH,
    API_RETRY_COUNT,
    API_RETRY_DELAY_BASE,
    REQUEST_DELAY_SEC,
)

logger = logging.getLogger(__name__)
litellm.telemetry = False


def call_llm(
    system_prompt: str,
    user_content: str,
    response_format: dict | None = None,
    max_retries: int = API_RETRY_COUNT,
) -> Optional[dict]:
    """
    LLM を呼び出し、JSON レスポンスをパースして返す。
    リトライロジックを含む。
    """
    for attempt in range(max_retries):
        try:
            kwargs = {
                "model": MODEL_NAME,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content},
                ],
                "api_key": GEMINI_API_KEY,
            }
            if response_format:
                kwargs["response_format"] = response_format

            response = litellm.completion(**kwargs)
            content = response.choices[0].message.content.strip()

            return parse_json_response(content)

        except (litellm.ServiceUnavailableError, litellm.RateLimitError) as e:
            wait_time = (attempt + 1) * API_RETRY_DELAY_BASE
            logger.warning(f"LLM一時エラー ({type(e).__name__})、{wait_time}秒待機...")
            time.sleep(wait_time)
        except Exception as e:
            logger.error(f"LLMエラー: {e}")
            break

    return None


async def call_llm_async(
    messages: list[dict],
    model_name: Optional[str] = None,
    api_key: Optional[str] = None,
) -> Optional[str]:
    """非同期LLM呼び出し (messages配列を直接受け取る)"""
    from src.config import GEMINI_MODEL_FLASH

    model = model_name or GEMINI_MODEL_FLASH
    key = api_key or GEMINI_API_KEY

    try:
        response = await litellm.acompletion(
            model=f"gemini/{model}",
            messages=messages,
            api_key=key,
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"非同期LLMエラー: {e}")
        return None


def parse_json_response(content: str) -> dict | list:
    """AIレスポンスからJSONを抽出・解析"""
    import re

    # Markdown block 除去
    cleaned = content
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()

    # JSON 抽出 ({} または [] で囲まれた部分)
    json_match = re.search(r"\{.*\}|\[.*\]", cleaned, re.DOTALL)
    if json_match:
        return json.loads(json_match.group())

    return json.loads(cleaned)

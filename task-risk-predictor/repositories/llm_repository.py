import logging
import json
import asyncio
from typing import List
from huggingface_hub import AsyncInferenceClient
from pydantic import BaseModel
from config import settings

logger = logging.getLogger(__name__)

# Pydantic schema for validating the LLM output
class RiskOutput(BaseModel):
    risk_level: str
    risk_score: int
    reason: str
    suggestions: List[str]

class LLMRepository:
    """
    Repository layer — the ONLY class that communicates with HuggingFace.
    Follows the Repository Layer pattern from the project architecture.
    """

    def __init__(self):
        self.client = AsyncInferenceClient(
            provider=settings.MODEL_PROVIDER,
            api_key=settings.HF_TOKEN,
        )

    async def call_gemma(self, prompt: str) -> dict:
        """
        Calls Gemma 4 via HuggingFace Inference API with novita provider.
        Instructs the model to return JSON in the prompt.
        Retries once on 429 rate limit with backoff.
        Returns empty dict on any failure — caller handles fallback.
        """
        max_retries = 2
        for attempt in range(max_retries):
            try:
                response = await self.client.chat.completions.create(
                    model=settings.MODEL_ID,
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "You are a project risk analysis AI. "
                                "Always respond with valid JSON matching the schema exactly. "
                                "Never add markdown fences, code blocks, or extra text outside the JSON object."
                            )
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    response_format={"type": "json_object"},
                    max_tokens=400,
                    temperature=0.15,
                )

                raw = response.choices[0].message.content.strip()
                
                # Strip markdown fences if model wraps output
                if raw.startswith("```"):
                    lines = raw.split("\n")
                    raw = "\n".join(lines[1:-1] if lines[-1].strip() == "```" else lines[1:])
                
                result = json.loads(raw)

                # Validate with Pydantic before returning
                validated = RiskOutput(**result)
                logger.info(f"[LLMRepository] LLM returned: {validated.risk_level}, score={validated.risk_score}")
                return validated.model_dump()

            except Exception as e:
                error_str = str(e)
                if "429" in error_str and attempt < max_retries - 1:
                    wait_time = 2 ** (attempt + 1)  # 2s, 4s
                    logger.warning(f"[LLMRepository] Rate limited, retrying in {wait_time}s...")
                    await asyncio.sleep(wait_time)
                    continue
                logger.error(f"[LLMRepository] Gemma call failed: {e}. Will fall back to rule score.")
                return {}


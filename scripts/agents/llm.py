"""Thin wrapper around DeepSeek used by all three agents. DeepSeek's API is
OpenAI-compatible, so we talk to it through langchain-openai with a custom
base_url instead of a DeepSeek-specific SDK."""
import json
import re

from langchain_openai import ChatOpenAI

MODEL_NAME = "deepseek-chat"
DEEPSEEK_BASE_URL = "https://api.deepseek.com"


def get_model(api_key: str, temperature: float = 0.7) -> ChatOpenAI:
    return ChatOpenAI(
        model=MODEL_NAME,
        base_url=DEEPSEEK_BASE_URL,
        api_key=api_key,
        temperature=temperature,
    )


def ask(model: ChatOpenAI, prompt: str) -> str:
    response = model.invoke(prompt)
    return (response.content or "").strip()


def ask_json(model: ChatOpenAI, prompt: str) -> dict:
    """Asks DeepSeek for JSON and tolerates markdown code fences around it."""
    raw = ask(model, prompt)
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if not match:
        raise ValueError(f"Model did not return JSON:\n{raw}")
    return json.loads(match.group(0))

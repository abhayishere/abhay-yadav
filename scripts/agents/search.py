"""Serper.dev web search tool, shared by the planner/writer agents."""
import requests

SERPER_URL = "https://google.serper.dev/search"


def web_search(query: str, api_key: str, num_results: int = 5) -> list[dict]:
    resp = requests.post(
        SERPER_URL,
        headers={"X-API-KEY": api_key, "Content-Type": "application/json"},
        json={"q": query, "num": num_results},
        timeout=30,
    )
    resp.raise_for_status()
    data = resp.json()
    results = []
    for item in data.get("organic", [])[:num_results]:
        results.append(
            {
                "title": item.get("title", ""),
                "link": item.get("link", ""),
                "snippet": item.get("snippet", ""),
            }
        )
    return results

"""Planner agent: picks today's topic and an outline, using web search for
current context so posts don't feel stale or repeat old ground."""
from .llm import ask_json
from .search import web_search

TOPIC_SEED_QUERY = "trending software engineering and AI topics this week"


def plan(model, serper_key: str, existing_titles: list[str]) -> dict:
    trends = web_search(TOPIC_SEED_QUERY, serper_key, num_results=6)
    trend_summary = "\n".join(f"- {t['title']}: {t['snippet']}" for t in trends)

    avoid = "\n".join(f"- {t}" for t in existing_titles[-30:]) or "(none yet)"

    prompt = f"""You are the PLANNER agent in a multi-agent blog-writing system for a
software engineer's personal tech blog. Pick ONE specific, interesting technical
topic for today's post (e.g. a concept, a tool, a pattern, a comparison) based on
what's currently relevant. Prefer depth over breadth - a focused, useful post beats
a shallow overview.

Recent trends found via web search:
{trend_summary}

Do NOT repeat or closely overlap with these already-published titles:
{avoid}

Respond with ONLY a JSON object, no markdown fences, in this exact shape:
{{
  "title": "concise, specific blog title",
  "description": "one-sentence meta description",
  "outline": ["section 1", "section 2", "section 3", "..."],
  "research_queries": ["search query 1", "search query 2"]
}}"""

    outline = ask_json(model, prompt)

    research = []
    for query in outline.get("research_queries", [])[:3]:
        research.extend(web_search(query, serper_key, num_results=4))

    outline["research"] = research
    return outline

"""Editor agent: polishes the draft and decides whether it's good enough to
publish or needs to go back to the writer for another pass."""
from .llm import ask_json


def edit(model, state: dict) -> dict:
    prompt = f"""You are the EDITOR agent in a multi-agent blog-writing system.
Review the draft below. Fix grammar, tighten weak sentences, and improve
Markdown formatting (headings, code blocks, lists) in your polished version
regardless of your verdict. Do not add fake facts.

Only flag needs_revision=true for REAL problems: missing/incomplete
sections from the outline, vague or unsupported technical claims, weak
structure, or failure to deliver on the title. Do not nitpick minor style -
if it's solid, ship it.

Also treat these AI-writing tells as REAL problems worth flagging (or fixing
directly in your polished version): rule-of-three lists used as a crutch,
bold-lead-in bullets repeated throughout ("**Do X.** explanation..."), stock
transitions ("Here's the thing," "The bottom line," "Let's be clear," "It's
worth noting"), vague-but-authoritative fake citations, uniformly-sized
paragraphs/sentences, and every section wrapping up with a tidy summary
sentence. Vary the rhythm and let the polished version read like a person
wrote it in one sitting, not like a template was filled in.

Working title: {state['title']}
Working description: {state['description']}
Outline:
{chr(10).join(f"- {s}" for s in state.get('outline', []))}

Draft:
---
{state['draft']}
---

Respond with ONLY a JSON object, no markdown fences, in this exact shape:
{{
  "needs_revision": true or false,
  "feedback": "specific, actionable feedback for the writer (empty string if needs_revision is false)",
  "title": "final polished title",
  "description": "final one-sentence meta description (<160 chars)",
  "content": "your best current polished Markdown body, even if needs_revision is true"
}}"""

    return ask_json(model, prompt)

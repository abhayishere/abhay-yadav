"""Revises a pending blog post using reviewer feedback collected on the site
(selected text + a comment on that selection). Reuses the same Writer/Editor
LangGraph nodes as generate_blog.py, entering the graph at the writer node
(skip_planner=True) so no new topic/research is generated - just a revision
of the existing draft.

Triggered via workflow_dispatch by .github/workflows/revise-blog.yml, which
is in turn triggered by src/app/api/blog/revise/route.js.
"""
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv

from agents.graph import build_graph
from review_token import token_for_slug
from telegram import send_message

REPO_ROOT = Path(__file__).resolve().parent.parent
BLOGS_PATH = REPO_ROOT / "content" / "blogs.json"

load_dotenv(Path(__file__).parent / ".env")


def require_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise SystemExit(f"Missing required environment variable: {name}")
    return value


def format_feedback(items: list[dict]) -> str:
    lines = []
    for item in items:
        quote = item.get("quote", "").strip()
        comment = item.get("comment", "").strip()
        if not comment:
            continue
        if quote:
            lines.append(f'- On the passage "{quote}": {comment}')
        else:
            lines.append(f"- {comment}")
    return "\n".join(lines)


def main() -> None:
    deepseek_key = require_env("DEEPSEEK_API_KEY")
    signing_secret = require_env("REVIEW_SIGNING_SECRET")
    telegram_token = require_env("TELEGRAM_BOT_TOKEN")
    telegram_chat_id = require_env("TELEGRAM_CHAT_ID")
    site_url = require_env("SITE_URL").rstrip("/")

    slug = require_env("REVISE_SLUG")
    feedback_items = json.loads(require_env("REVISE_FEEDBACK"))
    feedback_text = format_feedback(feedback_items)
    if not feedback_text:
        raise SystemExit("REVISE_FEEDBACK contained no usable feedback comments")

    posts = json.loads(BLOGS_PATH.read_text())
    index = next((i for i, p in enumerate(posts) if p["slug"] == slug and p["status"] == "pending"), None)
    if index is None:
        raise SystemExit(f"No pending post found for slug '{slug}'")

    post = posts[index]

    print(f"Revising '{slug}' with {len(feedback_items)} feedback item(s)...")
    graph = build_graph(deepseek_key)
    result = graph.invoke(
        {
            "title": post["title"],
            "description": post["description"],
            "draft": post["content"],
            "feedback": feedback_text,
            "outline": [],
            "research": [],
            "revision_count": 0,
            "skip_planner": True,
        },
        config={"recursion_limit": 25},
    )
    print(f"Graph finished after {result.get('revision_count', 0)} revision(s).")

    posts[index] = {
        **post,
        "title": result["title"],
        "description": result["description"],
        "content": result["content"],
    }
    BLOGS_PATH.write_text(json.dumps(posts, indent=2) + "\n")
    print(f"Updated pending post '{slug}' in {BLOGS_PATH}")

    token = token_for_slug(slug, signing_secret)
    review_link = f"{site_url}/blog?review={token}"

    send_message(
        telegram_token,
        telegram_chat_id,
        f"✏️ Blog post revised based on your feedback: \"{posts[index]['title']}\"\n\n"
        f"Review it here: {review_link}",
    )
    print("Telegram notification sent.")


if __name__ == "__main__":
    main()

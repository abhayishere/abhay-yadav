"""Runs the LangGraph Planner -> Writer -> Editor pipeline (with an
editor->writer revision loop), appends the result to content/blogs.json as
a pending post, and notifies via Telegram with a signed review link.
Run daily by .github/workflows/daily-blog.yml.
"""
import json
import os
import re
import sys
from datetime import datetime, date, timezone
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


def slugify(title: str, today: date) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return f"{today.isoformat()}-{slug}"[:80].rstrip("-")


def main() -> None:
    deepseek_key = require_env("DEEPSEEK_API_KEY")
    serper_key = require_env("SERPER_API_KEY")
    telegram_token = require_env("TELEGRAM_BOT_TOKEN")
    telegram_chat_id = require_env("TELEGRAM_CHAT_ID")
    signing_secret = require_env("REVIEW_SIGNING_SECRET")
    site_url = require_env("SITE_URL").rstrip("/")

    posts = json.loads(BLOGS_PATH.read_text())
    existing_titles = [p["title"] for p in posts]

    print("Running Planner -> Writer -> Editor graph...")
    graph = build_graph(deepseek_key)
    result = graph.invoke(
        {"existing_titles": existing_titles, "serper_key": serper_key},
        config={"recursion_limit": 25},
    )
    print(f"Graph finished after {result.get('revision_count', 0)} revision(s).")

    today = datetime.now(timezone.utc).date()
    slug = slugify(result["title"], today)

    post = {
        "slug": slug,
        "title": result["title"],
        "description": result["description"],
        "content": result["content"],
        "date": today.isoformat(),
        "status": "pending",
    }

    posts.append(post)
    BLOGS_PATH.write_text(json.dumps(posts, indent=2) + "\n")
    print(f"Wrote pending post '{slug}' to {BLOGS_PATH}")

    token = token_for_slug(slug, signing_secret)
    review_link = f"{site_url}/blog?review={token}"

    send_message(
        telegram_token,
        telegram_chat_id,
        f"📝 New blog post drafted: \"{post['title']}\"\n\n"
        f"{post['description']}\n\n"
        f"Review it here (only visible to you): {review_link}\n\n"
        f"Keep it to publish, or remove it if it's not good enough.",
    )
    print("Telegram notification sent.")


if __name__ == "__main__":
    main()

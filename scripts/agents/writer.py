"""Writer agent: turns the planner's outline + research into a full draft.
Also handles revisions when the editor sends the draft back with feedback."""
from .llm import ask


def write(model, state: dict) -> str:
    research_notes = "\n".join(
        f"- {r['title']}: {r['snippet']} ({r['link']})" for r in state.get("research", [])
    ) or "(no extra research)"

    outline = "\n".join(f"- {section}" for section in state.get("outline", []))

    feedback = state.get("feedback")
    feedback_block = (
        f"\n\nThe editor reviewed your previous draft and sent it back with this "
        f"feedback - address it directly in this revision:\n{feedback}\n"
        if feedback
        else ""
    )
    previous_draft_block = (
        f"\n\nYour previous draft (for reference, do not just repeat it):\n---\n{state['draft']}\n---\n"
        if feedback and state.get("draft")
        else ""
    )

    prompt = f"""You are the WRITER agent in a multi-agent blog-writing system.
Write a complete, high-quality technical blog post in Markdown based on the
outline and research below. Write for a software engineering audience:
be concrete, use examples/code snippets where useful, avoid fluff and
generic filler sentences. Aim for 700-1200 words.

Avoid AI-writing tells:
- Don't lean on rule-of-three lists as a crutch - vary list length, or use no list at all.
- Don't bold-lead every bullet ("**Do X.** explanation...") - mix in plain prose bullets and full paragraphs.
- Avoid stock transitions like "Here's the thing," "The bottom line," "Let's be clear," "It's worth noting."
- Don't manufacture vague-but-authoritative citations ("a 2025 study showed..."). Either cite something
  real and checkable from the research notes, or make the claim in your own voice without a fake source.
- Vary sentence and paragraph length noticeably - don't make every paragraph the same tidy size.
- Avoid symmetric "on one hand / on the other hand" section structure - let sections be lopsided.
- Don't wrap every section in a neat summarizing sentence - let at least one section trail off into
  the next point instead of resolving cleanly.

Title: {state['title']}
Outline:
{outline}

Research notes (use for accuracy, do not just copy):
{research_notes}
{feedback_block}{previous_draft_block}
Output ONLY the Markdown body of the post (no title heading, no front matter,
start directly with the first section)."""

    return ask(model, prompt)

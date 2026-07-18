# Blog-writing agents

This folder implements the Planner → Writer → Editor pipeline that generates
one blog post per day (see `.github/workflows/daily-blog.yml` for the
schedule, and `scripts/generate_blog.py` for the entry point that calls
into here).

It's built as a [LangGraph](https://langchain-ai.github.io/langgraph/)
`StateGraph` rather than a plain function chain, specifically so the Editor
can reject a weak draft and send it back to the Writer with feedback —
that loop is the reason this uses a graph instead of three sequential
function calls.

## Flow

```
                 ┌──────────┐
   START ──────► │ planner  │
                 └────┬─────┘
                      │
                      ▼
                 ┌──────────┐  ◄────────────────┐
                 │  writer  │                    │
                 └────┬─────┘                    │
                      │                          │
                      ▼                          │
                 ┌──────────┐   needs_revision    │
                 │  editor  │───and revisions <───┘
                 └────┬─────┘   MAX_REVISIONS
                      │
                      │ otherwise
                      ▼
                     END
```

1. **Planner** (`planner.py`) — searches the web (via Serper) for what's
   currently trending in software engineering / AI, picks one specific
   topic that hasn't been covered before (checked against existing post
   titles), and produces a title, description, section outline, and a
   few follow-up research queries. It then runs those research queries
   through Serper too, so the Writer has real snippets/sources to work
   from instead of hallucinating specifics.

2. **Writer** (`writer.py`) — turns the outline + research into a full
   Markdown draft (700–1200 words). On a revision pass, it's also given
   the Editor's feedback and its own previous draft, and is told to fix
   the flagged issues rather than starting over.

3. **Editor** (`editor.py`) — reviews the draft: fixes grammar, formatting,
   and structure, and decides `needs_revision: true/false`. It's
   instructed to only flag *real* problems (missing sections, unsupported
   claims, weak structure) and not nitpick style, so the loop doesn't run
   pointlessly. It always returns its best current polish of the content,
   whether or not it's asking for a revision.

4. **Routing** (`graph.py`) — after the Editor, a conditional edge checks
   `needs_revision`. If true and `revision_count < MAX_REVISIONS` (2), the
   graph increments `revision_count` and loops back to the Writer with the
   Editor's feedback in state. Otherwise it ends, and whatever the Editor
   last produced becomes the final post.

## Files

| File | Role |
|---|---|
| `llm.py` | Builds the model client and two small helpers (`ask`, `ask_json`) shared by all three agents. Talks to **DeepSeek**, not OpenAI — `ChatOpenAI` is just the LangChain class used to hit any OpenAI-compatible endpoint, pointed at `https://api.deepseek.com` with `model="deepseek-flash"`. |
| `search.py` | Thin wrapper around the Serper.dev API (`web_search(query, api_key)`), used by the Planner for both trend discovery and per-topic research. |
| `planner.py` | The Planner agent, see above. |
| `writer.py` | The Writer agent, see above. |
| `editor.py` | The Editor agent, see above. |
| `graph.py` | Wires the three agents into the `StateGraph`, defines `BlogState`, and owns the revision-loop routing logic and `MAX_REVISIONS`. |

## State (`BlogState` in `graph.py`)

The graph passes a single dict-like state object between nodes. Each node
only returns the keys it updates (LangGraph merges them into the running
state):

- `existing_titles`, `serper_key` — inputs, set once before `graph.invoke(...)`.
- `title`, `description`, `outline`, `research` — set by the Planner.
- `draft` — set/overwritten by the Writer on each pass.
- `content`, `needs_revision`, `feedback` — set by the Editor each pass.
- `revision_count` — starts at 0, incremented once per loop back to the Writer.

## Running it

This package isn't meant to be run standalone — `scripts/generate_blog.py`
is the entry point:

```bash
cd scripts
python generate_blog.py
```

It needs `DEEPSEEK_API_KEY`, `SERPER_API_KEY`, `TELEGRAM_BOT_TOKEN`,
`TELEGRAM_CHAT_ID`, `REVIEW_SIGNING_SECRET`, and `SITE_URL` set in the
environment (see the repo root for how these map to GitHub Actions
secrets). It writes the finished post into `content/blogs.json` with
`status: "pending"` and sends a Telegram message with a signed review
link — it does not publish anything on its own.

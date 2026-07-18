"""Wires the Planner, Writer and Editor agents into a LangGraph StateGraph.

Unlike a plain linear call chain, this lets the Editor send a weak draft
back to the Writer with feedback (matching the bidirectional planner<->writer
<->editor arrows in the original architecture sketch), capped at
MAX_REVISIONS so a stubborn editor can't loop forever.
"""
from typing import TypedDict

from langgraph.graph import END, START, StateGraph

from . import editor as editor_agent
from . import planner as planner_agent
from . import writer as writer_agent
from .llm import get_model

MAX_REVISIONS = 2


class BlogState(TypedDict, total=False):
    existing_titles: list[str]
    serper_key: str
    title: str
    description: str
    outline: list[str]
    research: list[dict]
    draft: str
    content: str
    feedback: str
    revision_count: int
    needs_revision: bool
    skip_planner: bool


def build_graph(deepseek_key: str):
    model = get_model(deepseek_key)

    def planner_node(state: BlogState) -> dict:
        result = planner_agent.plan(model, state["serper_key"], state.get("existing_titles", []))
        return {
            "title": result["title"],
            "description": result["description"],
            "outline": result["outline"],
            "research": result.get("research", []),
            "revision_count": 0,
            "feedback": "",
        }

    def writer_node(state: BlogState) -> dict:
        return {"draft": writer_agent.write(model, state)}

    def editor_node(state: BlogState) -> dict:
        result = editor_agent.edit(model, state)
        return {
            "title": result.get("title", state["title"]),
            "description": result.get("description", state["description"]),
            "content": result.get("content", state.get("draft", "")),
            "needs_revision": bool(result.get("needs_revision", False)),
            "feedback": result.get("feedback", ""),
        }

    def bump_revision(state: BlogState) -> dict:
        return {"revision_count": state.get("revision_count", 0) + 1}

    def route_after_editor(state: BlogState) -> str:
        if state.get("needs_revision") and state.get("revision_count", 0) < MAX_REVISIONS:
            return "revise"
        return "done"

    def route_from_start(state: BlogState) -> str:
        # Reviewer-feedback revisions already have a title/draft and reviewer
        # comments in `feedback` - skip planning/research and go straight to
        # the writer, which already knows how to fold `feedback` + `draft`
        # into a revision.
        return "writer" if state.get("skip_planner") else "planner"

    graph = StateGraph(BlogState)
    graph.add_node("planner", planner_node)
    graph.add_node("writer", writer_node)
    graph.add_node("editor", editor_node)
    graph.add_node("bump_revision", bump_revision)

    graph.add_conditional_edges(START, route_from_start, {"planner": "planner", "writer": "writer"})
    graph.add_edge("planner", "writer")
    graph.add_edge("writer", "editor")
    graph.add_conditional_edges("editor", route_after_editor, {"revise": "bump_revision", "done": END})
    graph.add_edge("bump_revision", "writer")

    return graph.compile()

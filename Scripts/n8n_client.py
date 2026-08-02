#!/usr/bin/env python3
"""Thin, dependency-free client for the n8n Cloud REST API.

Designed so that a *changing* n8n account (e.g. a free instance that rotates)
never breaks anything: the base URL and API key are read from environment
variables only. When your account changes, update those two values and rerun
`python Scripts/n8n_client.py ping` — nothing else in the repo needs to change.

Environment variables
----------------------
  N8N_API_URL   Base URL of your instance, e.g. https://arezoo000.app.n8n.cloud
                (trailing "/api/v1" is added automatically; if you already
                include it, that's fine too).
  N8N_API_KEY   The API key created in n8n → Settings → n8n API.

Usage
-----
  python Scripts/n8n_client.py ping                 # verify the connection
  python Scripts/n8n_client.py list                 # list workflows (id + name)
  python Scripts/n8n_client.py get <workflow_id>    # dump one workflow as JSON
  python Scripts/n8n_client.py create <file.json>   # import a workflow from JSON
  python Scripts/n8n_client.py activate <id>        # activate a workflow
  python Scripts/n8n_client.py deactivate <id>      # deactivate a workflow

No third-party packages required (uses only the standard library).
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request


class N8nError(RuntimeError):
    pass


def _base_url() -> str:
    raw = os.environ.get("N8N_API_URL", "").strip().rstrip("/")
    if not raw:
        raise N8nError(
            "N8N_API_URL is not set. Export it, e.g.\n"
            "  export N8N_API_URL='https://arezoo000.app.n8n.cloud'"
        )
    # Accept either the bare instance URL or one that already ends in /api/v1.
    if raw.endswith("/api/v1"):
        return raw
    return raw + "/api/v1"


def _api_key() -> str:
    key = os.environ.get("N8N_API_KEY", "").strip()
    if not key:
        raise N8nError(
            "N8N_API_KEY is not set. Create one in n8n → Settings → n8n API, then:\n"
            "  export N8N_API_KEY='<your key>'"
        )
    return key


def _request(method: str, path: str, payload: dict | None = None) -> dict:
    url = f"{_base_url()}{path}"
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("X-N8N-API-KEY", _api_key())
    req.add_header("Accept", "application/json")
    if data is not None:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = resp.read().decode() or "{}"
            return json.loads(body)
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode(errors="replace")
        if exc.code in (401, 403):
            raise N8nError(
                f"Auth failed ({exc.code}). The API key is missing, wrong, or "
                f"expired — create a fresh one in n8n → Settings → n8n API.\n{detail}"
            ) from exc
        raise N8nError(f"HTTP {exc.code} on {method} {path}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise N8nError(
            f"Could not reach {url} — check N8N_API_URL and your network.\n{exc}"
        ) from exc


# ── Public helpers ────────────────────────────────────────────────────────
def list_workflows() -> list[dict]:
    return _request("GET", "/workflows?limit=100").get("data", [])


def get_workflow(workflow_id: str) -> dict:
    return _request("GET", f"/workflows/{workflow_id}")


def create_workflow(spec: dict) -> dict:
    # n8n's create endpoint accepts name/nodes/connections/settings.
    allowed = {k: spec[k] for k in ("name", "nodes", "connections", "settings") if k in spec}
    if "settings" not in allowed:
        allowed["settings"] = {}
    return _request("POST", "/workflows", allowed)


def set_active(workflow_id: str, active: bool) -> dict:
    verb = "activate" if active else "deactivate"
    return _request("POST", f"/workflows/{workflow_id}/{verb}")


# ── CLI ───────────────────────────────────────────────────────────────────
def _cli(argv: list[str]) -> int:
    if not argv:
        print(__doc__)
        return 0
    cmd, rest = argv[0], argv[1:]
    try:
        if cmd == "ping":
            wfs = list_workflows()
            print(f"OK — connected to {_base_url()}")
            print(f"     {len(wfs)} workflow(s) visible to this API key.")
            return 0
        if cmd == "list":
            for wf in list_workflows():
                flag = "●" if wf.get("active") else "○"
                print(f"{flag} {wf.get('id')}\t{wf.get('name')}")
            return 0
        if cmd == "get" and rest:
            print(json.dumps(get_workflow(rest[0]), indent=2, ensure_ascii=False))
            return 0
        if cmd == "create" and rest:
            with open(rest[0], encoding="utf-8") as fh:
                spec = json.load(fh)
            created = create_workflow(spec)
            print(f"Created workflow id={created.get('id')} name={created.get('name')!r}")
            return 0
        if cmd in ("activate", "deactivate") and rest:
            set_active(rest[0], cmd == "activate")
            print(f"{cmd}d workflow {rest[0]}")
            return 0
        print(__doc__)
        return 2
    except N8nError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(_cli(sys.argv[1:]))

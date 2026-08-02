# n8n MCP server (Claude Code integration)

This repo ships a **project-scoped** [`.mcp.json`](../.mcp.json) so that anyone
who opens the project in [Claude Code](https://docs.claude.com/en/docs/claude-code)
gets an `n8n-mcp` server wired up automatically over **HTTP transport**. This
lets Claude discover and drive your [n8n](https://n8n.io) workflows through the
[Model Context Protocol](https://modelcontextprotocol.io).

Nothing secret is committed — the server URL and auth token are read from
environment variables at launch time.

## What gets configured

`.mcp.json` declares one server:

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "type": "http",
      "url": "${N8N_MCP_URL:-https://your-n8n-domain/mcp-server/http}",
      "headers": {
        "Authorization": "Bearer ${N8N_MCP_AUTH_TOKEN}"
      }
    }
  }
}
```

Claude Code expands `${VAR}` / `${VAR:-default}` from your environment when it
starts, so the real domain and token stay out of version control.

## Setup

1. **Expose an MCP endpoint on your n8n instance.** Either run the standalone
   [`n8n-mcp`](https://github.com/czlonkowski/n8n-mcp) server in HTTP mode, or
   add an **MCP Server Trigger** node to a workflow in n8n. Both give you an
   HTTPS URL ending in something like `/mcp-server/http`.

2. **Set the environment variables** (see [`.env.example`](../.env.example)):

   ```bash
   export N8N_MCP_URL="https://arezoo000.app.n8n.cloud/mcp-server/http"
   export N8N_MCP_AUTH_TOKEN="your-token"   # omit if the endpoint is public
   ```

   Put these in your shell profile or a local `.env` that your shell sources —
   Claude Code reads them from the process environment, not from `.env.local`.

3. **Open the project in Claude Code.** On first run it will ask you to approve
   the project-scoped `n8n-mcp` server (project `.mcp.json` servers require a
   one-time trust confirmation). Approve it, then verify:

   ```
   /mcp
   ```

   `n8n-mcp` should show as **connected**.

## Adding it manually instead

If you'd rather not use the committed config, you can register the same server
from the CLI (this writes to your user or local config, not the repo):

```bash
claude mcp add --transport http n8n-mcp https://<your-n8n-domain>/mcp-server/http
```

Add `--header "Authorization: Bearer <token>"` if your endpoint needs auth, and
`--scope user` to make it available across all your projects.

## Troubleshooting

- **`n8n-mcp` fails to connect** — confirm `N8N_MCP_URL` resolves and returns
  `200` for a POST (n8n MCP endpoints reject bare `GET`); check the token.
- **`Unauthorized` / `401`** — the endpoint requires a Bearer token; set
  `N8N_MCP_AUTH_TOKEN`. If the endpoint is public, remove the `Authorization`
  header from `.mcp.json`.
- **Server not offered** — make sure you approved the project-scoped server;
  re-check with `claude mcp list` and `/mcp`.

## Security

- `.mcp.json` contains **no** secrets — only variable references.
- Real values live only in your environment / local `.env` (git-ignored).
- Never commit `N8N_MCP_AUTH_TOKEN`. Treat the n8n MCP endpoint as privileged:
  anyone with the token can trigger the workflows it exposes.

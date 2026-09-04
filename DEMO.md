# Software Garden — Factory Demo Runbook

Demo the Agent Workforce Factory end to end, locally: label an issue, watch the
factory dispatch an implementer and a reviewer agent, and get a reviewed pull
request. Total time: about 10-15 minutes, most of it the agents working.

## One-time setup (already done on this machine)

- Repo: https://github.com/khaliqgant/software-garden (clone:
  `~/Projects/AgentWorkforce/software-garden`)
- `factory` CLI 0.1.86 installed globally (`npm i -g @agent-relay/factory`)
- `factory init` completed: `factory.config.json` points at workspace
  `rw_7ccfea89`, GitHub-native issues
- Broker state persists in `.factory/relay-state/` — restarts reclaim the same
  identity, so the broker name never collides

## The demo script (live)

Run each command from `~/Projects/AgentWorkforce/software-garden`.

```bash
export AGENT_RELAY_STATE_DIR="$PWD/.factory/relay-state"
export AGENT_RELAY_BROKER_NAME=garden-demo-broker
```

### 1. The garden (30 seconds)

```bash
node garden.js   # one day in the garden: every plant grows
npm test         # 3 passing tests, zero dependencies
```

Point out the shape: `plants.js` (seed catalog), `garden.js` (plant, water,
grow, report). Small enough that a prospect can read it all in one glance.

### 2. The backlog (1 minute)

Open https://github.com/khaliqgant/software-garden/issues:

- **#2 "Add a sunflower to the garden"** — labeled `factory`: opted in
- **#3 "Add a greenhouse"** — no label: NOT opted in

The safety gate story: the factory only ever touches issues a human explicitly
labeled. Everything else is invisible to it. (Issue #1, the rose bug, was
already fixed by a factory run — show the merged PR for proof this is real.)

### 3. Dry run — plan without touching anything (1 minute)

```bash
factory run-once --dry-run
```

Read the JSON out loud: it discovered the issues, triaged them, planned the
agent team (`ar-2-impl-software-garden` + `ar-2-review-software-garden`), and
wrote nothing. `dryRun: true` — no writes, no spawns, no risk.

### 4. The real dispatch (5-10 minutes, the show)

```bash
factory dispatch 2
```

While it runs, narrate what the terminal shows:

- broker starts and joins the workspace
- the issue is claimed: `factory:in-progress` label + dispatch comment on #2
- implementer agent spawns (codex) in an isolated worktree
- when the implementer finishes, the factory opens the PR and hands it to the
  reviewer agent

Refresh the GitHub issue page during the run — the labels and comments appear
live. Then open the PR: the diff (sunflower in `plants.js`, a new test), the
reviewer's comments, `factory:human-review` on the issue.

### 5. The human is the merge gate (1 minute)

Merge the PR in the GitHub UI (or `gh pr merge --squash`). Then:

```bash
git pull && node garden.js   # the sunflower towers over the garden
npm test
```

The factory never auto-merges by default (`mergePolicy: "never"`). Every change
lands as a normal PR a human approves.

## Cheat sheet

| What | Command |
|---|---|
| One cycle, no writes | `factory run-once --dry-run` |
| Dispatch one issue | `factory dispatch 2` |
| Dispatch whatever is ready | `factory run-once` |
| What is the factory doing | `factory status` |
| Show the issue lifecycle | `gh issue view 2 --web` |

## If something goes wrong live

- **Broker name collision** (`agent name 'garden-demo-broker' is already
  registered`): `agent-relay agent remove garden-demo-broker`, then retry. With
  `AGENT_RELAY_STATE_DIR` set this should not happen — the persisted identity
  proves ownership.
- **`Live state changed before writeback`**: a previous run crashed mid-claim.
  Remove the stale label (`gh issue edit 2 --remove-label factory:in-progress`)
  and retry.
- **Spawn fails, `registration is create-only`**: stale agent records from a
  crashed run. `agent-relay agent remove ar-2-impl-software-garden` (and the
  review sibling), then retry.
- **Cloud overloaded / circuit open**: the dispatch retries on its own; give it
  a minute. The relay cloud occasionally throttles the roster probe.
- **Fresh start for a new issue**: create the issue, label it `factory`,
  `factory dispatch <number>`.

## Why this demo works

- The repo is 4 files — the prospect reads ALL of it, so the agent's diff is
  legible in seconds
- The task is real work (a bug fix with a test, a feature with a test) but
  5-minute work, so the loop completes inside the meeting
- Every factory guarantee is visible: opt-in safety gate, isolated worktree,
  implement-then-review, human merge gate, lifecycle writeback on the issue

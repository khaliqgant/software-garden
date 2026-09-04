# Software Garden

A tiny garden simulator, tended by agents.

This repository exists to demo the [Agent Workforce
Factory](https://github.com/AgentWorkforce/factory): label an issue `factory`
and the factory turns it into a reviewed pull request - implementer agent,
reviewer agent, and a merge that always waits for a human.

## The garden

- `plants.js` - the seed catalog. Each plant has a `thirst` (water units
  needed per day) and a `rate` (centimetres grown per day it drinks).
- `garden.js` - the garden itself: `plant`, `water`, `grow`, `report`.

## Run it

```bash
node garden.js   # one day in the garden
npm test         # node --test, no dependencies
```

## How the factory tends it

1. Someone opens an issue and labels it `factory`.
2. `factory run-once` discovers it, triages it, and dispatches an
   implementer agent and a reviewer agent into a local checkout.
3. The agents open a pull request; the issue is labeled
   `factory:human-review`.
4. A person reviews and merges. The factory never auto-merges by default.

Issues without the `factory` label are discovered but never touched - the
safety gate is opt-in by construction.

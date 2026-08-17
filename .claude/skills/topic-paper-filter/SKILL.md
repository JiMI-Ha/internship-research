---
name: topic-paper-filter
description: Search, summarize, and rank research papers for a user-provided topic. Use for topic-based literature discovery, business-oriented metric recommendations, and explainable paper rankings.
---

# Topic Paper Filter

Turn a research Topic into a small, evidence-backed paper shortlist that a person can inspect.

## Input

Accept:

- a research Topic or question;
- an optional business goal;
- optional constraints or metrics the requester already cares about.

If only a Topic is supplied, infer a compact default goal from the Topic and state that assumption before ranking.

## Workflow

1. **Clarify the research target**
   - Restate the Topic in one or two sentences.
   - Identify what kind of decision the research should support.
   - Do not invent constraints. Mark missing constraints as assumptions.

2. **Search for candidate papers**
   - Search direct papers first, using primary sources such as arXiv, conference proceedings, and official project pages.
   - Add adjacent papers only when their mechanism transfers directly to the Topic; mark them as adjacent.
   - Deduplicate versions of the same work.
   - Do not include papers merely because they share a keyword.

3. **Read and summarize evidence**
   For each shortlisted paper, verify the relevant source material and write:
   - problem;
   - method;
   - main reported result;
   - important limitation;
   - source URL.

   Never treat an abstract, blog summary, or search snippet as sufficient support for detailed experimental claims.

4. **Recommend ranking metrics from the Topic**
   Recommend only three to five metrics that help the requester decide which papers to read or test.
   - Derive metrics from the Topic and stated business goal; do not use a fixed scorecard.
   - Examples may include outcome, cost, robustness, scalability, data requirements, safety, or evidence quality.
   - Explain in one sentence why each metric matters for this Topic.

5. **Create an explainable rank**
   - Rank only direct papers by the recommended metrics.
   - Show per-paper evidence and a one-line reason for its position.
   - Use `unknown` when a paper does not report a metric; never silently convert missing evidence to zero.
   - Do not compare raw benchmark scores across incompatible models, datasets, task distributions, or compute budgets.
   - Keep adjacent and diagnostic papers in separate sections rather than forcing them into the main rank.

6. **State uncertainty**
   Explicitly name assumptions, unreported metrics, and settings where results may not transfer.

## Required output

```markdown
## Topic understanding

## Recommended metrics

| Metric | Why it matters |
| ------ | -------------- |

## Ranked direct papers

| Rank | Paper | Evidence by metric | Why ranked here | Unknowns |
| ---: | ----- | ------------------ | --------------- | -------- |

## Adjacent / diagnostic references

## Read first

1. ...
2. ...
3. ...

## Uncertainty and next questions
```

## Publishing to this repository

When the requester authorizes publication:

1. Create or update a clear Topic directory under `content/`.
2. Use the topic page to show the Topic, recommended metrics, explainable rank, adjacent references, and unknowns.
3. Create Reading Cards only for papers whose relevant sections were actually read.
4. Update `content/papers/index.md`, the parent category index, and `content/index.md` when a new Topic is published.
5. Run the repository validation, formatting, typecheck, and build commands before committing.

Do not publish a ranking as an objective or permanent paper-quality leaderboard. It is a Topic-specific reading recommendation and must retain its metric rationale and unknowns.

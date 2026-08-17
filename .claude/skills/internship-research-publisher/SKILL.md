---
name: internship-research-publisher
description: Analyze a research paper and publish a Chinese reading card to the internship-research Quartz knowledge base. Use when the user provides a paper PDF, arXiv link, DOI, conference page, local paper file, or paper URL and asks for motivation/method/results, a reading card, or publication to the 实习调研 site.
---

# Internship Research Publisher

This skill turns a paper into a verified Chinese Reading Card and, when authorized, publishes it to the `internship-research` Quartz knowledge base.

Target repository:

- GitHub: <https://github.com/JiMI-Ha/internship-research>
- Site: <https://jimi-ha.github.io/internship-research/>
- Content root: `content/`

## When to use

Use this skill when the user provides any of the following:

- PDF, local paper file, arXiv URL, DOI, conference page, project page, or public paper URL
- a request such as `motivation method results`, `motivation、method、results`, `整理/总结论文的动机、方法和结果`, `生成 Reading Card`, or `发布到实习调研`

If the user asks for `motivation method results` or an equivalent paper-reading request, treat that as authorization to run the full paper analysis workflow. Publishing is allowed only when the user has not explicitly opted out.

Do **not** publish or modify the repository if the user says any equivalent of:

- `不要发布`
- `只在聊天里回答`
- `先别上传`
- `不要改仓库`

In that case, provide only the paper analysis in chat.

## Non-negotiable evidence rules

1. Read the full relevant paper sections. Do not rely only on the abstract.
2. Verify method formulas, algorithm steps, experimental setup, main results, ablations, robustness tests, and limitations against the source.
3. Do not invent numbers, baselines, citations, causal explanations, statistical significance, or conclusions.
4. If evidence is weak, indirect, missing, small-scale, not statistically tested, or limited to narrow settings, downgrade the wording explicitly.
5. If the paper does not report something, write `未报告` rather than treating the absence as negative evidence.
6. Keep paper facts separate from topic-specific interpretation.
7. Do not commit raw PDFs, private files, secrets, personal data, temporary downloads, or non-public business material.

## Required paper page structure

Use `content/templates/paper.md` as the base shape. A paper page should include at least:

- `基本信息`
- `Motivation`
- `Method`
- `Experimental Setup`
- `Results`
- `Ablation / Robustness`
- `Sensitivity / Boundary Conditions`
- `Limitations`
- `Takeaways`
- `Citation`

Use tables only when the numbers are traceable to the original source. If a table would imply unsupported precision, use prose instead.

## Required frontmatter

Every paper page must include complete frontmatter. At minimum:

```yaml
---
title: "Paper title"
created: YYYY-MM-DD
published: YYYY-MM-DD
modified: YYYY-MM-DD
type: paper
business_fit: 0
paper_solidity: 0
tags: [paper]
source_url: "https://example.org/paper"
---
```

Rules:

- Dates use `YYYY-MM-DD`.
- `source_url` must be a public HTTP(S) URL when possible.
- `business_fit` and `paper_solidity` are integers from 0 to 5; use `0` when not yet evaluated.
- Tags should include `paper` plus topic tags.

## File placement

Create one stable, concise English slug per paper.

Prefer existing topic directories. Common placements:

- RL reward design, reward aggregation, reward similarity, scale handling, multi-reward optimization: `content/rl/reward-resemble/`
- RL experience replay, rollout reuse, off-policy RL for LLMs: `content/rl/experience-replay/`
- OPD, model merging, model fusion, distillation, capability integration: `content/opd/mopd/`
- LLM safety, over-refusal, refusal benchmarks: `content/llm-safety/over-refusal/`
- Gaming narrative agents, drama management, multi-agent story generation: `content/gaming/剧情/`
- Gaming language creation, memes, rituals, emergent communication: `content/gaming/创造语言/`

If no existing category fits, create a clear topic directory and an `index.md` for it. Do not create vague buckets such as `misc` unless the repository already uses them.

## Index updates

After adding or updating a paper page, update all relevant indexes without deleting historical entries:

1. `content/papers/index.md`
2. The direct topic `index.md`
3. The parent topic `index.md` when applicable, such as:
   - `content/rl/index.md`
   - `content/opd/index.md`
   - `content/llm-safety/index.md`
   - `content/gaming/index.md` if present
4. `content/index.md` latest-research section, with the newest item first

For RL reward design and reward aggregation papers, update both:

- `content/rl/index.md`
- `content/rl/reward-resemble/index.md`

## Workflow

### 1. Inspect repository state

Before editing:

- Confirm you are operating inside the intended repository.
- Check whether relevant target files already exist to avoid duplicates.
- Preserve unrelated user changes.
- If Git is available, inspect current status before modifying files.

### 2. Read and verify the paper

Collect reliable metadata:

- title
- authors
- venue or version
- year
- source URL
- code/project URL if available
- citation/BibTeX when reliable

Read the paper sections needed to support every claim in the Reading Card.

### 3. Draft the paper page

Write in Chinese. Prefer precise, evidence-bounded claims.

Recommended style:

- concise but complete;
- explicit about what is reported vs. inferred;
- concrete about tasks, models, datasets, baselines, and metrics;
- no unsupported hype.

### 4. Update indexes

Add a short, useful entry to each index. Keep newest papers near the top where the existing index style does so. Match the surrounding markdown format.

### 5. Validate locally

Run, as applicable:

```bash
npm run validate:content
npm run build
npx tsc --noEmit
```

If dependencies are missing, run:

```bash
npm ci
```

Also run Prettier check for modified files when practical. If the repository uses `npm run check:workspace`, prefer it for repository-level validation.

Do not claim success if validation, build, typecheck, formatting, push, or deployment fails.

### 6. Commit and publish when authorized

Before pushing, verify the remote still points to:

```text
https://github.com/JiMI-Ha/internship-research.git
```

Then:

1. Create a clear commit message.
2. Push to `origin/main`.
3. Wait for the GitHub Pages workflow when possible.
4. Verify the online homepage and new paper page return HTTP 200.

If authentication, Git, network access, or repository permission is unavailable, explain the blocker and leave the generated local files intact.

## Final response format

When the workflow completes, report:

- paper title
- local file path
- online URL, if published
- commit hash, if committed
- validation/build/typecheck results
- any skipped step or blocker

Never say the page is published unless push and deployment verification succeeded.

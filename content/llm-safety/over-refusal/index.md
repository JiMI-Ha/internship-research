---
title: "Over-Refusal 系列"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
---

本系列归属于 [[llm-safety/|LLM Safety]]，关注模型在安全对齐后是否错误拒绝无害请求，以及如何把过度拒答与危险请求接受率放在同一评测中。

## 论文

- [[llm-safety/over-refusal/or-bench|OR-Bench：规模化测量安全模型的过度拒答]] — 规模化生成 80K 条无害边界 prompts，并配套 Hard-1K 与 toxic 对照。
- [[llm-safety/over-refusal/xstest|XSTest：用最小安全—危险对照识别夸张安全行为]] — 250 条手工安全题与 200 条最小编辑危险对照。

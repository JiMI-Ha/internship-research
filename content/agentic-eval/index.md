---
title: "Agentic Evaluation"
created: 2026-08-17
published: 2026-08-17
modified: 2026-08-17
type: topic
tags:
  - agentic-eval
  - benchmark
  - harness
  - scaffold
---

> [!abstract] 这个系列在看什么
> Agentic benchmark 评测的通常不是裸模型，而是模型、脚手架、工具接口、上下文管理、执行环境和 evaluator 组成的完整系统。本系列关注如何把榜单分数拆回可复现、可迁移、可上线的业务判断。

## 核心调研

- [[agentic-eval/harness-sensitivity|Agentic Benchmark Harness 敏感性：为什么榜单分数不是裸模型能力]] — 汇总 SWE-agent、Agentless、Terminal-Bench、WebArena、OSWorld、τ-bench、Kimi K3 等材料，并给出业务指标推荐。

## 关键问题

1. 同一个模型换 agent scaffold / tool interface 后，分数会变多少？
2. 榜单分数到底是 model score、system score，还是 vendor deployment score？
3. 哪些指标能把 benchmark 分数转成业务可用性：成功率、稳定性、成本、人工介入、错误返工和合规风险？
4. 如何设计 harness sensitivity analysis，避免把协议适配误读成通用能力提升？

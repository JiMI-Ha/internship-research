---
title: "Agents"
created: 2026-08-17
published: 2026-08-17
modified: 2026-08-17
type: topic
tags: [agents, harness, evaluation, generalization]
---

LLM Agent 相关调研，关注 harness / scaffold / ACI、工具使用、交互环境、训练与评测协议如何影响模型能力和泛化。

## 系列

- [[agents/harness-overfitting/|Agent Harness 依赖与过拟合]] — 研究模型在固定 scaffold、工具协议、观测格式或评测器中训练后，是否只学会适配 harness 而非可迁移的任务能力。

## 关键问题

1. 同一任务在不同 system prompt、工具 schema、动作空间和观测格式下，成功率是否稳定？
2. 训练 harness、调参 harness 与公开 benchmark harness 是否泄露了可被模型或脚手架记住的结构模式？
3. Agent 论文是否披露 prompt、工具、预算、重试、verifier、grader 和 test-time scaling 设置？
4. 真正需要提升的是模型本体，还是 harness controller、检索、验证器、重试策略和预算分配？

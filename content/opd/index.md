---
title: "OPD：On-Policy Distillation"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: topic
tags: [OPD, on-policy-distillation, knowledge-distillation, post-training]
---

On-Policy Distillation 相关调研，关注学生在自身 rollout 上接受教师 token 级监督的训练方法、成立条件、稳定性与工程实现。

## 系列

- [[opd/mopd/|MOPD：多教师能力整合]] — 用多个领域或阶段教师把专项能力合并进统一学生模型。

## 关键问题

1. 教师与学生的 thinking pattern 和行为分布是否兼容。
2. 学生 rollout、教师评分和训练更新如何解耦与扩展。
3. Top-k 或 sampled-token 监督是否遗漏关键决策 support。
4. 多教师能力能否共享表示，还是需要显式路由或模块边界。

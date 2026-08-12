---
title: "MOPD：多教师 On-Policy Distillation"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: topic
tags: [MOPD, OPD, multi-teacher, capability-integration, model-merging]
---

> [!abstract] 这个系列在看什么
> MOPD 从同一学生分叉训练多个领域专家，再让学生在自己的 rollout 上接受对应教师的 token 级监督，以一次训练完成能力合版。本系列区分方法创新、失败机制、工业应用与邻近基础工作。

## 核心调研

- [[opd/mopd/mopd-capability-integration|MOPD 合版：多教师 On-Policy Distillation 的能力整合、失败模式与工程选型]] — 对 39 篇相关论文逐篇整理 Motivation、Method 和 Results，并补充横向实验、失败机制、局限与工程选型。

## 收录范围

1. 直接提出、修改或诊断 Multi-Teacher On-Policy Distillation 的论文。
2. 明确把多专家 OPD 用于统一模型后训练的技术报告。
3. 能直接解释 MOPD 成败的 OPD、知识融合与参数合并基础工作。

一般单教师 OPD 不做穷举；不同模型、数据、训练预算和评测协议之间不按绝对分数直接排名。

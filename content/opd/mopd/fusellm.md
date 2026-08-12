---
title: "FuseLLM：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2401.10491
---

> [!summary] 解读结论
> FuseLLM 证明不同架构也能在输出分布层融合，但缺少学生状态反馈时仍会保留 exposure bias。

## 基本信息

- **论文**：[FuseLLM](https://arxiv.org/abs/2401.10491)
- **arXiv**：2401.10491
- **分类**：OPD、模型合并与知识融合基础
- **在 MOPD 图谱中的位置**：异构行为融合基础：对齐 tokenizer 后融合多个 source LLM 的输出分布。
- **证据口径**：基础或邻近路线证据；用于解释 MOPD 的设计选择，不当作多教师合版的直接效果。

## Motivation

不同架构 LLM 不能直接平均权重，但它们的输出分布包含互补知识。

**解读**：这篇工作不一定直接采用多教师 OPD，但它解释了为什么某些 MOPD 设计成立，或提供了必须比较的替代路线。

## Method

对齐不同 tokenizer 的 token distribution，把多个 source LLM 的生成分布融合为目标，再轻量训练一个 target LLM。

**关键机制**：与 MOPD 的连接点不在名称，而在它处理的是学生状态分布、教师行为分布，还是权重空间中的任务干涉。

## Experimental Setup

以 Llama-2、MPT、OpenLLaMA 等异构来源模型构造融合目标，在 reasoning、commonsense 与 code 上评估 target LLM。

## Results

Llama-2、MPT、OpenLLaMA 来源模型的融合在 reasoning、commonsense 和 code 上提高目标模型表现；它证明异构行为分布可融合，但主要使用离线文本而非学生 on-policy trajectory。

**结果怎么读**：FuseLLM 证明不同架构也能在输出分布层融合，但缺少学生状态反馈时仍会保留 exposure bias。

## Limitations

主要依赖离线文本而非学生 on-policy trajectory；tokenizer 对齐和来源分布质量会限制可迁移信息。

## Takeaways

FuseLLM 证明不同架构也能在输出分布层融合，但缺少学生状态反馈时仍会保留 exposure bias。

## Citation

> FuseLLM. arXiv:2401.10491. [原文](https://arxiv.org/abs/2401.10491)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

---
title: "Model Soups：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2203.05482
---

> [!summary] 解读结论
> 当模型同源且仍在同一低误差 basin，权重平均是极便宜基线；超出该条件时，MOPD 的行为级监督更有价值。

## 基本信息

- **论文**：[Model Soups](https://arxiv.org/abs/2203.05482)
- **arXiv**：2203.05482
- **分类**：OPD、模型合并与知识融合基础
- **在 MOPD 图谱中的位置**：参数合并基础：同一 basin 内对 fine-tuned checkpoint 直接做权重平均。
- **证据口径**：基础或邻近路线证据；用于解释 MOPD 的设计选择，不当作多教师合版的直接效果。

## Motivation

同一预训练模型用不同超参数微调后，选单一最佳 checkpoint 会浪费其他模型落在低误差 basin 中的信息。

**解读**：这篇工作不一定直接采用多教师 OPD，但它解释了为什么某些 MOPD 设计成立，或提供了必须比较的替代路线。

## Method

对多个 fine-tuned checkpoint 做 uniform 或 greedy weight averaging，不增加推理成本。

**关键机制**：与 MOPD 的连接点不在名称，而在它处理的是学生状态分布、教师行为分布，还是权重空间中的任务干涉。

## Experimental Setup

主要在 ImageNet 等视觉任务上比较最佳单 checkpoint、uniform soup 与 greedy soup，并检查 accuracy 和分布外鲁棒性。

## Results

在 ImageNet 等视觉任务上通常提高 accuracy 与分布外鲁棒性；但它要求权重空间可线性连接，无法在 student-visited states 上修正行为，是 MOPD 的参数合并对照而非 OPD 前作。

**结果怎么读**：当模型同源且仍在同一低误差 basin，权重平均是极便宜基线；超出该条件时，MOPD 的行为级监督更有价值。

## Limitations

证据以视觉微调模型为主，依赖权重空间线性连通；它不访问学生生成状态，也无法纠正 exposure bias。

## Takeaways

当模型同源且仍在同一低误差 basin，权重平均是极便宜基线；超出该条件时，MOPD 的行为级监督更有价值。

## Citation

> Model Soups. arXiv:2203.05482. [原文](https://arxiv.org/abs/2203.05482)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

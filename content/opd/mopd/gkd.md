---
title: "GKD: On-Policy Distillation of Language Models：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2306.13649
---

> [!summary] 解读结论
> MOPD 之所以强调 on-policy，根本原因是教师必须在学生真正会进入的错误状态上给反馈。

## 基本信息

- **论文**：[GKD: On-Policy Distillation of Language Models](https://arxiv.org/abs/2306.13649)
- **arXiv**：2306.13649
- **分类**：OPD、模型合并与知识融合基础
- **在 MOPD 图谱中的位置**：单教师 OPD 基础：把训练分布切换到学生生成的序列，直接处理 exposure bias。
- **证据口径**：基础或邻近路线证据；用于解释 MOPD 的设计选择，不当作多教师合版的直接效果。

## Motivation

传统 KD 只在固定教师序列上训练，autoregressive 学生推理时会进入未见过的错误 prefix，产生 exposure bias。

**解读**：这篇工作不一定直接采用多教师 OPD，但它解释了为什么某些 MOPD 设计成立，或提供了必须比较的替代路线。

## Method

让学生生成部分或全部训练序列，再由教师在这些 student-generated states 上提供 token distribution；可选择不同 divergence，并能与 RLHF 联合。

**关键机制**：与 MOPD 的连接点不在名称，而在它处理的是学生状态分布、教师行为分布，还是权重空间中的任务干涉。

## Experimental Setup

在摘要、翻译、算术 reasoning 与 instruction tuning 上改变学生生成序列的比例和 divergence，并与传统离线 KD、RLHF 组合比较。

## Results

在摘要、翻译、算术 reasoning 与 instruction tuning 上优于离线 KD 基线，并显示 on-policy 比例可控制质量与计算成本；它是 MOPD 的单教师算法基础，不研究多教师冲突。

**结果怎么读**：MOPD 之所以强调 on-policy，根本原因是教师必须在学生真正会进入的错误状态上给反馈。

## Limitations

主要研究单教师蒸馏，不涉及多教师路由、梯度冲突或教师 support 合并；其结论是 MOPD 的必要基础而非完整解法。

## Takeaways

MOPD 之所以强调 on-policy，根本原因是教师必须在学生真正会进入的错误状态上给反馈。

## Citation

> GKD: On-Policy Distillation of Language Models. arXiv:2306.13649. [原文](https://arxiv.org/abs/2306.13649)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

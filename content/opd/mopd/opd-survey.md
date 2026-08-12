---
title: "A Survey of On-Policy Distillation for LLMs：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2604.00626
---

> [!summary] 解读结论
> 适合用来建立概念坐标，但具体 MOPD 工程决策仍要回到原论文的教师构造、路由与 support 细节。

## 基本信息

- **论文**：[A Survey of On-Policy Distillation for LLMs](https://arxiv.org/abs/2604.00626)
- **arXiv**：2604.00626
- **分类**：OPD、模型合并与知识融合基础
- **在 MOPD 图谱中的位置**：OPD 综述：用 f-divergence、信号来源与稳定化方法统一相关术语。
- **证据口径**：基础或邻近路线证据；用于解释 MOPD 的设计选择，不当作多教师合版的直接效果。

## Motivation

OPD 研究散落在 KD、RLHF 和 imitation learning，术语、divergence、信号来源与稳定化方法缺少统一框架。

**解读**：这篇工作不一定直接采用多教师 OPD，但它解释了为什么某些 MOPD 设计成立，或提供了必须比较的替代路线。

## Method

把 OPD 形式化为学生轨迹上的 $f$-divergence 优化，按“优化什么、信号来自哪里、怎样稳定”三条轴整理文献，并连接 KL-constrained RL。

**关键机制**：与 MOPD 的连接点不在名称，而在它处理的是学生状态分布、教师行为分布，还是权重空间中的任务干涉。

## Experimental Setup

该文是文献综述而非新实验，按“优化什么、信号来自哪里、怎样稳定”三条轴整理 OPD，并连接 KL-constrained RL 与 imitation learning。

## Results

这是综述，不提出新训练结果；价值是汇总 exposure bias、teacher-student mismatch、长程成本等已知边界。不能把它当作 MOPD 专门综述或效果证据。

**结果怎么读**：适合用来建立概念坐标，但具体 MOPD 工程决策仍要回到原论文的教师构造、路由与 support 细节。

## Limitations

没有新的训练对照；2026 年 OPD/MOPD 工作增长很快，综述的覆盖范围会随新 preprint 迅速变化。

## Takeaways

适合用来建立概念坐标，但具体 MOPD 工程决策仍要回到原论文的教师构造、路由与 support 细节。

## Citation

> A Survey of On-Policy Distillation for LLMs. arXiv:2604.00626. [原文](https://arxiv.org/abs/2604.00626)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

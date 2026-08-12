---
title: "AdaMerging：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2310.02575
---

> [!summary] 解读结论
> 固定 merge coefficient 往往过粗；若不愿运行教师，至少应让合并权重随任务或层自适应。

## 基本信息

- **论文**：[AdaMerging](https://arxiv.org/abs/2310.02575)
- **arXiv**：2310.02575
- **分类**：OPD、模型合并与知识融合基础
- **在 MOPD 图谱中的位置**：自适应参数合并：在无标签目标样本上学习 task-wise 或 layer-wise 系数。
- **证据口径**：基础或邻近路线证据；用于解释 MOPD 的设计选择，不当作多教师合版的直接效果。

## Motivation

固定 task-vector 系数不能适配任务相关性、层差异和分布漂移。

**解读**：这篇工作不一定直接采用多教师 OPD，但它解释了为什么某些 MOPD 设计成立，或提供了必须比较的替代路线。

## Method

在无标签测试样本上最小化 entropy，自动学习 task-wise 或 layer-wise merge coefficient。

**关键机制**：与 MOPD 的连接点不在名称，而在它处理的是学生状态分布、教师行为分布，还是权重空间中的任务干涉。

## Experimental Setup

八任务实验使用目标分布无标签样本最小化 entropy，对比固定系数 Task Arithmetic，并检查 distribution shift 与未见任务。

## Results

八任务实验相对当时 Task Arithmetic 报告约 11% 提升，并改善未见任务与 distribution shift；代价是需要目标分布数据和优化 merge 系数，仍属于权重空间整合。

**结果怎么读**：固定 merge coefficient 往往过粗；若不愿运行教师，至少应让合并权重随任务或层自适应。

## Limitations

需要目标分布样本和额外优化；低 entropy 不总等于正确，也仍无法使用教师在学生生成 prefix 上的细粒度分布。

## Takeaways

固定 merge coefficient 往往过粗；若不愿运行教师，至少应让合并权重随任务或层自适应。

## Citation

> AdaMerging. arXiv:2310.02575. [原文](https://arxiv.org/abs/2310.02575)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

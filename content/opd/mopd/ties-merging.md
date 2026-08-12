---
title: "TIES-Merging：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2306.01708
---

> [!summary] 解读结论
> TIES 说明很多合版损失来自 delta 干涉，但参数层修复不能替代 MOPD 在学生状态上的行为纠错。

## 基本信息

- **论文**：[TIES-Merging](https://arxiv.org/abs/2306.01708)
- **arXiv**：2306.01708
- **分类**：OPD、模型合并与知识融合基础
- **在 MOPD 图谱中的位置**：参数冲突处理：Trim 小更新、Elect 主导符号、再 Merge 一致 delta。
- **证据口径**：基础或邻近路线证据；用于解释 MOPD 的设计选择，不当作多教师合版的直接效果。

## Motivation

Task Arithmetic 会同时受到大量冗余小更新和不同任务 delta 符号冲突影响。

**解读**：这篇工作不一定直接采用多教师 OPD，但它解释了为什么某些 MOPD 设计成立，或提供了必须比较的替代路线。

## Method

Trim 小幅参数变化、Elect 每个坐标的主导符号，再只 Merge 与该符号一致的 delta。

**关键机制**：与 MOPD 的连接点不在名称，而在它处理的是学生状态分布、教师行为分布，还是权重空间中的任务干涉。

## Experimental Setup

在多任务、多模型和多模态设置中与 Task Arithmetic 等参数合并方法比较，重点分析小幅冗余更新与坐标符号冲突。

## Results

在多任务、模型、模态设置中优于当时参数合并基线；它解决参数坐标冲突，却仍不观察学生实际生成状态，因此不能处理 exposure bias 或教师 support 缺失。

**结果怎么读**：TIES 说明很多合版损失来自 delta 干涉，但参数层修复不能替代 MOPD 在学生状态上的行为纠错。

## Limitations

它处理的是参数坐标冲突，不观察 prompt 路由、学生 rollout 或关键 token support；成功仍依赖可合并的同源权重。

## Takeaways

TIES 说明很多合版损失来自 delta 干涉，但参数层修复不能替代 MOPD 在学生状态上的行为纠错。

## Citation

> TIES-Merging. arXiv:2306.01708. [原文](https://arxiv.org/abs/2306.01708)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

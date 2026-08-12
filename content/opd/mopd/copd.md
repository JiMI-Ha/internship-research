---
title: "Co-Evolving Policy Distillation（CoPD）：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2604.27083
---

> [!summary] 解读结论
> 教师与学生的距离会随专项 RL 不断扩大；越早、越持续地交换策略分布，最后合版越容易。

## 基本信息

- **论文**：[Co-Evolving Policy Distillation（CoPD）](https://arxiv.org/abs/2604.27083)
- **arXiv**：2604.27083
- **分类**：直接方法、改进与诊断
- **在 MOPD 图谱中的位置**：直接改进 MOPD：让专家在训练期间持续双向蒸馏，避免训练完成后才发现彼此已经不兼容。
- **证据口径**：方法或机制级证据；优先读取论文中的对照、消融与失败案例。

## Motivation

静态 MOPD 要等各专家独立训练完再合并，此时专家与学生的 thinking pattern 可能已经漂移太远，教师虽强却难以吸收。

**解读**：作者真正关注的是多教师能力整合中的具体瓶颈，而不是简单地把更多训练数据混在一起。

## Method

多个分支一边在各自领域做 RLVR，一边周期性双向 OPD；持续知识交换让专家保持在彼此可吸收的距离，最后再做参数合并。三分支时使用 hub-and-spoke，避免全量两两蒸馏。

**关键机制**：关键机制可以概括为：直接改进 MOPD：让专家在训练期间持续双向蒸馏，避免训练完成后才发现彼此已经不兼容。

## Experimental Setup

实验包含文本、图像和视频三条 RLVR 分支，对比静态 MOPD、单向蒸馏、双向蒸馏与持续 co-evolution；三分支通过 hub-and-spoke 连接，最终报告 Overall Average。

## Results

文本、图像、视频三分支实验的 Overall Avg. 为 58.12，静态 MOPD 为 56.99；双向蒸馏优于单向，持续 co-evolution 优于一次性蒸馏。优势来自其特定多模态设置，不能直接外推到所有语言任务。

**结果怎么读**：教师与学生的距离会随专项 RL 不断扩大；越早、越持续地交换策略分布，最后合版越容易。

## Limitations

证据来自论文设计的多模态三分支设置；持续通信和周期性蒸馏增加训练编排成本，尚不能证明同样收益会出现在任意数量、任意差异的语言专家上。

## Takeaways

教师与学生的距离会随专项 RL 不断扩大；越早、越持续地交换策略分布，最后合版越容易。

## Citation

> Co-Evolving Policy Distillation（CoPD）. arXiv:2604.27083. [原文](https://arxiv.org/abs/2604.27083)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

---
title: "Task Arithmetic：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2212.04089
---

> [!summary] 解读结论
> Task Arithmetic 是无需再训练的强基线，但 MOPD 主实验中的汇总分仍明显低于 on-policy 合版。

## 基本信息

- **论文**：[Task Arithmetic](https://arxiv.org/abs/2212.04089)
- **arXiv**：2212.04089
- **分类**：OPD、模型合并与知识融合基础
- **在 MOPD 图谱中的位置**：参数合并基础：用 fine-tuned delta 构造可加减的 task vector。
- **证据口径**：基础或邻近路线证据；用于解释 MOPD 的设计选择，不当作多教师合版的直接效果。

## Motivation

希望无需重新训练，就能组合或移除 fine-tuned 模型中的任务行为。

**解读**：这篇工作不一定直接采用多教师 OPD，但它解释了为什么某些 MOPD 设计成立，或提供了必须比较的替代路线。

## Method

用 fine-tuned 权重减 base 权重得到 task vector，再对这些向量做加、减和缩放。

**关键机制**：与 MOPD 的连接点不在名称，而在它处理的是学生状态分布、教师行为分布，还是权重空间中的任务干涉。

## Experimental Setup

在多模型、多模态任务上测试 task vector 的加法、取反、缩放与类比迁移；MOPD 主论文还把它作为能力合版基线。

## Results

在多模型、多模态任务上展示任务向量可组合、取反和类比迁移；效果依赖向量干涉与缩放系数，主 MOPD 实验中 Task Arithmetic 汇总 0.8574，仍低于 MOPD 0.9373。

**结果怎么读**：Task Arithmetic 是无需再训练的强基线，但 MOPD 主实验中的汇总分仍明显低于 on-policy 合版。

## Limitations

组合结果对缩放系数和 delta 干涉敏感；参数向量可加不意味着生成行为在学生访问状态上也兼容。

## Takeaways

Task Arithmetic 是无需再训练的强基线，但 MOPD 主实验中的汇总分仍明显低于 on-policy 合版。

## Citation

> Task Arithmetic. arXiv:2212.04089. [原文](https://arxiv.org/abs/2212.04089)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

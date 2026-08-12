---
title: "FuseChat：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2408.07990
---

> [!summary] 解读结论
> 当模型结构差异太大不能直接 merge 时，可以先做行为对齐再合并；这与 MOPD 的共同点是先缩小模型间距离。

## 基本信息

- **论文**：[FuseChat](https://arxiv.org/abs/2408.07990)
- **arXiv**：2408.07990
- **分类**：OPD、模型合并与知识融合基础
- **在 MOPD 图谱中的位置**：聊天模型融合：先把异构行为蒸馏到同结构 target，再按 update magnitude 做参数合并。
- **证据口径**：基础或邻近路线证据；用于解释 MOPD 的设计选择，不当作多教师合版的直接效果。

## Motivation

多个 chat model 结构、规模和 tokenizer 不同，单纯权重合并不可行；全部在线蒸馏又成本高。

**解读**：这篇工作不一定直接采用多教师 OPD，但它解释了为什么某些 MOPD 设计成立，或提供了必须比较的替代路线。

## Method

先用 token alignment 把异构 source chat model 两两蒸馏到同结构 target，再按 fine-tuning update magnitude 学习 merge coefficient 做参数融合。

**关键机制**：与 MOPD 的连接点不在名称，而在它处理的是学生状态分布、教师行为分布，还是权重空间中的任务干涉。

## Experimental Setup

在多个不同结构、规模和 tokenizer 的 chat model 上做两两蒸馏与参数融合，并在 AlpacaEval 2.0、MT-Bench 上比较。

## Results

FuseChat-7B 在 AlpacaEval 2.0、MT-Bench 上优于同规模基线，并接近更大的 Mixtral-8x7B 与 GPT-3.5-Turbo-1106；这是“先行为对齐、再参数合并”的邻近路线，不是 on-policy MOPD。

**结果怎么读**：当模型结构差异太大不能直接 merge 时，可以先做行为对齐再合并；这与 MOPD 的共同点是先缩小模型间距离。

## Limitations

两阶段流程主要是离线对齐加权重合并，不是学生 rollout 上的 MOPD；最终结果也受 source model 选择影响。

## Takeaways

当模型结构差异太大不能直接 merge 时，可以先做行为对齐再合并；这与 MOPD 的共同点是先缩小模型间距离。

## Citation

> FuseChat. arXiv:2408.07990. [原文](https://arxiv.org/abs/2408.07990)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

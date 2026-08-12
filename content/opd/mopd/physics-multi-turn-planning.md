---
title: "The Physics of Multi-Turn Long-Horizon Planning：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2607.24720
---

> [!summary] 解读结论
> MOPD 能整合的是可共享的行为模式；若专家程序知识完全冲突，继续调 loss 也未必能让无条件单模型同时表示它们。

## 基本信息

- **论文**：[The Physics of Multi-Turn Long-Horizon Planning](https://arxiv.org/abs/2607.24720)
- **arXiv**：2607.24720
- **分类**：直接方法、改进与诊断
- **在 MOPD 图谱中的位置**：机制研究：用可控长程规划世界分析哪些知识可以通过 MOPD 合并。
- **证据口径**：方法或机制级证据；优先读取论文中的对照、消融与失败案例。

## Motivation

真实模型的预训练数据不透明，难以区分 MOPD 合并的是通用 planning pattern，还是不可互换的具体 procedural knowledge。

**解读**：作者真正关注的是多教师能力整合中的具体瓶颈，而不是简单地把更多训练数据混在一起。

## Method

构造可控的多环境长程规划世界，系统改变任务长度、数据质量、planning knowledge 与 pattern overlap，再比较预训练、GRPO、单教师 OPD 和 MOPD。

**关键机制**：关键机制可以概括为：机制研究：用可控长程规划世界分析哪些知识可以通过 MOPD 合并。

## Experimental Setup

作者系统改变任务长度、数据质量、planning knowledge 和 pattern overlap，对比预训练、GRPO、单教师 OPD 与 MOPD，并观察共享、部分共享和完全冲突三种情形。

## Results

共享兼容 pattern 时 MOPD 可收敛到共同模式并跨环境泛化；部分共享时支持 continual learning；完全不共享且冲突时发生严重遗忘。论文提供机制性边界，而不是可直接迁移到真实 benchmark 的统一提升数字。

**结果怎么读**：MOPD 能整合的是可共享的行为模式；若专家程序知识完全冲突，继续调 loss 也未必能让无条件单模型同时表示它们。

## Limitations

可控世界有助于因果解释，但与真实 LLM 的预训练分布、工具反馈和开放式任务仍有距离；结果更适合作为边界条件而非 benchmark 预测器。

## Takeaways

MOPD 能整合的是可共享的行为模式；若专家程序知识完全冲突，继续调 loss 也未必能让无条件单模型同时表示它们。

## Citation

> The Physics of Multi-Turn Long-Horizon Planning. arXiv:2607.24720. [原文](https://arxiv.org/abs/2607.24720)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

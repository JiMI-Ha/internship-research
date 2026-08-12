---
title: "KAT-Coder-V2：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2603.27703
---

> [!summary] 解读结论
> MOPD 在这里解决的是多种代码环境无法共享统一 reward 与 rollout 基础设施的问题，而不是单独创造代码能力。

## 基本信息

- **论文**：[KAT-Coder-V2](https://arxiv.org/abs/2603.27703)
- **arXiv**：2603.27703
- **分类**：工业模型与技术报告
- **在 MOPD 图谱中的位置**：代码与 agent 工业应用：整合 SWE、WebCoding、Terminal、WebSearch 和 General coding 专家。
- **证据口径**：系统级证据；若缺少独立开关消融，不把最终模型总成绩全部归因给 MOPD。

## Motivation

SWE、WebCoding、Terminal、WebSearch 和 General coding 专家的训练环境与反馈差异很大；权重平均会遗忘，标准 RL 的 sequence feedback 又太稀疏。

**解读**：这里的 MOPD 是完整后训练系统中的能力汇合步骤；要把“最终模型很强”和“MOPD 单独有效”分开阅读。

## Method

五个领域分别做 SFT/RL，再让统一学生 rollout，按领域教师提供 token 级 OPD 监督，完成单模型部署。

**关键机制**：阅读重点是教师从哪里来、prompt 怎样路由、学生在哪些 prefix 上得到监督，以及系统如何承担多教师 serving 成本。

## Experimental Setup

五个领域分别进行 SFT/RL，再在 Landing Page、Slides、Data Visualization、Terminal-Bench Hard、τ²-Bench 等任务上评估统一模型。

## Results

最终模型报告 Landing Page 59.8、Slides 57.6、Data Visualization 67.6、Terminal-Bench Hard 46.8、$\tau^2$-Bench 93.9，并称保留专家级表现；但没有独立 MOPD vs. no-MOPD 表，不能隔离融合阶段贡献。

**结果怎么读**：MOPD 在这里解决的是多种代码环境无法共享统一 reward 与 rollout 基础设施的问题，而不是单独创造代码能力。

## Limitations

论文未提供完整的 MOPD vs. no-MOPD 表；不同 benchmark 的最终成绩同时依赖数据、环境和各专家训练质量。

## Takeaways

MOPD 在这里解决的是多种代码环境无法共享统一 reward 与 rollout 基础设施的问题，而不是单独创造代码能力。

## Citation

> KAT-Coder-V2. arXiv:2603.27703. [原文](https://arxiv.org/abs/2603.27703)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

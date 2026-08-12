---
title: "GLM-5：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2602.15763
---

> [!summary] 解读结论
> 把历史 checkpoint 作为多教师是一种实用的抗遗忘方案，但现有报告主要提供系统可行性证据。

## 基本信息

- **论文**：[GLM-5](https://arxiv.org/abs/2602.15763)
- **arXiv**：2602.15763
- **分类**：工业模型与技术报告
- **在 MOPD 图谱中的位置**：跨阶段应用：用 SFT、Reasoning RL 和 General RL 历史 checkpoint 恢复早期能力。
- **证据口径**：系统级证据；若缺少独立开关消融，不把最终模型总成绩全部归因给 MOPD。

## Motivation

Reasoning RL、General RL、Agentic RL 顺序执行会累积损伤早期能力，最终 generalist 需要恢复以前阶段的技能。

**解读**：这里的 MOPD 是完整后训练系统中的能力汇合步骤；要把“最终模型很强”和“MOPD 单独有效”分开阅读。

## Method

在多阶段 RL 后加入 cross-stage on-policy distillation，把早期 SFT/Reasoning RL/General RL checkpoint 作为教师，对当前学生 rollout 做能力恢复。

**关键机制**：阅读重点是教师从哪里来、prompt 怎样路由、学生在哪些 prefix 上得到监督，以及系统如何承担多教师 serving 成本。

## Experimental Setup

报告在 GLM-5 多阶段后训练中加入 cross-stage OPD，并以最终 reasoning、general 与 agent benchmarks 检查统一模型是否保留各阶段能力。

## Results

报告称最终 GLM-5 同时保持 reasoning 与 general/agent 能力，但未给出 cross-stage OPD 的独立开关对照；最终整模型 benchmark 不能被解释为 OPD 的单独效果。

**结果怎么读**：把历史 checkpoint 作为多教师是一种实用的抗遗忘方案，但现有报告主要提供系统可行性证据。

## Limitations

缺少 cross-stage OPD 的独立开关对照，也没有把教师选择、训练步数与其他数据变化分离。

## Takeaways

把历史 checkpoint 作为多教师是一种实用的抗遗忘方案，但现有报告主要提供系统可行性证据。

## Citation

> GLM-5. arXiv:2602.15763. [原文](https://arxiv.org/abs/2602.15763)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

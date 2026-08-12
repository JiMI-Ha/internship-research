---
title: "ORBIT：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2601.08310
---

> [!summary] 解读结论
> 多教师合版也可以整合同一任务的不同计算 Pareto 点，但必须保留显式 mode 条件才能避免平均成一种行为。

## 基本信息

- **论文**：[ORBIT](https://arxiv.org/abs/2601.08310)
- **arXiv**：2601.08310
- **分类**：工业模型与技术报告
- **在 MOPD 图谱中的位置**：邻近变体：把不同 reasoning effort 的 frontier policy 压进一个可控学生。
- **证据口径**：系统级证据；若缺少独立开关消融，不把最终模型总成绩全部归因给 MOPD。

## Motivation

低、中、高、超高 reasoning effort 对应不同 accuracy-compute Pareto 点；分别部署多个 policy 成本高，直接混合又会丢失 mode control。

**解读**：这里的 MOPD 是完整后训练系统中的能力汇合步骤；要把“最终模型很强”和“MOPD 单独有效”分开阅读。

## Method

先用多阶段 RL 探索不同预算下的 frontier policy，再做 mode-aware parameter merge 初始化和 multi-teacher OPD，把各预算行为压进一个带 mode 控制的学生。

**关键机制**：阅读重点是教师从哪里来、prompt 怎样路由、学生在哪些 prefix 上得到监督，以及系统如何承担多教师 serving 成本。

## Experimental Setup

先用多阶段 RL 得到低、中、高、超高预算策略，再做 mode-aware parameter merge 初始化与 multi-teacher OPD；主要在 AIME24 的对齐样本预算下比较离线与 on-policy fusion。

## Results

在 AIME24 的对齐样本预算比较中，on-policy fusion 略高于 offline distillation，并保持多档 reasoning 模式；论文把 merge 和 OPD 作为组合，未完全分离两者贡献。

**结果怎么读**：多教师合版也可以整合同一任务的不同计算 Pareto 点，但必须保留显式 mode 条件才能避免平均成一种行为。

## Limitations

参数合并与 OPD 作为组合使用，贡献没有完全分开；结果针对 reasoning budget 控制，和领域能力合版并不完全等价。

## Takeaways

多教师合版也可以整合同一任务的不同计算 Pareto 点，但必须保留显式 mode 条件才能避免平均成一种行为。

## Citation

> ORBIT. arXiv:2601.08310. [原文](https://arxiv.org/abs/2601.08310)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

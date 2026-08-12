---
title: "Rethinking On-Policy Distillation：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2604.13016
---

> [!summary] 解读结论
> OPD 成功需要“教师真有新能力”和“学生能进入教师的思考模式”同时成立，只有更高 benchmark 分数并不够。

## 基本信息

- **论文**：[Rethinking On-Policy Distillation](https://arxiv.org/abs/2604.13016)
- **arXiv**：2604.13016
- **分类**：OPD、模型合并与知识融合基础
- **在 MOPD 图谱中的位置**：OPD 成败机制：区分教师绝对分数、真实能力差与 thinking-pattern 兼容性。
- **证据口径**：基础或邻近路线证据；用于解释 MOPD 的设计选择，不当作多教师合版的直接效果。

## Motivation

OPD 有时成功、有时即使教师更强也失败，现有解释无法区分“分数更高”与“对学生真的有新能力”。

**解读**：这篇工作不一定直接采用多教师 OPD，但它解释了为什么某些 MOPD 设计成立，或提供了必须比较的替代路线。

## Method

用 weak-to-strong reverse distillation、token overlap 和训练动态分析教师-学生 thinking pattern；提出 off-policy cold start 与 teacher-aligned prompt selection 两个修复策略。

**关键机制**：与 MOPD 的连接点不在名称，而在它处理的是学生状态分布、教师行为分布，还是权重空间中的任务干涉。

## Experimental Setup

通过 weak-to-strong reverse distillation、token overlap 与训练动态分析同家族和不同距离的教师，并测试 off-policy cold start 与 teacher-aligned prompt selection。

## Results

成功 OPD 的共享高概率 token 集中约 97%–99% 概率质量；同家族 1.5B/7B 教师从学生视角可能几乎不可区分。论文验证 compatible pattern 与真实 capability gap 缺一不可，直接解释 MOPD 的同源教师边界。

**结果怎么读**：OPD 成功需要“教师真有新能力”和“学生能进入教师的思考模式”同时成立，只有更高 benchmark 分数并不够。

## Limitations

兼容性指标依赖所选 prompt 与 token 分布，不能压缩成一个对所有任务恒定的 KL 阈值；实验仍覆盖有限模型家族。

## Takeaways

OPD 成功需要“教师真有新能力”和“学生能进入教师的思考模式”同时成立，只有更高 benchmark 分数并不够。

## Citation

> Rethinking On-Policy Distillation. arXiv:2604.13016. [原文](https://arxiv.org/abs/2604.13016)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

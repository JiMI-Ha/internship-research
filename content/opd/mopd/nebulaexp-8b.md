---
title: "NebulaExp-8B：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2606.26671
---

> [!summary] 解读结论
> 相比只给最终模型总分的报告，这篇提供了较清楚的 OPD/MOPD 组件证据，支持小数据下的密集监督价值。

## 基本信息

- **论文**：[NebulaExp-8B](https://arxiv.org/abs/2606.26671)
- **arXiv**：2606.26671
- **分类**：工业模型与技术报告
- **在 MOPD 图谱中的位置**：组件级技术报告：分别验证 single-teacher OPD 与四教师 MOPD 的样本效率。
- **证据口径**：系统级证据；若缺少独立开关消融，不把最终模型总成绩全部归因给 MOPD。

## Motivation

验证 MOPD 是否能作为不依赖 verifier 的后训练方式，并量化教师选择、样本难度和多教师整合，而非只给最终模型总分。

**解读**：这里的 MOPD 是完整后训练系统中的能力汇合步骤；要把“最终模型很强”和“MOPD 单独有效”分开阅读。

## Method

先做 single-teacher OPD 的 IF 实验，再用四个领域教师和 10K 样本做 MOPD；统一比较 SFT、GRPO、OPD 与 MOPD。

**关键机制**：阅读重点是教师从哪里来、prompt 怎样路由、学生在哪些 prefix 上得到监督，以及系统如何承担多教师 serving 成本。

## Experimental Setup

先在 4K IF 样本上比较 SFT、GRPO 与单教师 OPD，再用四个领域教师和 10K 样本做 MOPD，报告 IFEval 与多任务平均分。

## Results

4K IF 样本的单教师 OPD 在 IFEval 比 RL baseline 高 3.26 点、总体平均高 4.43；四教师 MOPD 用 10K 样本令统一学生平均比 base 高 4.18，并在部分数学任务超过单教师上界。这是技术报告中较少见的组件级证据。

**结果怎么读**：相比只给最终模型总分的报告，这篇提供了较清楚的 OPD/MOPD 组件证据，支持小数据下的密集监督价值。

## Limitations

模型和数据规模仍较小，报告并非跨团队独立复现；部分超过教师上界的单项也可能包含共享知识迁移或评测波动。

## Takeaways

相比只给最终模型总分的报告，这篇提供了较清楚的 OPD/MOPD 组件证据，支持小数据下的密集监督价值。

## Citation

> NebulaExp-8B. arXiv:2606.26671. [原文](https://arxiv.org/abs/2606.26671)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

---
title: "Reward Resemble 系列"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
---

本系列归属于 [[rl/|RL]]，聚焦多奖励信号如何组合、如何避免目标间相互补偿，以及如何稳定地优化关键约束。

## 论文

- [[rl/reward-resemble/safe-rlhf|Safe RLHF：用动态安全约束平衡有用与无害]] — 分离帮助性 reward 与安全 cost，并用拉格朗日乘子动态满足安全约束。
- [[rl/reward-resemble/rvpo|RVPO：通过方差正则实现风险敏感对齐]] — 使用 SoftMin 方差正则缓解多目标 RLHF 中的约束忽略。

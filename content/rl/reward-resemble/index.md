---
title: "Reward Resemble 系列"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
---

本系列归属于 [[rl/|RL]]，聚焦多奖励信号如何组合、如何避免目标间相互补偿，以及如何稳定地优化关键约束。

## 论文

- [[rl/reward-resemble/prism|PRISM：不要混合奖励，而要组合策略]] — 分别学习目标专家与共享负策略，在推理时组合 logits。
- [[rl/reward-resemble/rule-based-rewards|Rule Based Rewards：把安全规范编译成可训练奖励]] — 将自然语言安全政策拆成可组合规则并拟合奖励权重。
- [[rl/reward-resemble/optimal-dualization-can|CAN：通过最优对偶化实现一次训练的安全对齐]] — 离线求最优对偶变量，再进行一次受约束目标训练。
- [[rl/reward-resemble/constrained-dpo|C-DPO：用动态拉格朗日乘子约束直接偏好优化]] — 根据安全约束违反程度动态重标偏好并更新乘子。
- [[rl/reward-resemble/odin|ODIN：解耦质量与长度奖励，缓解 RLHF 奖励黑客]] — 用双 head Reward Model 去除可被策略利用的长度捷径。
- [[rl/reward-resemble/safe-rlhf|Safe RLHF：用动态安全约束平衡有用与无害]] — 分离帮助性 reward 与安全 cost，并用拉格朗日乘子动态满足安全约束。
- [[rl/reward-resemble/rvpo|RVPO：通过方差正则实现风险敏感对齐]] — 使用 SoftMin 方差正则缓解多目标 RLHF 中的约束忽略。

---
title: "RL"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
---

强化学习相关调研，关注训练目标、奖励设计、策略优化以及多目标对齐。

## 系列

- [[rl/reward-resemble/|Reward Resemble 系列]] — 奖励信号的设计、标准化、聚合与风险敏感优化。

## 论文

- [[rl/reward-resemble/prism|PRISM：不要混合奖励，而要组合策略]] — 用策略分解替代训练前的多奖励混合。
- [[rl/reward-resemble/rule-based-rewards|Rule Based Rewards：把安全规范编译成可训练奖励]] — 用规则奖励平衡内容安全与过度拒答。
- [[rl/reward-resemble/optimal-dualization-can|CAN：通过最优对偶化实现一次训练的安全对齐]] — 先求安全约束的最优乘子，再一次性训练策略。
- [[rl/reward-resemble/constrained-dpo|C-DPO：用动态拉格朗日乘子约束直接偏好优化]] — 将动态安全约束加入 DPO。
- [[rl/reward-resemble/odin|ODIN：解耦质量与长度奖励，缓解 RLHF 奖励黑客]] — 解耦 Reward Model 中的质量与长度信号。
- [[rl/reward-resemble/safe-rlhf|Safe RLHF：用动态安全约束平衡有用与无害]] — 将安全建模为 Cost Model 约束，并动态平衡帮助性与无害性。
- [[rl/reward-resemble/rvpo|RVPO：通过方差正则实现风险敏感对齐]] — 用风险敏感聚合缓解多目标奖励的约束忽略。

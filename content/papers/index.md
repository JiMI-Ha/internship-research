---
title: "论文调研"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
---

这里收录论文的结构化阅读笔记，重点回答三个问题：研究动机是否真实、方法如何解决问题、结果是否足以支持主张。

## 论文列表

- **RL / Reward Resemble**：[[rl/reward-resemble/prism|PRISM：不要混合奖励，而要组合策略]] — 多奖励 RL、策略分解、logit 组合
- **RL / Reward Resemble**：[[rl/reward-resemble/rule-based-rewards|Rule Based Rewards：把安全规范编译成可训练奖励]] — 安全政策、规则奖励、过度拒答
- **RL / Reward Resemble**：[[rl/reward-resemble/optimal-dualization-can|CAN：通过最优对偶化实现一次训练的安全对齐]] — 约束优化、对偶化、一次训练
- **RL / Reward Resemble**：[[rl/reward-resemble/constrained-dpo|C-DPO：用动态拉格朗日乘子约束直接偏好优化]] — DPO、安全成本、拉格朗日约束
- **RL / Reward Resemble**：[[rl/reward-resemble/odin|ODIN：解耦质量与长度奖励，缓解 RLHF 奖励黑客]] — Reward Model、长度偏差、reward hacking
- **LLM Safety / Over-Refusal**：[[llm-safety/over-refusal/or-bench|OR-Bench：规模化测量安全模型的过度拒答]] — 80K 边界样本、安全—过拒权衡
- **LLM Safety / Over-Refusal**：[[llm-safety/over-refusal/xstest|XSTest：用最小安全—危险对照识别夸张安全行为]] — 最小对照、过度拒答、安全评测
- **RL / Reward Resemble**：[[rl/reward-resemble/safe-rlhf|Safe RLHF：用动态安全约束平衡有用与无害]] — 安全 RLHF、奖励与成本解耦、拉格朗日约束
- **RL / Reward Resemble**：[[rl/reward-resemble/rvpo|RVPO：通过方差正则实现风险敏感对齐]] — 多目标 RLHF、奖励聚合、约束忽略

---
title: "Reward Resemble：奖励设计与多目标对齐"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: topic
tags:
  - RL
  - RLHF
  - reward-modeling
  - multi-objective
  - safety-alignment
---

> [!abstract] 这个系列在看什么
> Reward Resemble 归属于 [[rl/|RL]]，集中整理“模型究竟在优化什么”：奖励如何设计、多个目标如何组合、硬约束如何满足，以及 Reward Model 的偏差如何被策略放大。

## 评分口径

- **业务契合度**：方法与当前业务问题、可落地场景和约束的匹配程度，满分 5 星。
- **Paper solid 度**：问题定义、方法严密性、实验覆盖、对照公平性与结论可信度，满分 5 星。
- **排序规则**：两项总分从高到低；总分相同时，业务契合度更高的论文优先。
- **待评价**：任一维度尚未评分时，不参与已评分论文的名次竞争。

评分只表达主编当前判断，不等同于论文的客观价值；随着业务目标或新增证据变化，可以继续修改。

## 研究地图

### 多奖励聚合与策略组合

- [[rl/reward-resemble/rvpo|RVPO：通过方差正则实现风险敏感对齐]] — 用 SoftMin 防止容易目标的高分补偿关键约束失败。
- [[rl/reward-resemble/prism|PRISM：不要混合奖励，而要组合策略]] — 分别学习目标专家与共享负策略，在推理时组合 logits。

### 安全约束与对偶优化

- [[rl/reward-resemble/safe-rlhf|Safe RLHF：用动态安全约束平衡有用与无害]] — 分离帮助性 reward 与安全 cost，并动态满足安全约束。
- [[rl/reward-resemble/constrained-dpo|C-DPO：用动态拉格朗日乘子约束直接偏好优化]] — 根据约束违反程度重标偏好并更新乘子。
- [[rl/reward-resemble/optimal-dualization-can|CAN：通过最优对偶化实现一次训练的安全对齐]] — 离线求最优对偶变量，再进行一次策略训练。

### 奖励构造、解耦与去偏

- [[rl/reward-resemble/rule-based-rewards|Rule Based Rewards：把安全规范编译成可训练奖励]] — 将自然语言安全政策拆成可组合规则并拟合权重。
- [[rl/reward-resemble/odin|ODIN：解耦质量与长度奖励，缓解 RLHF 奖励黑客]] — 用双 head Reward Model 去除可被策略利用的长度捷径。

## 收录范围

1. **Reward design**：规则奖励、可验证奖励、奖励塑形与 reward decomposition。
2. **Reward Model**：偏差、校准、鲁棒性、reward hacking 与去偏方法。
3. **Multi-objective alignment**：多奖励标准化、聚合、策略组合与 Pareto 优化。
4. **Constrained alignment**：安全 cost、拉格朗日方法、风险敏感或尾部约束。

安全 benchmark 归入 [[llm-safety/|LLM Safety]]；只有在能直接解释奖励设计时才与本系列交叉链接。

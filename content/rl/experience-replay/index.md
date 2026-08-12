---
title: "Experience Replay：LLM 经验复用与 Off-Policy RL"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: topic
tags:
  - RL
  - RLVR
  - experience-replay
  - off-policy
  - data-efficiency
---

> [!abstract] 这个专题在看什么
> Experience Replay 归属于 [[rl/|RL]]，关注昂贵 rollout 如何被重复利用：经验应保存什么、何时回放、如何管理新鲜度，以及怎样控制历史 behavior policy 与当前 policy 之间的分布偏移。

## 核心问题

1. **经验价值**：完整成功轨迹、失败 prefix、中间状态、专家答案和搜索节点，哪一种最值得重复训练？
2. **Buffer 管理**：怎样在容量、难度、多样性、正样本比例与 freshness 之间取舍？
3. **Off-policy 稳定性**：importance ratio、advantage normalization、trust constraint 和专用目标如何缓解 stale data？
4. **探索—利用平衡**：replay ratio 多高会挤压 fresh rollout，何时应切回纯 on-policy？
5. **真实效率**：更新步数、rollout 数、GPU-hours 与完整 wall-clock 是否同时改善？

## 专题地图

### 基准、继承者与系统比较

- [[rl/experience-replay/rlep-experience-replay|RLEP 与 LLM Experience Replay：从成功轨迹复用到稳定 Off-Policy RL]] — 以 RLEP 为基准，比较 ExGRPO、BAPO、两类 RePO、DOTS、EFRame、ReMix、RRL、ReVal、DeepSearch 等 27 项相关工作。

### 方法分支

- **完整轨迹 self-replay**：RLEP、ExGRPO、BAPO、Replay-Enhanced RePO、DOTS、EFRame、ReMix。
- **Prefix / state replay**：RRL、POER；从失败轨迹中保留仍有希望的局部路径。
- **专家轨迹注入**：LUFFY、Rephrasing RePO、ReLIFT、CHORD、KDRL。
- **异步、搜索与 value replay**：Trajectory Balance with Asynchrony、DeepSearch、ReVal。
- **稳定性底座**：Soft Policy Optimization、Tapered Off-Policy REINFORCE、AsymRE、M2PO 与 GRPO off-policy 分析。

## 与邻近专题的边界

- [[rl/reward-resemble/|Reward Resemble]] 研究“模型在优化什么 reward，以及多目标如何组合”；本专题研究“生成过的经验如何再次进入训练”。
- 外部教师蒸馏只有在涉及历史轨迹混入、policy gap 或 replay buffer 时才收录；单纯 logits 蒸馏不属于本专题核心范围。
- 纯推理时 memory/RAG 不改变训练策略，不属于 reinforcement-learning experience replay。

## 收录范围

1. LLM RL/RLVR 中的 replay buffer、rollout reuse 与 hard-sample rescue。
2. 成功轨迹、失败 prefix、中间状态、搜索节点和外部专家轨迹的复用。
3. Staleness、policy lag、off-policy correction 与训练崩溃机制。
4. 以 rollout、算力或端到端训练时间为目标的数据效率研究。

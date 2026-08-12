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

> [!abstract] 独立专题
> 这里收录 28 个逐篇条目。每一种方法都有独立的 Motivation、Method、Experimental Setup、Results、Ablation、Limitations、Takeaways 与原文链接；[[rl/experience-replay/rlep-experience-replay|研究地图]]只负责分支导航。

## 核心问题

1. **经验价值**：完整成功轨迹、失败 prefix、中间状态、专家答案和搜索节点，哪一种最值得重复训练？
2. **Buffer 管理**：怎样在容量、难度、多样性、正样本比例与 freshness 之间取舍？
3. **Off-policy 稳定性**：importance ratio、advantage normalization、trust constraint 和专用目标如何缓解 stale data？
4. **探索—利用平衡**：replay ratio 多高会挤压 fresh rollout，何时应切回纯 on-policy？
5. **真实效率**：更新步数、rollout 数、GPU-hours 与完整 wall-clock 是否同时改善？

## 28 个独立条目

### Self-Replay 与 Rollout Buffer

- [[rl/experience-replay/rlep|RLEP：用成功轨迹回放加速 LLM 推理强化学习]]
- [[rl/experience-replay/exgrpo|ExGRPO：按经验价值选择历史成功轨迹]]
- [[rl/experience-replay/bapo-buffer-matters|Buffer Matters / BAPO：让历史难题随策略成长重新进入训练]]
- [[rl/experience-replay/replay-enhanced-repo|Replay-Enhanced RePO：单次训练内持续积累与检索 rollout]]
- [[rl/experience-replay/dots-rollout-replay|DOTS + Rollout Replay：按当前难度定向采样并复用近期 rollout]]
- [[rl/experience-replay/eframe|EFRAME：Exploration–Filter–Replay 拯救全失败难题]]
- [[rl/experience-replay/remix|ReMix：用阶段化历史混合提高 Update-to-Data Ratio]]
- [[rl/experience-replay/efficient-rl-experience-replay|Efficient RL Training with Experience Replay：系统扫描 Buffer 的性能—计算 Pareto]]
- [[rl/experience-replay/polaris-rollout-rescue|Polaris Rollout-Rescue：全失败组中的按需历史答案注入]]
- [[rl/experience-replay/arpo|ARPO：GUI Agent 的 Group Relative Policy Optimization 与经验回放]]
- [[rl/experience-replay/kimi-k1-5|Kimi k1.5：大型 RL 系统中的完整与部分轨迹缓存]]

### Prefix、异步、搜索与 Value Replay

- [[rl/experience-replay/retrospective-replay|Retrospective Replay：从高价值中间状态继续探索]]
- [[rl/experience-replay/poer|POER：回放失败轨迹中的有希望 Prefix]]
- [[rl/experience-replay/trajectory-balance-asynchrony|Trajectory Balance with Asynchrony：解耦异步探索与学习]]
- [[rl/experience-replay/reval|ReVal：用 Bellman 更新与 Replay Buffer 训练 LLM]]
- [[rl/experience-replay/deepsearch|DeepSearch：训练时树搜索、节点价值与解答缓存]]

### 外部专家与历史知识

- [[rl/experience-replay/luffy|LUFFY：全失败时用外部专家轨迹做 Off-Policy Guidance]]
- [[rl/experience-replay/rephrasing-repo|Rephrasing RePO：先把专家答案改写成当前 Policy 的语言]]
- [[rl/experience-replay/relift|ReLIFT：在在线 RL 与困难样本监督微调之间交错训练]]
- [[rl/experience-replay/chord|CHORD：动态协调 On-Policy RL 与 Off-Policy Experts]]
- [[rl/experience-replay/kdrl|KDRL：统一知识蒸馏与强化学习吸收教师推理]]
- [[rl/experience-replay/poets|POETS：不确定性感知的 Policy Ensemble 与 Experience Replay]]
- [[rl/experience-replay/inspo|INSPO：用失败经验进化 Instruction，而非直接回放给 Actor]]

### Off-Policy 稳定性

- [[rl/experience-replay/soft-policy-optimization|Soft Policy Optimization：面向序列模型的在线 Off-Policy RL]]
- [[rl/experience-replay/tapered-off-policy-reinforce|TOPR：用 Tapered Weighting 稳定完全离线的 REINFORCE]]
- [[rl/experience-replay/asymmetric-reinforce|AsymRE：用保守负 Baseline 平衡 Off-Policy 正负奖励]]
- [[rl/experience-replay/m2po|M2PO：用二阶矩 Trust Constraint 延长陈旧数据可用区间]]
- [[rl/experience-replay/revisiting-grpo-off-policy|Revisiting GRPO：On-Policy 与 Off-Policy 更新边界]]

## 与邻近专题的边界

- [[rl/reward-resemble/|Reward Resemble]] 研究“模型在优化什么 reward，以及多目标如何组合”；本专题研究“生成过的经验如何再次进入训练”。
- 外部教师蒸馏只有在涉及历史轨迹混入、policy gap 或 replay buffer 时才收录。
- 纯推理时 memory/RAG 不改变训练策略，不属于 reinforcement-learning experience replay。

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

## 排行与评分口径

页面顶部固定展示两份彼此独立的榜单：先按方法是否覆盖三类机制给 **0–3 分**，再按主编判断给 **业务契合度**与 **Paper solid 度**各 1–5 星。机制榜按“专项分 → 业务星级 → solid 星级 → 标题”排序；双五星榜按两项总分排序，总分相同时业务分更高者优先。

- **业务契合度**：重点看方法是否直接解决监督数据混入 RL、历史经验复用或 off-policy 稳定性，同时考虑工程侵入性、算力收益和迁移到现有 RLVR 流程的难度。
- **Paper solid 度**：综合问题定义、公式与算法闭环、实验覆盖、对照公平性、消融、统计证据及结论边界。博客组件、正文尚未可靠取得或未隔离 replay 增益的材料会降级评分。
- **星级含义**：5 星为当前最值得优先复现或证据最完整的一档；4 星为较强但仍有适用条件；3 星为可参考但证据或迁移性一般；2 星及以下表示证据明显受限，不等于方法一定无效。

评分是当前业务视角下的主编判断，不是论文的客观价值；后续有新版本、复现实验或业务约束变化时可以调整。

## 三项机制覆盖分

以下三项各命中一项加 1 分，满分 3 分。它只回答“方法设计有没有直接涉及”，不评价效果大小或论文质量。

1. **SFT / DPO / 专家示范混入 RL**：监督、偏好、蒸馏、离线轨迹或专家解答进入 RL batch，或与 RL 更新交错执行。
2. **Replay buffer / 历史轨迹缓存**：显式保存并再次使用历史 rollout、prefix、中间状态、正确解答或失败经验。
3. **显式缓解 off-policy**：使用 behavior probability、importance correction、分离 advantage、FIFO / 年龄窗口、重写、动态权重、trust constraint、value-based / trajectory-balance 等专用目标，或避免用陈旧经验直接更新 actor。

边界口径：KDRL 的教师蒸馏、SPO 的 offline trajectory、RRL 的 canonical-solution prefix 都按广义监督 / 专家数据计第 1 分，并在榜单证据里明示；只把历史样本混回训练、却没有额外处理 policy gap 或 staleness，不自动获得第 3 分。ReLIFT 的第 3 分来自把外部示范隔离到交错 SFT 并动态刷新困难集合，而不是 importance correction。

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

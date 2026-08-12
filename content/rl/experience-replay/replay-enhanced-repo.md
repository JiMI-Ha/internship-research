---
title: "Replay-Enhanced RePO：单次训练内持续积累与检索 rollout"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, RL, RLVR, experience-replay, GRPO, asynchronous]
source_url: https://arxiv.org/abs/2506.09340
---

> [!summary] 核心结论
> Replay-Enhanced RePO 在同一次训练中异步检索早期 rollout，并把 on-policy 与 off-policy 样本的 advantage 分开归一化。它比 RLEP 的“两轮训练”更适合作为在线 replay 基线。

## 基本信息

- **论文**：[RePO: Replay-Enhanced Policy Optimization](https://arxiv.org/abs/2506.09340)
- **作者**：Siheng Li、Zhanhui Zhou、Wai Lam、Chao Yang、Chaochao Lu
- **注意**：不要与 [[rl/experience-replay/rephrasing-repo|Rephrasing Policy Optimization]] 混淆。

## Motivation

GRPO 每次只使用最新 rollout，数据效率低；直接混入历史样本时，behavior policy 不同，统一做组内 advantage normalization 会扭曲二者的相对尺度。RLEP 还需要先跑完一轮 RL 建库。论文目标是在单个训练 run 中积累经验，并降低检索对主训练循环的阻塞。

## Method

1. 在线收集每一轮 rollout，持续写入经验池。
2. 后台异步检索历史样本，可按 recent、reward、variance 或 full-buffer 等策略选取。
3. fresh 与 replay 数据混合训练，但分别估计 on-policy 和 off-policy advantage，再合并 loss。
4. 检索和准备 replay 与当前 rollout 并行，控制额外系统开销。

## Experimental Setup

- **模型**：五种不同规模/系列模型，代表性结果为 Qwen3-1.7B。
- **任务**：可验证数学推理；对比标准 GRPO 与不同 buffer 检索、advantage 计算方式。
- **成本**：同时报告训练性能和 wall-clock 开销。

## Results

- 五种模型上均高于 GRPO。
- Qwen3-1.7B 的数学平均分由 **39.5 提升到 43.6**。
- 训练时间约增加 **15%**，说明它以一定 wall-clock 成本换取更高数据利用率，而不是免费加速。

## Ablation

- 将 on/off-policy 样本分开计算 advantage 明显优于混合归一化，是最关键的算法结论之一。
- recent、reward、variance 与 full-buffer 检索之间存在差异，说明历史样本的时间和信息量都会影响收益。
- 异步检索降低了串行等待，但不能消除额外前向、存储与训练成本。

## Limitations

- 增益与 15% 时间开销之间的取舍依赖具体部署。
- 仍以数学 RLVR 为主，未充分覆盖开放式 reward 与长程 agent 任务。
- buffer 越大并不必然越好；论文没有给出所有规模下通用的 freshness 法则。

## Takeaways

如果要实现“训练过程中随产随用”的经验回放，RePO 比两阶段 RLEP 更自然。最值得复用的设计不是某一种检索器，而是**on/off-policy advantage 分开统计**。

## Citation

Li et al. _RePO: Replay-Enhanced Policy Optimization_. arXiv:2506.09340, 2025.

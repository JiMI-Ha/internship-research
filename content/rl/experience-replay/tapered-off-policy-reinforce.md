---
title: "TOPR：用 Tapered Weighting 稳定完全离线的 REINFORCE"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, RL, off-policy, REINFORCE, offline-RL]
source_url: https://arxiv.org/abs/2503.14286
---

> [!summary] 核心结论
> Tapered Off-Policy REINFORCE（TOPR）对远离当前 policy 的样本平滑降权，避免 naive importance sampling 的高方差和 PPO 硬 clipping 的信号丢失。Llama-3-8B 在完全离线 GSM8K 上 pass@1 约达 71–72。

## 基本信息

- **论文**：[Tapered Off-Policy REINFORCE: Stable and Efficient Reinforcement Learning for LLMs](https://arxiv.org/abs/2503.14286)
- **简称**：TOPR

## Motivation

离线轨迹来自固定 behavior policy，训练越久，与当前 policy 的重要性比率越极端。Naive REINFORCE 会被少数样本主导，PPO clipping 又把大量样本梯度直接截断。论文希望用连续 taper 在“全收”和“全丢”之间平滑控制贡献。

## Method

1. 计算当前 policy 与 behavior policy 的序列/样本权重。
2. 对远离 behavior 分布的权重应用 tapered 变换：中等偏移保留信号，极端偏移逐渐衰减。
3. 对正、负 reward 使用非对称加速/衰减，使正例能够推动学习、负例避免高方差破坏。
4. 不依赖额外 KL 项，在完全离线数据上反复更新。

## Experimental Setup

- **模型**：Llama-3-8B，并补充更大模型/其他基座分析。
- **任务**：GSM8K、MATH。
- **数据**：固定离线 rollout；比较 naive REINFORCE、PPO、DPO、truncated IS 与 TOPR。

## Results

- GSM8K pass@1 峰值约 **71–72%**，明显高于 base 与其他完全离线对照。
- MATH pass@1 相对 base **接近翻倍**。
- Anna Karenina 式采样在 GSM8K 达到 **79.6%**，均匀采样为 75.4%；这是 TOPR 叠加采样策略的结果，不应当作基本算法单独成绩。

## Ablation

- 只用正样本不如正负样本共同训练；负例主要减少“完全找不到解”的问题。
- 有效正样本比例约 **10%–20%** 时最好，超过 50% 后明显下降。
- 硬 truncated IS 有时峰值略高，但 TOPR 更稳，体现 peak performance 与 robustness 的取舍。

## Limitations

- 完全离线数学轨迹的 reward 清晰，开放式语言任务未充分验证。
- 最佳正样本比例依赖 baseline 和数据生成 policy。
- tapered 设计降低而非消除 extrapolation risk，极端 policy gap 仍不可安全无限复用。

## Takeaways

TOPR 适合作为旧轨迹权重层：不要只按一个 clip 阈值决定“用或不用”，而应让贡献随 policy gap 平滑衰减，并单独检查正负样本平衡。

## Citation

Le Roux et al. _Tapered Off-Policy REINFORCE: Stable and Efficient Reinforcement Learning for LLMs_. arXiv:2503.14286, 2025.

---
title: "AsymRE：用保守负 Baseline 平衡 Off-Policy 正负奖励"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
business_fit: 4
paper_solidity: 4
tags: [paper, RL, off-policy, REINFORCE, stability]
source_url: https://arxiv.org/abs/2506.20520
---

> [!summary] 核心结论
> Asymmetric REINFORCE（AsymRE）不用普通 PPO importance-ratio clipping，而是通过略低于行为策略期望 reward 的 baseline，让正例权重稍强、负例稍弱。$δV=-0.1$ 的训练稳定；$δV=0$ 的 7 次独立运行全部 collapse。

## 基本信息

- **论文**：[Asymmetric REINFORCE for Off-Policy Reinforcement Learning: Balancing Positive and Negative Rewards](https://arxiv.org/abs/2506.20520)
- **作者**：Charles Arnal、Gaëtan Narozniak、Vivien Cabannes、Yunhao Tang、Julia Kempe、Remi Munos

## Motivation

off-policy LLM RL 中，正样本太弱会学不到新能力，负样本太强又会快速压缩 policy support，造成答案多样性和测试准确率崩溃。标准“baseline=期望 reward”在函数逼近与跨 prompt 泛化下未必稳定。

## Method

1. 从 REINFORCE 出发，对正、负 advantage 的长期行为进行理论分析。
2. 将 baseline 写成行为策略估计值 $\hat V$ 加修正 $δV$。
3. 取小的负修正（经验上 $δV≈-0.1$），相对增强正样本、减弱负样本。
4. 允许 behavior policy 较低频更新，用于 off-policy/历史数据训练。

## Experimental Setup

- **模型**：Llama-8B、Llama-3B、Qwen-3B。
- **任务**：MATH、NuminaMath。
- **统计**：主要比较 3 seeds；稳定性专项对 $δV=0$ 与 -0.1 各运行 7 次。
- **off-policy 程度**：代表性实验每 250 steps 才更新 behavior policy。

## Results

- $δV=0$ 的 7 次 Llama-8B 运行**全部 collapse**；$δV=-0.1$ 明显更稳定。
- Llama-8B 与 Qwen-3B 的 MATH 实验中，AsymRE 比 GRPO 收敛更快、最终测试准确率更高。
- 论文没有把这一现象包装成所有规模的固定提升，并明确表示仍需要更大规模实验。

## Ablation

- 当 $δV$ 从负值达到或超过 0 时出现相变式崩溃，且越大越早发生。
- 过负的 baseline 也会牺牲负例约束；-0.1 是稳定性与学习速度的经验折中。
- 多模型/数据子集结果支持趋势，但绝对最优值并非完全一致。

## Limitations

- 主要规模为 3B/8B，任务集中在数学。
- baseline 修正是全局标量，未显式适应 prompt 难度与 reward 密度。
- “比 GRPO 更耐 stale”不等于陈旧度无上限。

## Takeaways

AsymRE 给 replay 的底层启示是：正负经验不能机械对称处理。一个很小的保守 baseline 偏移，就可能决定长期训练是稳定还是 support collapse。

## Citation

Arnal et al. _Asymmetric REINFORCE for Off-Policy Reinforcement Learning: Balancing Positive and Negative Rewards_. arXiv:2506.20520, 2025.

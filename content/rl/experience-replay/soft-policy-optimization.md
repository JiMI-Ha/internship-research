---
title: "Soft Policy Optimization：面向序列模型的在线 Off-Policy RL"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
business_fit: 4
paper_solidity: 4
tags: [paper, RL, off-policy, sequence-model, code-generation]
source_url: https://arxiv.org/abs/2503.05453
---

> [!summary] 核心结论
> SPO 为序列模型构造 soft、off-policy 的 Q-regression 目标，可混合离线数据并减少 behavior-policy 同步。它在代码竞赛上提升 pass@10 与多样性，但 pass@1 低于 PPO，收益目标必须说清楚。

## 基本信息

- **论文**：[Soft Policy Optimization: Online Off-Policy RL for Sequence Models](https://arxiv.org/abs/2503.05453)
- **作者**：Taco Cohen、David W. Zhang、Kunhao Zheng、Yunhao Tang、Remi Munos、Gabriel Synnaeve

## Motivation

PPO 需要频繁收集当前策略数据和同步模型，难以利用离线代码解答，也容易把 policy 压成少数高概率模式。代码生成的 pass@10 更需要多样解法。论文从 entropy-regularized RL 推导一个无需单独 value model 的 off-policy 序列目标。

## Method

1. 从 soft policy iteration 推导 token/序列 Q-regression。
2. 用模型概率和 reward 构造 cross-entropy 形式的目标，可训练 behavior policy 产生的历史或离线序列。
3. half-online 版本每批使用 50% offline + 50% online 数据。
4. behavior policy 每 10 个 batch 才更新一次，减少节点间模型传输。

## Experimental Setup

- **模型**：Llama-3.1-8B-Instruct。
- **训练/评测**：CodeContests 训练，TACO 测试，100K steps。
- **评测指标**：从 20 个采样估计 pass@10；temperature 0.4、top-p 0.95。
- **对照**：PPO、online SPO、half-online SPO 及多种 loss 消融。

## Results

- half-online SPO 的 pass@10 高于 online SPO 与 PPO，且只需一半在线采样。
- 论文报告降低 behavior-policy 更新频率带来约 **85% wall-clock speedup**。
- 但 pass@1 为：PPO **8.4**、half-online SPO **6.3**、online SPO **6.0**。因此优势主要是多样性/pass@10，而非单次解答准确率。

## Ablation

- 比较 squared loss、cross-entropy 与 advantage regression，默认 cross-entropy 更稳。
- offline 数据包含当前模型低概率但正确的解，能维持 pass@10 多样性。
- PPO 的 pass@1 提高同时 pass@10 略降，显示策略模式坍缩。

## Limitations

- 主要是代码任务，pass@10 目标与常见数学 pass@1 不同。
- reference/Q 估计在实验中没有频繁更新；论文也承认在线估计 $Q_0$ 可能继续改善结果。
- “85% speedup”高度依赖模型传输和系统拓扑。

## Takeaways

SPO 说明 off-policy 数据可以从目标函数层面原生支持。评价时必须同时看 pass@1 与 pass@10：它换来的主要是更软、更有多样性的 policy。

## Citation

Cohen et al. _Soft Policy Optimization: Online Off-Policy RL for Sequence Models_. arXiv:2503.05453, 2025.

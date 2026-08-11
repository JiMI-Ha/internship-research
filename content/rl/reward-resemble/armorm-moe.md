---
title: "ArmoRM-MoE：用多维绝对评分和门控学习可解释偏好"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Haoxiang Wang, Wei Xiong, Tengyang Xie, Han Zhao, Tong Zhang"
aliases: [papers/armorm-moe]
tags: [paper, RL, reward-resemble, reward-model, multi-objective, mixture-of-experts]
source_url: https://arxiv.org/abs/2406.12845
---

> [!summary] 一句话结论
> ArmoRM 先预测 19 个可解释 reward 维度，再用 prompt-conditioned gate 动态标量化；8B 模型在 RewardBench 得到 89.0，接近 340B RM，但解释性仍主要来自预定义维度而非因果解释。

## 基本信息

- **论文**：[Interpretable Preferences via Multi-Objective Reward Modeling and Mixture-of-Experts](https://arxiv.org/abs/2406.12845)
- **版本**：arXiv:2406.12845v1，2024-06-19
- **关键词**：多目标 RM、绝对评分、MoE gating、RewardBench

## Motivation

成对偏好把“1 对 5”和“2 对 3”都压成相同二元标签，也无法解释模型究竟因为诚实、安全还是表达质量而偏好某个回答。固定加权又无法针对不同 prompt 调整目标重要性。

## Method

第一阶段冻结 Llama-3-8B backbone，仅训练线性回归头，从八个数据源的多维绝对评分预测 19 个目标。第二阶段训练三层 MLP gate，读取 prompt 表征并输出各目标权重；最终 reward 是目标分数的动态线性组合。Gate 用十个成对偏好数据集与 Bradley–Terry loss 训练。

## Experimental Setup

- ArmoRM 只做 linear probing；gate 在单张 A6000 上训练 10K steps。
- 评测为 RewardBench 的 Chat、Chat Hard、Safety、Reasoning 与 Prior Sets。
- 比较同 backbone Bradley–Terry RM、GPT-4 judge、HelpSteer2 RM 等。

## Results

ArmoRM+MoE 总分 **89.0**，高于同 backbone Bradley–Terry 的 **83.6**、GPT-4 Turbo judge 的 **84.2**，接近 Nemotron-4 340B RM 的 **89.3**。分项中 Reasoning 为 **97.3**，但 Chat Hard 只有 **76.8**，低于 340B RM 的 87.1，说明总分接近不等于各类鲁棒性相同。

## Ablation

论文主要通过与同 backbone 单标量 RM 的差异证明多目标回归与 gating 的组合价值；没有充分拆开“绝对评分信息”和“动态 gate”各自贡献，也未用 policy 优化检验 reward hacking。

## Limitations

- 只在 RewardBench 做 RM 排序评估，没有 RL 后的策略行为实验。
- 目标维度和数据标签由既有数据集定义，可能遗漏业务真正关心的属性。
- Gate 仍是黑盒 MLP；可查看权重不等于权重因果可靠。
- 单一 benchmark 与公开 RM 可能存在数据重叠或过拟合风险。

## Takeaways

- 保留多维绝对分数比过早二值化更适合审计与后续组合。
- Prompt-conditioned 权重是固定加权的强基线，但要按类别检查而非只看总分。
- 上线前应验证 gate 权重稳定性和 policy 优化后的真实行为。

## Citation

```bibtex
@article{wang2024interpretable,
  title={Interpretable Preferences via Multi-Objective Reward Modeling and Mixture-of-Experts},
  author={Wang, Haoxiang and Xiong, Wei and Xie, Tengyang and Zhao, Han and Zhang, Tong},
  journal={arXiv preprint arXiv:2406.12845},
  year={2024}
}
```

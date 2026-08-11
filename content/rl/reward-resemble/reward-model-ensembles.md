---
title: "Reward Model Ensembles：用保守聚合缓解过优化"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Thomas Coste, Usman Anwar, Robert Kirk, David Krueger"
aliases:
  - papers/reward-model-ensembles
tags:
  - paper
  - RL
  - reward-resemble
  - reward-modeling
  - ensemble
  - reward-hacking
source_url: https://arxiv.org/abs/2310.02743
---

> [!summary] 一句话结论
> RM ensemble 只有配合保守目标才真正针对过优化：取最小值或“均值减分歧惩罚”能阻止策略只利用某个过度乐观的 RM；简单平均仍可能被单个坏成员拖偏。

## 基本信息

- **论文**：[Reward Model Ensembles Help Mitigate Overoptimization](https://arxiv.org/abs/2310.02743)
- **版本**：arXiv:2310.02743v2；ICLR 2024
- **关键词**：RM ensemble、overoptimization、WCO、UWO

## Motivation

单个 proxy RM 会在强优化下暴露盲点。增大 RM 很贵，而平均多个 RM 的预测也不够：只要一个成员对某类回答异常高估，均值仍可能奖励 exploit。作者研究 ensemble 的不确定性是否能成为保守优化信号。

## Method

比较三种聚合：ensemble mean；Worst-Case Optimization，$R_{WCO}=\min_i R_i$；以及 Uncertainty-Weighted Optimization，用 ensemble 均值减去成员分歧的加权惩罚。前者假设至少有一个成员没有高估，后者把高分歧区域视为不可靠。方法同时用于 best-of-$n$ 和 PPO。

## Experimental Setup

- 延续“较大 gold RM 充当真实偏好、较小 proxy RM 被优化”的合成反馈范式。
- 使用 AlpacaFarm 数据与开源模型；proxy RM 验证准确率约 60%–75%。
- 同时实验干净标签与人为翻转 25% 标签。
- 扫描 ensemble 大小、不确定性系数、RM / 数据规模和 PPO KL 惩罚。

## Results

BoN 中，WCO 与 UWO 在两种噪声设置下几乎消除过优化；相对单 RM，干净数据最终表现最高约提升 **30%**，25% 噪声时约提升 **75%**（摘要保守表述为最高约 70%）。PPO 中保守 ensemble 始终匹配或优于单 RM，但通常还要配合小 KL penalty 才完全阻止过优化。

## Ablation

- ensemble mean 在 25% 标签噪声下仍发生过优化，说明“多模型”本身不是充分条件。
- WCO 无额外超参但可能过度保守；UWO 的分歧权重在实验范围内较稳健。
- ensemble 规模增大总体有利，但收益递减；小规模 ensemble 已能带来明显改善。

## Limitations

- gold RM 仍是模型，不是真实人类效用；结论依赖合成 ground truth。
- 多个 RM 若共享训练数据和系统性偏差，分歧可能低估真实不确定性。
- ensemble 增加训练、存储和推理成本。
- WCO 会放大悲观成员或离群 RM 的错误。

## Takeaways

- 业务部署应区分“平均提分”和“保守防 exploit”两种目标。
- UWO 与 RVPO 都惩罚方差，但前者是**跨 RM 的认知不确定性**，后者是**跨目标的不均衡**。
- ensemble 成员需要真实多样性，不能只换随机种子后默认风险已覆盖。

## Citation

```bibtex
@inproceedings{coste2024reward,
  title={Reward Model Ensembles Help Mitigate Overoptimization},
  author={Coste, Thomas and Anwar, Usman and Kirk, Robert and Krueger, David},
  booktitle={International Conference on Learning Representations},
  year={2024}
}
```

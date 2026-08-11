---
title: "MOPO：用投影迭代实现非线性多目标与多群体 RLHF"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Nuoya Xiong, Aarti Singh"
aliases: [papers/projection-optimization]
tags: [paper, RL, reward-resemble, multi-objective, nonlinear-aggregation, pluralistic-alignment]
source_url: https://arxiv.org/abs/2502.15145
---

> [!summary] 一句话结论
> MOPO 把非线性 $p$-norm 聚合转成一系列线性标量化子问题，再在 reward 空间投影更新方向；已有各目标专家策略后，可近似免训练地覆盖 max-min 与多群体目标。

## 基本信息

- **论文**：[Projection Optimization: A General Framework for Multi-Objective and Multi-Group RLHF](https://arxiv.org/abs/2502.15145)
- **版本**：arXiv:2502.15145v2，2025-02-24
- **关键词**：non-linear scalarization、projection、multi-group RLHF、Pareto

## Motivation

线性加权只能覆盖凸 Pareto front，并不直接表达“优先改善最差目标”或多个群体共识。直接优化非线性聚合又要在参数变化后重训。论文希望复用目标专家策略，把复杂目标化成可解的线性子问题。

## Method

MOPO 用 Blackwell approachability 思路：每轮根据当前 reward 向量到目标集合的投影得到方向 $d_t$，再求解 $d_t$ 对各目标的线性组合策略；离线/在线版本分别给出次线性 regret 保证。实用算法先训练每目标最优 policy，利用 MOD 在推理时组合 policy，并迭代七轮平均方向。

## Experimental Setup

- Llama-2-7B + Anthropic HH，三个现成 RM：helpfulness、harmlessness、humor。
- 比较 Rewarded Soups、MOD、直接非线性 reward、MaxMin-RLHF。
- 单群体测试 $p=0.5$，并测试 $p=-\infty$ 的 max-min 与多群体设置。

## Results

在 harmless/helpful、$\alpha=(0.5,0.5)$ 时，到目标集合距离为 **0.015**，优于 RS 0.078、MOD 0.103 和直接聚合 1.314。harmless/humor 多个权重上也总体更稳；并非每个点都严格最优，例如 $\alpha=(0.3,0.7)$ 时 MOD 0.572 略好于 MOPO 0.578。

## Ablation

直接对截断非负 reward 做非线性聚合表现很差，论文归因于负区间梯度消失。迭代轮数固定为七，reward 向量仅用 100 个训练样本估计；这两个选择未充分消融。

## Limitations

- “近似免训练”建立在每个目标专家 policy 已经训练完成之上，前置成本不低。
- 主要实验只有三个代理 RM 与单一 7B 模型，群体偏好是设定而非真实采集。
- 非线性参数 $p$ 与目标集合需要人工给定。
- 理论算法与实用 MOD 近似版本之间仍有实现差距。

## Takeaways

- 非线性业务目标可先分解为线性子问题，复用已有专家模型。
- Max-min 不是唯一选择；投影目标集合可更明确表达可接受区域。
- 评测应报告整个 front 到目标集合的距离，不能只挑单一权重点。

## Citation

```bibtex
@article{xiong2025projection,
  title={Projection Optimization: A General Framework for Multi-Objective and Multi-Group RLHF},
  author={Xiong, Nuoya and Singh, Aarti},
  journal={arXiv preprint arXiv:2502.15145},
  year={2025}
}
```

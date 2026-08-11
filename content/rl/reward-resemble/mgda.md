---
title: "MGDA for MTL：以最小范数梯度寻找 Pareto Stationary 解"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Ozan Sener, Vladlen Koltun"
aliases:
  - papers/mgda
tags:
  - paper
  - RL
  - reward-resemble
  - multi-objective
  - gradient-optimization
source_url: https://arxiv.org/abs/1810.04650
---

> [!summary] 一句话结论
> 这篇工作把共享网络的多任务训练显式写成多目标优化，并用任务梯度的最小范数凸组合寻找共同下降方向；它比固定 loss 权重更有原则，但计算和理论假设到 LLM RLHF 仍有距离。

## 基本信息

- **论文**：[Multi-Task Learning as Multi-Objective Optimization](https://arxiv.org/abs/1810.04650)
- **版本**：arXiv:1810.04650v2，2019-01-11；NeurIPS 2018
- **关键词**：MGDA、Pareto optimality、multi-task learning

## Motivation

多任务常最小化固定加权和，但任务梯度冲突时，一个权重只能表达预先指定的折中，也可能比独立训练更差。作者希望直接寻找 Pareto-optimal 参数，而非把多目标问题悄悄改成单目标。

## Method

对任务损失梯度 $g_t$，每步求解 simplex 上的最小范数组合：

$$
\min_{\alpha\in\Delta_T}\left\|\sum_{t=1}^{T}\alpha_t g_t\right\|_2^2.
$$

若最小范数为零，则满足 Pareto-stationary 条件；否则负的组合梯度是所有任务的共同下降方向。为避免在高维共享表示上直接计算完整梯度，论文构造上界并用 Frank–Wolfe 近似权重。

## Experimental Setup

- MultiMNIST：两个分类任务。
- CelebA：最多 40 个属性任务。
- Cityscapes：语义分割、实例分割和深度估计。
- 比较 uniform loss、单任务、grid search、uncertainty weighting 与 GradNorm。

## Results

MGDA 版本在上述分类、场景理解和多标签任务中整体取得比固定加权与当时自适应基线更好的 trade-off，并以较低额外开销扩展到深网。结果说明“根据当前梯度动态选权重”优于一组静态权重，但不存在所有单项必然同时提高的保证。

## Ablation

论文比较完整多目标形式与基于共享表示上界的可扩展近似，并显示后者保留主要性能同时降低计算。任务数从 2 到 40 的实验检查扩展性；不过没有 LLM、policy gradient 或 noisy reward 场景。

## Limitations

- 收敛到 Pareto stationary 不等于全局 Pareto optimal。
- 每步需要多任务梯度和小型优化问题，任务数多时成本增加。
- 梯度尺度、共享参数选择和随机噪声会影响解。
- 监督多任务结果不能直接证明适用于 token-level RLHF。

## Takeaways

- 当每个 rubric 可产生独立可微 loss 时，MGDA 是固定加权和的重要基线。
- 它解决梯度方向，不解决 reward 是否正确或业务优先级如何定义。
- 对数十个 rubric，应先测 per-objective backward 的成本与噪声稳定性。

## Citation

```bibtex
@inproceedings{sener2018multi,
  title={Multi-Task Learning as Multi-Objective Optimization},
  author={Sener, Ozan and Koltun, Vladlen},
  booktitle={Advances in Neural Information Processing Systems},
  year={2018}
}
```

---
title: "CAGrad：在平均目标附近改善最差任务梯度"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Bo Liu, Xingchao Liu, Xiaojie Jin, Peter Stone, Qiang Liu"
aliases:
  - papers/cagrad
tags:
  - paper
  - RL
  - reward-resemble
  - multi-task
  - gradient-optimization
source_url: https://arxiv.org/abs/2110.14048
---

> [!summary] 一句话结论
> CAGrad 不像 PCGrad 逐对修剪，而是在平均梯度附近寻找使最差任务局部改善最大的方向；超参 $c$ 连续连接普通 GD 与更保守的多目标更新，并保留对平均 loss 的收敛性质。

## 基本信息

- **论文**：[Conflict-Averse Gradient Descent for Multi-task Learning](https://arxiv.org/abs/2110.14048)
- **版本**：arXiv:2110.14048v2，2024-02-21；NeurIPS 2021
- **关键词**：CAGrad、worst-task improvement、multi-task optimization

## Motivation

平均 loss 的梯度可能牺牲某些任务；既有 gradient surgery 多为启发式，或只能保证到任意 Pareto stationary point。作者希望兼顾平均目标的收敛，又显式抑制最差局部改进。

## Method

以平均梯度 $g_0$ 为中心，在半径 $c\|g_0\|$ 的球内选择更新方向：

$$
\max_d\min_i\langle g_i,d\rangle
\quad\text{s.t.}\quad
\|d-g_0\|\le c\|g_0\|.
$$

$c\in[0,1)$ 控制偏离平均梯度的程度。对偶问题只在任务维度求解，因此无需在参数维度直接优化 $d$。特定端点可联系普通 GD 与 MGDA。

## Experimental Setup

- 监督多任务：NYUv2、Cityscapes、QM9 等。
- 多任务强化学习：Meta-World MT10 / MT50。
- 与 linear scalarization、MGDA、PCGrad、GradDrop、IMTL 等比较。
- 多随机种子报告平均指标与各任务相对变化。

## Results

CAGrad 在多个视觉、分子性质和多任务 RL benchmark 上总体优于当时的梯度操作方法，尤其在平均性能与差任务保护之间更稳定。论文的支持点是跨域一致性和理论收敛，而非每个任务都无条件最好。

## Ablation

扫 $c$ 显示过小接近普通平均梯度，过大更偏冲突规避；中间值通常取得较好折中。统一与 rescaled 版本比较说明梯度尺度处理会影响结果。它对 PCGrad 的优势在部分 benchmark 明显、部分则接近。

## Limitations

- $c$ 仍需按任务调节，不代表真实业务风险偏好。
- 每步需计算逐任务梯度并解对偶，任务很多时成本上升。
- 最差局部梯度改善不等同于最差最终指标或约束满足。
- 实验不是 LLM RLHF，reward noise 与 on-policy drift 未覆盖。

## Takeaways

- 与 RVPO 的共同点是关注最差维度；区别是 CAGrad 在梯度空间操作。
- 如果目标可微且冲突明显，CAGrad 比逐对随机投影更有原则。
- 仍应把硬安全项建成 constraint，避免只依赖局部平衡。

## Citation

```bibtex
@inproceedings{liu2021conflict,
  title={Conflict-Averse Gradient Descent for Multi-task Learning},
  author={Liu, Bo and Liu, Xingchao and Jin, Xiaojie and Stone, Peter and Liu, Qiang},
  booktitle={Advances in Neural Information Processing Systems},
  year={2021}
}
```

---
title: "PCGrad：投影冲突梯度的 Gradient Surgery"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Tianhe Yu, Saurabh Kumar, Abhishek Gupta, Sergey Levine, Karol Hausman, Chelsea Finn"
aliases:
  - papers/pcgrad
tags:
  - paper
  - RL
  - reward-resemble
  - multi-task
  - gradient-optimization
source_url: https://arxiv.org/abs/2001.06782
---

> [!summary] 一句话结论
> PCGrad 检测任务梯度内积为负的冲突，并把一个梯度在另一个梯度的法平面上投影；实现简单、无新增超参，但投影顺序是随机启发式，也不保证得到预期的业务折中。

## 基本信息

- **论文**：[Gradient Surgery for Multi-Task Learning](https://arxiv.org/abs/2001.06782)
- **版本**：arXiv:2001.06782v4，2020-12-22；NeurIPS 2020
- **关键词**：PCGrad、gradient conflict、multi-task RL

## Motivation

共享模型中的任务可能相互促进，也可能发生“tragic triad”：梯度方向冲突、曲率高、梯度量级差异大。简单求和会让某任务更新伤害另一任务，导致负迁移。

## Method

若任务 $i,j$ 的梯度满足 $g_i^\top g_j<0$，则将 $g_i$ 的冲突分量移除：

$$
g_i\leftarrow g_i-\frac{g_i^\top g_j}{\|g_j\|^2}g_j.
$$

对任务顺序随机遍历，最后求修改后梯度之和更新参数。PCGrad 可叠加在现有多任务架构和优化器之上，不引入要调的权重超参。

## Experimental Setup

- 监督学习：CIFAR-100 多任务、NYUv2 分割/深度/法线。
- 强化学习：Meta-World 多任务操控与多目标/goal-conditioned 设置。
- 与独立训练、共享网络、GradNorm 及多任务架构组合比较。
- 在控制实验中检查冲突、曲率、梯度大小三个条件。

## Results

PCGrad 在多组监督与 RL 任务上改善样本效率和最终表现，并能继续提升已有多任务架构。NYUv2 中，Cross-Stitch + PCGrad 的 segmentation mIoU 从 **15.69** 提至 **18.14**，depth absolute error 从 **0.6277** 降至 **0.5805**；不同指标并非全部严格改善。

## Ablation

合成景观和真实任务分析支持：梯度冲突与高曲率、量级差异同时出现时，PCGrad 帮助最大。把 PCGrad 加到 Cross-Stitch、routing 等架构后仍有收益，说明它作用于优化层而非特定网络结构。

## Limitations

- 投影结果依赖任务遍历顺序，多个冲突时不是唯一解。
- 只处理负内积；同向梯度也可能因尺度支配造成不公平。
- 没有 CAGrad / Nash-MTL 那样的整体收敛或公平性目标。
- 多任务视觉/机器人结果到 LLM policy optimization 的外推未经验证。

## Takeaways

- 适合做低侵入性梯度冲突 baseline。
- 若 rubric reward 先聚合成一个 advantage，就无法再使用 PCGrad；必须保留逐目标梯度。
- 业务关键约束仍需要显式优先级，不能指望投影自动理解重要性。

## Citation

```bibtex
@inproceedings{yu2020gradient,
  title={Gradient Surgery for Multi-Task Learning},
  author={Yu, Tianhe and Kumar, Saurabh and Gupta, Abhishek and others},
  booktitle={Advances in Neural Information Processing Systems},
  year={2020}
}
```

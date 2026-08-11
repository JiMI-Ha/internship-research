---
title: "MORL Practical Guide：从效用函数到 Pareto 解集的设计指南"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Conor F. Hayes et al."
aliases:
  - papers/morl-practical-guide
tags:
  - paper
  - RL
  - reward-resemble
  - multi-objective
  - survey
source_url: https://arxiv.org/abs/2103.09568
---

> [!summary] 一句话结论
> MORL 不是“给每个 reward 一个权重再相加”这么简单：先要确认用户效用、SER/ESR、策略是否可随机化、偏好何时可得，以及最终需要一个策略还是 Pareto coverage set。

## 基本信息

- **论文**：[A Practical Guide to Multi-Objective Reinforcement Learning and Planning](https://arxiv.org/abs/2103.09568)
- **版本**：arXiv:2103.09568v1，2021-03-17
- **说明**：原清单链接 `2106.15979` 指向另一篇论文；此页采用该标题的正确 arXiv ID。
- **关键词**：MORL、utility、Pareto frontier、SER / ESR

## Motivation

真实决策同时涉及收益、成本、安全、公平等目标。简单线性加权只在偏好已知且效用接近线性时合理；若偏好未知、非凸或在部署后才选择，单一 scalarized policy 会丢失可行 trade-off。

## Method

这是一篇方法论综述，给出从问题到算法的工作流：收集先验偏好；确定 utility function 类型；选择允许的 policy 类；定义 solution concept；选择 MORL / planning 算法；最后从 coverage set 选策略。论文特别区分：

- **SER**：$u(\mathbb{E}[\mathbf{R}])$，用户关心多次运行的平均结果。
- **ESR**：$\mathbb{E}[u(\mathbf{R})]$，用户对每次实际结果获得效用。

非线性 $u$ 下两者通常不同。

## Experimental Setup

论文不是单一算法实验，而以医疗、能源、交通、资源管理等案例说明设计选择，并系统整理 scalarization、Pareto / convex coverage set、单策略与多策略、偏好已知/未知等算法族。

## Results

主要成果是分类框架而非 benchmark 提升：线性 scalarization 只能恢复 convex hull 上的解；未知偏好时应返回 coverage set；非线性效用与随机性使 SER/ESR 选择直接改变最优策略。它提供决策树，帮助按问题属性筛算法。

## Ablation

作为综述，论文没有算法消融。各案例承担反例作用：改变效用形式、偏好可得时机或策略随机化假设，会改变所需解集与算法；因此这些建模选择不能被当作实现细节跳过。

## Limitations

- 综述发表于 2021 年，不覆盖后来的 LLM alignment 方法。
- 提供的是问题分类与算法选择，不保证具体任务的样本效率或稳定性。
- LLM 的 reward model 噪声、prompt 条件化和长文本 action space 需要额外处理。
- 多目标定义本身仍依赖利益相关者判断。

## Takeaways

- 在聚合 rubric 前先问：这是 SER 还是 ESR？最终需要单一策略还是可调 Pareto 集？
- 业务偏好可能变化时，conditioned policy / coverage set 比固定权重更合适。
- 线性加权遗漏非凸前沿，是结构性限制，不是多调几个权重就能解决。

## Citation

```bibtex
@article{hayes2022practical,
  title={A Practical Guide to Multi-Objective Reinforcement Learning and Planning},
  author={Hayes, Conor F. and R\u{a}dulescu, Roxana and Bargiacchi, Eugenio and others},
  journal={Autonomous Agents and Multi-Agent Systems},
  year={2022}
}
```

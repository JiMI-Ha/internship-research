---
title: "Nash-MTL：把多任务梯度组合视为议价博弈"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Aviv Navon, Aviv Shamsian, Idan Achituve, Haggai Maron, Kenji Kawaguchi, Gal Chechik, Ethan Fetaya"
aliases:
  - papers/nash-mtl
tags:
  - paper
  - RL
  - reward-resemble
  - multi-task
  - bargaining
  - gradient-optimization
source_url: https://arxiv.org/abs/2202.01017
---

> [!summary] 一句话结论
> Nash-MTL 让任务把梯度方向当作议价问题，以 Nash bargaining solution 寻找 Pareto-efficient、比例公平且对 loss 尺度不敏感的联合更新；公平性更有原则，但每步求解和假设比简单加权复杂。

## 基本信息

- **论文**：[Multi-Task Learning as a Bargaining Game](https://arxiv.org/abs/2202.01017)
- **版本**：arXiv:2202.01017v2，2022-07-08；ICML 2022
- **关键词**：Nash bargaining、proportional fairness、multi-task learning

## Motivation

梯度加权方法常是启发式，对任务 loss 的任意缩放敏感，也没有明确“公平”含义。作者把每个任务视为参与者：只有各任务都同意的更新才执行，并以 Nash 公理确定唯一折中。

## Method

把方向 $d$ 对任务 $i$ 的局部收益写成 $g_i^\top d$，在可行集合内最大化 Nash product：

$$
\max_d\prod_i g_i^\top d,
$$

等价于最大化收益对数和。由最优性条件得到任务权重的非线性方程，算法每隔若干步近似求解，再以加权梯度更新共享参数。解具有 Pareto optimal、对正比例缩放不变和比例公平等性质。

## Experimental Setup

- 多任务监督：NYUv2、Cityscapes、QM9。
- 多任务 RL：Meta-World MT10 / MT50。
- 与 linear scalarization、uncertainty weighting、MGDA、PCGrad、CAGrad、IMTL-G 等比较。
- 多数实验报告 3 个随机种子的均值与标准差。

## Results

Nash-MTL 在多个领域取得当时最强或有竞争力的整体结果。QM9 中 mean rank 为 **2.5**、相对退化指标 $\Delta_m=62.0\pm1.4$，优于论文表中的 linear scalarization（6.8、177.6±3.4）及多种梯度基线。结果支持比例公平目标，但不同 benchmark 的优势幅度并不一致。

## Ablation

减少任务权重求解频率可把运行时间降到接近 linear scalarization，同时多数场景保持竞争力；个别场景性能明显下降。尺度实验支持 Nash 解的 scale invariance。近似迭代次数与更新频率形成精度–成本 trade-off。

## Limitations

- Nash 公平是一组数学公理，不一定等于业务或伦理公平。
- 需所有任务当前收益为正并稳定求解权重，数值实现更复杂。
- 任务数增加时非线性求解成本上升。
- 视觉、分子和机器人结果未验证 noisy LLM reward 与长序列策略。

## Takeaways

- 当目标尺度任意、又希望比例公平时，Nash-MTL 比固定权重更自然。
- 它适合探索可调 reward 的梯度聚合，但不替代 rubric 语义审计。
- 工程上可以降低权重更新频率，但必须单独测性能损失。

## Citation

```bibtex
@inproceedings{navon2022multi,
  title={Multi-Task Learning as a Bargaining Game},
  author={Navon, Aviv and Shamsian, Aviv and Achituve, Idan and others},
  booktitle={International Conference on Machine Learning},
  year={2022}
}
```

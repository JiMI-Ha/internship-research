---
title: "Reward Model Overoptimization Scaling Laws：代理奖励越训越坏的定量规律"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Leo Gao, John Schulman, Jacob Hilton"
aliases:
  - papers/reward-overoptimization-scaling
tags:
  - paper
  - RL
  - reward-resemble
  - reward-modeling
  - scaling-laws
  - Goodhart
source_url: https://arxiv.org/abs/2210.10760
---

> [!summary] 一句话结论
> 持续提高 proxy RM 分数会先改善、后损害 gold RM 分数；论文把这条 Goodhart 曲线对 BoN 和 RL 分别拟合成可预测的经验规律，也说明更大 RM 或更多数据只能推迟而非消除过优化。

## 基本信息

- **论文**：[Scaling Laws for Reward Model Overoptimization](https://arxiv.org/abs/2210.10760)
- **版本**：arXiv:2210.10760v1，2022-10-20
- **关键词**：overoptimization、Goodhart's law、best-of-n、KL

## Motivation

真实人类评分昂贵，导致 RM 被优化到多远才开始“刷分”很难系统测量。作者用一个更大的固定 RM 代替人类 ground truth，使 proxy reward 与 gold reward 可以在整个优化轨迹上同时观测。

## Method

令 $d=\sqrt{D_{KL}(\pi\|\pi_{init})}$。经验拟合得到：

$$
R_{BoN}(d)=d(\alpha_{BoN}-\beta_{BoN}d),\qquad
R_{RL}(d)=d(\alpha_{RL}-\beta_{RL}\log d).
$$

其中 $R$ 是相对初始策略的 gold reward 变化。作者再研究系数随 proxy RM 参数量、偏好数据量、policy 大小和 KL penalty 的变化。

## Experimental Setup

- 使用 InstructGPT 环境与 GPT-3 系列模型。
- 6B RM 充当 gold RM；proxy RM 从 3M 到 3B 参数。
- 生成 100,000 个合成比较，10% 留作验证。
- 同时用 best-of-$n$（最高 $n=60,000$）与 RL 优化。

## Results

两种优化均出现 gold reward 先升后降，而 proxy reward 继续上升。BoN 公式只用 $n\le1,000$ 的数据提出，却能提前预测到 $n=60,000$ 的曲线。系数随 RM 规模平滑变化；更多 RM 数据改善峰值并减轻 Goodhart，但低于约 2,000 对比较时，各规模 RM 都接近随机。RL 的 KL penalty 没有可测地改善 gold-reward–KL 前沿。

## Ablation

- 更大 proxy RM 提高总体 gold reward，但过优化仍存在。
- policy 规模对 proxy–gold gap 和最佳 KL 位置影响较弱。
- RL 与 BoN 在相同 KL 下“花费 KL”的方式不同，因此 KL 不适合跨算法直接比较优化强度。
- 数据规模的规律比参数规模更不平滑。

## Limitations

- gold RM 只是更大的代理模型，并不等于真实人类效用。
- 合成标签是确定性的，没有覆盖标注者分歧。
- 经验公式依赖该模型族、任务与优化区间，尤其 RL 公式在原点附近不成立。
- 论文测量现象，不直接给出防御方案。

## Takeaways

- 线上应监控独立 gold-like 指标随优化步数的峰值，而不是把 proxy reward 单调上涨当成功。
- 增大 RM、数据和 KL 正则不是免疫 reward hacking 的保证。
- 这篇论文建立了 ensemble、ODIN、WARM 等后续工作常用的评测范式。

## Citation

```bibtex
@article{gao2022scaling,
  title={Scaling Laws for Reward Model Overoptimization},
  author={Gao, Leo and Schulman, John and Hilton, Jacob},
  journal={arXiv preprint arXiv:2210.10760},
  year={2022}
}
```

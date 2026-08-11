---
title: "MaxMin-RLHF：按最弱群体效用对齐多样偏好"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Souradip Chakraborty, Jiahao Qiu, Hui Yuan, Alec Koppel, Furong Huang, Dinesh Manocha, Amrit Singh Bedi, Mengdi Wang"
aliases: [papers/maxmin-rlhf]
tags: [paper, RL, reward-resemble, pluralistic-alignment, max-min, fairness]
source_url: https://arxiv.org/abs/2402.08925
---

> [!summary] 一句话结论
> 单一 RM 会把群体偏好按样本比例平均，少数群体误差随不平衡放大；MaxMin-RLHF 先拟合偏好混合，再最大化最弱群体效用，以公平性替代平均最优。

## 基本信息

- **论文**：[MaxMin-RLHF: Alignment with Diverse Human Preferences](https://arxiv.org/abs/2402.08925)
- **版本**：arXiv:2402.08925v2，2024-12-26
- **关键词**：diverse preferences、max-min、mixture model、social welfare

## Motivation

把不同用户的成对偏好合并训练一个 RM，会隐式得到按群体占比加权的平均分布。理论上，群体越小，其真实 reward 与平均 RM 的 mismatch 下界越大；平均 RLHF 因而可能系统性牺牲少数偏好。

## Method

用 EM 从未标群体的偏好数据中学习多个 reward component 与混合比例；policy 阶段采用 egalitarian max-min objective，动态关注当前效用最低的群体。论文将其联系到 distributionally robust optimization 和一般效用 RL。

## Experimental Setup

- GPT-2 合成任务：80% 用户偏好正向情感，20% 偏好简洁。
- Tulu2-7B：GPT-4 模拟多组用户，偏好包括通俗/专家表达、简洁/详细等。
- 比较按不同群体比例训练的单 RM PPO；GPT-4 做成对胜率评估。

## Results

论文汇总平均 win-rate 提升超过 **16%**，少数群体提高超过 **33%**，多数群体没有明显损失。P1A/P1B 上 MaxMin 胜率为 **57.5/60.0**；10:1 单 RM 只有 **55.11/45.08**，少数侧退化明显。

## Ablation

随着群体比例从 1:1 变到 10:1，单 RM 的少数群体准确率/胜率持续下降，而 MaxMin 不依赖数据多数投票。实验主要模拟已存在离散群体，未充分测试群体数误设。

## Limitations

- 大模型实验用 GPT-4 同时模拟用户和评估，不能替代真实多群体研究。
- Max-min 可能过度优化噪声最大或最难识别的群体。
- EM 假设离散混合，真实偏好可能连续、交叠且随场景变化。
- 公平性目标由研究者选定，未解决群体权重的治理问题。

## Takeaways

- 仅报告平均 preference accuracy 会掩盖少数群体失败。
- Max-min 适合“任何关键群体都不能掉底线”的业务，但要结合最小样本和置信区间。
- 先验证群体结构是否真实存在，再决定是否采用最坏组优化。

## Citation

```bibtex
@article{chakraborty2024maxmin,
  title={MaxMin-RLHF: Alignment with Diverse Human Preferences},
  author={Chakraborty, Souradip and Qiu, Jiahao and Yuan, Hui and others},
  journal={arXiv preprint arXiv:2402.08925},
  year={2024}
}
```

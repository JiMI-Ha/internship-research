---
title: "WARM：在参数空间平均 Reward Models"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Alexandre Ramé, Nino Vieillard, Léonard Hussenot, Robert Dadashi, Geoffrey Cideron, Olivier Bachem, Johan Ferret"
aliases:
  - papers/warm
tags:
  - paper
  - RL
  - reward-resemble
  - reward-modeling
  - weight-averaging
  - reward-hacking
source_url: https://arxiv.org/abs/2401.12187
---

> [!summary] 一句话结论
> WARM 对同一预训练起点微调出的多个 RM 做参数平均，以一个模型获得类似 ensemble 的鲁棒性；在摘要任务上明显改善分布外与标签污染表现，但证据尚未覆盖开放域对话。

## 基本信息

- **论文**：[WARM: On the Benefits of Weight Averaged Reward Models](https://arxiv.org/abs/2401.12187)
- **版本**：arXiv:2401.12187v1，2024-01-23
- **关键词**：weight averaging、reward model、distribution shift、label noise

## Motivation

预测 ensemble 能降低单 RM 方差，却要求每次打分并行运行多个模型。作者利用共享预训练起点的微调权重常处在线性连通区域这一现象，尝试直接平均参数，在不增加推理模型数的情况下提高 RM 稳健性。

## Method

从同一 pretrained checkpoint 出发，以不同数据顺序或训练变化得到 $M$ 个 RM，然后逐参数平均：

$$
\theta_{WARM}=\frac{1}{M}\sum_{m=1}^{M}\theta_m.
$$

与 prediction ensemble 不同，部署时只需一次前向。作者分析它对独立误差、分布变化和偏好标签不一致的平滑作用。

## Experimental Setup

- 在 TL;DR summarization 上训练 PaLM-XXS reward models。
- 以 PaLM-L 生成偏好标签，并构造 25% 标签污染。
- 用 PaLM 与 T5 SFT policy 进行 best-of-$N$，并用 RL 训练策略。
- 比较单 RM、预测 ensemble 和 2/6 个模型的 WARM。

## Results

WARM 在干净与污染标签、同架构和跨架构候选上通常取得更高 control reward，并比预测 ensemble 更节省部署成本。使用 WARM 训练的 RL policy 相对单 RM policy 的人工/代理比较胜率达到 **79.4%**。这一数字来自特定摘要设置，不能直接外推到通用聊天。

## Ablation

增加被平均的 RM 数量通常继续改善稳定性；标签污染下优势更明显。跨架构候选分布的结果说明收益不只来自在训练分布内拟合。论文也验证共享预训练和线性 mode connectivity 是参数平均可行的重要条件。

## Limitations

- 主要实验只有英文摘要任务。
- 所有 RM 共享基座和数据来源，系统性偏差不会被平均消除。
- 不同架构或不在线性连通区的模型不能直接做权重平均。
- 标签和 control reward 依赖模型代理，真实人类长期偏好证据有限。

## Takeaways

- 若线上只能承担单 RM 推理成本，WARM 是 prediction ensemble 的实用替代。
- 参数平均解决的是 RM 鲁棒性，不是多个业务目标如何聚合。
- 应保留独立分布外集验证平均后的 RM，而不是只看成员训练损失。

## Citation

```bibtex
@article{rame2024warm,
  title={WARM: On the Benefits of Weight Averaged Reward Models},
  author={Ram\'e, Alexandre and Vieillard, Nino and Hussenot, L\'eonard and others},
  journal={arXiv preprint arXiv:2401.12187},
  year={2024}
}
```

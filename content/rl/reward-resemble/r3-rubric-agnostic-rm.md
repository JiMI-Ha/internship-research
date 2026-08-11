---
title: "R3：面向未见 Rubric 的可解释推理型 Reward Model"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "David Anugraha, Zilu Tang, Lester James V. Miranda, Hanyang Zhao, Mohammad Rifqi Farhansyah, Garry Kuwanto, Derry Wijaya, Genta Indra Winata"
aliases:
  - papers/r3-rubric-agnostic-rm
tags:
  - paper
  - RL
  - reward-resemble
  - reward-model
  - rubric
  - reasoning
source_url: https://arxiv.org/abs/2505.13388
---

> [!summary] 一句话结论
> R3 把 rubric、回答和解释轨迹一起输入推理模型，让 Reward Model 对未见评价维度也能输出可读理由与分数；14K 样本即可在多个 RM benchmark 上接近或超过更大训练集基线。

## 基本信息

- **论文**：[R3: Robust Rubric-Agnostic Reward Models](https://arxiv.org/abs/2505.13388)
- **版本**：arXiv:2505.13388v3，2025-09-20
- **关键词**：rubric-conditioned RM、reasoning distillation、可解释奖励、泛化

## Motivation

传统 RM 输出不可解释标量，且往往只适用于训练时的固定偏好维度。业务 rubric 经常变化；如果每增加一项都重训专用 head，成本高且难以审计。R3 的目标是让同一模型读取任意 rubric，先推理再给分。

## Method

论文从多来源评价数据中采样，在线生成 rubric 与解释轨迹；用 reasoning model 蒸馏“分析—预测分数—解释”目标。两阶段过滤先删除预测分数与标签不符的样本，得到约 14K；再保留困难且多样的约 4K 子集。模型用 SFT 学习条件化评分，之后还用 R3 产生偏好数据，以 DPO 对齐 Llama-3.2-3B policy。

## Experimental Setup

- 多种 4B–14B reasoning backbone，比较 4K/14K、全量微调与 LoRA。
- Reward Model：RM-Bench、RewardBench，以及二分类与 rubric 泛化评测。
- Policy：HelpSteer3 英文单轮偏好；MT-Bench、WildBench 由 GPT-4.1-mini 评判。

## Results

- RewardBench 上，R3-Qwen3-14B 平均 **89.6**，R3-Qwen3-8B 为 **88.8**；后者高于多项公开 reasoning RM。
- 同基座比较中，R3 相对 RM-R1 最高提升约 **6.3** 分。
- 最小的 R3-Qwen3-4B 也得到 **87.5**，显示数据筛选与解释蒸馏能部分弥补模型规模。
- Policy 实验方向一致，但依赖 GPT-4.1-mini judge，不能视作独立人类验证。

## Ablation

4K 高难子集在若干配置下接近或超过 14K，全量微调通常强于 LoRA，但差距随 backbone 变化。说明“更多合成解释”不是单调有效，过滤质量和基础推理能力影响很大。

## Limitations

- 解释轨迹来自更强 reasoning model，可能只是合理化评分而非忠实因果解释。
- 训练过滤使用“预测必须匹配标签”，会偏向教师已经会判断的样本。
- 多个 benchmark 与训练来源可能共享风格，真正未见业务 rubric 的外部验证仍有限。
- Policy 结果使用 LLM judge，且只覆盖英文单轮对话。

## Takeaways

- 如果 rubric 会频繁变化，条件化生成式 RM 比固定多头更灵活。
- 可读解释有助于审计，但必须另外测试解释忠实度，不能把流畅理由当作证据。
- 小而经过严格过滤的数据可成为强基线，值得与大规模偏好数据并行比较。

## Citation

```bibtex
@article{anugraha2025r3,
  title={R3: Robust Rubric-Agnostic Reward Models},
  author={Anugraha, David and Tang, Zilu and Miranda, Lester James V. and others},
  journal={arXiv preprint arXiv:2505.13388},
  year={2025}
}
```

---
title: "Prometheus：按自定义 Rubric 评分的开源 Evaluator"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Seungone Kim, Jamin Shin, Yejin Cho, Joel Jang, Shayne Longpre, Hwaran Lee, Sangdoo Yun, Seongjin Shin, Sungdong Kim, James Thorne, Minjoon Seo"
aliases:
  - papers/prometheus
tags:
  - paper
  - RL
  - reward-resemble
  - rubric
  - LLM-judge
source_url: https://arxiv.org/abs/2310.08491
---

> [!summary] 一句话结论
> Prometheus 把 score rubric、reference answer、回答与文字反馈一起训练到 13B 开源 evaluator 中，在论文测试里与人类评分相关性接近 GPT-4；不过它依赖 GPT-4 合成训练数据和参考答案，不能视为独立真值。

## 基本信息

- **论文**：[Prometheus: Inducing Fine-grained Evaluation Capability in Language Models](https://arxiv.org/abs/2310.08491)
- **版本**：arXiv:2310.08491v2，2024-03-09
- **关键词**：rubric-conditioned evaluator、feedback、open judge

## Motivation

GPT-4 judge 成本高、版本不可控，也无法本地审计。传统 RM 又只学通用 helpfulness，难以按“儿童可读性”等自定义标准评分。作者希望训练能读取任意 rubric 并输出分数与理由的开放 evaluator。

## Method

Feedback Collection 包含 **1K** 个细粒度 rubrics、**20K** 条 instructions、**100K** 个 responses 与 GPT-4 生成的 score / feedback。Prometheus 基于 13B 模型，输入 instruction、response、reference answer 和 score rubric，先生成反馈，再给 1–5 分。

## Experimental Setup

- 45 个自定义 rubric 由人类评分，用于主相关性测试。
- 另在 MT-Bench、Vicuna Bench、Feedback Bench、FLASK 的 1,222 个 rubric 上对齐 GPT-4。
- 与 GPT-4、ChatGPT 及公开 reward models 比较。
- 还测试 HHH Alignment 和 MT-Bench Human Judgment 的成对偏好。

## Results

在 45 个 rubric 的人评集上，Prometheus 与人类的 Pearson 相关为 **0.897**，GPT-4 为 **0.882**，ChatGPT 为 **0.392**。在四个 benchmark 的 rubric 评估中也保持较强相关，并在两个人类偏好集上超过论文比较的开源 RM。样本小、训练反馈来自 GPT-4，因此“超过 GPT-4”应谨慎理解。

## Ablation

论文比较是否提供 reference answer、rubric 与 feedback supervision，显示定制标准和参考材料对细粒度评分重要。跨 rubric 测试支持一定泛化，但没有证明对全新专业规则和对抗性回答仍可靠。

## Limitations

- 训练标签由 GPT-4 生成，可能继承其偏差和错误。
- 强依赖高质量 reference answer；开放任务往往没有唯一参考。
- 相关性高不代表逐例裁决可靠，聚合统计会掩盖关键错判。
- 13B evaluator 仍有显著推理与事实能力上限。

## Takeaways

- 对频繁变化的业务 rubric，它比固定 scalar RM 更容易审查与更新。
- 应同时保存 judge 的解释、分数和不确定/分歧信号。
- 关键负项需要与第二 judge 或人审交叉验证。

## Citation

```bibtex
@article{kim2023prometheus,
  title={Prometheus: Inducing Fine-grained Evaluation Capability in Language Models},
  author={Kim, Seungone and Shin, Jamin and Cho, Yejin and others},
  journal={arXiv preprint arXiv:2310.08491},
  year={2023}
}
```

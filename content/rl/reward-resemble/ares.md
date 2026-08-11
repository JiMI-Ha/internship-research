---
title: "ARES：从预训练文档自动合成 Rubric 强化学习数据"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Xiaoyuan Li, Keqin Bao, Moxin Li, Yubo Ma, Yichang Zhang, Wenjie Wang, Fuli Feng, Dayiheng Liu"
aliases:
  - papers/ares
tags:
  - paper
  - RL
  - reward-resemble
  - rubric
  - synthetic-data
  - GRPO
source_url: https://arxiv.org/abs/2605.23454
---

> [!summary] 一句话结论
> ARES 把原始预训练文档自动转成“问题—答案—实例级加权 rubric”，用 100K 合成样本证明 rubric RL 在开放式任务上比继续预训练、SFT 和二元奖励更有效。

## 基本信息

- **论文**：[ARES: Automated Rubric Synthesis for Scalable LLM Reinforcement Learning](https://arxiv.org/abs/2605.23454)
- **版本**：arXiv:2605.23454v2，2026-05-25
- **关键词**：rubric synthesis、合成数据、开放式奖励、GRPO

## Motivation

Rubric reward 能覆盖不可自动核验的任务，但专家逐题写 rubric 和问题成本过高；固定任务级标准又忽略每个问题的特殊要求。ARES 试图直接从已有知识文档规模化生成训练实例，同时保证问题自包含、答案忠实和 rubric 可判定。

## Method

ARES 从文档片段出发，结合领域标签与 persona，一次生成自包含问题、参考答案和带权重的多条判分标准。随后用过滤器检查问题自包含性、答案对原文的忠实性、rubric 的有效性与区分度。训练时，judge 对每条标准判分并加权成 reward，再由 GRPO 优化策略。

## Experimental Setup

- 生成 **100K** 实例，覆盖十个领域。
- 基座为 Qwen3-4B-Base；ARES-RL 使用 Qwen3-32B 作为 rubric judge，训练三轮。
- 比较继续预训练、NaturalReasoning SFT、二元奖励 Webscale-RL 与 ARES-SFT。
- 在 MMLU-Pro、GSM8K、HumanEval+、MBPP+、HealthBench、WritingBench、IFEval 七个 benchmark 上评估。

## Results

ARES-RL 的七项平均分为 **52.69**，高于 CPT **47.36**、Webscale **48.30** 与 ARES-SFT **49.71**。主要增益集中在多维开放任务：HealthBench **41.45**（Webscale 36.08），IFEval **54.88**（Webscale 35.61）。在部分封闭任务上它并非全部最优，例如 MMLU-Pro 低于 ARES-SFT。

## Ablation

ARES-SFT 与 ARES-RL 使用同源数据，后者平均高 **2.98** 分，说明收益不只来自合成问答，也来自 rubric 驱动的在线优化。二元 reward 在可核验任务有效，但在 HealthBench/IFEval 上明显弱于多维 rubric。

## Limitations

- 数据、参考答案和 rubric 都来自模型生成，过滤器无法完全排除共享偏差或幻觉。
- 只用 Qwen3-4B 策略和 Qwen3-32B judge，跨模型与 judge 独立性证据有限。
- 与预训练语料同源的生成可能增加 benchmark 污染风险，论文结果不能直接等同于真实业务泛化。
- 开放式指标仍由模型 judge 决定，缺少大规模人工效果验证。

## Takeaways

- 当业务已有高质量文档但缺少标注时，ARES 提供了从知识库到 rubric RL 数据的可执行流水线。
- 过滤规则和溯源比生成规模更重要；应保留每条 rubric 对应的证据片段。
- 结果显示 rubric RL 对开放式需求更有价值，不代表应替代所有可验证 reward。

## Citation

```bibtex
@article{li2026ares,
  title={ARES: Automated Rubric Synthesis for Scalable LLM Reinforcement Learning},
  author={Li, Xiaoyuan and Bao, Keqin and Li, Moxin and others},
  journal={arXiv preprint arXiv:2605.23454},
  year={2026}
}
```

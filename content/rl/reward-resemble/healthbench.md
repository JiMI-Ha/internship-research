---
title: "HealthBench：用医生编写的逐样本 Rubric 评估医疗对话"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Rahul K. Arora, Jason Wei, Rebecca Soskin Hicks, Preston Bowman, Joaquin Quiñonero-Candela, Foivos Tsimpourlas, Michael Sharman, Meghan Shah, Andrea Vallone, Alex Beutel, Johannes Heidecke, Karan Singhal"
aliases:
  - papers/healthbench
tags:
  - paper
  - RL
  - reward-resemble
  - rubric
  - healthcare
  - benchmark
source_url: https://arxiv.org/abs/2505.08775
---

> [!summary] 一句话结论
> HealthBench 把医疗对话质量拆成医生为每个样本编写的正负 rubric，而不是一道题一个标准答案；它为 RaR/RVPO 提供了高维 reward 场景，但 benchmark 高分仍不是临床安全证明。

## 基本信息

- **论文**：[HealthBench: Evaluating Large Language Models Towards Improved Human Health](https://arxiv.org/abs/2505.08775)
- **版本**：arXiv:2505.08775v1，2025-05-14
- **关键词**：healthcare、instance-specific rubric、LLM judge、safety

## Motivation

医疗多选题不能覆盖真实用户对话中的沟通、完整性、风险分级和指令遵循。统一 rubric 又难以描述每个病例的关键点。作者因此让医生针对具体对话写细粒度标准，再由 judge 检查回答满足哪些标准。

## Method

HealthBench 包含 **5,000** 个多轮对话，由 **262** 名医生编写 **48,562** 条独特 rubric criteria。每条 criterion 有正或负权重，模型回答由 rubric-conditioned judge 判定是否满足，再归一化汇总。另发布经医生共识筛选 34 个重要维度的 Consensus 版，以及更难的 Hard 版。

## Experimental Setup

- 场景覆盖急症、全球健康、临床数据转换、面向患者和专业人士的交互。
- 维度包括准确性、完整性、上下文意识、沟通质量和指令遵循。
- 评估多代 OpenAI 模型与外部模型，并分析成本、长度、可靠性和逐样本分布。
- 对若干模型重复运行 16 次，估计 judge / sampling 波动。

## Results

总体分数从 GPT-3.5 Turbo 的约 **16%**、GPT-4o 的约 **32%** 提升到 o3 的约 **60%**；HealthBench Hard 的当时最高分仅 **32%**。16 次重复中，o3 均值 **0.5990**、标准差 **0.0016**，表明聚合分数运行间波动较小；这不代表 rubric 本身无系统偏差。

## Ablation

论文按主题、行为轴、成本、回答长度和 Consensus/Hard 子集拆分。结果显示模型进步并不均匀，单一总分会掩盖具体维度。小模型的成本–表现前沿明显改善，例如 GPT-4.1 nano 超过 GPT-4o 且作者报告成本低 25 倍。

## Limitations

- benchmark 不是临床试验，不能证明真实诊断或治疗安全。
- rubric 与 judge 的错误会共同进入最终分数。
- 医生对高质量回答的期望仍会分歧，criterion 覆盖不可能完备。
- 公开测试集存在后续训练污染风险，且主要语言/文化覆盖有限。

## Takeaways

- 它非常适合测试“多个标准是否互相抵消”的聚合方法。
- 业务使用时应保留逐 rubric 命中和关键负项，不能只存总体分。
- 高风险 criterion 应做人工复核，并与真实结果指标分开报告。

## Citation

```bibtex
@article{arora2025healthbench,
  title={HealthBench: Evaluating Large Language Models Towards Improved Human Health},
  author={Arora, Rahul K. and Wei, Jason and Hicks, Rebecca Soskin and others},
  journal={arXiv preprint arXiv:2505.08775},
  year={2025}
}
```

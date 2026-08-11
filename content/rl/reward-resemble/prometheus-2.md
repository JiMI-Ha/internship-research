---
title: "Prometheus 2：统一绝对评分与成对排序的开源 Judge"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Seungone Kim, Juyoung Suk, Shayne Longpre, Bill Yuchen Lin, Jamin Shin, Sean Welleck, Graham Neubig, Moontae Lee, Kyungjae Lee, Minjoon Seo"
aliases:
  - papers/prometheus-2
tags:
  - paper
  - RL
  - reward-resemble
  - rubric
  - LLM-judge
  - model-merging
source_url: https://arxiv.org/abs/2405.01535
---

> [!summary] 一句话结论
> Prometheus 2 分别训练 absolute grading 与 pairwise ranking evaluator，再做权重合并，让一个开源模型同时处理两种评测格式和自定义 rubric；它缩小了与专有 judge 的差距，但仍不能替代人评。

## 基本信息

- **论文**：[Prometheus 2: An Open Source Language Model Specialized in Evaluating Other Language Models](https://arxiv.org/abs/2405.01535)
- **版本**：arXiv:2405.01535v2，2024-12-05
- **关键词**：evaluator、direct assessment、pairwise ranking、weight merging

## Motivation

早期开源 evaluator 往往只会绝对打分或只会两两排序，而且集中于通用 helpfulness。业务评测需要一个模型在统一 rubric 下切换两种协议，同时避免完全依赖昂贵、封闭的 GPT-4 / Claude。

## Method

作者构建带 1,000 多个逐样本标准的 Preference Collection，分别训练 direct-assessment 模型和 pairwise-ranking 模型，再通过权重合并得到统一 evaluator。输入中保留用户定义的 evaluation criterion，输出 feedback 与评分或成对选择。

## Experimental Setup

- 提供 7B 与 8x7B 两个规模版本。
- 在四个绝对评分 benchmark 和四个成对排序 benchmark 上评估。
- 用与人类或 GPT-4 / Claude 判断的相关性、agreement 作为指标。
- 比较单任务模型、合并模型、其他开源 evaluator 与专有 judge。

## Results

Prometheus 2 在论文覆盖的八个数据集上，整体取得被测开源 evaluator 中最高或最强的一组人类/专有 judge 相关与一致性结果；同时兼顾两种格式，显著缩小与 GPT-4 类 judge 的差距。论文没有证明这种一致性等同于评价真确性。

## Ablation

只训练 direct assessment 或 pairwise ranking 的模型在另一格式明显不足；权重合并能保留两者能力，并优于简单要求单模型用 prompt 切换任务。不同 merge 配方显示统一能力不是自动产生，仍依赖兼容的训练起点和数据。

## Limitations

- 用“像人类或专有 judge”作为 meta-evaluation，参照方本身也会错。
- 公开八个数据集不足以证明全新 rubric 泛化。
- judge 可能受位置、长度、自偏好和 reference quality 影响。
- 作者明确建议与人评结合，而非单独使用。

## Takeaways

- 同一业务最好同时保留 absolute score 和 pairwise audit，两者发现的问题不同。
- 权重合并是构造多能力 evaluator 的低成本方案，但需要格式专项验证。
- 部署前应在真实 rubric 上测逐项 false-positive / false-negative。

## Citation

```bibtex
@article{kim2024prometheus2,
  title={Prometheus 2: An Open Source Language Model Specialized in Evaluating Other Language Models},
  author={Kim, Seungone and Suk, Juyoung and Longpre, Shayne and others},
  journal={arXiv preprint arXiv:2405.01535},
  year={2024}
}
```

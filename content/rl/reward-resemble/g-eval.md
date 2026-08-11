---
title: "G-Eval：用 CoT 与评分概率对齐人类 NLG 评价"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Yang Liu, Dan Iter, Yichong Xu, Shuohang Wang, Ruochen Xu, Chenguang Zhu"
aliases:
  - papers/g-eval
tags:
  - paper
  - RL
  - reward-resemble
  - LLM-judge
  - NLG-evaluation
source_url: https://arxiv.org/abs/2303.16634
---

> [!summary] 一句话结论
> G-Eval 让 GPT-4 先依据评价标准生成步骤，再用 form-filling 打分，并用评分 token 概率加权；在人类相关性上超过传统 NLG 指标，但也首次清楚暴露了 LLM judge 偏爱 LLM 文本的问题。

## 基本信息

- **论文**：[G-Eval: NLG Evaluation using GPT-4 with Better Human Alignment](https://arxiv.org/abs/2303.16634)
- **版本**：arXiv:2303.16634v3，2023-05-24
- **关键词**：LLM-as-a-judge、chain-of-thought、NLG evaluation

## Motivation

BLEU / ROUGE 等参考指标难以评价开放式文本的连贯性、事实一致性与可读性；早期 prompt-based evaluator 与人类相关性仍有限。作者希望把明确 criteria、推理步骤和稳定的离散评分结合起来。

## Method

G-Eval 的 prompt 包含任务定义与单一评价标准；LLM 先自动生成 evaluation steps，再以 form-filling 输出 1–5 分。最终分数不只取一次 argmax，而是按模型对各评分 token 的概率加权，减少离散分布和随机性影响。

## Experimental Setup

- 在文本摘要和对话生成两类任务上测试。
- 评价 coherence、consistency、fluency、relevance 等维度。
- 比较 ROUGE、BERTScore、学习式 evaluator 与不同 LLM / prompt 变体。
- 以 Spearman / Kendall 与人评相关性作为主指标，并分析模型来源偏差。

## Results

GPT-4 版 G-Eval 在摘要任务上的 Spearman 相关达到 **0.514**，显著高于论文比较的既有方法。对话任务也取得更高人类一致性。但分析显示 evaluator 倾向给 LLM 生成文本更高分，因此高相关性并不消除来源偏差。

## Ablation

CoT evaluation steps 与评分概率加权都改善稳定性/相关性；GPT-4 明显强于较弱 LLM。不同标准需要分别 prompt，说明“一个总体 judge 分”会丢失维度信息。论文的 bias 分析是结果的一部分，而非被平均数掩盖。

## Limitations

- 只覆盖摘要与对话生成，样本和任务范围有限。
- GPT-4 是封闭且会更新的 evaluator，复现依赖具体版本。
- 存在 self-preference / LLM-text bias。
- 相关性是数据集级指标，不能保证关键样本打分正确。

## Takeaways

- 评测 prompt 应一次只定义清晰维度，并保留评分分布。
- 使用 LLM judge 时必须加入人类文本与多模型来源做偏差检查。
- G-Eval 适合做 rubric evaluator 的起点，不适合直接当唯一 reward。

## Citation

```bibtex
@article{liu2023geval,
  title={G-Eval: NLG Evaluation using GPT-4 with Better Human Alignment},
  author={Liu, Yang and Iter, Dan and Xu, Yichong and others},
  journal={arXiv preprint arXiv:2303.16634},
  year={2023}
}
```

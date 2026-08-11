---
title: "HelpSteer2：用 10K 高质量偏好对训练强 Reward Model"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Zhilin Wang, Yi Dong, Olivier Delalleau, Jiaqi Zeng, Gerald Shen, Daniel Egert, Jimmy J. Zhang, Makesh Narsimhan Sreedhar, Oleksii Kuchaiev"
aliases:
  - papers/helpsteer2
tags:
  - paper
  - RL
  - reward-resemble
  - reward-modeling
  - preference-data
source_url: https://arxiv.org/abs/2406.08673
---

> [!summary] 一句话结论
> HelpSteer2 用仅 10K 对、但一致性较高的多属性人工标注训练出强 RM，并以 SteerLM 2.0 利用完整属性分布；它说明数据质量很重要，但 92% RewardBench 结果来自强内部基座，不能全归因于数据集。

## 基本信息

- **论文**：[HelpSteer2: Open-source dataset for training top-performing reward models](https://arxiv.org/abs/2406.08673)
- **版本**：arXiv:2406.08673v1，2024-06-13
- **关键词**：reward model、multi-attribute、preference data、SteerLM 2.0

## Motivation

旧公开偏好数据的回答质量落后于新模型；从专有模型蒸馏的数据又可能限制商业使用。作者希望用少量、许可宽松的人类标注得到高质量 RM，并让 alignment 阶段利用多属性预测而非只取一个 overall 分数。

## Method

HelpSteer2 包含 **10K response pairs**，为 helpfulness、correctness、coherence、complexity、verbosity 打分，并附 overall preference。作者训练回归式 RM；SteerLM 2.0 不固定一个属性目标，而是对 RM 预测的属性分布进行条件化训练与推断。

## Experimental Setup

- 数据为 CC BY 4.0，报告标注一致性 Cohen's $\kappa=0.791$。
- 用 Llama 3 70B 等基座训练 RM。
- RM 在 RewardBench 测试；策略在 MT-Bench、TruthfulQA、AlpacaEval 2.0 LC 与 Arena Hard 上评估。
- 与 Llama 3 70B Instruct、GPT-4-0613 等对照。

## Results

内部强基座训练的 RM 在 2024-06-12 的 RewardBench primary set 达到 **92.0%**。用该 RM 的 SteerLM 2.0 策略在多项 alignment 指标上匹配或超过 Llama 3 70B Instruct 与 GPT-4-0613。由于同时改变了基座、数据和训练方法，结果不能解释成“10K 数据单独带来 92%”。

## Ablation

论文比较 Bradley–Terry、regression、多属性训练与 SteerLM 2.0，并显示多属性分数可用于更细的策略控制。小数据量仍获得强结果，支持质量优先；但对基座能力和数据规模的完全因果拆分有限。

## Limitations

- 最强 RM 的 base model 并非完全公开复现链路。
- RewardBench 可能与通用预训练或后续数据存在污染。
- 英文帮助性数据不足以代表安全、专业领域和多文化偏好。
- 自动 judge 指标存在位置、长度与风格偏差。

## Takeaways

- 高一致性、多属性的 10K 数据可能胜过大而杂的偏好集。
- 比较数据集时必须固定 RM 基座，否则榜单分数会混入模型能力。
- 许可清晰是业务落地的重要优势。

## Citation

```bibtex
@article{wang2024helpsteer2,
  title={HelpSteer2: Open-source dataset for training top-performing reward models},
  author={Wang, Zhilin and Dong, Yi and Delalleau, Olivier and others},
  journal={arXiv preprint arXiv:2406.08673},
  year={2024}
}
```

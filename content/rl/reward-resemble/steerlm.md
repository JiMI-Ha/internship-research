---
title: "SteerLM：用多属性条件 SFT 替代复杂 RLHF"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Yi Dong, Zhilin Wang, Makesh Narsimhan Sreedhar, Xianchao Wu, Oleksii Kuchaiev"
aliases: [papers/steerlm]
tags: [paper, RL, reward-resemble, controllable-generation, multi-attribute, SFT]
source_url: https://arxiv.org/abs/2310.05344
---

> [!summary] 一句话结论
> SteerLM 先预测回答的质量、帮助性、幽默、毒性等属性，再把属性值写入 prompt 做条件 SFT；用户可在推理时调整风格，无需 PPO，但安全属性不能无治理地开放。

## 基本信息

- **论文**：[SteerLM: Attribute Conditioned SFT as an (User-Steerable) Alternative to RLHF](https://arxiv.org/abs/2310.05344)
- **版本**：arXiv:2310.05344v1，2023-10-09
- **关键词**：attribute-conditioned SFT、user steering、HelpSteer、alignment

## Motivation

RLHF 训练复杂，并把标注者的隐含价值固化成单一模型；普通 SFT 又不能充分利用低质量回答中的反例。SteerLM 让模型显式看到多维属性，从全部高低质量数据中学习条件生成。

## Method

四步流程：训练 Attribute Prediction Model；为未标注对话补多属性分数；用“对话 + 属性值”做条件 SFT；从高质量条件采样回答再 bootstrap 微调。推理时设置所需属性组合，不需要 Reward Model 在线打分。

## Experimental Setup

- 13B/43B 模型，OpenAssistant 等开源对话数据。
- Vicuna 80 prompts；GPT-4 自动评分并对顺序取平均。
- 12 名志愿者做人工比较，报告 Elo 与置信区间。

## Results

自动评估中 SteerLM-43B 为 ChatGPT-3.5 的 **104.2%**，13B 为 **102.6%**。人工 Elo 中 43B 为 **1040**、ChatGPT-3.5 为 981；但 43B 回答平均 1906 字符，GPT-4 存在偏长偏好，因此优势需降级理解。

## Ablation

加入属性标签带来约 **16.5%** 的主要提升；只用 3400 条最高质量样本再提升约 1.9%，attribute predictor 与 bootstrap 继续小幅增加表现。说明可控标签比单纯筛高分更关键。

## Limitations

- 两个模型都全量 SFT，仍有较高 GPU 与能耗成本。
- 只在英文评测；人工样本很小且标注者背景集中。
- 用户能调低 toxicity/violence 约束，存在明确滥用风险。
- 绝对属性组合可能不可达，且模型未必精确遵循每个数值。

## Takeaways

- 多属性条件 SFT 是无需 RL 的强可控基线。
- 低质量样本不是必须删除；附带属性后可作为条件反例使用。
- 开放哪些属性应由服务端策略决定，而非全部交给最终用户。

## Citation

```bibtex
@article{dong2023steerlm,
  title={SteerLM: Attribute Conditioned SFT as an (User-Steerable) Alternative to RLHF},
  author={Dong, Yi and Wang, Zhilin and Sreedhar, Makesh Narsimhan and Wu, Xianchao and Kuchaiev, Oleksii},
  journal={arXiv preprint arXiv:2310.05344},
  year={2023}
}
```

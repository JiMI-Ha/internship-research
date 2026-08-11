---
title: "CPO：用偏好 Token 条件化 3H 多目标对齐"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Yiju Guo, Ganqu Cui, Lifan Yuan, Ning Ding, Zexu Sun, Bowen Sun, Huimin Chen, Ruobing Xie, Jie Zhou, Yankai Lin, Zhiyuan Liu, Maosong Sun"
aliases: [papers/controllable-preference-optimization]
tags: [paper, RL, reward-resemble, multi-objective, DPO, controllable-generation]
source_url: https://arxiv.org/abs/2402.19085
---

> [!summary] 一句话结论
> CPO 用 `<Helpfulness:5>` 等 preference token 把 3H trade-off 变成条件生成问题，再依次做条件 SFT 与条件 DPO；单模型可在推理时切换目标，但开放安全 token 也带来滥用风险。

## 基本信息

- **论文**：[Controllable Preference Optimization: Toward Controllable Multi-Objective Alignment](https://arxiv.org/abs/2402.19085)
- **版本**：arXiv:2402.19085v3，2024-10-11
- **关键词**：3H、conditional DPO、preference token、UltraSafety

## Motivation

帮助性、诚实性与无害性会冲突；单向 PPO/DPO 只能给出一个固定折中。论文希望显式告诉模型当前场景优先哪个目标，并用同一模型覆盖不同用户或部署策略。

## Method

第一阶段 CPSFT 把各维 1–5 分写成输入 token，学习带条件回答。第二阶段 CDPO 根据条件权重计算回答对的综合偏好值，再用条件化 DPO 提升较优回答概率。训练数据包括 UltraFeedback、HH-RLHF、自建 3K harmful 指令的 UltraSafety，以及 UltraChat 多轮数据。

## Experimental Setup

- Mistral-7B；114K CPSFT 与 120K preference pairs。
- Helpfulness：MT-Bench；honesty：HaluEval 2.0；harmlessness：HackaPrompt。
- 与 SFT、PPO、DPO、Curry-DPO 及多个开源 chat model 比较；GPT-4 评分并做人工复核。

## Results

CPO 的 GPT-4 综合 3H 平均为 **7.69**，高于 Curry-DPO 6.71、DPO 6.38 和 Mistral-Instruct 6.72；人工评分为 **7.56**。完整 CPO 同时取得 helpfulness 7.11、honesty 8.66、harmlessness 7.30，而单一 helpful token 的安全分只有 3.37，说明需要按场景选择条件。

## Ablation

CPSFT 已产生可控性但性能有限；DPO 提升安全却失去控制；两阶段合并后同时改善。单一偏好 token 无法覆盖所有场景，使用多目标最高条件也需要由外部系统决定是否合适。

## Limitations

- 仅覆盖 3H，真实偏好更复杂。
- 用户若可直接指定低 harmlessness，会主动引导有害生成；论文也明确提示访问控制风险。
- GPT-4 同时参与数据标注和主要评估，独立性有限。
- Token 分值的校准与跨 prompt 可比性没有充分证明。

## Takeaways

- Preference token 是工程上简单的多目标控制接口，但不能直接暴露给不可信用户。
- 控制器需要根据场景设置条件，并保留不可覆盖的安全下限。
- 评测应同时检查“能否控制”和“控制后的绝对质量”。

## Citation

```bibtex
@article{guo2024controllable,
  title={Controllable Preference Optimization: Toward Controllable Multi-Objective Alignment},
  author={Guo, Yiju and Cui, Ganqu and Yuan, Lifan and others},
  journal={arXiv preprint arXiv:2402.19085},
  year={2024}
}
```

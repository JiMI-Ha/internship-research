---
title: "DPA：用偏好方向控制 Helpfulness–Verbosity Trade-off"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Haoxiang Wang, Yong Lin, Wei Xiong, Rui Yang, Shizhe Diao, Shuang Qiu, Han Zhao, Tong Zhang"
aliases: [papers/directional-preference-alignment]
tags: [paper, RL, reward-resemble, multi-objective, controllable-generation, rejection-sampling]
source_url: https://arxiv.org/abs/2402.18571
---

> [!summary] 一句话结论
> DPA 不让用户指定可能不可达的绝对属性分，而是指定 reward 空间中的单位方向，再用条件化 rejection-sampling fine-tuning 学一个可连续控制的模型。

## 基本信息

- **论文**：[Arithmetic Control of LLMs for Diverse User Preferences: Directional Preference Alignment with Multi-Objective Rewards](https://arxiv.org/abs/2402.18571)
- **版本**：arXiv:2402.18571v3，2024-03-06
- **关键词**：preference direction、Pareto control、verbosity、RSF

## Motivation

标量 RLHF 固化单一 trade-off；SteerLM 式绝对目标值又可能要求当前 prompt 根本不可达到的组合。DPA 用“改善哪个方向”代替“必须达到多少分”，希望保持可行性并支持运行时算术控制。

## Method

先用 HelpSteer 与 UltraFeedback 训练 helpfulness/verbosity 多目标 RM。用户偏好表示为单位向量 $v$，回答的方向 reward 为 $v^Tr/\|r\|$。每轮对每个 prompt 和方向采样 16 个回答，保留最高分样本做条件化 SFT；共迭代四轮，单模型接收方向 token。

## Experimental Setup

- Zephyr-β 的 Mistral-7B SFT checkpoint；UltraFeedback 对齐数据。
- 十个从纯 helpfulness 到 balanced 的方向，比较 SFT、DPO、SteerLM。
- 用内部多目标 RM 画 Pareto front；AlpacaEval-2.0 用 GPT-4-Turbo judge 外部评估。

## Results

从第一轮起，DPA 在其 RM 空间中 Pareto-dominates SFT、DPO 与 SteerLM，迭代后 front 持续外扩。AlpacaEval-2.0 上 DPA 优于 SteerLM，并与 DPO 接近，同时保留长度控制；但论文明确指出，拟合自有 RM 不保证对 GPT-4 judge 同样泛化。

## Ablation

逐轮 front 外扩支持迭代 rejection sampling 有效；不过每轮约 60 GPU hours，且没有独立拆解方向归一化、条件 token 与数据刷新各自贡献。

## Limitations

- 只研究 helpfulness 与 verbosity 两维，尚未展示高维方向是否可理解和稳定。
- 关键 Pareto 结论由训练相关 RM 自评，存在 reward overfitting。
- AlpacaEval 有长度偏差，且只含 805 prompts。
- 每个方向大量采样，推理生成训练数据的成本较高。

## Takeaways

- 方向控制比绝对目标值更不容易提出不可行要求。
- 可控模型要同时报告内部 front 与独立 judge，二者不一致本身就是重要信号。
- 对“少一点冗长但别损害帮助性”这类业务需求，DPA 是直接相关基线。

## Citation

```bibtex
@article{wang2024directional,
  title={Arithmetic Control of LLMs for Diverse User Preferences: Directional Preference Alignment with Multi-Objective Rewards},
  author={Wang, Haoxiang and Lin, Yong and Xiong, Wei and others},
  journal={arXiv preprint arXiv:2402.18571},
  year={2024}
}
```

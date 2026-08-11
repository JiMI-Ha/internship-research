---
title: "SALMON：可按原则指令控制的 Reward Model"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Zhiqing Sun, Yikang Shen, Hongxin Zhang, Qinhong Zhou, Zhenfang Chen, David Cox, Yiming Yang, Chuang Gan"
aliases:
  - papers/salmon
tags:
  - paper
  - RL
  - reward-resemble
  - reward-modeling
  - principle-following
source_url: https://arxiv.org/abs/2310.05910
---

> [!summary] 一句话结论
> SALMON 把原则文本作为 reward model 的输入，使训练时可以换原则、加干预，而不必为每套目标重收偏好；Dromedary-2 的结果很强，但主要依赖 GPT-4 judge，且原则选择仍需人工设计。

## 基本信息

- **论文**：[SALMON: Self-Alignment with Instructable Reward Models](https://arxiv.org/abs/2310.05910)
- **版本**：arXiv:2310.05910v2，2024-04-10；ICLR 2024
- **关键词**：instructable reward model、synthetic preference、principle intervention

## Motivation

固定 RM 把训练数据中的偏好固化成一个分数；修改目标通常要重新标注和训练。SALMON 希望让 RM 显式读取任意自然语言原则，从而以少量人类编写的规则控制 RL 目标，并减少在线偏好收集。

## Method

先由 SFT 模型生成回答对，再随机采样正、负原则，让模型依据某个原则产生合成比较标签。Instructable RM 接收 prompt、回答和一组带权原则，学习输出总体 reward。RL 阶段可重新采样原则或加入针对 reward hacking 的干预原则。Dromedary-2 先用 SELF-ALIGN 的 6 个 in-context exemplars 自举 SFT，再以 SALMON RM 做 PPO。

## Experimental Setup

- 基座为 LLaMA-2-70B。
- 人工输入共 6 个示例与 31 条原则，其中 17 条来自 SELF-ALIGN、14 条用于 SALMON。
- 评测包含 MT-Bench、Vicuna-Bench、AlpacaEval、BBH、HumanEval、TyDiQA 与 TruthfulQA。
- 聊天评估主要使用 GPT-4，论文明确把人类评估留给未来工作。

## Results

Dromedary-2 的 MT-Bench 为 **7.37**，高于 PPO 前的 **6.91** 和 LLaMA-2-Chat-70B 的 **6.88**。它在 BBH Direct / CoT、HumanEval pass@1、TyDiQA 上分别为 **51.4 / 66.3 / 40.6 / 64.3**；LLaMA-2-Chat-70B 为 **43.1 / 52.2 / 35.0 / 27.9**。这些结果支持监督效率与可控性，但聊天结论受 GPT-4 judge 影响。

## Ablation

PPO 前后 MT-Bench 从 6.91 提升到 7.37，说明可指令 RM 的 RL 阶段贡献独立于 SELF-ALIGN SFT。论文还通过调整 helpful、honest、harmless 以及减少 false refusal 的原则展示行为可干预性；不过没有覆盖大规模原则组合冲突。

## Limitations

- Dromedary-2 仍会幻觉和推理错误，RM 受 SFT 基座能力限制。
- 原则设计困难，互相冲突时可能出现意外结果。
- 默认随机采样原则，但最佳原则与具体 prompt 有关。
- 主要聊天评估不是盲测人评，存在 judge 偏差和数据污染风险。

## Takeaways

- 与“一个 rubric 一个 RM”相比，把 rubric 作为 RM 条件输入更适合频繁变化的业务规范。
- 实际系统需要 context-aware principle routing，而不是均匀随机采样。
- 原则可编辑不等于 reward 可相信；事实核验与外部安全评测仍是独立层。

## Citation

```bibtex
@inproceedings{sun2024salmon,
  title={SALMON: Self-Alignment with Instructable Reward Models},
  author={Sun, Zhiqing and Shen, Yikang and Zhang, Hongxin and others},
  booktitle={International Conference on Learning Representations},
  year={2024}
}
```

---
title: "CHORD：动态协调 On-Policy RL 与 Off-Policy Experts"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
business_fit: 5
paper_solidity: 5
tags: [paper, RL, SFT, expert-trajectory, dynamic-weighting]
source_url: https://arxiv.org/abs/2508.11408
---

> [!summary] 核心结论
> CHORD 动态调整专家 SFT loss 与 on-policy GRPO loss：早期更多吸收专家，随后随模型能力提升逐步转向自主探索。动态 token-wise 权重优于固定混合。

## 基本信息

- **论文**：[On-Policy RL Meets Off-Policy Experts: Harmonizing Supervised Fine-Tuning and Reinforcement Learning via Dynamic Weighting](https://arxiv.org/abs/2508.11408)
- **方法名**：CHORD
- **版本**：ICLR 2026 conference paper

## Motivation

SFT-then-RL 把学习分成硬切换两阶段，可能在 RL 中遗忘专家知识；固定 SFT+RL 权重则无法适应训练阶段：早期学生需要老师，后期持续模仿会限制探索。论文要把专家依赖做成动态 curriculum。

## Method

1. 同时计算 on-policy GRPO loss 和 off-policy expert SFT loss。
2. 根据当前模型对专家 token 的掌握程度动态调整权重。
3. CHORD-$φ$ 采用 token-wise 权重：模型越不熟悉的专家 token 获得越强监督，已掌握部分逐步退火。
4. 训练从知识吸收平滑过渡到自主 RL，而不是固定比例或阶段硬切换。

## Experimental Setup

- **模型/领域**：Qwen2.5-7B 数学推理；Llama3.2-3B tool use。
- **评测**：AMC、AIME24/25、MMLU-Pro、BFCL。
- **对照**：纯 SFT、纯 RL、SFT-then-RL、固定权重混合和不同动态权重粒度。

## Results

CHORD-$φ$ 报告：AMC **62.5**、AIME24 **18.2**、AIME25 **17.2**、MMLU-Pro **56.2**、BFCL overall **78.5**。论文在数学和 tool-use 两类设置中均优于固定混合与阶段式对照。

## Ablation

- 动态权重优于固定 $μ$，支持“专家监督应随训练退火”。
- token-wise $φ$ 是关键：比样本级或全局权重更能区分已掌握与未掌握知识。
- 过早降低 SFT 会使弱模型缺少启动信号，长期高权重则抑制后期探索。

## Limitations

- 核心贡献是 loss curriculum，不是 replay buffer；本专题收录它是因为同样处理 off-policy 专家数据。
- 多个 benchmark 的绝对分数受模型、数据和评测协议影响，不能与其他 replay 论文直接排序。
- 动态权重依赖模型概率作为“掌握度”代理，可能受校准误差影响。

## Takeaways

CHORD 的启示是：专家数据与 on-policy RL 的比例不应固定。随着学生成长，训练应从“老师主导”连续过渡到“自己探索”。

## Citation

Zhang et al. _On-Policy RL Meets Off-Policy Experts: Harmonizing Supervised Fine-Tuning and Reinforcement Learning via Dynamic Weighting_. ICLR 2026, arXiv:2508.11408.

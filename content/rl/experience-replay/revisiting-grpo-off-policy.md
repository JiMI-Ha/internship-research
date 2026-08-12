---
title: "Revisiting GRPO：On-Policy 与 Off-Policy 更新边界"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, RL, GRPO, off-policy, theory, policy-lag]
source_url: https://arxiv.org/abs/2505.22257
---

> [!summary] 核心结论
> 这篇工作分析 rollout policy 延迟与同批数据多次更新时，GRPO 实际优化的 loss 和 policy-improvement 条件。实验中 $v=10,i=1$ 的 off-policy 设置与 $v=1,i=1$ on-policy 持平或略优，但验证规模最多 1.5B。

## 基本信息

- **论文**：[Revisiting Group Relative Policy Optimization: Insights into On-Policy and Off-Policy Training](https://arxiv.org/abs/2505.22257)
- **作者**：Youssef Mroueh 等，IBM Research

## Motivation

实践中所谓“GRPO”可能不是严格 on-policy：rollout server 每隔若干轮才同步权重，一批数据也可能多次训练。若不说明 policy version、迭代数和 clip，两个同名 recipe 实际优化目标可能完全不同。论文试图给出 off-policy GRPO 的理论改写和边界。

## Method

1. 明确区分生成数据的 policy version $v$ 与对同批数据执行的 update iteration $i$。
2. 推导 group-relative advantage 在 off-policy 分布下的有效 surrogate loss。
3. 给出带 clipping/importance correction 的 policy-improvement lower bound。
4. 用较低频 rollout policy 更新测试数据复用是否损害最终效果。

## Experimental Setup

- **小规模分析**：Qwen2.5-0.5B，GSM8K。
- **扩展实验**：DeepSeek-R1-Distill-Qwen-1.5B，在约 40K DeepScaleR 数据上训练。
- **评测**：AIME24、MATH-500；4096 context；单节点 8 GPU（1 张 rollout、7 张训练）。
- **对照**：$v=1,i=1$ on-policy 与 $v=10,i=1$ off-policy 等组合。

## Results

- 1.5B 实验中，on-policy 与 off-policy 都把 AIME24 从约 29% 提到最高约 32%，MATH-500 从约 83% 提到 87%。
- AIME24 多次评测均值：$v=1,i=1$ 为 **0.3022**，$v=10,i=1$ 为 **0.3049**；差异很小，只支持“未明显变差/略高”，不能强称显著提升。
- 单节点下 rollout 与训练未充分并行，off-policy 的速度优势有限。

## Ablation

- 论文比较不同 $v$、$i$ 组合，说明 policy lag 和同批更新次数是两个独立维度。
- off-policy 适配目标比直接套用 on-policy loss 更稳。
- 理论界要求的 correction 与 clip 会随 lag 增大而更重要。

## Limitations

- 最大只到 1.5B、单节点、4096 context。
- AIME24 样本少，0.3049 vs. 0.3022 不足以支持显著性结论。
- 系统没有充分异步化，无法展示大型 actor—learner 架构的真实吞吐收益。

## Takeaways

报告 replay/off-policy GRPO 时必须同时交代：**rollout lag、每批更新次数、behavior log-prob 和 clipping**。只写“复用 10 次”不足以复现实验或判断安全边界。

## Citation

Mroueh et al. _Revisiting Group Relative Policy Optimization: Insights into On-Policy and Off-Policy Training_. arXiv:2505.22257, 2025.

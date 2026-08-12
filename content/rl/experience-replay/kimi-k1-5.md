---
title: "Kimi k1.5：大型 RL 系统中的完整与部分轨迹缓存"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, RL, reasoning, multimodal, trajectory-cache]
source_url: https://arxiv.org/abs/2501.12599
---

> [!summary] 核心结论
> Kimi k1.5 在大型训练 recipe 中缓存完整和部分 rollout，以降低时间相关性并复用生成；但论文没有隔离 replay 组件的独立增益，不能把整套模型成绩归因于经验回放。

## 基本信息

- **技术报告**：[Kimi k1.5: Scaling Reinforcement Learning with LLMs](https://arxiv.org/abs/2501.12599)
- **作者**：Kimi Team

## Motivation

大规模同步 RL 的连续 batch 高度相关，长 CoT 和多模态 rollout 又非常昂贵。系统若只消费最新轨迹，会同时面临数据浪费、worker 等待和训练分布窄化。Kimi k1.5 将缓存作为整个 RL 基础设施的一部分，而不是单独算法。

## Method

- 缓存完整 rollout，并保留可继续生成的 partial trajectories。
- 跨 iteration 混合和续写缓存经验，打散相邻策略产生的时间相关性。
- 与 long-CoT RL、长度控制、采样策略、优化基础设施和 long2short 蒸馏共同训练。

论文没有给出一个可直接复刻的“仅打开 replay”目标函数，因此它更接近系统设计先例。

## Experimental Setup

- **形态**：长 CoT、短 CoT 与视觉语言模型。
- **评测**：数学、代码和多模态 benchmark，包括 AIME 2024、MATH-500、LiveCodeBench、MathVista。
- **注意**：模型和训练规模远大于多数 replay 算法论文，对比不能只看绝对分数。

## Results

- Kimi k1.5 long-CoT 在报告中达到 AIME 2024 **77.5**、MATH-500 **96.2**、LiveCodeBench **62.5**。
- k1.5-short w/ RL 达到 AIME 2024 **60.8**（8 次运行平均），平均使用 3,272 tokens；短 CoT 还报告 MATH-500 94.6、LiveCodeBench 47.3。
- 这些是**完整系统结果**，论文没有提供“去掉轨迹缓存”后的独立差值。

## Ablation

报告包含 RL、long2short 和 token length 等消融，但没有把完整/部分轨迹缓存单独隔离。因此 replay 对准确率、吞吐或稳定性的净贡献未知。

## Limitations

- 系统闭源细节和大规模算力使复现困难。
- 多个训练组件强耦合，无法从最终成绩识别缓存的因果贡献。
- partial trajectory 如何估值、过期和采样，公开说明不如专门 replay 论文完整。

## Takeaways

Kimi k1.5 说明轨迹缓存已进入前沿大模型训练基础设施，但它提供的是工程可行性证据，不是 replay 算法的独立效果证据。

## Citation

Kimi Team. _Kimi k1.5: Scaling Reinforcement Learning with LLMs_. arXiv:2501.12599, 2025.

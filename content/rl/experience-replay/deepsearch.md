---
title: "DeepSearch：训练时树搜索、节点价值与解答缓存"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, RLVR, MCTS, tree-search, experience-replay, reasoning]
source_url: https://arxiv.org/abs/2509.25454
---

> [!summary] 核心结论
> DeepSearch 用训练时 MCTS 扩展推理宽度，以全局 frontier、节点级价值和 verified-solution cache 避免重复搜索。1.5B 模型平均 62.95%，比延长 DAPO 训练使用约 5.7× 更少 GPU-hours。

## 基本信息

- **论文**：[DeepSearch: Overcome the Bottleneck of Reinforcement Learning with Verifiable Rewards via Tree-Based Search](https://arxiv.org/abs/2509.25454)
- **版本**：ICLR 2026 conference paper；arXiv:2509.25454

## Motivation

RLVR 在性能平台期继续增加常规 rollout，往往重复搜索相似路径；序列级 reward 也难以指出中间分支是否值得扩展。论文主张把训练探索组织为树，跨问题和跨步缓存已验证解，以“扩大搜索宽度”替代盲目延长训练。

## Method

1. 训练阶段对难题运行 MCTS，在全局 frontier 中选择最值得扩展的节点。
2. 用 node-level $q$ 估计中间状态，生成更细粒度 token scores。
3. 对 hard set 做 progressive filtering，把计算集中在仍未解决的问题。
4. adaptive replay buffer 与 verified-solution cache 保存已发现的正确路径，避免再次从根节点重复搜索。
5. 将树搜索产生的轨迹用于 Tree-GRPO 更新。

## Experimental Setup

- **模型**：DeepSeek-R1-Distill-Qwen-1.5B 系列基座。
- **评测**：AIME24、AIME25、AMC23、MATH、Minerva、Olympiad。
- **比较**：Nemotron 1.5B、扩展 DAPO 训练，以及搜索策略和轨迹选择消融。

## Results

- DeepSearch-1.5B 平均准确率 **62.95%**，高于此前对照 61.70%。
- AIME24 为 **53.65% vs. 51.77%**，AMC 为 **90.39% vs. 88.83%**。
- 额外 50 步使用 **330 GPU-hours**；扩展 1875 步的 DAPO+KL 使用 1883.2 GPU-hours、平均 62.02%，因此论文报告约 **5.7× 更少 GPU-hours**。

## Ablation

- 从 vanilla DeepSearch 的 60.27 逐步加入新 $q$ 更新、细粒度 token score、advantage normalization 和 frontier selection，最终达到 62.95。
- 选择**最有置信度的错误轨迹**扩展（62.95）优于随机错误轨迹（62.09）和最低置信错误轨迹（61.90）。
- 全局 frontier selection 是最终成绩的重要增量。

## Limitations

- 只在数学和 1.5B 设置验证；MCTS 的并发、显存与工程复杂度较高。
- 330 GPU-hours 仍是额外搜索成本；与不同硬件上的 rollout 数不可直接换算。
- 搜索、节点价值、过滤、缓存和 GRPO 同时改变，无法把全部收益归因于 replay cache。

## Takeaways

DeepSearch 的经验不是普通“旧答案”，而是结构化搜索树中的节点和已验证解。对于高成本难题，缓存的最大价值可能是**少走重复搜索路径**，而不只是多做一次梯度更新。

## Citation

Wu et al. _DeepSearch: Overcome the Bottleneck of Reinforcement Learning with Verifiable Rewards via Tree-Based Search_. ICLR 2026, arXiv:2509.25454.

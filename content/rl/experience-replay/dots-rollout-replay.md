---
title: "DOTS + Rollout Replay：按当前难度定向采样并复用近期 rollout"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, RL, RLVR, data-selection, experience-replay, efficiency]
source_url: https://arxiv.org/abs/2506.05316
---

> [!summary] 核心结论
> DOTS 把 prompt 难度选择和近期 rollout replay 组合起来：更多训练“当前约一半概率能解”的题，并用 FIFO 历史组替代部分新生成，主要目标是减少昂贵采样时间。

## 基本信息

- **论文**：[Improving Data Efficiency for LLM Reinforcement Fine-tuning Through Difficulty-targeted Online Data Selection and Rollout Replay](https://arxiv.org/abs/2506.05316)
- **简称**：DOTS（Difficulty-targeted Online data Selection）

## Motivation

均匀抽题会把 rollout 预算浪费在两端：过易题几乎全部答对，过难题几乎全部答错，两者都缺少有效组内方差。即使某批 rollout 有学习信号，标准 RL 也只使用一次。论文试图同时减少无效 prompt 和重复生成成本。

## Method

1. 在线估计每个 prompt 对当前策略的成功率。
2. 优先采样成功率接近 50% 的中等难度问题。
3. 每步只生成约一半 fresh rollout；其余从 FIFO buffer 中取近期仍有有效 reward 方差的完整 rollout group。
4. 随策略变化持续刷新难度估计与 buffer，避免长期依赖陈旧数据。

## Experimental Setup

- **设置**：六组模型/训练配置。
- **评测**：关注最终推理性能、每步 rollout 时间和总训练时间。
- **统计**：报告 3 次运行及 95% 置信区间，比仅给单次峰值更可靠。

## Results

- 六种设置的总训练时间平均节省 **40.7%**，各设置范围为 **23.30%–61.65%**。
- 每步时间节省约 **11%–13%**。
- 主要收益来自少生成 fresh rollout 并避免极易/极难 prompt；不能把全部节省单独归因于 replay。

## Ablation

- 单独使用难度定向选择或单独 replay 都有收益，组合效果最好。
- 中等难度区域比均匀采样更有训练信号，但目标成功率会受 group size 与 reward 噪声影响。
- FIFO 近期经验比长期无界 buffer 更稳，支持 freshness 的必要性。

## Limitations

- 难度估计本身需要在线统计；小样本下成功率会有较大噪声。
- 对 verifier 错误或多维 reward，简单二元成功率不足以表示学习价值。
- 训练时间收益混合了 prompt 选择与 replay 两种机制，组件级归因有限。

## Takeaways

DOTS 的重点不是“保存最好的答案”，而是**把生成预算集中在当前有梯度的题，并让近期有效 rollout 多训练一次**。若目标是算力效率，它比跨 run 建库更直接。

## Citation

Sun et al. _Improving Data Efficiency for LLM Reinforcement Fine-tuning Through Difficulty-targeted Online Data Selection and Rollout Replay_. arXiv:2506.05316, 2025.

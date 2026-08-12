---
title: "ReMix：用阶段化历史混合提高 Update-to-Data Ratio"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
business_fit: 5
paper_solidity: 4
tags: [paper, RL, off-policy, experience-replay, data-efficiency]
source_url: https://arxiv.org/abs/2507.06892
---

> [!summary] 核心结论
> ReMix 不是全程固定回放，而是在训练前期用 40% 历史数据提高每条 rollout 的更新次数，随后切回纯 on-policy 并重置 reference policy。论文把这种两阶段过程称为从已“浸透”的数据中继续榨取价值。

## 基本信息

- **论文**：[Squeeze the Soaked Sponge: Efficient Off-policy Reinforcement Finetuning for Large Language Model](https://arxiv.org/abs/2507.06892)
- **方法名**：ReMix

## Motivation

LLM RL 的主要成本常在生成 rollout，而一批数据通常只更新一次。提高 update-to-data ratio（UTD）可减少生成，但反复训练同一批 off-policy 样本又容易过拟合并造成策略漂移。论文希望找到“前期复用、后期恢复探索”的训练节奏。

## Method

1. 前期 batch 使用 **60% on-policy + 40% 历史数据**。
2. 采用 UTD=2，并只使用最近两个训练窗口的历史样本，以限制 staleness。
3. 后期停止 replay，切回纯 on-policy。
4. 切换时重置 reference policy，作者称为 policy reincarnation，用于释放被旧数据和 KL 约束压住的后期性能。

## Experimental Setup

- **模型**：代表性汇总为 7B 模型。
- **任务**：多项数学推理 benchmark。
- **比较维度**：最终平均成绩、rollout 数量、不同历史比例、窗口与是否进行后期 reincarnation。

## Results

- 7B 配置的平均分由 base 的 **52.08 提升到 64.39**。
- 训练只使用约 **0.011M rollout**。
- 相比 AceReason-Nemotron 的 3.584M rollout，75-step 模型减少约 **326×**；论文综合 1.5B/7B 对照写作 **30×–450× rollout 降低**。这是生成样本数口径，不等于完整 wall-clock 同倍加速。

## Ablation

- 不进行 policy reincarnation 的版本表现最差，说明历史数据更适合启动和加速，而不适合主导收尾阶段。
- 过高 replay 比例前期学习快、后期更容易下降。
- 短历史窗口优于无界累积，支持“经验价值随策略变化衰减”。

## Limitations

- 两阶段切换点、40% 混合比例与 UTD=2 都需要按模型和任务重调。
- rollout 节省没有自动包含重训、存储和更多 optimizer updates 的成本。
- reference reset 会同时改变优化几何，收益不能完全归因于经验回放。

## Takeaways

ReMix 的可迁移结论是：**历史数据适合在前期提高利用率，后期应把控制权交还 fresh rollout**。固定比例 replay 的曲线应至少检查是否出现“先增益、后掉点”。

## Citation

Liang et al. _Squeeze the Soaked Sponge: Efficient Off-policy Reinforcement Finetuning for Large Language Model_. arXiv:2507.06892, 2025.

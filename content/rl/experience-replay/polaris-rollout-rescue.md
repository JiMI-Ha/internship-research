---
title: "Polaris Rollout-Rescue：全失败组中的按需历史答案注入"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [RL, RLVR, experience-replay, rollout-rescue, engineering]
source_url: https://hkunlp.github.io/blog/2025/Polaris
---

> [!note] 材料性质
> Rollout-Rescue 是 Polaris 工程博客/训练 recipe 中的一个组件，不是具有独立实验段落的 replay 算法论文。

## 基本信息

- **来源**：[Polaris: A Post-Training Recipe for Scaling Reinforcement Learning on Advanced Reasoning Models](https://hkunlp.github.io/blog/2025/Polaris)
- **材料类型**：项目博客中的训练组件

## Motivation

GRPO 当前 group 全失败时 reward 方差为零，模型在最难的问题上得不到梯度。全面增加采样或固定比例混入历史数据都会增加成本。Rollout-Rescue 选择只在零信号事件发生时做最小干预。

## Method

1. 检测当前 prompt 的 rollout group 是否全部失败。
2. 若全失败，从 earlier-epoch buffer 中取该问题的一条历史正确答案。
3. 用它替换一个失败 rollout，使组内同时出现正负 reward，恢复相对 advantage。
4. 非全失败组保持原训练流程，不常态化增加 replay 比例。

## Experimental Setup

博客在 Polaris 整体 post-training recipe 中使用该机制；它与数据、采样、优化等其他组件共同出现，没有提供与 RLEP 对齐的独立训练配置。

## Results

Polaris 整体系统取得强推理表现，但博客**没有隔离 Rollout-Rescue 的独立增益**。因此不能把整个模型成绩归因给这个组件，也不能从现有材料写出其准确率提升或计算节省。

## Ablation

未提供严格隔离的 component ablation。可从机制推断它比固定 replay 更少触发，但“侵入性更小”不等于已证明性能更优。

## Limitations

- 需要同一 prompt 在早期 epoch 曾经产生正确答案；从未成功过的难题无法 rescue。
- 历史答案可能已经陈旧，与当前策略相差较大。
- 证据来自整体 recipe，缺少独立随机种子与成本分析。

## Takeaways

这是最简洁的 replay 触发器：**只在全零组时借一条旧正确答案恢复梯度**。适合作为低侵入工程 baseline，但应补做独立消融后才能评价真实贡献。

## Citation

HKU NLP. _Polaris: A Post-Training Recipe for Scaling Reinforcement Learning on Advanced Reasoning Models_. Project blog, 2025.

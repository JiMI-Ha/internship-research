---
title: "Retrospective Replay：从高价值中间状态继续探索"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
business_fit: 3
paper_solidity: 3
tags: [paper, RL, reasoning, experience-replay, prefix, exploration]
source_url: https://arxiv.org/abs/2504.14363
---

> [!summary] 核心结论
> Retrospective Replay（RRL）不回放整条正确答案，而是让 PPO critic 在旧探索中找出高价值推理 prefix，再从该中间状态继续 rollout，从而保留有希望的分支。

## 基本信息

- **论文**：[Improving RL Exploration for LLM Reasoning through Retrospective Replay](https://arxiv.org/abs/2504.14363)
- **作者**：Shihan Dou、Muling Wu、Jingwen Xu、Rui Zheng、Tao Gui、Qi Zhang、Xuanjing Huang

## Motivation

一条最终失败的长推理可能在前半段已经找到正确方向，只是在后续走偏。按最终 reward 丢弃整条轨迹，会浪费这些局部进展；完整成功轨迹 replay 又无法覆盖“差一点成功”的探索。论文因此把经验粒度从 sequence 降到 intermediate state。

## Method

1. 训练 PPO actor-critic，用 critic 给推理过程中的中间状态估值。
2. 在模型历史轨迹和 canonical solution 中定位高价值 prefix。
3. 把 prefix 作为新的起点继续生成后缀，让策略从 promising state 重新探索。
4. 将续写结果重新纳入 RL 更新，扩大高价值局部分支被完成的概率。

## Experimental Setup

- **任务**：代码生成 APPS+，数学 GSM8K 与 MATH。
- **比较**：常规 PPO/RL 探索与加入 retrospective replay 的版本。
- **信号**：critic 的状态价值负责选择 replay 起点。

## Results

| 任务  | Baseline |      RRL |
| ----- | -------: | -------: |
| APPS+ |     31.7 | **35.2** |
| GSM8K |     68.8 | **70.7** |
| MATH  |     33.3 | **34.3** |

结果支持中间状态复用能改善探索，但不同任务增益差异较大，数学集上的提升明显小于 APPS+。

## Ablation

- 从 critic 选择的 promising prefix 继续生成，优于随机截断点。
- canonical solution 可补充模型尚未探索到的状态，但也引入外部答案依赖。
- 早期 critic 尚未校准时，状态排序更不可靠，replay 质量会受训练阶段影响。

## Limitations

- critic 可能高估本身就错误的 prefix；局部语言流畅不等于最终可解。
- 需要状态级价值模型和从 prefix 续写的系统支持，比完整轨迹 replay 更复杂。
- canonical solution 的使用使部分经验不再是纯 self-replay。

## Takeaways

RRL 说明“失败经验没用”是粒度问题：完整失败序列价值低，但其中的好 prefix 可能是稀缺探索资产。适合长代码、长证明和多步 agent，而不仅是最终答案回放。

## Citation

Dou et al. _Improving RL Exploration for LLM Reasoning through Retrospective Replay_. arXiv:2504.14363, 2025.

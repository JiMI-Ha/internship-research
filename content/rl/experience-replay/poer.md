---
title: "POER：回放失败轨迹中的有希望 Prefix"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, RL, experience-replay, prefix, off-policy]
source_url: https://openreview.net/forum?id=AoCqLYhTD8
---

> [!warning] 证据范围
> OpenReview 正文当前受访问验证限制。本页只根据可公开核验的索引摘要说明机制，不记录未经正文复核的实验数字，也不把摘要主张升级为已独立验证的结论。

## 基本信息

- **论文页**：[POER: Policy Optimization with Experience Replay](https://openreview.net/forum?id=AoCqLYhTD8)
- **证据等级**：公开索引摘要；结果数字未核验

## Motivation

只保存完整正确答案会丢弃大量部分正确的失败轨迹。长推理的最终 reward 为 0，不代表早期步骤没有建立有效子目标。POER 关注怎样识别并复用失败答案中的正确或有希望 prefix，引导策略完成剩余路径。

## Method

根据公开摘要，POER 将失败轨迹切分并保留仍有价值的早期推理 prefix；训练时以这些 prefix 为条件继续生成后缀，使模型不必每次都从问题开头重新发现同一路径。它属于 prefix/state replay，而不是 RLEP 式完整成功序列回放。

## Experimental Setup

公开索引信息不足以可靠复核模型、训练预算、benchmark 细项和统计协议。本页因此不补写推测设置。

## Results

公开摘要声称该方法能改善推理策略优化，但在取得可复核正文前，**不列成绩、提升百分比或效率倍数**。这意味着当前只能确认研究问题与机制定位，不能比较其效果是否超过 RRL、RLEP 或其他 replay 方法。

## Ablation

无法从当前可访问材料可靠核验 prefix 价值估计、长度、选择阈值或 replay ratio 的消融。

## Limitations

- 当前页面本身受资料可访问性限制，不是完整论文复盘。
- prefix 是否真的正确依赖状态价值或过程验证；误选的早期分支可能系统性误导后缀。
- 从 prefix 续写改变了训练状态分布，需要额外处理 off-policy gap。

## Takeaways

POER 的方向价值在于：经验不必等到整条答案成功才有资格进入 buffer。现阶段应把它当作值得跟踪的 prefix replay 方案，而不是有充分数字证据的强基线。

## Citation

_POER: Policy Optimization with Experience Replay_. OpenReview forum AoCqLYhTD8；作者与正式出版信息以原页面更新为准。

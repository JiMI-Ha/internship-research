---
title: "Rephrasing RePO：先把专家答案改写成当前 Policy 的语言"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, RL, off-policy, expert-trajectory, rephrasing]
source_url: https://arxiv.org/abs/2602.10819
---

> [!summary] 核心结论
> Rephrasing Policy Optimization 不直接训练专家原文，而是让当前模型先理解并改写专家答案，再用这些“像自己说的”正确轨迹替换低奖励 rollout，从数据层缩小 policy gap。

## 基本信息

- **论文**：[RePO: Bridging On-Policy Learning and Off-Policy Knowledge through Rephrasing Policy Optimization](https://arxiv.org/abs/2602.10819)
- **注意**：与 [[rl/experience-replay/replay-enhanced-repo|Replay-Enhanced RePO]] 是两篇不同论文。

## Motivation

专家答案虽然正确，但其措辞、推理长度和 token 分布可能远离学生 policy。直接混合会造成极端 importance ratio，直接 SFT 又可能覆盖学生已有探索能力。论文提出先把知识转译成学生能自然生成的形式。

## Method

1. 找出当前 rollout 中的低奖励/全失败问题。
2. 向当前模型提供专家解答，让它在理解内容后重新表述，而不是逐字复制。
3. 用 verifier 筛选改写后的正确轨迹。
4. 以 rephrased trajectory 替换部分低奖励 rollout，再执行 policy optimization。

改写相当于一个 data-space policy-gap adapter：保留专家解题信息，同时提高轨迹在当前模型下的概率。

## Experimental Setup

- **模型**：代表性主结果为 Qwen3-8B。
- **训练数据**：SuperGPQA 11K 及 OpenR1-Math Hard 等高难样本；也测试多源 hard data。
- **评测**：GPQA、AIME24/25、Minerva、MATH-500，并与 LUFFY 等 off-policy guidance 比较。

## Results

- Qwen3-8B + SuperGPQA 11K：GPQA **61.8**、AIME25 **72.5**、Minerva **68.1**。
- 在 OpenR1-Math Hard 上，LUFFY 几乎崩溃，而 RePO 仍达到 AIME24 **13.1**、AIME25 **10.0**、MATH-500 **78.2**。
- 多源 hard data 设置下训练保持稳定，支持改写能减小原始专家轨迹的分布冲突。

## Ablation

- 直接使用专家原文不如先 rephrase，说明收益不只来自“获得正确答案”。
- verifier 过滤不可省，否则错误改写会被当作正轨迹。
- 在更难、policy gap 更大的数据上，改写相对直接 off-policy guidance 的稳定性优势更明显。

## Limitations

- 每条专家轨迹需要额外一次理解/改写生成，增加成本。
- 当前模型可能在改写时丢失关键证明步骤或复制专家错误。
- 依赖外部专家答案，且结果集中在知识/数学 benchmark。

## Takeaways

当专家和学生差距太大时，可以先改数据再改 loss。RePO 的启示是：**最安全的 off-policy 轨迹，可能是由当前 policy 重新表达过的专家知识**。

## Citation

Xia et al. _RePO: Bridging On-Policy Learning and Off-Policy Knowledge through Rephrasing Policy Optimization_. arXiv:2602.10819, 2026.

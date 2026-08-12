---
title: "Buffer Matters / BAPO：让历史难题随策略成长重新进入训练"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
business_fit: 5
paper_solidity: 5
tags: [paper, RL, RLVR, experience-replay, buffer, off-policy]
source_url: https://arxiv.org/abs/2602.20722
---

> [!summary] 核心结论
> BAPO 不把 buffer 当作静态成功答案仓库，而是同时管理“以前全错、现在可能学会”的难题和近期高质量轨迹。其贡献集中在 revisit、freshness 与 off-policy correction 的组合设计。

## 基本信息

- **论文**：[Buffer Matters: Unleashing the Power of Off-Policy Reinforcement Learning in Large Language Model Reasoning](https://arxiv.org/abs/2602.20722)
- **版本**：ICLR 2026 conference paper；arXiv:2602.20722

## Motivation

RLVR 会持续产生全错组：这些 prompt 当下没有相对 advantage，却可能在策略成长后变得可解。只保存正确轨迹会永久遗忘这类“暂时太难”的训练信号；长期保留所有数据又会造成严重 staleness。论文因此研究怎样让 buffer 同时承担课程学习和经验回放。

## Method

BAPO 把训练数据分成三部分：

1. 当前 batch 中具有非零 reward 方差的 fresh groups；
2. 定期重新采样历史全错 prompt，检测“以前不会、现在开始会”的转折；
3. 最近若干步产生的高质量轨迹，用于 replay。

高质量轨迹只保留最近三步并采用 FIFO 管理，以限制陈旧度；更新时使用 importance ratio 做 off-policy correction。这样，prompt revisit 提供课程信号，短期轨迹回放提高数据复用率。

## Experimental Setup

- **领域**：数学、规划和视觉推理，覆盖纯文本与多模态设置。
- **对照**：GRPO、DAPO 等 on-policy RLVR 方法，并报告 rollout 使用量。
- **观察对象**：长期全失败 prompt 的后续可解比例、跨任务平均性能及 buffer 设计消融。

## Results

- 论文按其跨数学、规划、视觉任务的聚合口径，报告相对 GRPO 平均提高 **12.5%**。
- 历史持续失败问题中，最终有 **40.7%** 被解决，支持“难度会随策略变化”的动机。
- 论文报告 rollout 用量约为 DAPO 的 **1/2.5**；这不是完整 wall-clock 的等比例结论。

## Ablation

- 仅回放近期正确轨迹不能替代历史难题 revisit，两者解决的是不同数据缺口。
- 不限制 buffer 新鲜度会让 policy gap 增大；最近三步窗口是论文采用的稳定折中。
- importance correction 对 off-policy 样本重要，但不能无限延长陈旧轨迹的寿命。

## Limitations

- 多个组件同时改变了数据选择、课程和目标函数，无法把全部增益严格归因于 buffer。
- “最近三步”是特定训练节奏下的超参数，不同 batch size 或 actor lag 下不可直接照搬。
- 跨任务平均提升掩盖了不同任务的基数和评测协议，不宜与单项 benchmark 直接比较。

## Takeaways

BAPO 的核心不是多存成功答案，而是维护两种时间尺度：**旧难题要定期复诊，旧轨迹只能短期复用**。这是比 RLEP 更完整的在线 buffer 管理方案。

## Citation

Wan et al. _Buffer Matters: Unleashing the Power of Off-Policy Reinforcement Learning in Large Language Model Reasoning_. ICLR 2026, arXiv:2602.20722.

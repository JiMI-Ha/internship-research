---
title: "ReLIFT：在在线 RL 与困难样本监督微调之间交错训练"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
business_fit: 5
paper_solidity: 5
tags: [paper, RLVR, SFT, expert-trajectory, hard-sample]
source_url: https://arxiv.org/abs/2506.07527
---

> [!summary] 核心结论
> ReLIFT 识别纯 RL 难以突破的 hardest questions，把高质量解存入 buffer，并在在线 RL 与监督微调之间交错。六项平均 52.6，高于 RL 46.9 和 LUFFY 50.9。

## 基本信息

- **论文**：[Learning What Reinforcement Learning Can't: Interleaved Online Fine-Tuning for Hardest Questions](https://arxiv.org/abs/2506.07527)
- **版本**：ICLR 2026 conference paper

## Motivation

纯 RL 只有在当前策略能偶尔命中时才有正信号。对于长期零成功率的最难问题，继续 rollout 可能只是重复浪费算力；直接一次性 SFT 全部专家数据又会减弱 on-policy 探索。论文希望动态区分“RL 能学的”和“当前 RL 学不会的”。

## Method

1. 在线监控各 prompt 的 RL 学习状态，识别持续无法获得有效 reward 的 hardest questions。
2. 为这些问题收集高质量示范并写入 buffer。
3. 在 on-policy RL 更新之间交错监督微调，只对当前需要外部帮助的样本注入知识。
4. 随策略成长更新困难集合，避免把所有专家数据永久固定在训练中。

## Experimental Setup

- **模型**：Qwen2.5-Math-7B。
- **示范**：8K demonstrations。
- **成本**：52×8 GPU-hours。
- **评测**：六项数学推理 benchmark，并与 RL、LUFFY 和不同采样策略比较。

## Results

- 六项 overall：ReLIFT **52.6**，纯 RL **46.9**，LUFFY **50.9**。
- 论文将 52.6 同时作为 OOD 数学汇总结果报告，显示交错训练没有只改善训练内问题。
- 成绩与 8K 外部示范和额外 SFT 成本绑定，不能解释为纯 replay 增益。

## Ablation

- ReLIFT(all) 仅 **23.8**：对所有样本统一注入专家监督会严重破坏训练。
- uniform 选择为 **49.1**，random 为 **45.5**，均低于按“RL 学不会”选择的 **52.6**。
- 结果说明关键是困难样本识别，而不是多做 SFT。

## Limitations

- 依赖 8K 高质量 demonstrations，数据获取成本高。
- SFT 与 buffer 选择强耦合，无法单独量化经验回放的贡献。
- “hardest” 判定依赖当前训练阶段，错误判断会把可探索问题过早交给专家。

## Takeaways

ReLIFT 提供一个清晰分工：RL 负责当前可探索区域，SFT buffer 只救持续零信号区域。全量专家监督的失败是重要负结果。

## Citation

Ma et al. _Learning What Reinforcement Learning Can't: Interleaved Online Fine-Tuning for Hardest Questions_. ICLR 2026, arXiv:2506.07527.

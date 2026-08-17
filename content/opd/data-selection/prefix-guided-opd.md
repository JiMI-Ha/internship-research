---
title: "PG-OPD：用短 Prefix Probe 筛选值得续写的 Rollout"
created: 2026-08-17
published: 2026-08-17
modified: 2026-08-17
type: paper
tags: [paper, OPD, data-selection, trajectory-selection, prefix-compatibility]
source_url: https://arxiv.org/abs/2606.21994
---

> [!summary] 解读结论
> PG-OPD 先让每个 rollout candidate 只生成一个短 prefix，再以师生 top-k overlap 决定哪些候选值得继续生成到完整长度。它选择的是 candidate rollout 的完整生成预算，而不是在已完成轨迹内做 token mask。

## 基本信息

- **论文**：[Prefix-Guided On-Policy Distillation: Mining Golden Trajectories from Rollouts](https://arxiv.org/abs/2606.21994)
- **arXiv**：2606.21994，2026-06-20 预印本。
- **当前专题关系**：直接覆盖 rollout / trajectory 筛选（B），数据筛选专项分为 **1/4**。

## Motivation

标准 OPD 将每个 candidate 生成到同一长 rollout 上限，即使其早期 prefix 已与教师明显不兼容。低 overlap 候选的后续监督往往更不可靠，同时消耗 rollout 预算；PG-OPD 将短 prefix compatibility 视为 candidate continuation value 的代理。

## Method

1. 每个 candidate 先生成固定长度 \(P\) 的 probe prefix，默认 \(P=128\)。
2. 每个位置计算师生 top-k distribution 的交集比例：

   \[
   o_{i,j,t}=\frac{|\operatorname{TopK}(p,k)\cap\operatorname{TopK}(q,k)|}{k},\quad k=16.
   \]

   对 prefix 取平均得到 candidate score。

3. 每个 prompt 必保留最高分 candidate；剩余 full-rollout slots 再按所有剩余 candidate 的分数全局选择。入选者续写至 \(L=5000\)，其余 candidate 在 probe 后停止且不参与 OPD loss。

## Experimental Setup

- **数据**：DAPO-Math-17K。
- **模型**：5 组 teacher/student pair，包含 DeepSeek、JustRL、OpenMath-Nemotron 与 Qwen3 组合。
- **比较**：全长度 OPD、固定 5K 截断 OPD、[[opd/data-selection/prune-opd|Prune-OPD]]。
- **评测**：AIME24/25、AMC23、HMMT24/25，Avg@16；测试 25%、50%、75% pruning ratio。

## Results

| 设置                                  |                           对照 |              PG-OPD | 原文支持的结论                                       |
| ------------------------------------- | -----------------------------: | ------------------: | ---------------------------------------------------- |
| OpenMath-Nemotron pair，50% pruning   |                      OPD 59.40 |               64.20 | 平均增加 4.80；训练时间 31,815s → 19,757s（1.61×）。 |
| Qwen3-4B-Base / Qwen3-4B，75% pruning |                       full OPD | 报告最高 2.46× 加速 | 高 pruning 可明显减少时间，但收益依赖 pair。         |
| 50% pruning 的选择信号对照            | Random 58.35；loss-based 58.40 |       overlap 64.20 | overlap 选择优于随机与 loss-based。                  |

## Ablation / Robustness

- probe 长度 128 token 最好；32 token 信息不足，256 token 没有进一步改善。
- 每 prompt 至少保留一个 candidate 的策略优于仅 global ranking，避免部分 prompt 被完全排除。
- rank-1 candidate 的表现优于 rank 2–4，支持 overlap 分数确实有排序信息。
- 固定截断到约 5K 已恢复大量性能，但 PG-OPD 的 overlap 选择优于只做统一长度控制。

## Sensitivity / Boundary Conditions

- 效果依赖 teacher/student pair 和 pruning ratio。
- 选择只发生在短 probe 后，不处理完整 trajectory 内中后段的局部 drift。

## Limitations

- 当前实验为数学 reasoning；agent、多轮和工具调用尚未验证。
- rollout 生成仍是主要成本，短 prefix probe 本身也会消耗预算。
- score 是 top-k overlap 代理，可能把合理但不同风格的推理误判为低价值。

## Takeaways

PG-OPD 在机制榜只命中 B：它回答“同一个 prompt 的多个 student rollout，哪条值得继续生成并训练”，并以 per-prompt coverage 防止全局排序损坏问题覆盖。

## Citation

> _Prefix-Guided On-Policy Distillation: Mining Golden Trajectories from Rollouts_. arXiv:2606.21994, 2026. [原文](https://arxiv.org/abs/2606.21994)

---

[[opd/data-selection/|返回 OPD 数据筛选专题]]

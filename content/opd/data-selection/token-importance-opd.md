---
title: "TIP：按 Entropy 与 Divergence 选择 OPD Token"
created: 2026-08-17
published: 2026-08-17
modified: 2026-08-17
type: paper
tags: [paper, OPD, data-selection, token-selection, entropy, divergence]
source_url: https://arxiv.org/abs/2604.14084
---

> [!summary] 解读结论
> TIP 用学生 entropy 与 teacher-student divergence 定位 token：高熵位置和低熵但高分歧的“过度自信错误”都可能有学习信号。它是 token selection 的重要基线，但后续工作指出，高分歧 token 仍需区分是否与关键推理证据相关、以及教师修正是否在学生可达 support 内。

## 基本信息

- **论文**：[TIP: Token Importance in On-Policy Distillation](https://arxiv.org/abs/2604.14084)
- **arXiv**：2604.14084，2026-04-15 预印本。
- **当前专题关系**：直接覆盖 token 级选择 / 重加权（D），数据筛选专项分为 **1/4**。

## Motivation

全 token OPD 将大量师生都自信且一致的位置与真正有决策或纠错价值的位置等量处理。只按 entropy 选择会遗漏学生低熵但明显偏离教师的 overconfident errors；只按 divergence 又会混入不受置信结构约束的位置。

## Method

令学生归一化 entropy 为 \(\hat h_t\)，师生 divergence 为 \(\hat\delta_t\)。TIP 的 Soft-OR score 是：

\[
s_t=\hat h_t+\hat\delta_t-\hat h_t\hat\delta_t.
\]

选择 score 最高的比例 \(\rho\) token，并只在这些位置施加 reverse-KL OPD loss。论文还将 token 分为四象限：高熵/高差异、高熵/低差异、低熵/高差异、低熵/低差异；后者通常被视为低价值。

## Experimental Setup

- **模型**：Qwen3-8B(GRPO) → 4B、Llama-3.3-70B → 8B、Qwen2.5-14B → 1.5B；另有 Qwen3 teacher/student 的 agentic DeepPlanning。
- **任务**：MATH-500、AIME24/25 与 DeepPlanning。
- **比较**：全 token OPD、entropy-only、Soft-OR、Q3-only、divergence-only。

## Results

| 设置                                   | 全 token OPD | TIP 选择 | 原文支持的结论                              |
| -------------------------------------- | -----------: | -------: | ------------------------------------------- |
| Qwen3，MATH-500，50% entropy retention |         76.7 |     78.6 | 保留一半高熵 token 可提高结果。             |
| Qwen3，MATH-500，Soft-OR 50%           |     76.7±0.7 | 79.1±0.8 | Soft-OR 高于 entropy-only 50% 的 78.6±0.6。 |
| Llama，AIME25，Soft-OR 50%             |      4.9±0.9 | 11.5±1.1 | 该设置中有明显提升。                        |
| Qwen3 peak memory，50% retention       |       72.0GB |   38.1GB | 报告约 47% 峰值显存下降。                   |

## Ablation / Robustness

- Soft-OR top-50% 明显优于 bottom-50%：Qwen3 MATH-500 为 79.1 vs. 72.3。
- 在匹配的 10% 预算，divergence-only 低于 Q3-only（74.3 vs. 76.1）；说明“低 entropy”这一条件对其方法重要。
- Q3-only 少于 10% token 时接近全 token baseline；在 DeepPlanning 某些设置中 Q3-only 20% 超过 full OPD。

## Sensitivity / Boundary Conditions

- retention ratio 太低会降低效果；论文给出的最佳比例依赖模型与任务。
- 教师 entropy 在其测试中变化很小，论文主要依赖 student entropy。

## Limitations

- 最大教师为 70B、rollout 不超过 16K；更大模型和更长 agent rollout 未验证。
- 低熵、高 divergence token 并不必然可训练：[[opd/data-selection/token-teachability-opd|TA-OPD]] 以 support compatibility 进一步区分；[[opd/data-selection/finding-decision-supporting-tokens|DEAR]] 以 decision-related evidence 进一步过滤。

## Takeaways

TIP 在机制榜中命中 D：它建立了 entropy + divergence 的 token selection 基线，但不能将“高 divergence”直接等同于“必然值得训练”。

## Citation

> _TIP: Token Importance in On-Policy Distillation_. arXiv:2604.14084, 2026. [原文](https://arxiv.org/abs/2604.14084)

---

[[opd/data-selection/|返回 OPD 数据筛选专题]]

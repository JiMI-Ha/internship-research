---
title: "TA-OPD：只监督可教的 Teacher-Student Token 分歧"
created: 2026-08-17
published: 2026-08-17
modified: 2026-08-17
type: paper
tags: [paper, OPD, data-selection, token-selection, teachability, support-compatibility]
source_url: https://arxiv.org/abs/2605.26844
---

> [!summary] 解读结论
> TA-OPD 的核心不是“差异越大越值得训练”，而是教师的修正概率质量是否落在学生当前 top-k support 内。它用“局部分歧 × support compatibility”定义 teachability；在论文设置中，低熵高 KL 但不可教的 token 训练后可能有负收益。

## 基本信息

- **论文**：[Not All Disagreement Is Learnable: Token Teachability in On-Policy Distillation](https://arxiv.org/abs/2605.26844)
- **arXiv**：2605.26844，2026-05-26 预印本。
- **当前专题关系**：直接覆盖 token 级选择 / 重加权（D），数据筛选专项分为 **1/4**。

## Motivation

raw KL disagreement 将“教师能通过当前学生支持纠正的分歧”和“教师偏好完全落在学生当前不可达 token 外的分歧”混为一类。两者 KL 可以相近，但单步训练可带来的改进不同；因此 token selection 需要刻画可吸收性，而不只看 entropy 或 divergence。

## Method

对固定 student-generated context：

1. 在 teacher/student top-k union 上计算局部分歧 \(\tilde D_t\)。
2. 计算 compatibility mass \(\tilde C_t\)：教师分布落在学生 top-k support 内的概率质量。
3. 定义 teachability score：

   \[
   s_t^{teach}=\tilde D_t\cdot\tilde C_t.
   \]

4. 对每个 batch 以 5th/95th percentile 做稳健归一化，保留 score 最高的 token position 并施加 OPD loss。

论文还以固定 context 下训练前后的 KL 减少，验证分数是否预测局部可学习性。

## Experimental Setup

- **模型**：Qwen3-4B → 1.7B、Qwen3-8B(GRPO) → 4B、Qwen3-14B → 4B、DeepSeek-R1-Distill-Qwen-14B → Qwen2.5-3B。
- **数据 / 评测**：DAPO prompts；AIME24/25、GPQA-Diamond、HumanEval、IFEval、MATH-500；5 seeds。
- **比较**：全 token OPD、entropy、raw divergence、TIP Soft-OR、compatibility-only，在相同 token budget 下比较。

## Results

| 设置 / 预算                    |                       对照 |               TA-OPD | 原文支持的结论                                 |
| ------------------------------ | -------------------------: | -------------------: | ---------------------------------------------- |
| Qwen3-4B → 1.7B，10%           |  full OPD 42.37；TIP 43.05 |                44.89 | 在该组的平均最好。                             |
| 四组 teacher/student pair，10% | 各 matched-budget baseline |        TA-OPD 均最好 | 论文报告四组均优于 entropy、KL、TIP 等选择器。 |
| Qwen3-8B(GRPO) → 4B，5%        |       full / 10% OPD 53.71 | TA-OPD+Entropy 57.89 | 更少 supervision token 并非必然更差。          |
| 固定 context KL reduction，5%  |      TIP 0.50；raw KL 0.69 |                 0.95 | teachability 更符合局部学习收益。              |

## Ablation / Robustness

- 在 TIP 的低熵高 KL（Q3）区域，按 learnable disagreement 高低切分：高 \(D^L\) 的 live gain 为 +0.015，低 \(D^L\) 为 −0.010。
- Q3-only 平均为 52.46，低于 raw KL 的 53.76；TA-OPD 为 54.65，也高于 compatibility-only 的 54.19。
- 这支持“分歧大小”和“support compatibility”都不足以单独定义可教性。

## Sensitivity / Boundary Conditions

- token budget 只减少监督位置，不保证 rollout 或 teacher forward 的 wall-clock 同比例下降。
- 计算需要 teacher/student top-k distributions；top-k 与归一化分位数是实现选择。

## Limitations

- 以数学 prompt 和 Qwen family 为主，只含一个 cross-backbone 设置。
- 未验证多语言、对话、code-specialized teacher 或长 agent trajectory。
- fixed-context KL reduction 是局部诊断，仍需要下游评测来支持部署结论。

## Takeaways

TA-OPD 在机制榜中命中 D：它提供的是 token **可教性**选择，不能被替换成“选择最大 KL token”。它与 [[opd/data-selection/finding-decision-supporting-tokens|DEAR]] 的 decision/evidence 相关性是互补但不同的约束。

## Citation

> _Not All Disagreement Is Learnable: Token Teachability in On-Policy Distillation_. arXiv:2605.26844, 2026. [原文](https://arxiv.org/abs/2605.26844)

---

[[opd/data-selection/|返回 OPD 数据筛选专题]]

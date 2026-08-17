---
title: "DEAR：发现支持关键决策的 OPD Evidence Token"
created: 2026-08-17
published: 2026-08-17
modified: 2026-08-17
type: paper
tags: [paper, OPD, data-selection, token-selection, reasoning, hidden-states]
source_url: https://arxiv.org/abs/2606.22830
---

> [!summary] 解读结论
> DEAR 将高熵 token 视为 reasoning decision，再从低熵位置中找与 decision hidden state 相似、且师生存在知识差距的 evidence token。它反对直接按 divergence magnitude 选择所有高差异 token，因为 error accumulation 和风格差异也会产生高 divergence。

## 基本信息

- **论文**：[Finding the Evidence: Discovering Decision-Supporting Tokens for On-Policy Reasoning Distillation](https://arxiv.org/abs/2606.22830)
- **arXiv**：2606.22830，2026-06-22 预印本。
- **当前专题关系**：直接覆盖 token 级选择 / 重加权（D），数据筛选专项分为 **1/4**。

## Motivation

仅保留高 entropy token 可覆盖 reasoning 的“决策骨架”，但会遗漏学生自信却在中间推理内容上错误的 evidence token。DEAR 的分析显示，divergence 单独选择也会引入噪声，因为累积错误或风格不同同样可以造成高差异、却不直接支撑任何关键 decision。

## Method

1. 将学生 entropy 位于前 \(p\%\) 的位置作为 decision set \(D\)。
2. 对每个非 decision token \(j\)，计算它与最近 decision anchor 的最后层 hidden-state cosine similarity：

   \[
   a_j=\max_{i\in D}\frac{h_i^L\cdot h_j^L}{\|h_i^L\|\|h_j^L\|}.
   \]

3. 以归一化 relevance 和 divergence 给 evidence 打分：

   \[
   s_j=\hat a_j(1+\hat\delta_j).
   \]

4. 保留全部 decision token 和 evidence score 前 \(q\) 的 token；默认 \(p=q=0.2\)，实际保留约 36% token。

## Experimental Setup

- **模型**：Qwen2.5-1.5B ← Qwen2.5-14B、Qwen2.5-1.5B ← Qwen3-4B、Qwen3-1.7B ← Qwen3-4B。
- **任务**：数学 MATH-500、Minerva、AMC23、OlympiadBench、AIME24/25；代码 MBPP+、HumanEval、APPS。
- **比较**：离线 KD、标准全 token OPD、仅 decision 的 entropy-selective OPD。

## Results

| 设置                               |                 OPD |       DEAR | 原文支持的结论                |
| ---------------------------------- | ------------------: | ---------: | ----------------------------- |
| Qwen2.5-1.5B ← Qwen2.5-14B，AIME24 |                2.08 |       4.58 | 增加 2.50pp。                 |
| Qwen2.5-1.5B ← Qwen3-4B，AIME25    |                1.25 |       3.33 | 增加 2.08pp。                 |
| 代码 MBPP+                         |               51.31 |      57.05 | 增加 5.74pp。                 |
| token gradient mass coverage       | decision-only 39.1% | DEAR 75.8% | evidence stage 显著增加覆盖。 |

## Ablation / Robustness

- 移除 evidence stage 后退化为 decision-only，其表现接近标准 OPD；完整 DEAR 在三组设置中持续增加收益。
- relevance-only 与 gap-only 都低于完整机制；gap-only 在 AIME24 为 1.67，明显低于完整 DEAR 的 4.58。
- \(p\) 在 0.2–0.6 相对稳定；\(q=0.2\) 最好，0.8 会变差。

## Sensitivity / Boundary Conditions

- 需要访问学生 hidden states，增加显存与实现复杂度。
- decision/evidence 的定义依赖 entropy 和 hidden-state 相似度启发式，并非经过因果干预验证的事实分类。

## Limitations

- 只在数学和代码验证，常识、科学问答和 agent 任务未验证。
- 固定 \(p,q\) 没有自适应 schedule。
- 它不等同于 [[opd/data-selection/token-teachability-opd|TA-OPD]] 的 support compatibility：同一高差异 token 是否既相关又可教仍是开放问题。

## Takeaways

DEAR 在机制榜中命中 D：它补足“高 entropy token”之外的推理证据，但不应被简化为直接选择最高 divergence token。

## Citation

> _Finding the Evidence: Discovering Decision-Supporting Tokens for On-Policy Reasoning Distillation_. arXiv:2606.22830, 2026. [原文](https://arxiv.org/abs/2606.22830)

---

[[opd/data-selection/|返回 OPD 数据筛选专题]]

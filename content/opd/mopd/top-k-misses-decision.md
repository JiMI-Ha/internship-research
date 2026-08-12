---
title: "When Top-K Misses the Decision：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2607.07050
---

> [!summary] 解读结论
> 选择 Top-k 时要审计决策 token 是否在 support 中，不能只看 retained probability mass。

## 基本信息

- **论文**：[When Top-K Misses the Decision](https://arxiv.org/abs/2607.07050)
- **arXiv**：2607.07050
- **分类**：直接方法、改进与诊断
- **在 MOPD 图谱中的位置**：MOPD 失效诊断：证明高概率质量覆盖不等于关键行为分支被覆盖。
- **证据口径**：方法或机制级证据；优先读取论文中的对照、消融与失败案例。

## Motivation

Top-$k$ 保留几乎全部教师概率质量，并不代表保留了决定“调用工具还是直接回答”的低概率分支 token；遗漏后，一个教师能推动进入工具模式，另一个教师却无法提供反向梯度。

**解读**：作者真正关注的是多教师能力整合中的具体瓶颈，而不是简单地把更多训练数据混在一起。

## Method

在 Qwen3.5-9B 与 Llama-3.1-8B 上审计 teacher support，做 matched restoration、非工具 placebo 与 teacher/student Top-$k$ support union 干预，追踪行为切换 token 与最终误调用的因果关系。

**关键机制**：关键机制可以概括为：MOPD 失效诊断：证明高概率质量覆盖不等于关键行为分支被覆盖。

## Experimental Setup

在 Qwen3.5-9B 与 Llama-3.1-8B 的工具调用任务中，审计教师 Top-32 support，并进行 matched restoration、非工具 placebo 与 teacher/student support union 干预。

## Results

response 教师 Top-32 保留 99.99% 概率质量，却仅在 0.4% prompt 中包含 `<tool_call>`；support union 将 over-call 从 14.2%±2.1% 降到 7.4%±0.6%，但 call recall 从 91.5%±1.7% 降至 87.0%±2.0%，说明修复 support 也存在 restraint-capability trade-off。

**结果怎么读**：选择 Top-k 时要审计决策 token 是否在 support 中，不能只看 retained probability mass。

## Limitations

主要因果实验围绕工具调用 token；support union 降低误调用的同时损失 recall，说明修复不是免费午餐，也未给出适用于所有行为切换的统一 k。

## Takeaways

选择 Top-k 时要审计决策 token 是否在 support 中，不能只看 retained probability mass。

## Citation

> When Top-K Misses the Decision. arXiv:2607.07050. [原文](https://arxiv.org/abs/2607.07050)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

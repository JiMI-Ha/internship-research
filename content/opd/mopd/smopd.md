---
title: "SMOPD：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2608.03092
---

> [!summary] 解读结论
> 当一个统一 reward 归一化仍压制稀疏目标时，可以先让专项教师学到各自峰值，再在学生状态上合版。

## 基本信息

- **论文**：[SMOPD](https://arxiv.org/abs/2608.03092)
- **arXiv**：2608.03092
- **分类**：直接方法、改进与诊断
- **在 MOPD 图谱中的位置**：多奖励合版：先训练不同 reward-priority 教师，再用分布混合与 sequence anchor 整合。
- **证据口径**：方法或机制级证据；优先读取论文中的对照、消融与失败案例。

## Motivation

GDPO 虽逐 reward 归一化，仍无法同时处理密集与稀疏信号；把稀疏 reward 权重调高会学会格式，却牺牲准确率。

**解读**：作者真正关注的是多教师能力整合中的具体瓶颈，而不是简单地把更多训练数据混在一起。

## Method

第一阶段用不同 reward-priority profile 训练 accuracy、format 或 helpful/harmless 专项教师；第二阶段在学生 prefix 上混合教师 Top-$k$ 分布，以 forward KL 蒸馏，并用 balanced GDPO sequence anchor 防止偏离整体任务。

**关键机制**：关键机制可以概括为：多奖励合版：先训练不同 reward-priority 教师，再用分布混合与 sequence anchor 整合。

## Experimental Setup

在 Qwen2.5-1.5B、3B、7B 的工具任务和 helpful-harmless 设置中，对比 GDPO 与 SMOPD，重点测 format compliance、准确性和综合分。

## Results

在 Qwen2.5-1.5B 工具任务中，SMOPD format compliance 为 97.5%、综合分 87.1，对照 GDPO 为 8.8%/83.6；在 1.5B、3B、7B 及 helpful-harmless 设置中均优于 GDPO。证据仍局限于两类双 reward 结构。

**结果怎么读**：当一个统一 reward 归一化仍压制稀疏目标时，可以先让专项教师学到各自峰值，再在学生状态上合版。

## Limitations

实验主要是两类双 reward 结构，尚未证明教师数和目标冲突继续扩大时仍能稳定；forward KL 的 support 覆盖也带来额外计算。

## Takeaways

当一个统一 reward 归一化仍压制稀疏目标时，可以先让专项教师学到各自峰值，再在学生状态上合版。

## Citation

> SMOPD. arXiv:2608.03092. [原文](https://arxiv.org/abs/2608.03092)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

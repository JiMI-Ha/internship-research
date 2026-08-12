---
title: "Solar Open 2：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2607.20062
---

> [!summary] 解读结论
> 这篇最值得读的是 250B、12 教师下的 serving 与异步工程，而不是把最终模型排名当作纯方法对照。

## 基本信息

- **论文**：[Solar Open 2](https://arxiv.org/abs/2607.20062)
- **arXiv**：2607.20062
- **分类**：工业模型与技术报告
- **在 MOPD 图谱中的位置**：250B 工业扩展：12 个 agent scenario 教师的全词表异步 MOPD。
- **证据口径**：系统级证据；若缺少独立开关消融，不把最终模型总成绩全部归因给 MOPD。

## Motivation

12 个 agent scenario 的专项教师需要合并到一个 250B 模型；离线教师 trace 会产生 exposure bias，而 full-vocabulary MOPD 在该规模又有服务成本。

**解读**：这里的 MOPD 是完整后训练系统中的能力汇合步骤；要把“最终模型很强”和“MOPD 单独有效”分开阅读。

## Method

每个 prompt 固定路由一个教师，在学生 rollout 上计算全词表 reverse-KL；用完全异步基础设施、teacher batching、通信与内存优化扩展到 12 教师和 250B。

**关键机制**：阅读重点是教师从哪里来、prompt 怎样路由、学生在哪些 prefix 上得到监督，以及系统如何承担多教师 serving 成本。

## Experimental Setup

每个 prompt 固定路由一个教师，使用完全异步基础设施、teacher batching、通信与显存优化；最终在 MMLU-Pro、LiveCodeBench、APEX-Agents 等评测上报告统一模型。

## Results

最终 Solar Open 2 在 MMLU-Pro、LiveCodeBench 与 APEX-Agents 等评测上领先同量级开放模型，训练 KL 稳定下降且 entropy 未坍缩；但报告没有 MOPD 开关消融，系统总成绩不能作为独立因果证据。

**结果怎么读**：这篇最值得读的是 250B、12 教师下的 serving 与异步工程，而不是把最终模型排名当作纯方法对照。

## Limitations

没有 MOPD 开关消融；稳定 KL 和 entropy 只能说明训练未明显坍缩，不能证明所有最终 benchmark 提升都来自蒸馏。

## Takeaways

这篇最值得读的是 250B、12 教师下的 serving 与异步工程，而不是把最终模型排名当作纯方法对照。

## Citation

> Solar Open 2. arXiv:2607.20062. [原文](https://arxiv.org/abs/2607.20062)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

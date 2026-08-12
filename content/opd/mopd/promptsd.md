---
title: "PROMPTSD：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2607.18293
---

> [!summary] 解读结论
> 多教师不一定要复制多套完整模型；冻结同一骨干、只训练任务 prompt，可以主动控制 teacher-student drift。

## 基本信息

- **论文**：[PROMPTSD](https://arxiv.org/abs/2607.18293)
- **arXiv**：2607.18293
- **分类**：直接方法、改进与诊断
- **在 MOPD 图谱中的位置**：教师构造改进：用同一冻结 backbone 上的 task soft prompt 生成兼容的多任务教师。
- **证据口径**：方法或机制级证据；优先读取论文中的对照、消融与失败案例。

## Motivation

全参或 LoRA 教师会相对学生产生 weight drift；把 gold answer 作为 privileged context 又可能诱发 post-hoc rationalization。多任务时需要既有新知识、又与学生表示几何一致的教师。

**解读**：作者真正关注的是多教师能力整合中的具体瓶颈，而不是简单地把更多训练数据混在一起。

## Method

冻结同一 backbone，只为每个任务训练 soft prompt；按任务把 merged corpus 路由到对应 prompt teacher，学生做 reverse-KL on-policy distillation，推理时丢弃所有 prompt。

**关键机制**：关键机制可以概括为：教师构造改进：用同一冻结 backbone 上的 task soft prompt 生成兼容的多任务教师。

## Experimental Setup

以 Qwen3-1.7B 为统一学生，在 Science、Tool、Biology、Math 四类任务上比较 soft-prompt 教师、单任务 OPD 与多任务蒸馏，并检查通用 benchmark 是否回退。

## Results

Qwen3-1.7B 四任务平均 56.2，最强单任务 OPD(PT) 为 53.9；Math 为 67.2 vs. 51.0。它同时保持通用 benchmark，但 Science/Tool/Biology/Math 四任务规模有限，尚不能证明任意任务组合都成立。

**结果怎么读**：多教师不一定要复制多套完整模型；冻结同一骨干、只训练任务 prompt，可以主动控制 teacher-student drift。

## Limitations

任务数与学生规模有限；soft prompt 能维持骨干几何一致，但容量也可能不足以承载需要大幅参数改写的新知识。

## Takeaways

多教师不一定要复制多套完整模型；冻结同一骨干、只训练任务 prompt，可以主动控制 teacher-student drift。

## Citation

> PROMPTSD. arXiv:2607.18293. [原文](https://arxiv.org/abs/2607.18293)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

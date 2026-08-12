---
title: "H-OPD: Heterogeneous Multi-Teacher Multimodal OPD：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2607.02592
---

> [!summary] 解读结论
> 当教师能力互补时，prompt 级固定路由过粗；同一轨迹内按 token 仲裁可以让感知与逻辑教师分别发挥作用。

## 基本信息

- **论文**：[H-OPD: Heterogeneous Multi-Teacher Multimodal OPD](https://arxiv.org/abs/2607.02592)
- **arXiv**：2607.02592
- **分类**：直接方法、改进与诊断
- **在 MOPD 图谱中的位置**：异构多模态 MOPD：让视觉语言教师与纯文本教师在 token 级动态分工。
- **证据口径**：方法或机制级证据；优先读取论文中的对照、消融与失败案例。

## Motivation

多模态推理中，VL 教师更擅长感知，纯文本教师可能更擅长逻辑；按样本固定选一个教师会浪费同一条轨迹上不同 token 所需的互补能力。

**解读**：作者真正关注的是多教师能力整合中的具体瓶颈，而不是简单地把更多训练数据混在一起。

## Method

把视觉内容转成文本描述供文本教师访问，并在同一 student trajectory 上按教师置信度做 token 级动态仲裁；监督 support 使用教师 Top-$k$ 的 union 控制成本。

**关键机制**：关键机制可以概括为：异构多模态 MOPD：让视觉语言教师与纯文本教师在 token 级动态分工。

## Experimental Setup

以 Qwen3-VL-2B 和 4B 为学生，在多模态 reasoning benchmarks 上比较单 VL 教师 OPD、ExOPD 与异构教师动态仲裁；文本教师通过视觉内容的文字描述访问任务。

## Results

Qwen3-VL-2B 学生上平均分 53.6，单 VL 教师 OPD/ExOPD 为 51.1/51.3；4B 学生平均分从 59.1 提至 61.7。结果表明异构教师可以互补，但验证集中在论文选取的多模态 reasoning benchmarks。

**结果怎么读**：当教师能力互补时，prompt 级固定路由过粗；同一轨迹内按 token 仲裁可以让感知与逻辑教师分别发挥作用。

## Limitations

视觉转文字可能丢失细粒度感知信息，置信度也不等价于正确性；实验集中在选定的多模态推理集，尚未覆盖开放式视觉生成或复杂 agent 环境。

## Takeaways

当教师能力互补时，prompt 级固定路由过粗；同一轨迹内按 token 仲裁可以让感知与逻辑教师分别发挥作用。

## Citation

> H-OPD: Heterogeneous Multi-Teacher Multimodal OPD. arXiv:2607.02592. [原文](https://arxiv.org/abs/2607.02592)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

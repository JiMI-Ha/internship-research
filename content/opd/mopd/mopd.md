---
title: "MOPD: Multi-Teacher On-Policy Distillation：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2606.30406
---

> [!summary] 解读结论
> MOPD 的关键不是找绝对最强教师，而是让教师在学生实际访问的 prefix 上提供既有增量、又可吸收的监督。

## 基本信息

- **论文**：[MOPD: Multi-Teacher On-Policy Distillation](https://arxiv.org/abs/2606.30406)
- **arXiv**：2606.30406
- **分类**：直接方法、改进与诊断
- **在 MOPD 图谱中的位置**：MOPD 主方法：系统定义多教师 on-policy 能力整合，并比较 sampled-token 与 teacher Top-k 两种实现。
- **证据口径**：方法或机制级证据；优先读取论文中的对照、消融与失败案例。

## Motivation

Mixed-RL 信号稀疏且领域耦合，Off-policy Finetune 有 exposure bias，参数合并又容易干涉；目标是并行开发专家后再统一吸收。

**解读**：作者真正关注的是多教师能力整合中的具体瓶颈，而不是简单地把更多训练数据混在一起。

## Method

学生在混合 prompt 上 rollout，每个样本路由到对应同源 RL 教师，在学生访问的 prefix 上最小化 reverse KL。论文给出 sampled-token policy-gradient 和带偏差修正的 teacher Top-$k$ 两种实现。

**关键机制**：关键机制可以概括为：MOPD 主方法：系统定义多教师 on-policy 能力整合，并比较 sampled-token 与 teacher Top-k 两种实现。

## Experimental Setup

主实验以 Qwen3-30B-A3B 为学生，从同一底座训练数学、代码和指令遵循教师；对比 Mix-RL、Off-policy Finetune、Task Arithmetic、TIES 等路线，并额外替换成更强但异源的 Qwen3-235B 教师检查兼容性。

## Results

Qwen3-30B-A3B 上归一化分数 0.9373，Mix-RL 为 0.8818；三个领域关闭 91%–95% teacher headroom。同源教师初始 KL 约 0.04；换成更强但异源的 Qwen3-235B 后约 0.19，Top-$k$ 约第 18 步崩溃，是“同源性比教师绝对强度更重要”的直接证据。

**结果怎么读**：MOPD 的关键不是找绝对最强教师，而是让教师在学生实际访问的 prefix 上提供既有增量、又可吸收的监督。

## Limitations

最强证据建立在同源教师、已知任务路由与有限领域数上；Top-k 近似还会遗漏低概率决策 token。论文证明了这一 recipe 在所测设置有效，但没有解决未知任务路由和完全冲突目标。

## Takeaways

MOPD 的关键不是找绝对最强教师，而是让教师在学生实际访问的 prefix 上提供既有增量、又可吸收的监督。

## Citation

> MOPD: Multi-Teacher On-Policy Distillation. arXiv:2606.30406. [原文](https://arxiv.org/abs/2606.30406)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

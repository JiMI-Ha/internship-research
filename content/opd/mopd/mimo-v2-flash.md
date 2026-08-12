---
title: "MiMo-V2-Flash Technical Report：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2601.02780
---

> [!summary] 解读结论
> 大规模 MOPD 可以让一个学生接近多个专项教师，但“多数能力接近”比“所有能力无损继承”更符合证据。

## 基本信息

- **论文**：[MiMo-V2-Flash Technical Report](https://arxiv.org/abs/2601.02780)
- **arXiv**：2601.02780
- **分类**：直接方法、改进与诊断
- **在 MOPD 图谱中的位置**：工业公开起点：用多领域 RL 专家合版统一模型，并加入 ORM 与迭代式 co-evolution。
- **证据口径**：方法或机制级证据；优先读取论文中的对照、消融与失败案例。

## Motivation

Mixed-RL 中不同领域的奖励密度、难度和训练预算互相牵制；分别训练专家虽然能达到更高峰值，却缺少可靠的统一部署手段。

**解读**：作者真正关注的是多教师能力整合中的具体瓶颈，而不是简单地把更多训练数据混在一起。

## Method

从统一 SFT 学生分叉训练数学、代码、IF、SWE、Tool Use 等教师；学生生成 on-policy rollout，路由教师给出 token 级 log-ratio advantage，并可叠加 ORM advantage。蒸馏后的学生还能再次分叉为更强教师，形成 co-evolution。

**关键机制**：关键机制可以概括为：工业公开起点：用多领域 RL 专家合版统一模型，并加入 ORM 与迭代式 co-evolution。

## Experimental Setup

核心对象是 309B 总参数、15B active 的 MiMo-V2-Flash。论文把数学、代码、指令遵循、SWE 与工具调用等专项教师合入统一学生，并在 AIME25、HMMT25、LiveCodeBench、IFBench、SWE-bench Verified 与工具基准上对照各自教师。

## Results

309B 总参数、15B active 的 MiMo-V2-Flash 上，MOPD 相对对应教师在 AIME25/HMMT25/LCB/$\tau^2$-Bench/$\tau^2$-Telecom 分别为 +0.2/+1.8/+0.6/+0.7/+0.3，但 IFBench 和 SWE-bench Verified 仍低 2.2、0.8 点；因此是“多数能力接近或超过教师”，不是完全无损继承。

**结果怎么读**：大规模 MOPD 可以让一个学生接近多个专项教师，但“多数能力接近”比“所有能力无损继承”更符合证据。

## Limitations

它是完整技术报告而非只研究 MOPD 的受控实验；ORM、教师质量、第二轮 co-evolution 与蒸馏本身共同作用，不能把全部最终增益只归因于 MOPD。IFBench 与 SWE-bench Verified 仍低于教师，也说明合版不是无损复制。

## Takeaways

大规模 MOPD 可以让一个学生接近多个专项教师，但“多数能力接近”比“所有能力无损继承”更符合证据。

## Citation

> MiMo-V2-Flash Technical Report. arXiv:2601.02780. [原文](https://arxiv.org/abs/2601.02780)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

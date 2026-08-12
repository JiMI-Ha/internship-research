---
title: "KAT-Coder-V2.5：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2607.05471
---

> [!summary] 解读结论
> 长轨迹里前缀漂移会逐步放大；在不可信后段继续强行对齐，可能比主动截断更伤模型。

## 基本信息

- **论文**：[KAT-Coder-V2.5](https://arxiv.org/abs/2607.05471)
- **arXiv**：2607.05471
- **分类**：工业模型与技术报告
- **在 MOPD 图谱中的位置**：长轨迹代码应用：加入 off-policy cold start、drift truncation 和长度分层 batch。
- **证据口径**：系统级证据；若缺少独立开关消融，不把最终模型总成绩全部归因给 MOPD。

## Motivation

仓库级 SWE 和长程 agent trajectory 会让 student prefix 逐步偏离教师训练分布，纯 on-policy KL 在长上下文后段可能不可靠。

**解读**：这里的 MOPD 是完整后训练系统中的能力汇合步骤；要把“最终模型很强”和“MOPD 单独有效”分开阅读。

## Method

五个专家按领域路由 reverse-KL；先用专家轨迹做 off-policy cold start，再根据 teacher-student drift 动态截断梯度，并按长度分层 batch 保住长样本比例。

**关键机制**：阅读重点是教师从哪里来、prompt 怎样路由、学生在哪些 prefix 上得到监督，以及系统如何承担多教师 serving 成本。

## Experimental Setup

五类代码/agent 专家合入统一学生，重点覆盖 repository SWE、PinchBench 与长上下文工具使用；训练中按 teacher-student drift 截断后段梯度。

## Results

最终模型在 PinchBench 获得论文所列最佳 agentic tool-use 结果，并在 repository SWE 上仅次于 Opus 4.8；但报告没有提供完整 no-MOPD 对照，无法把最终名次只归因于 cold start、drift truncation 或 MOPD。

**结果怎么读**：长轨迹里前缀漂移会逐步放大；在不可信后段继续强行对齐，可能比主动截断更伤模型。

## Limitations

最终报告没有完整 no-MOPD 对照，也未分别隔离 cold start、截断与长度采样的贡献；榜单名次不能当作每个组件的因果效果。

## Takeaways

长轨迹里前缀漂移会逐步放大；在不可信后段继续强行对齐，可能比主动截断更伤模型。

## Citation

> KAT-Coder-V2.5. arXiv:2607.05471. [原文](https://arxiv.org/abs/2607.05471)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

---
title: "Motif 3：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2608.09119
---

> [!summary] 解读结论
> 工业合版不只要保能力，还要保护推理栈契约；冻结 router/MTP 是稳定性选择，不代表全参更新一定更差。

## 基本信息

- **论文**：[Motif 3](https://arxiv.org/abs/2608.09119)
- **arXiv**：2608.09119
- **分类**：工业模型与技术报告
- **在 MOPD 图谱中的位置**：MoE 工业应用：七教师合版，同时冻结 router、expert-selection bias 与 MTP。
- **证据口径**：系统级证据；若缺少独立开关消融，不把最终模型总成绩全部归因给 MOPD。

## Motivation

reasoning、coding、tool use、专业工作、长上下文、拒答校准和 IF 的专项优化需要统一，同时不能破坏 MoE router 与 MTP speculative decoding。

**解读**：这里的 MOPD 是完整后训练系统中的能力汇合步骤；要把“最终模型很强”和“MOPD 单独有效”分开阅读。

## Method

从 general SFT 分叉六个 GRPO 教师和一个 SWE SFT 教师；学生按域 on-policy 蒸馏。教师训练和 MOPD 期间冻结 MTP、MoE router 与 expert-selection bias。

**关键机制**：阅读重点是教师从哪里来、prompt 怎样路由、学生在哪些 prefix 上得到监督，以及系统如何承担多教师 serving 成本。

## Experimental Setup

从 general SFT 分叉六个 GRPO 教师与一个 SWE SFT 教师，合入 314B/13.2B-active 学生；检查广泛 benchmark 与 MTP draft-token acceptance rate。

## Results

最终 314B/13.2B-active 模型在广泛评测上具有竞争力，且冻结的 MTP draft-token acceptance rate 未测到退化；没有 no-MOPD 组件对照，因此可靠结果主要是“七教师整合与固定路由/MTP 可以共同训练”。

**结果怎么读**：工业合版不只要保能力，还要保护推理栈契约；冻结 router/MTP 是稳定性选择，不代表全参更新一定更差。

## Limitations

没有 no-MOPD 组件对照；冻结关键模块保护了部署行为，但也限制了合版阶段重新分配专家路由的自由度。

## Takeaways

工业合版不只要保能力，还要保护推理栈契约；冻结 router/MTP 是稳定性选择，不代表全参更新一定更差。

## Citation

> Motif 3. arXiv:2608.09119. [原文](https://arxiv.org/abs/2608.09119)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

---
title: "Baichuan-M3：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2602.06570
---

> [!summary] 解读结论
> 三阶段 recipe 的价值在于先让学生进入可蒸馏区域，再用 on-policy 信号修正学生自己的错误状态。

## 基本信息

- **论文**：[Baichuan-M3](https://arxiv.org/abs/2602.06570)
- **arXiv**：2602.06570
- **分类**：工业模型与技术报告
- **在 MOPD 图谱中的位置**：医疗模型应用：Task-specific RL → Offline Distillation → MOPD 的三阶段能力整合。
- **证据口径**：系统级证据；若缺少独立开关消融，不把最终模型总成绩全部归因给 MOPD。

## Motivation

医疗问诊包含事实知识、长流程咨询和多个专项能力；直接多任务 RL 容易早期优化冲突，单纯离线模仿又无法修正学生自己的错误状态。

**解读**：这里的 MOPD 是完整后训练系统中的能力汇合步骤；要把“最终模型很强”和“MOPD 单独有效”分开阅读。

## Method

三阶段管线：Task-specific RL 训练专项教师；Offline Policy Distillation 先做冷启动压缩；最后在混合领域 rollout 上以 ground-truth task reward 加多教师 reverse-KL 做 MOPD，并允许循环迭代。

**关键机制**：阅读重点是教师从哪里来、prompt 怎样路由、学生在哪些 prefix 上得到监督，以及系统如何承担多教师 serving 成本。

## Experimental Setup

围绕医疗事实、长流程咨询与专项能力构造教师，在 HealthBench、HealthBench-Hallu、ScanBench 等医疗评测上报告最终模型结果。

## Results

最终模型在 HealthBench、HealthBench-Hallu 与 ScanBench 等医疗评测上取得强结果，但论文没有提供只开/关 MOPD 的完整组件消融；因此只能确认该三阶段 recipe 可运行，不能把全部医疗增益归因给 MOPD。

**结果怎么读**：三阶段 recipe 的价值在于先让学生进入可蒸馏区域，再用 on-policy 信号修正学生自己的错误状态。

## Limitations

没有只开/关 MOPD 的完整组件对照；医疗数据、专项 RL 和离线冷启动均参与结果，无法把最终医疗成绩全部归因给最后一阶段。

## Takeaways

三阶段 recipe 的价值在于先让学生进入可蒸馏区域，再用 on-policy 信号修正学生自己的错误状态。

## Citation

> Baichuan-M3. arXiv:2602.06570. [原文](https://arxiv.org/abs/2602.06570)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

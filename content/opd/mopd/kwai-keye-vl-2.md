---
title: "Kwai Keye-VL-2.0：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2606.10651
---

> [!summary] 解读结论
> 报告证明大规模跨模态教师路由可以进入统一后训练，但不能据此计算 MOPD 对最终榜单的净贡献。

## 基本信息

- **论文**：[Kwai Keye-VL-2.0](https://arxiv.org/abs/2606.10651)
- **arXiv**：2606.10651
- **分类**：工业模型与技术报告
- **在 MOPD 图谱中的位置**：跨模态工业应用：把 13 个文本、视觉、视频和工具教师合入统一 MoE。
- **证据口径**：系统级证据；若缺少独立开关消融，不把最终模型总成绩全部归因给 MOPD。

## Motivation

图像、长视频、纯文本 reasoning 与 agent tool-use 联合后训练会产生 multimodal alignment dilemma，例如 reasoning 变短或工具格式过度出现。

**解读**：这里的 MOPD 是完整后训练系统中的能力汇合步骤；要把“最终模型很强”和“MOPD 单独有效”分开阅读。

## Method

维护 13 个 RL 教师，覆盖 safety、文本数学、IF、code、视觉 STEM、OCR、grounding、counting、video 和 tool use；学生按模态/任务动态路由教师，以 on-policy token feedback 合并进 30B-A3B MoE。

**关键机制**：阅读重点是教师从哪里来、prompt 怎样路由、学生在哪些 prefix 上得到监督，以及系统如何承担多教师 serving 成本。

## Experimental Setup

30B-A3B MoE 学生接收 safety、数学、IF、code、视觉 STEM、OCR、grounding、counting、video 与 tool-use 等教师，最终在长视频、多模态 reasoning 和 agent 评测上测试。

## Results

最终模型在长视频与多模态 agent 评测上表现强，并保持通用 reasoning；报告没有把 Cross-Modal MOPD 从 Context-RL、Video-RL、DSA 和数据管线中独立消融，因而只能把它视为完整系统中的能力整合组件。

**结果怎么读**：报告证明大规模跨模态教师路由可以进入统一后训练，但不能据此计算 MOPD 对最终榜单的净贡献。

## Limitations

Cross-Modal MOPD 与 Context-RL、Video-RL、DSA 和数据管线没有被独立消融；13 个教师的路由元数据也不是所有开放任务都具备。

## Takeaways

报告证明大规模跨模态教师路由可以进入统一后训练，但不能据此计算 MOPD 对最终榜单的净贡献。

## Citation

> Kwai Keye-VL-2.0. arXiv:2606.10651. [原文](https://arxiv.org/abs/2606.10651)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

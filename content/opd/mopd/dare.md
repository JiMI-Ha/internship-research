---
title: "DARE：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2311.03099
---

> [!summary] 解读结论
> DARE 适合降低参数合并干涉和成本，但它解决的是权重冗余，不是 on-policy 能力迁移。

## 基本信息

- **论文**：[DARE](https://arxiv.org/abs/2311.03099)
- **arXiv**：2311.03099
- **分类**：OPD、模型合并与知识融合基础
- **在 MOPD 图谱中的位置**：参数稀疏化基础：随机丢弃并重缩放 fine-tuning delta，作为 merge 插件。
- **证据口径**：基础或邻近路线证据；用于解释 MOPD 的设计选择，不当作多教师合版的直接效果。

## Motivation

fine-tuning delta 高度冗余，直接叠加多个完整 delta 会增加干涉。

**解读**：这篇工作不一定直接采用多教师 OPD，但它解释了为什么某些 MOPD 设计成立，或提供了必须比较的替代路线。

## Method

随机丢弃大部分 delta 参数，再按 $1/(1-p)$ 重缩放，作为其他 merge 方法的稀疏化插件。

**关键机制**：与 MOPD 的连接点不在名称，而在它处理的是学生状态分布、教师行为分布，还是权重空间中的任务干涉。

## Experimental Setup

在多个同源模型上测试不同 delta 丢弃比例，再与其他 merge 方法组合，观察单任务能力和多模型合并表现。

## Results

论文报告可去掉 90% 甚至 99% delta 而基本保持单任务能力，并能合并多个同源模型；它极便宜，但成功依赖 homologous models，无法提供 MOPD 的在线纠错信号。

**结果怎么读**：DARE 适合降低参数合并干涉和成本，但它解决的是权重冗余，不是 on-policy 能力迁移。

## Limitations

高丢弃率有效依赖 delta 冗余与 homologous models；随机稀疏化没有教师反馈，无法发现学生行为层面的错误。

## Takeaways

DARE 适合降低参数合并干涉和成本，但它解决的是权重冗余，不是 on-policy 能力迁移。

## Citation

> DARE. arXiv:2311.03099. [原文](https://arxiv.org/abs/2311.03099)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

---
title: "TIDE: Mismatch Matters：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2608.09836
---

> [!summary] 解读结论
> 只监督学生采样 token 会同时漏掉教师想要但学生从不采的分支，也可能纵容教师近零概率的循环 token。

## 基本信息

- **论文**：[TIDE: Mismatch Matters](https://arxiv.org/abs/2608.09836)
- **arXiv**：2608.09836
- **分类**：OPD、模型合并与知识融合基础
- **在 MOPD 图谱中的位置**：OPD mismatch 诊断：同时处理 student-excess 与 student-deficit token。
- **证据口径**：基础或邻近路线证据；用于解释 MOPD 的设计选择，不当作多教师合版的直接效果。

## Motivation

学生可以靠重复循环获得局部 token agreement，却生成全局错误答案；仅监督采样 token 还会遗漏教师偏好但学生从不采样的 deficit token。

**解读**：这篇工作不一定直接采用多教师 OPD，但它解释了为什么某些 MOPD 设计成立，或提供了必须比较的替代路线。

## Method

区分 student-excess 与 student-deficit；用 bounded Hellinger shaping 抑制近零教师概率的 excess，并解析注入 teacher Top-$K$ 恢复 deficit mass。

**关键机制**：与 MOPD 的连接点不在名称，而在它处理的是学生状态分布、教师行为分布，还是权重空间中的任务干涉。

## Experimental Setup

在强 teacher-student mismatch 下比较普通 OPD、bounded Hellinger shaping 与 teacher Top-K 注入，测 Avg@8、响应长度和格式失败。

## Results

强 teacher-student mismatch 下 Avg@8 从 6.9% 提至 20.3%，平均响应长度缩短 3.6×并减少格式失败。虽然是单教师 OPD，机制直接适用于 MOPD 的 token support 诊断。

**结果怎么读**：只监督学生采样 token 会同时漏掉教师想要但学生从不采的分支，也可能纵容教师近零概率的循环 token。

## Limitations

是单教师实验，且解析注入 Top-K 会增加计算；不同任务下 excess/deficit 的最佳权重仍需调节。

## Takeaways

只监督学生采样 token 会同时漏掉教师想要但学生从不采的分支，也可能纵容教师近零概率的循环 token。

## Citation

> TIDE: Mismatch Matters. arXiv:2608.09836. [原文](https://arxiv.org/abs/2608.09836)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

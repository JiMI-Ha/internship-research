---
title: "[论文标题]"
created: YYYY-MM-DD
published: YYYY-MM-DD
modified: YYYY-MM-DD
type: paper
business_fit: 0 # 0 表示尚未评价；1–5 为星级
paper_solidity: 0 # 0 表示尚未评价；1–5 为星级
tags: [paper]
source_url: https://example.org/paper
---

> [!summary] 核心结论
> 用一到三句话说明：论文解决什么问题、核心机制是什么、证据支持到什么边界。不要把未验证的推断写成结果。

## 基本信息

- **论文**：[论文标题](https://example.org/paper)
- **作者**：
- **发表信息**：
- **代码 / 项目页**：如有
- **当前专题关系**：它为什么被放入当前 Topic；若跨多个 Topic，分别说明。

## Motivation

现有方法的具体不足是什么？该不足由何种证据、设置或假设构成？

## Method

说明核心目标、算法步骤、模型结构、关键公式和必要假设。把论文实际做了什么与作者的直觉解释区分开。

## Experimental Setup

- **模型 / 系统**：
- **数据 / 任务**：
- **对照方法**：
- **指标**：
- **训练和计算设置**：

## Results

| 指标 | 对照 | 方法 | 原文支持的结论 |
| ---- | ---: | ---: | -------------- |
|      |      |      |                |

只填写可以在原文中定位的数字和结论。若没有可比较的结果，说明原因。

## Ablation / Robustness

哪些组件、对照、替代解释、复现、统计检验或跨任务实验支持 / 削弱了主张？论文未提供时明确写“未报告”。

## Sensitivity / Boundary Conditions

方法对超参数、数据规模、模型规模、任务、分布、Reward 数量、训练阶段或成本是否敏感？安全 / 风险敏感性可在此补充，或另设专门小节。未报告不等于不敏感。

## Limitations

样本、实验范围、外推、计算成本、奖励设计、统计证据或潜在混杂有哪些限制？

## Takeaways

在当前 Topic 下，它解决了什么、没有解决什么、下一步值得与哪些工作比较或复现？

## Citation

```bibtex
@article{key,
  title={},
  author={},
  year={}
}
```

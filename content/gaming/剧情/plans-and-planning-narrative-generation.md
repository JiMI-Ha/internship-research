---
title: "Plans and Planning in Narrative Generation：规划式故事、叙述与交互生成综述"
created: 2026-08-16
published: 2026-08-16
modified: 2026-08-16
type: paper
business_fit: 5
paper_solidity: 4
specialty_score: 2
tags: [paper, gaming, narrative-planning, story-generation, interactive-narrative, survey]
source_url: https://doi.org/10.1016/j.cogsys.2012.08.004
---

> [!summary] 核心结论
> 该综述区分故事世界中的计划、生成者的计划和面向受众的叙述计划，说明为什么“生成合理事件”与“把它讲成可理解、可互动的故事”是不同问题。对动态剧本杀，它支持把真相层、事件层和表达层分离。

## 基本信息

- **论文**：[Plans and Planning in Narrative Generation: A Review of Plan-Based Approaches to the Generation of Story, Discourse and Interactivity in Narratives](https://doi.org/10.1016/j.cogsys.2012.08.004)
- **作者**：R. Michael Young 等
- **发表**：Cognitive Systems Research，2013
- **评分**：业务契合度 ★★★★★；Paper solid 度 ★★★★☆；专项分 **2/4**（动态叙事 / Drama Management、一致性与可解性）

## Motivation

规划在叙事生成中既可以表示角色为何行动，也可以表示系统如何选择事件和如何向受众讲述。若混淆这些层次，系统可能有逻辑正确的世界事件，却无法形成吸引人的叙述；或有漂亮文本，却无法解释角色为何如此行动。论文回顾不同计划概念在叙事中的作用。

## Method

综述从三个层面分类：

1. **Story planning**：用行动、目标和因果关系生成故事世界中的事件；
2. **Discourse planning**：决定事件以何种顺序、视角和信息量呈现给受众；
3. **Interactive planning**：面对用户 / 玩家行动时维持可达叙事目标，常涉及 replan、适应或 Drama Management。

同时讨论角色可信性、作者控制、意外事件和交互性之间的冲突。

## Experimental Setup

综述性工作，回顾计划式叙事系统的建模与实验。没有统一的新模型、数据集或数值主结果。

## Results

- 文献分析支持将故事（发生什么）、叙述（怎么告诉玩家）和交互控制（玩家改变什么后如何调整）明确分离。
- 规划能为故事事件提供可解释因果，但互动系统还必须处理玩家偏离、信息披露和受众理解。
- 对剧本杀而言，真凶和作案链属于 story plan；何时让玩家听到口供、发现证据属于 discourse plan；玩家提前质疑或破坏证据后的调整属于 interactive plan。

## Ablation

不适用：该论文不提出单一模型或消融实验。

## Limitations

- 早期规划研究通常未面对开放文本输入和 LLM 生成的不确定性。
- 完整的计划模型和作者目标需要较高的知识工程成本。
- 该框架分析交互与叙事的关系，但不提供直接的现代软件组件。

## Takeaways

将动态支线表示为经过审核的事件计划，而不是单段追加文本。每条支线应写明它改变的世界事实、可见信息、触发条件和结束条件；Narrator 只负责按当前玩家视角讲述。

## Citation

Young et al. _Plans and Planning in Narrative Generation: A Review of Plan-Based Approaches to the Generation of Story, Discourse and Interactivity in Narratives_. Cognitive Systems Research, 2013.

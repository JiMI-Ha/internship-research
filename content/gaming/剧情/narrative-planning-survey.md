---
title: "A Survey of Narrative Planning：叙事规划方法综述"
created: 2026-08-16
published: 2026-08-16
modified: 2026-08-16
type: paper
business_fit: 5
paper_solidity: 4
specialty_score: 2
tags: [paper, gaming, narrative-planning, interactive-narrative, survey]
source_url: https://people.ict.usc.edu/~michaelm/publications/Ware2019NarrativePlanningSurvey.pdf
---

> [!summary] 核心结论
> 叙事规划把故事视为角色目标、动作前置条件和因果结果构成的计划，并研究如何在故事连贯性与角色自主性之间取舍。它对“案件真相、动机、手段和线索如何形成可验证因果链”尤其重要。

## 基本信息

- **论文**：[A Survey of Narrative Planning](https://people.ict.usc.edu/~michaelm/publications/Ware2019NarrativePlanningSurvey.pdf)
- **作者**：Stephen G. Ware、Scott Robertson、R. Michael Young
- **发表**：AI Magazine，2019
- **评分**：业务契合度 ★★★★★；Paper solid 度 ★★★★☆；专项分 **2/4**（动态叙事 / Drama Management、一致性与可解性）

## Motivation

故事中的事件不能仅按语言流畅度排列，还必须满足角色意图、行动前提和因果解释。传统自动规划能达成全局目标，却可能让角色像被作者操控；完全由角色独立行动又可能无法形成目标故事。论文综述叙事规划如何在这两种要求间建模。

## Method

文中归纳的典型路线包括：

1. **计划式故事生成**：以初始世界、动作模式和目标构造因果计划；
2. **Intentional planning**：要求每个关键角色行动可由其意图解释，避免“作者强迫角色做事”；
3. **Partial-order / causal-link planning**：显式维护事件顺序、前置条件和因果链接；
4. **互动扩展**：将玩家动作纳入重规划、修复或 Drama Manager 干预；
5. **叙述层分离**：区分发生了什么（fabula）与如何讲述（discourse）。

## Experimental Setup

这是领域综述，覆盖多种规划器、故事生成系统和互动叙事架构。没有统一的新实验数据集或单一结果表。

## Results

- 综述表明，因果链接和角色意图约束能显著提高故事事件的可解释性。
- 互动场景中，必须为玩家造成的状态偏离提供 replan、plan repair 或受控干预机制。
- 对剧本杀而言，规划表示可直接映射为“凶手的目标—行动—时间线—证据后果”，从而让线索不是随机文本而是可追溯的因果产物。

## Ablation

不适用：综述不产生单一算法的消融。不同方法间的比较是概念性与案例驱动的。

## Limitations

- 通用规划常假设动作与状态离散且定义完整；开放语言行动需要额外的语义映射。
- 大型角色关系、欺骗和不完全信息会导致状态空间快速膨胀。
- 规划保证的是模型内逻辑，不保证玩家觉得故事有趣或容易理解。

## Takeaways

将案件核心写成规划域：角色有目标和行动前置条件，行动产生可观测后果，线索链接到这些后果。LLM 可以生成口供和场景细节，但不能生成违反因果域的关键事实。

## Citation

Ware, Robertson, and Young. _A Survey of Narrative Planning_. AI Magazine, 2019.

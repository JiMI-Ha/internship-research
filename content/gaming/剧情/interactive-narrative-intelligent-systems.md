---
title: "Interactive Narrative：智能系统视角的互动叙事"
created: 2026-08-16
published: 2026-08-16
modified: 2026-08-16
type: paper
business_fit: 5
paper_solidity: 5
specialty_score: 3
tags: [paper, gaming, interactive-narrative, narrative-planning, drama-management, survey]
source_url: https://dl.acm.org/doi/10.1609/aimag.v34i1.2449
---

> [!summary] 核心结论
> 该综述将互动叙事视为智能系统问题：需要同时建模故事世界、角色、玩家、叙事目标和控制策略。它为 LLM 时代系统划分提供了清晰边界：自然语言生成只是输出端，规划、状态和玩家建模仍是保持故事可控的基础。

## 基本信息

- **论文**：[Interactive Narrative: An Intelligent Systems Approach](https://dl.acm.org/doi/10.1609/aimag.v34i1.2449)
- **作者**：Mark O. Riedl、Vadim Bulitko
- **发表**：AI Magazine，2013
- **评分**：业务契合度 ★★★★★；Paper solid 度 ★★★★★；专项分 **3/4**（动态叙事 / Drama Management、一致性与可解性、工程编排与评测）

## Motivation

线性故事让作者控制强，但玩家自由弱；纯模拟让玩家自由强，却常缺乏主题、因果和戏剧节奏。互动叙事系统的挑战是把玩家动作纳入故事，同时避免作者为每个分支手工编写内容而导致组合爆炸。

## Method

论文系统梳理互动叙事的智能组件：

1. **故事世界模型**：角色、对象、动作和因果状态；
2. **叙事规划 / 生成**：把目标分解为满足前置条件的事件序列；
3. **Drama Management**：通过选择、延后、替换或引入事件维持作者意图；
4. **角色与玩家建模**：区分角色自主性、玩家偏好和预期行动；
5. **叙述呈现**：把底层事件转为玩家可理解的故事表达。

它比较了基于规划、基于搜索、基于学习和基于规则的系统取舍。

## Experimental Setup

综述论文。它汇总多个互动叙事原型、架构与实验范式，而非自行训练或评估单一模型。

## Results

- 论文指出有效系统必须显式处理“authorial control 与 player agency”的冲突，而不是把它当成界面问题。
- 规划和状态表示能保证事件前置条件与因果目标，玩家建模可减少生硬干预，调度层可管理节奏。
- 对 LLM 游戏的结论是：模型可增强自然语言交互与内容产能，但不会消除这些系统性需求；若没有状态和控制层，开放文本将放大原有问题。

## Ablation

不适用：这是领域综述。其分类可以作为架构检查表，而非组件性能证明。

## Limitations

- 早于大语言模型，未涉及自然语言工具调用、长上下文记忆或生成安全。
- 不提供可直接复制的现代代码实现或统一 benchmark。
- 部分经典系统假设离散动作与相对有限的世界状态，迁移到开放对话需要额外表示层。

## Takeaways

为剧本杀建立“语义动作 → 状态验证 → 事件规划 / 调度 → LLM 叙述”的管线。允许玩家自由用自然语言表达意图，但只让经过规则和故事世界验证的动作改变案件事实。

## Citation

Riedl and Bulitko. _Interactive Narrative: An Intelligent Systems Approach_. AI Magazine, 2013.

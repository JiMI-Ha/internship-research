---
title: "SOTOPIA：语言 Agent 社交智能的交互式评测"
created: 2026-08-16
published: 2026-08-16
modified: 2026-08-16
type: paper
business_fit: 4
paper_solidity: 4
specialty_score: 2
tags: [paper, gaming, LLM, agents, evaluation, social-intelligence]
source_url: https://arxiv.org/abs/2310.11667
---

> [!summary] 核心结论
> SOTOPIA 将两名 Agent 放入拥有关系、目标和社会情境的开放式互动中，再以多维目标和 LLM / 人类评审衡量社交能力。它为嫌疑人、证人和侦探的行为评测提供了模板，但并不衡量推理谜题是否可解。

## 基本信息

- **论文**：[SOTOPIA: Interactive Evaluation for Social Intelligence in Language Agents](https://arxiv.org/abs/2310.11667)
- **作者**：Zhou 等
- **发表**：ICLR 2024
- **评分**：业务契合度 ★★★★☆；Paper solid 度 ★★★★☆；专项分 **2/4**（角色 Agent 与私密状态、工程编排与评测）

## Motivation

常规 LLM benchmark 多考察知识、推理或单轮指令遵循，难以评价 Agent 在多轮社会互动中的能力：例如维护关系、达成私人目标、遵守社会规范、在冲突中协商。对互动叙事而言，角色“会说话”不等于其行为可信，因此需要专门的社会场景评测。

## Method

SOTOPIA 构造社会互动环境：

1. 为两个 Agent 提供身份、关系、场景和各自目标；
2. Agent 在自然语言中自由交互；
3. 环境在规定轮数后结束；
4. 由评审从目标达成、关系维持、社会规范等维度评分；
5. 通过 SOTOPIA-π 等设置考察不同模型与策略。

评测强调 Agent 的目标往往不同，且不是所有信息都需要完全公开。

## Experimental Setup

- 使用大量由日常社会关系和目标组成的双人场景；
- 比较不同语言模型、提示策略及人类表现；
- 结合 LLM-as-a-judge 与人类评估，验证自动评价和社交互动质量之间的关系。

## Results

- 论文显示当时的强语言模型在部分社会场景上表现良好，但仍会在目标平衡、常识、关系维护和规范遵从上出现失败。
- SOTOPIA 的多维评分能够区分仅追求个人目标与兼顾社会结果的 Agent 行为。
- 对剧本杀的直接含义是：角色评测应分解为“角色目标、隐瞒策略、情绪合理性、关系后果”等维度；论文没有给出线索闭环或真凶识别率。

## Ablation

论文比较模型、提示和评价设置，并检验 LLM 评审与人类评估的关系。主要结论是社会互动不能只靠单一任务成功指标衡量。

## Limitations

- 双人、短回合、日常社会场景与多人长时剧本杀存在分布差异。
- LLM judge 可能有长度、文风、模型偏好等偏差。
- 私密目标不是密码学意义上的信息隔离；实际游戏还需访问权限。
- 没有显式的世界状态、行动后果模拟或逻辑谜题验证。

## Takeaways

可以把 SOTOPIA 的目标卡和多维评审转化为 NPC 回归测试：例如嫌疑人是否守住自身秘密、面对证据时是否合理改变策略、是否避免无端承认真相。它应与独立的线索图验证一起使用。

## Citation

Zhou et al. _SOTOPIA: Interactive Evaluation for Social Intelligence in Language Agents_. ICLR, 2024.

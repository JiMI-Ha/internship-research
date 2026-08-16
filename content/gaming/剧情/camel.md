---
title: "CAMEL：用角色扮演构建可协作的语言模型 Agent 社会"
created: 2026-08-16
published: 2026-08-16
modified: 2026-08-16
type: paper
business_fit: 4
paper_solidity: 3
specialty_score: 2
tags: [paper, gaming, LLM, multi-agent, role-playing]
source_url: https://arxiv.org/abs/2303.17760
---

> [!summary] 核心结论
> CAMEL 以 inception prompting 为两个语言 Agent 指定角色、共同任务和对话边界，让其自主协作完成任务并产生可供训练的数据。它是“主持人 / 嫌疑人 / 证人”等角色分工的有用原型，但 Prompt 角色扮演本身不能提供剧本杀需要的秘密隔离和事实约束。

## 基本信息

- **论文**：[CAMEL: Communicative Agents for “Mind” Exploration of Large Scale Language Model Society](https://arxiv.org/abs/2303.17760)
- **作者**：Guohao Li、Hasan Abed Al Kader Hammoud、Hani Itani、Dmitrii Khizbullin、Bernard Ghanem
- **发表**：NeurIPS 2023
- **评分**：业务契合度 ★★★★☆；Paper solid 度 ★★★☆☆；专项分 **2/4**（角色 Agent 与私密状态、工程编排与评测）

## Motivation

单个聊天模型即使能力强，也难以稳定模拟多个拥有不同职责和视角的参与者。多 Agent 直接对话又常会偏离任务、混淆角色或陷入无效循环。论文希望用结构化角色设定引导 Agent 协作，并从这些交互中产生研究多 Agent 行为的数据。

## Method

CAMEL 的核心是 **inception prompting**：

1. 为 user agent 与 assistant agent 分别分配角色；
2. 给出共同任务、约束和对话协议；
3. 让 user agent 逐步提出指令，assistant agent 据此执行；
4. 通过显式终止条件和角色提醒减少跑题；
5. 从产生的对话中构建 instruction-following 数据。

它将“谁提出需求、谁完成任务”固定为协作对，而非让角色在完全无约束的社会环境中自由博弈。

## Experimental Setup

- 在多个任务域中生成角色扮演对话和协作轨迹；
- 评估角色提示对任务完成和行为可控性的影响；
- 展示合成数据可用于后续 instruction-following 微调的可能性。

## Results

- 论文展示 inception prompting 能让两个 Agent 在给定任务下维持分工并完成多轮协作。
- 作者报告角色扮演生成的对话可形成训练语料，并给出若干任务案例说明其相较无角色约束对话更易保持目标导向。
- 这些结果支持“角色与协议能提升协作可控性”，但并未评测欺骗、盘问、线索泄露、案件可解性或多人实时游戏体验。

## Ablation

论文比较有无 inception prompting / 角色约束的对话行为，表明显式角色和任务设定对于避免无目标聊天、保持协作方向是必要设计。它没有把“私密记忆访问控制”作为可验证模块进行消融。

## Limitations

- 面向合作任务，不是对抗性社交推理；嫌疑人说谎和侦探盘问的目标冲突未被解决。
- 两 Agent 共享在 prompt 中提供的上下文，无法天然隔离秘密。
- 角色一致性依赖语言模型遵循提示，仍会出现越权、幻觉或角色漂移。
- 不能替代由程序维护的规则、时间线或证据状态。

## Takeaways

可把 CAMEL 用作角色协议模板：GM 负责轮次和可见信息，NPC Agent 只通过受控检索工具读取自己的档案与已观察事件。真正的“秘密”应靠访问控制实现，不能只写在 prompt 中。

## Citation

Li et al. _CAMEL: Communicative Agents for “Mind” Exploration of Large Scale Language Model Society_. NeurIPS, 2023.

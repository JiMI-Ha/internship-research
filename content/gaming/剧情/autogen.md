---
title: "AutoGen：可编排的多 Agent 对话框架"
created: 2026-08-16
published: 2026-08-16
modified: 2026-08-16
type: paper
business_fit: 4
paper_solidity: 4
specialty_score: 1
tags: [paper, gaming, LLM, multi-agent, orchestration, tools]
source_url: https://arxiv.org/abs/2308.08155
---

> [!summary] 核心结论
> AutoGen 通过可定制的 conversable agents、可编程对话模式、工具执行与人类介入，把复杂 LLM 应用从单轮 Prompt 提升为可编排的协作流程。它很适合实现 AI 主持人系统的工程骨架，但并不自动提供剧情控制或谜题逻辑。

## 基本信息

- **论文**：[AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation](https://arxiv.org/abs/2308.08155)
- **作者**：Qingyun Wu 等
- **发表**：2023，arXiv
- **评分**：业务契合度 ★★★★☆；Paper solid 度 ★★★★☆；专项分 **1/4**（工程编排与评测）

## Motivation

复杂 LLM 应用往往需要模型推理、代码 / 工具执行、错误修复与人类反馈。把所有职责塞入单一 Agent 会使 prompt 难以维护，也不便于在不同环节插入审计与控制。AutoGen 的目标是用多 Agent 对话作为统一抽象，降低构建这类工作流的工程门槛。

## Method

AutoGen 提供：

1. **ConversableAgent**：可配置系统消息、自动回复、函数调用和人工输入的基本 Agent；
2. **AssistantAgent 与 UserProxyAgent**：分别面向 LLM 协作和代码执行 / 人类代理；
3. **对话编排**：支持双 Agent、群聊、顺序 / 嵌套对话、终止条件和自定义回复逻辑；
4. **工具执行与人类介入**：让 Agent 能调用代码、外部工具，必要时请求人工确认。

重点是给开发者提供机制，而不是训练一个新的多 Agent 模型。

## Experimental Setup

- 覆盖数学、代码、问答等任务，展示不同 Agent 组合与工具使用方式；
- 对比单一模型调用和多 Agent 对话工作流在任务完成、调试与人工参与上的实践效果；
- 以框架案例和系统能力为主，不是面向游戏叙事的受控实验。

## Results

- 论文展示 AutoGen 可用多 Agent 交互完成代码生成、执行、反馈和修复等端到端任务。
- 案例说明可编程的对话模式能把工具调用、人类反馈和模型协作整合到同一应用中。
- 这些结果证明其工程通用性，而非证明任何特定的角色扮演质量、剧情连贯性或游戏体验提升。

## Ablation

框架论文的核心证据是跨任务案例和不同 Agent 配置，而不是模型参数级消融。其可复用价值在于能将对话流程明确写成应用逻辑。

## Limitations

- 框架不会自动解决 Agent 误调用工具、循环对话、成本失控或共享上下文泄露。
- Agent 之间的自然语言通信不等于可审计的状态变更。
- 没有原生案件知识图、权限系统或戏剧节奏模型。
- 复杂工作流的可靠性仍受底层模型、工具接口和开发者设计影响。

## Takeaways

在剧本杀中，可将 AutoGen 作为编排层：GM Agent 请求状态引擎判定动作，Narrator Agent 将合法状态变更语言化，Validator Agent 检查新支线。所有关键写操作应由工具 schema 和事务日志完成，不能直接相信聊天消息。

## Citation

Wu et al. _AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation_. arXiv:2308.08155, 2023.

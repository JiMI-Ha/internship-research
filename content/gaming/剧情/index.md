---
title: "Gaming / 剧情：AI 实时分支叙事与剧本杀"
created: 2026-08-16
published: 2026-08-16
modified: 2026-08-16
type: topic
tags: [gaming, interactive-narrative, murder-mystery, LLM, multi-agent]
---

> [!abstract] 专题范围
> 本专题研究如何为实时、多支线的剧本杀与悬疑推理游戏构建可靠的 AI 叙事系统：LLM 负责语言表达与角色扮演，结构化世界状态、线索因果图、权限隔离与 Drama Manager 负责可解性、因果一致性和节奏控制。

## 评分口径

- **业务契合度**：论文对“实时、多支线、可解的 AI 剧本杀 / 互动叙事游戏”的直接帮助程度，满分 5 星。重点考察是否支持剧情分支、角色私密信息、长期状态、主持 / 叙事调度、线索一致性或工程落地。
- **Paper solid 度**：基于问题定义、方法闭环、实验覆盖、对照与消融、统计证据和结论边界的主编判断，满分 5 星。综述和设计论文按其对应贡献评价，不把“没有统一 benchmark”误判为实验失败。
- **完整评分**：两项都有分数时，按总分降序；总分相同时，业务契合度更高者优先。
- **评分边界**：评分只表达当前项目目标下的阅读判断，而非论文的客观价值；新版本、复现和业务约束变化后应重新校准。

## 四项专项推荐分

以下维度各命中一项加 1 分，满分 4 分；专项分只回答“论文是否直接提供这一能力”，不替代两项星级评分。

1. **动态叙事 / Drama Management**：显式处理玩家行为导致的剧情分支、节奏控制或叙事目标。
2. **角色 Agent 与私密状态**：角色拥有独立目标、记忆、计划、视角或受限信息。
3. **一致性与可解性**：显式处理世界状态、因果、线索依赖、约束或可验证性。
4. **工程编排与评测**：提供可复用系统框架、数据 / benchmark 或可操作的评测方法。

## 逐篇阅读

### LLM、多 Agent 与角色扮演

- [[gaming/剧情/generative-agents|Generative Agents：记忆、反思与计划驱动的社会模拟]]
- [[gaming/剧情/dramatron|Dramatron：面向戏剧写作的人机协作生成工具]]
- [[gaming/剧情/camel|CAMEL：用角色扮演构建可协作的语言模型 Agent 社会]]
- [[gaming/剧情/agentverse|AgentVerse：多 Agent 协作与涌现行为框架]]
- [[gaming/剧情/autogen|AutoGen：可编排的多 Agent 对话框架]]
- [[gaming/剧情/sotopia|SOTOPIA：语言 Agent 社交智能的交互式评测]]

### 互动叙事、规划与 Drama Management

- [[gaming/剧情/drama-management-survey|Drama Management Survey：动态剧情调度的系统性回顾]]
- [[gaming/剧情/interactive-narrative-intelligent-systems|Interactive Narrative：智能系统视角的互动叙事]]
- [[gaming/剧情/narrative-planning-survey|A Survey of Narrative Planning：叙事规划方法综述]]
- [[gaming/剧情/plans-and-planning-narrative-generation|Plans and Planning in Narrative Generation：规划式故事、叙述与交互生成综述]]
- [[gaming/剧情/facade-interactive-drama|Façade：互动戏剧架构中的内容组织]]

## 设计结论

这些论文共同支持的系统边界是：不要让单个 LLM 同时充当编剧、所有角色、规则裁判、记忆库和真相数据库。稳健实现至少应分为：

1. **事实层**：将凶案真相、时间线、线索依赖、人物位置和知识边界写入可验证的结构化状态；
2. **调度层**：由 Drama Manager 选择何时引入冲突、线索和转场，并维护玩家自由与悬念节奏；
3. **角色层**：为每位 NPC 提供独立 persona、目标、可检索记忆和可见信息；
4. **表达层**：让 LLM 生成叙述、台词、情绪与局部即兴，但不能无约束地篡改事实层；
5. **审核层**：对每个新支线检查时间线、信息泄漏、线索可达性与主谜题可解性。

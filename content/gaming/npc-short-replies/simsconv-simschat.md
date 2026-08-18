---
title: "SimsConv / SimsChat：可自定义角色、场景、情绪的角色对话数据"
created: 2026-08-18
published: 2026-08-18
modified: 2026-08-18
type: paper
business_fit: 0
paper_solidity: 0
tags:
  - paper
  - gaming
  - role-playing
  - dataset
  - emotion
  - SFT
source_url: https://arxiv.org/abs/2406.17962
---

> [!summary] 核心结论
> SimsConv 用 GPT-4 生成自定义角色、场景、情绪和多轮互动，并训练 SimsChat。它对 NPC 数据管线很有价值，但不是 preference / RL 论文，也没有短回复预算。

## 基本信息

- **论文**：[Crafting Customisable Characters with LLMs: A Persona-Driven Role-Playing Agent Framework](https://arxiv.org/abs/2406.17962)
- **作者**：arXiv:2406.17962 作者团队
- **发表信息**：arXiv 2024
- **当前专题关系**：直接相关；提供角色 profile、场景、情绪和 inner reflection 的合成数据框架。

## Motivation

现有 role-play 多围绕固定名人或虚构人物，难以支持用户自由定义的角色、生活经历、情绪和互动场景。论文希望构造可自定义的角色对话数据，并训练能泛化到多种真实感角色的 agent。

## Method

方法分三步构造 SimsConv：先从 career、aspiration、traits、skills 等预定义方面扩展角色 personal / social profile；再基于角色信息生成真实场景；最后让角色在指定 emotion 和 topic 下多轮互动。GPT-4 生成 dialogue 时显式区分 speech 和 inner thoughts / reflections。SimsChat 使用 LLaMA-3-8B-Instruct 在 SimsConv 上微调。

## Experimental Setup

- **模型 / 系统**：LLaMA-3-8B-Instruct 微调得到 SimsChat。
- **数据 / 任务**：68 个角色、1,360 个场景、13,971 段多轮对话；16 类情绪、18 类话题。
- **对照方法**：Tongyi Xingchen、GPT-3.5、GPT-4o、GPT-4 等。
- **指标**：automatic evaluation 与 human evaluation，覆盖 memorisation、values、personality、hallucination、stability 等。
- **训练和计算设置**：5 epochs，AdamW，learning rate warmup 到 3e-5 后衰减，context window 4096，8×V100 32GB。

## Results

| 指标                | 对照                       | 方法     | 原文支持的结论                                                                           |
| ------------------- | -------------------------- | -------- | ---------------------------------------------------------------------------------------- |
| 自动 / 人工角色评估 | 多个商业和开源模型         | SimsChat | 作者报告 SimsChat 在多项角色维度上表现稳定，并能处理 WikiRoleEval 的 unseen characters。 |
| 数据规模            | 传统 persona dialogue 数据 | SimsConv | 论文提供包含角色、场景、情绪和话题的结构化合成数据，支持可自定义角色训练。               |

## Ablation / Robustness

论文包含 extensive ablation studies，重点验证角色构造、场景和对话数据对 personality / knowledge 维度的贡献；同时在 WikiRoleEval 上测试 unseen characters。

## Sensitivity / Boundary Conditions

数据依赖 GPT-4 生成，风格和安全边界会继承 teacher 偏差。输出没有 30 token 限制，inner thoughts 作为训练 / 数据格式的一部分，如何隐藏需要另设目标。

## Limitations

评测维度偏角色保持和知识，不直接覆盖互动钩子、玩家推进性或短台词体验。角色关系状态虽然出现在 social profile 中，但没有作为可控输入单独研究。

## Takeaways

适合作为本专题的数据合成模块：生成角色卡、关系、场景、情绪和候选短回复；再用独立 rubric judge 过滤成偏好数据。

## Citation

_Crafting Customisable Characters with LLMs: A Persona-Driven Role-Playing Agent Framework_. arXiv, 2024.

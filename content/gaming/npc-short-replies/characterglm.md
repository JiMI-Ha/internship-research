---
title: "CharacterGLM：中文可定制角色对话模型"
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
  - Chinese
  - dialogue
  - engagement
source_url: https://arxiv.org/abs/2311.16832
---

> [!summary] 核心结论
> CharacterGLM 构建中文 CharacterDial 语料并训练可定制中文角色模型，评估 consistency、human-likeness 和 engagement。它是中文角色对话的重要 baseline，但不涉及 deliberation 或短 token 优化。

## 基本信息

- **论文**：[CharacterGLM: Customizing Chinese Conversational AI Characters with Large Language Models](https://arxiv.org/abs/2311.16832)
- **作者**：清华 CoAI、Lingxin AI、智谱等团队
- **发表信息**：arXiv 2023
- **当前专题关系**：直接相关；提供中文角色对话语料、中文模型和 engagement 维度。

## Motivation

中文角色对话需要稳定的人设、拟人感和多轮 engagement。通用聊天模型缺少角色属性、行为和语言风格的系统训练，prompt 定制也容易在多轮中漂移。

## Method

论文定义 CharacterDial 任务，让用户通过 profile 配置可对话角色。CharacterGLM 使用大规模众包和自动构造的中文角色对话语料，覆盖多种角色类别、身份、兴趣、观点、语言特征和社会关系，并通过 carefully designed training 与 self-refinement 方法训练 6B 到 66B 规模模型。

## Experimental Setup

- **模型 / 系统**：CharacterGLM 系列，公开 6B 版本。
- **数据 / 任务**：约 250 个角色、多轮 CharacterDial 语料。
- **对照方法**：GPT-3.5 等中文对话模型。
- **指标**：consistency、human-likeness、engagement，含 pair-wise comparison。
- **训练和计算设置**：论文介绍多阶段训练和自我改进，但公开可复现细节有限。

## Results

| 指标                 | 对照                        | 方法         | 原文支持的结论                                                                           |
| -------------------- | --------------------------- | ------------ | ---------------------------------------------------------------------------------------- |
| Pair-wise comparison | GPT-3.5                     | CharacterGLM | 论文展示 CharacterGLM 在 consistency、human-likeness、engagement 上相对 GPT-3.5 的优势。 |
| 多轮稳定性           | 不同 dialogue turn interval | CharacterGLM | 论文分析随对话轮次变化的平均优势，用于说明多轮角色保持能力。                             |

## Ablation / Robustness

论文包含多轮区间分析和若干质量比较，但与 TBS / HER 相比，对 deliberation 或 reward 组件没有可拆解消融。

## Sensitivity / Boundary Conditions

公开复现依赖数据和训练细节开放程度。CharacterGLM 的目标是完整角色对话，不是短回复；engagement 也不等同于 30 token 内的互动钩子。

## Limitations

没有 teacher thought、preference optimization 或安全-效用权衡。中文 CharacterDial 语料与游戏 NPC 的状态机、任务推进和关系状态仍有差距。

## Takeaways

适合作为中文 NPC 的 baseline 和评价维度来源，尤其是 consistency / human-likeness / engagement；但需要另加短输出和安全 judge。

## Citation

_CharacterGLM: Customizing Chinese Conversational AI Characters with Large Language Models_. arXiv, 2023.

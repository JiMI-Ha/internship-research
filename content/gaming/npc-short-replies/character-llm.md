---
title: "Character-LLM：用经历重建和 Experience Upload 训练角色智能体"
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
  - experience
  - memory
  - SFT
source_url: https://arxiv.org/abs/2310.10158
---

> [!summary] 核心结论
> Character-LLM 强调通过经历重建和 Experience Upload 让模型学习角色记忆、性格和情绪。它对 NPC 背景数据构造有价值，但不解决短回复、preference optimization 或隐藏 deliberation。

## 基本信息

- **论文**：[Character-LLM: A Trainable Agent for Role-Playing](https://arxiv.org/abs/2310.10158)
- **作者**：Yunfan Shao、Linyang Li、Junqi Dai、Xipeng Qiu
- **发表信息**：arXiv 2023
- **代码 / 项目页**：https://github.com/choosewhatulike/trainable-agents
- **当前专题关系**：直接相关；提供角色经历数据构造和 trainable simulacra baseline。

## Motivation

仅靠 prompt 扮演角色容易流于表面，模型缺少角色真实经历和记忆。论文希望通过把角色经历转成训练数据，让角色模型在新场景中保持可信的性格、知识边界和情绪。

## Method

Character-LLM 包含 Experience Reconstruction、Experience Upload 和 Protective Experience。先从 profile / Wikipedia 等可靠来源收集角色信息，再把重要事件重构为 flashback scenes，多轮补全为经验数据。Experience Upload 用这些场景微调 LLaMA；Protective Experience 用来减少世界知识与角色记忆混淆造成的幻觉。

## Experimental Setup

- **模型 / 系统**：LLaMA 7B 微调得到不同角色 simulacra。
- **数据 / 任务**：Cleopatra、Voldemort、Spartacus、Hermione、Newton、Caesar、Beethoven、Socrates、Martin Luther King 等角色的经验场景。
- **对照方法**：instruction-tuned models、prompt-based role-play 等。
- **指标**：single-turn / multi-turn interview，人类和模型评估角色扮演质量。
- **训练和计算设置**：每个 simulacrum 在对应 experience examples 上微调，引入 EOT token 分隔回合。

## Results

| 指标                        | 对照                                 | 方法                    | 原文支持的结论                                                                         |
| --------------------------- | ------------------------------------ | ----------------------- | -------------------------------------------------------------------------------------- |
| Interview role-play quality | 普通 instruction-tuned / prompt 模型 | Character-LLM simulacra | 作者报告 trainable agents 更能记住经历并保持角色性格。                                 |
| Failure analysis            | 经验数据不足或世界知识干扰           | Protective Experience   | 论文观察到 limited experiences 和 worldwide knowledge confusion 会导致 hallucination。 |

## Ablation / Robustness

论文包含 case studies 和 failure analysis，讨论训练角色在记忆、人格和幻觉上的表现。Protective Experience 是对角色知识边界的专项补充。

## Sensitivity / Boundary Conditions

每个角色需要单独构造经历数据，扩展到大量 NPC 成本高。interview evaluation 与真实玩家短对话不同，没有 token budget 或 latency 评估。

## Limitations

方法偏 SFT 和角色记忆，不是 preference / RL。经历重建依赖 LLM 合成和外部资料质量；角色在未覆盖经历上的泛化仍可能失败。

## Takeaways

可用于构造 NPC 的“经历库”和保护性边界样本，再把这些经历压缩进短回复训练数据或检索上下文。

## Citation

Shao et al. _Character-LLM: A Trainable Agent for Role-Playing_. arXiv, 2023.

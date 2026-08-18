---
title: "HER：角色扮演中的双层思考与 RL 对齐"
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
  - reinforcement-learning
  - reward-model
  - deliberation
source_url: https://arxiv.org/abs/2601.21459
---

> [!summary] 核心结论
> HER 把 role-play 明确拆成隐藏 system thinking 与角色层 thought / action / speech，并训练 generative reward model 做 RL。它是 teacher deliberation + judge / RL 管线的强相关参考，但目标是长篇角色扮演，不是 30 token NPC 短台词。

## 基本信息

- **论文**：[HER: Human-like Reasoning and Reinforcement Learning for LLM Role-playing](https://arxiv.org/abs/2601.21459)
- **作者**：Chengyu Du 等
- **发表信息**：arXiv 2026
- **当前专题关系**：直接相关；提供 role-play reasoning 数据合成、GRM judge 与 RL 训练框架。

## Motivation

角色扮演不是单一正确答案任务：模型既要跟随 persona 和场景，又要保持情绪、叙事和长期一致性。固定 rubric 或简单 SFT 难以覆盖开放式互动中的隐性偏好，普通 thought 格式又容易把系统规划和角色内心混在一起。

## Method

HER 提出 Dual-layer Thinking：先生成隐藏的第三人称 system thinking，用来跟踪约束和计划；再生成角色层输出，允许交错 role thinking、action 与 speech。数据侧，论文从 CoSER 对话反向合成 reasoning-augmented trajectories，并通过多样化 reformatting 防止模板坍缩。训练侧，先做 cold-start SFT，再训练 Role-play Generative Reward Model。GRM 不只给分，而是生成 by-case principles、候选分析和最终偏好；策略阶段用该 GRM 比较 policy response 与 frozen SFT baseline，产生 RL reward。

## Experimental Setup

- **模型 / 系统**：以 Qwen3-32B-Base 训练 HER；另训练 HER-RM / GRM。
- **数据 / 任务**：CoSER role-play 对话、reasoning-augmented trajectories、专家偏好数据。
- **对照方法**：强商业模型、开源 role-play baseline、不同 reward supervision 格式。
- **指标**：CoSER Test 的平均分及 SC / AN / CF / SQ 等维度，MiniMax Role-Play Bench 的 Worlds、Stories、Preferences。
- **训练和计算设置**：论文报告 SFT + RL 两阶段，开放模型解码 temperature 0.7、max tokens 4096。

## Results

| 指标                                | 对照                      | 方法                   | 原文支持的结论                                                   |
| ----------------------------------- | ------------------------- | ---------------------- | ---------------------------------------------------------------- |
| CoSER / MiniMax role-play benchmark | 商业和开源 role-play 模型 | HER                    | 作者报告 HER 在两个 role-play benchmark 上获得更高综合表现。     |
| Reward model 判断                   | 固定原则 supervision      | by-case principles GRM | 作者报告 by-case principles 更能贴合场景偏好，优于固定原则格式。 |

## Ablation / Robustness

论文分析了 system thinking、by-case reward modeling、balanced anti-shortcut training 等组件。GRM 训练中特别平衡 candidate order、长度对比和 judging format，以减少位置偏差、长度偏差和模板捷径。

## Sensitivity / Boundary Conditions

HER 默认允许长输出和复杂结构，max tokens 设置远高于 NPC 短回复需求。它的 role thinking 可见或可折叠，是否完全隐藏并只输出 speech 需要业务侧重构。2026 预印本的复现、数据开放和评测稳定性还要继续跟踪。

## Limitations

方法复杂，依赖高质量 reasoning trajectory 和偏好数据；GRM 本身可能学习到长度、风格或位置 shortcut。它没有直接验证短 token 输出、实时游戏延迟或玩家留存。

## Takeaways

HER 适合借鉴训练管线而不是直接照搬输出格式：用 teacher 生成隐藏 deliberation，用 judge 生成样本级原则和偏好，再只把短 speech 作为 student 的部署输出。

## Citation

Du et al. _HER: Human-like Reasoning and Reinforcement Learning for LLM Role-playing_. arXiv, 2026.

---
title: "Role-play Safety-Utility：反派角色中的安全与角色感权衡"
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
  - safety
  - preference
  - tradeoff
source_url: https://arxiv.org/abs/2502.20757
---

> [!summary] 核心结论
> 这篇系统指出 role-playing 中存在 safety-utility trade-off，尤其是反派角色数据会提升角色表现但降低安全指标。它是本专题 safety reward 和坏例 taxonomy 的核心参考。

## 基本信息

- **论文**：[The Rise of Darkness: Safety-Utility Trade-Offs in Role-Playing Dialogue Agents](https://arxiv.org/abs/2502.20757)
- **作者**：arXiv:2502.20757 作者团队
- **发表信息**：arXiv 2025
- **当前专题关系**：直接相关；处理 role-play 中角色感与安全的冲突。

## Motivation

角色扮演为了更像角色，可能生成冒犯、偏见或危险内容；过强安全约束又会让角色失去语言表现力和沉浸感。反派角色尤其容易触发这种冲突。

## Method

论文先对多个开源和闭源 LLM 做 safety / utility 分析，再提出 Adaptive Dynamic Multi-Preference（ADMP）。ADMP 在训练数据中显式加入 Utility 和 Safety preference，让模型根据 character settings 与 user query 动态生成偏好，再据此生成响应。Coupling Margin Sampling 用于构造高风险边界样本。

## Experimental Setup

- **模型 / 系统**：LLaMA-2、Mistral、Qwen、GPT-4、GPT-3.5 等。
- **数据 / 任务**：RoleBench 扩展和重标注，特别关注 villain dialogues。
- **对照方法**：静态 single-preference 方法如 DPO / ORPO，以及非自适应 multi-preference 方法。
- **指标**：多项 safety metrics 与 role-playing utility metrics，如 RoleKnowledge、RoleStyle、SAP-Negative 等。
- **训练和计算设置**：引入 safety reward 和 utility reward，输出中先生成 preference 再生成 response。

## Results

| 指标                         | 对照             | 方法                   | 原文支持的结论                                                                  |
| ---------------------------- | ---------------- | ---------------------- | ------------------------------------------------------------------------------- |
| Safety / utility correlation | 多个 LLM         | 分析实验               | 作者报告所有模型都存在明显 safety-utility trade-off，且反派角色与冲突高度相关。 |
| Villain data ratio           | 不同比例反派数据 | preliminary experiment | 反派数据比例提高时，role utility 指标上升，而 UB / OFF 等 safety 指标下降。     |
| 高风险场景                   | 静态偏好方法     | ADMP + CMS             | 作者报告 ADMP 更能动态平衡安全与角色表现。                                      |

## Ablation / Robustness

论文比较静态偏好、非自适应多偏好和 ADMP，并通过反派数据比例分析说明 trade-off 来源。CMS 专门针对高风险 character-query coupling 构造样本。

## Sensitivity / Boundary Conditions

安全和 utility reward 的定义会影响结论；不同游戏世界、分级制度和角色设定下，允许表达的边界不同。论文关注长对话代理，不直接处理短台词。

## Limitations

ADMP 不是 deliberation 论文，也没有 teacher thought。安全 reward 与角色感 reward 的冲突可能被短回复预算放大，需要业务自定义 policy 和人工校准。

## Takeaways

本专题应把安全作为独立 cost / constraint，而不是简单并入总分；反派、诱导泄密、角色不知道的问题和亲密关系应进入 bad case taxonomy。

## Citation

_The Rise of Darkness: Safety-Utility Trade-Offs in Role-Playing Dialogue Agents_. arXiv, 2025.

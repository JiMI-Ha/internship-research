---
title: "XSTest：用最小安全—危险对照识别夸张安全行为"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
authors: "Paul Röttger, Hannah Rose Kirk, Bertie Vidgen, Giuseppe Attanasio, Federico Bianchi, Dirk Hovy"
aliases:
  - papers/xstest
tags:
  - paper
  - llm-safety
  - over-refusal
  - benchmark
  - safety-alignment
  - evaluation
source_url: https://arxiv.org/abs/2308.01263
---

> [!summary] 一句话结论
> XSTest 用 250 条看似敏感但实际安全的短 prompt 与 200 条最小编辑危险对照测量过度拒答；原始 Llama-2-70B-chat 对安全题有 38.0% 完全拒答和 21.6% 部分拒答，而 GPT-4 分别为 6.4% 与 2.0%。结果提示模型可能依赖表面词汇触发安全行为，但该 benchmark 规模小、英文单轮且刻意构造，不能单独证明因果机制或真实部署发生率。

## 基本信息

- **论文**：[XSTest: A Test Suite for Identifying Exaggerated Safety Behaviours in Large Language Models](https://arxiv.org/abs/2308.01263)
- **作者**：Paul Röttger、Hannah Rose Kirk、Bertie Vidgen、Giuseppe Attanasio、Federico Bianchi、Dirk Hovy
- **版本**：arXiv:2308.01263v3，2024-04-01；NAACL 2024 Main Conference
- **关键词**：过度拒答、安全评测、最小对照、exaggerated safety、false positive

## Motivation

安全对齐既要让模型拒绝危险请求，也要避免它因出现“杀死”“毒品”“裸体”等敏感词就拒绝无害问题。已有 safety benchmark 多以危险请求为正例，能测“该拒绝时是否拒绝”，却很少系统测试“该回答时是否回答”。

如果只优化危险集拒答率，一个永远拒答的模型会得到满分。XSTest 因此专门构造接近安全边界的负例，识别 **exaggerated safety behaviours**：模型把无害请求误判为危险而完全或部分拒绝。

## Method

### 1. 250 条手工安全 prompts

作者设计 10 类安全 prompt，每类 25 条。它们刻意包含容易触发安全系统的表面特征，例如同形异义词、虚构/历史语境、对敏感主题的安全解释，或只是提到而没有请求实施伤害。

这些题目不是自然流量抽样，而是 diagnostic test：目标是集中暴露决策边界，而非估计真实用户中的过拒率。

### 2. 200 条最小编辑 unsafe contrasts

作者为其中 200 条安全题创建最小修改的危险对照，尽量保持词汇与形式不变，只改变实际意图。模型若能同时回答 safe 版本、拒绝 unsafe 版本，说明它使用了语义和意图，而非只靠关键词。

### 3. 三类人工响应标签

回答被标为：

- **Full compliance**：正常完成请求；
- **Full refusal**：完全拒绝；
- **Partial refusal**：包含拒绝/安全警告，但仍提供部分所需内容。

对 safe prompts，full 与 partial refusal 都计入夸张安全行为；对 unsafe contrasts，则两种拒答表示安全响应强度不同。

## Experimental Setup

| 模型 / 条件         | 配置                                              |
| ------------------- | ------------------------------------------------- |
| Llama-2-70B-chat    | 原始 system prompt；移除 system prompt            |
| Mistral-7B-Instruct | 无 guardrail；添加 safety guardrail               |
| GPT-4               | 默认聊天设置                                      |
| 生成                | temperature 0                                     |
| 数据                | 250 safe prompts；其中 200 个配有 unsafe contrast |
| 标注                | 人工三分类；报告一致率与 Cohen's $\kappa$         |

## Results

### Safe prompts：过度拒答

| 模型 / 条件                        | Full refusal | Partial refusal |    总拒答 |
| ---------------------------------- | -----------: | --------------: | --------: |
| Llama-2-70B-chat，原始             |        38.0% |           21.6% | **59.6%** |
| Llama-2-70B-chat，无 system prompt |        14.0% |           15.6% |     29.6% |
| Mistral-7B-Instruct，无 guardrail  |         0.8% |            0.8% |  **1.6%** |
| Mistral-7B-Instruct，加 guardrail  |         9.6% |            9.2% |     18.8% |
| GPT-4                              |         6.4% |            2.0% |      8.4% |

system prompt / guardrail 明显改变过拒率：移除 Llama-2 安全 system prompt 后总拒答下降 30 个百分点；给 Mistral 添加 guardrail 后则上升 17.2 个百分点。这表明夸张安全不仅来自预训练模型，也受部署提示强烈影响。

### Unsafe contrasts：必要拒答

| 模型 / 条件                        | Full refusal | Partial refusal |     总拒答 |
| ---------------------------------- | -----------: | --------------: | ---------: |
| Llama-2-70B-chat，原始             |        99.5% |            0.5% | **100.0%** |
| Llama-2-70B-chat，无 system prompt |        97.5% |            2.5% | **100.0%** |
| Mistral-7B-Instruct，无 guardrail  |        23.5% |           12.5% |      36.0% |
| Mistral-7B-Instruct，加 guardrail  |        87.5% |            9.0% |      96.5% |
| GPT-4                              |        97.5% |            2.0% |      99.5% |

无 guardrail Mistral 对安全题最少拒答，但对危险对照也只拒绝 36.0%，因此不能把低 over-refusal 单独解释为更好。XSTest 必须与 unsafe contrast 结果成对阅读。

### 标注可靠性

不同评测批次的人工一致率为 **93.8%–98.4%**，Cohen's $\kappa$ 为 **0.89–0.97**。这说明三类响应标签在该短回答设置中较容易稳定判断。

作者据结果提出模型可能存在 lexical overfitting，即安全训练过度依赖敏感词等表面线索。最小对照与 prompt 类别支持这一解释，但实验没有直接观察模型内部决策，故它是有证据支持的推断，不是已证明的因果机制。

## Ablation

XSTest 不是训练方法论文，没有传统组件消融；最接近的干预是系统提示对照：

1. 移除 Llama-2 system prompt 显著降低 safe refusal，同时保持该小型 unsafe 集上的拒答。
2. 为 Mistral 添加 guardrail 同时提高 safe 与 unsafe 拒答，展示安全收益和过拒代价。
3. safe / unsafe 最小对照控制大部分词汇形式，用于区分语义判断与表面触发。

这些干预说明 prompting 是重要变量，但不等同于全面评估系统提示在开放场景中的安全收益。

## Limitations

1. XSTest 具有 **negative predictive power**：通过测试只能说明未触发这些已知模式，不能证明模型没有其他过度拒答问题。
2. 数据短、简单、英文、单轮且仅数百条，风险类别与语言覆盖有限。
3. prompts 刻意设计以触发边界错误，不能用于估计真实用户流量的过拒发生率。
4. 模型和 API 会随版本变化；论文中的 GPT-4 等结果不应视为当前产品的永久属性。
5. full / partial refusal 是行为表面标签，不直接评价回答内容是否正确、有帮助或安全。
6. “词汇过拟合”是由行为模式推断的解释，没有被因果实验完全确认。

## Takeaways

- 安全评测需要成对检查 false negative 与 false positive；只测危险题会奖励永远拒答的系统。
- 最小安全—危险对照是诊断关键词触发和意图理解差异的低成本工具。
- system prompt 能显著移动安全—过拒边界，评测时必须记录完整部署配置。
- XSTest 适合回归测试与定性诊断，不适合单独作为真实过拒率或全面安全性的估计器。

## Citation

```bibtex
@inproceedings{rottger2024xstest,
  title={XSTest: A Test Suite for Identifying Exaggerated Safety Behaviours in Large Language Models},
  author={Röttger, Paul and Kirk, Hannah Rose and Vidgen, Bertie and Attanasio, Giuseppe and Bianchi, Federico and Hovy, Dirk},
  booktitle={Proceedings of the 2024 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies},
  year={2024}
}
```

---
title: "OR-Bench：规模化测量安全模型的过度拒答"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
authors: "Justin Cui, Wei-Lin Chiang, Ion Stoica, Cho-Jui Hsieh"
aliases:
  - papers/or-bench
tags:
  - paper
  - llm-safety
  - over-refusal
  - benchmark
  - safety-alignment
  - evaluation
  - synthetic-data
source_url: https://arxiv.org/abs/2405.20947
---

> [!summary] 一句话结论
> OR-Bench 从危险 seeds 自动改写出 80K 条靠近安全边界但经审核为无害的 prompts，并构造 Hard-1K 与 600 条 toxic 对照；32 个模型中，安全拒答与过拒的 Spearman 相关为 0.89，显示二者强相关，但自动审核仍可能残留约 1.8% 危险题，Hard-1K 也受用于筛选它的模型集合影响。

## 基本信息

- **论文**：[OR-Bench: An Over-Refusal Benchmark for Large Language Models](https://arxiv.org/abs/2405.20947)
- **作者**：Justin Cui、Wei-Lin Chiang、Ion Stoica、Cho-Jui Hsieh
- **版本**：arXiv:2405.20947v5，2025-06-15；ICML 2025
- **关键词**：过度拒答、大规模 benchmark、安全—帮助性权衡、合成数据、自动审核

## Motivation

XSTest 等小型手工集合揭示了过度拒答，但难以覆盖大量主题和模型，也不适合高频比较迭代。普通无害指令又离安全边界太远，强模型几乎都能回答，缺少区分度。

OR-Bench 的目标是规模化生成 **看起来可疑、实际无害** 的边界样本，并同时保留 toxic 对照。作者希望回答：更强的安全训练是否系统性伴随更多过拒？同一模型家族随版本升级，是否真的改善了这项权衡？

## Method

### 1. 从 toxic seeds 反向构造无害边界题

作者先让 Mixtral 8×7B 生成多主题 toxic seeds，再将它们改写成与危险内容词汇或语境接近、但意图安全的 prompts。这样比从普通帮助性数据采样更容易落在拒答边界附近。

### 2. 多模型审核与二次复核

候选题由 GPT-4-Turbo、Llama-3-70B 与 Gemini-1.5-Pro 判断是否安全，以多数票过滤。随后让未加审核的 Mistral 生成回答，再依据回答内容进行复核，减少表面安全但实际可执行伤害的样本。

最终形成：

- **OR-Bench-80K**：80,000 条无害边界 prompts，覆盖 10 类；
- **OR-Bench-Hard-1K**：每个模型家族中至少有 3 个较大/较新模型拒绝的 1,000 条困难题；
- **Toxic set**：600 条危险 prompts，用来检查降低过拒是否以接受危险请求为代价。

### 3. 分层评测

80K 全集使用关键词规则识别拒答，以控制成本；Hard-1K 和 Toxic set 使用 GPT-4 judge 做更细的响应判断。作者评测 8 个家族的 32 个模型，统一 temperature 0。

## Experimental Setup

| 项目              | 设置                                                             |
| ----------------- | ---------------------------------------------------------------- |
| 模型              | 32 个模型、8 个家族，包含 Claude、GPT、Llama、Gemini、Mistral 等 |
| 数据              | OR-Bench-80K、Hard-1K、600 toxic prompts                         |
| 生成温度          | 0                                                                |
| 80K 指标          | 关键词拒答检测                                                   |
| Hard / Toxic 指标 | GPT-4 自动判断                                                   |
| Moderator 验证    | 人类专家标注子集，比较单模型与 ensemble 审核准确率               |

## Results

### 安全与过拒高度相关

在所测 32 个模型上，toxic safety rejection 与 safe over-refusal rejection 的 Spearman 相关系数为 **0.89**。也就是说，更倾向拒绝危险题的模型通常也更倾向误拒无害边界题。

这是跨模型相关性，不证明“安全训练必然导致过拒”的因果关系；模型架构、训练数据、系统提示和审核器可能同时影响两项指标。

### Hard-1K 拒答率

| 模型              | Hard-1K 拒答率 |
| ----------------- | -------------: |
| Claude-2.1        |          99.8% |
| Claude-3.5 Sonnet |          43.8% |
| GPT-3.5-0301      |          57.4% |
| GPT-3.5-0125      |          12.7% |

同家族新版本往往明显减少过拒，说明安全—帮助性边界可以改善，并非只能固定取舍。但必须同时检查 toxic set：部分代际更新的过拒下降伴随危险请求接受率上升，不能只用 safe acceptance 宣称整体更好。

### OR-Bench-80K 拒答率

| 模型         | 80K 拒答率 |
| ------------ | ---------: |
| Claude-2.1   |      52.9% |
| GPT-3.5-0301 |      34.7% |
| GPT-3.5-0125 |       0.9% |
| Llama-2-70B  |      13.9% |
| Llama-3-70B  |       2.2% |

80K 与 Hard-1K 的绝对值不可直接比较：Hard-1K 明确按现有模型的拒答行为筛选，难度远高于总体数据。

### 数据审核质量

- 单个最佳 expert moderator 准确率为 **94%**，三模型 ensemble 为 **93%**。
- 审核器 false negative 为 **4%**，false positive 为 **16%**。
- 在候选题审核前 toxic 比例为 10% 的假设下，论文估计通过审核后仍为 toxic 的概率约 **1.8%**。

  1.8% 是基于假设、采样验证和审核器误差推导的估计，不是对全部 80K 条逐条人工确认的结果。

## Ablation

OR-Bench 主要提供数据与评测分析，而非模型组件消融：

1. **单 moderator vs. ensemble**：expert 94%、ensemble 93%，多数投票没有在验证子集上超过最佳单模型。
2. **80K vs. Hard-1K**：模型筛选产生的 Hard-1K 显著放大差异，适合压力测试，但也引入选择偏差。
3. **家族代际比较**：Claude、GPT 与 Llama 的新版本普遍降低过拒；toxic set 揭示有些改善可能来自安全边界整体放松。

## Limitations

1. 审核与评测大量依赖 GPT、Llama、Gemini 等模型，可能存在 judge family bias。
2. 自动审核并不完美；论文自己估计最终数据仍可能混入约 1.8% toxic prompts。
3. 从 toxic seeds 自动改写只是生成边界题的一种方法，不保证覆盖真实用户过拒的全部形态。
4. Hard-1K 由被测模型家族的拒答行为筛选，可能偏向这些模型共有的弱点，对新架构未必同样困难。
5. 80K 使用关键词识别拒答，可能漏掉隐式拒答或把包含免责声明的正常回答误判为拒答。
6. 32 模型横截面的 0.89 相关是观察性证据，不能建立安全训练导致过拒的因果关系。
7. 数据和模型主要围绕英文单轮对话，跨语言与多轮场景仍不足。

## Takeaways

- OR-Bench 的贡献是把过拒评测从数百条诊断题扩展到 80K 条边界样本，并配套困难集和 toxic 对照。
- 评估模型更新必须同时报告 safe acceptance 与 toxic rejection；只改善其中一侧不足以说明边界更准确。
- Hard-1K 适合快速压力测试，80K 适合大范围覆盖，但二者分别有模型选择偏差与关键词判定误差。
- 0.89 的强相关说明安全—过拒张力普遍存在；它不是不可改善的定律，也不是因果证明。

## Citation

```bibtex
@inproceedings{cui2025orbench,
  title={OR-Bench: An Over-Refusal Benchmark for Large Language Models},
  author={Cui, Justin and Chiang, Wei-Lin and Stoica, Ion and Hsieh, Cho-Jui},
  booktitle={Proceedings of the 42nd International Conference on Machine Learning},
  year={2025}
}
```

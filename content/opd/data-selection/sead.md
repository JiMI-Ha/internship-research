---
title: "SEAD：按学生能力逐步开放 Prompt 的 OPD"
created: 2026-08-17
published: 2026-08-17
modified: 2026-08-17
type: paper
tags: [paper, OPD, data-selection, prompt-selection, token-selection, curriculum]
source_url: https://arxiv.org/abs/2606.28562
---

> [!summary] 解读结论
> SEAD 以学生初始通过率估计 prompt 难度，只让当前能力窗口内的问题进入训练；同时按教师和学生熵把 token 分为跳过、reverse-KL 和 forward-KL 区域。它是本专题中直接部署 prompt-level curriculum 的工作，但当前证据局限于数学。

## 基本信息

- **论文**：[SEAD: Competence-Aware On-Policy Distillation via Entropy-Guided Supervision](https://arxiv.org/abs/2606.28562)
- **arXiv**：2606.28562，2026-06-26 预印本。
- **当前专题关系**：直接覆盖 prompt / curriculum 筛选（A）与 token 级选择（D），数据筛选专项分为 **2/4**。

## Motivation

全量 prompt 训练会同时混入学生已掌握、当前不可达和处在可学习区间的问题；全 token reverse-KL 也忽略了师生不确定性结构。SEAD 的目标是在训练阶段同时控制问题难度和 token 监督类型。

## Method

1. **Prompt curriculum**：用初始学生对第 \(i\) 个问题的 \(K=8\) 次 rollout pass rate \(p_i\) 定义难度 \(d_i=1-p_i\)。第 \(t\) 步只允许

   \[
   \mathcal{D}(t)=\{q_i:d_i\le c(t)\}
   \]

   中的 prompt 进入训练；能力门 \(c(t)\) 随训练逐步放宽。

2. **Token zoning**：在 top-k vocabulary 子集上计算教师与学生熵，按百分位将 token 分为低/低熵跳过区、教师低熵且学生高熵的 reverse-KL 区、教师高熵区的 forward-KL 区。默认比例约为 50% / 40% / 10%。
3. **阶段退火**：将 divergence 权重从 0.8 余弦退火到 0。

## Experimental Setup

- **数据**：去重的 DAPO-Math-17K。
- **模型**：OLMo 7B 学生 / 32B 教师；Nemotron 8B 学生 / 49B 教师。
- **训练**：batch 96 prompts，每题 1 rollout，最大生成 16,384 token，temperature 0.7。
- **比较**：GRPO、全 token reverse-KL 的 vanilla OPD、OPSD。
- **评测**：MATH-500、Minerva-Math、OlympiadBench（pass@1）与 AMC23、AIME24/25（pass@32）。

## Results

| 设置               |             对照 | SEAD | 原文支持的结论       |
| ------------------ | ---------------: | ---: | -------------------- |
| OLMo 7B → 32B 平均 | vanilla OPD 59.2 | 64.0 | 该设置中高 4.8。     |
| 同一设置           |        GRPO 58.0 | 64.0 | 高于纯 GRPO。        |
| Nemotron 设置      |    初始学生 68.3 | 69.9 | 有增益，但幅度较小。 |

## Ablation / Robustness

- token zoning（T）单独增加 0.32，annealing（A）单独增加 0.22；T+A 增加 4.20，显示两者有强交互。
- 完整组合增加 4.82 平均分、AIME25 增加 5.2。
- 论文的 factorial ablation 支持 prompt curriculum、token zoning 与退火不应只按单组件增益理解。

## Sensitivity / Boundary Conditions

- prompt 难度为初始学生 pass rate 的静态估计，不会随训练重估。
- token 熵在 top-k vocabulary 子集上计算，分区比例由固定百分位确定。

## Limitations

- 只验证数学；代码、agent 和开放式任务尚未验证。
- 未验证很长 reasoning chain。
- 不能保证学生只继承教师的期望行为。

## Takeaways

SEAD 在机制榜中命中 A、D：它将“哪些题进入本轮 OPD”和“题内哪些 token 如何监督”放在同一训练流程，但它不做 trajectory 候选筛选或 prefix drift 截断。

## Citation

> _SEAD: Competence-Aware On-Policy Distillation via Entropy-Guided Supervision_. arXiv:2606.28562, 2026. [原文](https://arxiv.org/abs/2606.28562)

---

[[opd/data-selection/|返回 OPD 数据筛选专题]]

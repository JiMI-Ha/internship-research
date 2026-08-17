---
title: "ReNIO：按负轨迹重要性重加权 OPD 样本"
created: 2026-08-17
published: 2026-08-17
modified: 2026-08-17
type: paper
tags: [paper, OPD, data-selection, trajectory-selection, sample-reweighting]
source_url: https://arxiv.org/abs/2606.23104
---

> [!summary] 解读结论
> ReNIO 不先判定一条 student-generated output 最终正确与否，而是从学生相对教师的 pivotal token log-ratio 构造样本权重。论文的受控实验发现，只训练错误 rollout 在其设置中优于只训练正确 rollout；这不是“错误样本永远更好”的普遍结论。

## 基本信息

- **论文**：[ReNIO: Reweighting Negative Trajectory Importance for LLM On-Policy Distillation](https://arxiv.org/abs/2606.23104)
- **arXiv**：2606.23104，2026-06-22 预印本。
- **当前专题关系**：直接覆盖 rollout / trajectory 筛选或重加权（B），数据筛选专项分为 **1/4**。

## Motivation

以最终答案正确性选择 student-generated output 会遗漏错误 trajectory 内可被教师纠正的关键位置，也难以适用于没有完整 correctness label 的场景。ReNIO 试图以可从 prefix 计算的 student/teacher 差异，估计哪些 trajectory 值得在 OPD 中提高权重。

## Method

对 student-generated token \(y_t\) 定义 log-ratio：

\[
\ell_t=\log\pi_S(y_t\mid x,y_{<t})-\log\pi_T(y_t\mid x,y_{<t}).
\]

- 将 \(\ell_t>\tau\) 的位置视为 pivotal token，默认 \(\tau\approx0.8\)。
- 以 pivotal token ratio 的几何均值构造 trajectory weight；默认 clip bound 约为 3.0。
- 对 batch 内权重归一化，使平均权重为 1，避免少数 trajectory 主导更新。

## Experimental Setup

- **模型**：Qwen3 1.7B/4B/8B 与 DeepSeek-R1-Distill-Qwen 1.5B/7B。
- **任务**：AIME24/25、HMMT25 数学；HumanEval+、MBPP+ 代码。
- **数据 / 训练**：30K OpenThoughts code examples；LoRA；OPD / OPSD 100 steps，GRPO 300 steps。
- **比较**：Base、GRPO、OPD、OPSD，以及各自加入 ReNIO。

## Results

| 例子                         |               对照 |                         ReNIO 结果 | 原文支持的结论         |
| ---------------------------- | -----------------: | ---------------------------------: | ---------------------- |
| Qwen3-1.7B，AIME24，OPSD     |               OPSD |                             +8.90% | 多个设置中有提升。     |
| R1-Distill-7B，AIME25        | 对照 OPD/OPSD 变体 |                            +10.00% | 高于未重加权版本。     |
| R1-Distill-1.5B，HMMT25，OPD |                OPD |                            +15.44% | 小模型设置中提升显著。 |
| 汇总                         |           对应基线 | 数学约 +4.7–5.9%，代码约 +2.3–2.8% | 结果依赖模型和任务。   |

## Ablation / Robustness

- 去除 clipping 后平均分降至 40.09；去除 batch normalization 后降至 39.54，说明权重稳定化是必要组件。
- 默认 threshold 0.8、clip bound 3.0 在论文 sweep 中较好。
- prefix 长度增加到 4096 后收益仍在但减弱。
- 论文观察到 ReNIO weight 与 teacher entropy 负相关：学生偏离而教师仍自信的位置权重更高。

## Sensitivity / Boundary Conditions

- pivotal threshold 和 clip bound 都需要调参。
- 权重不依赖 final-answer correctness，但不能保证其总是对应下游成功概率的提升。

## Limitations

- 只在较小模型规模验证，作者明确未测试更大规模。
- 数学和代码为主；长 agent trajectory、教师路由和多教师冲突未验证。
- “错误 rollout 更有价值”来自特定受控实验，不能改写为排除正确 rollout 的通用规则。

## Takeaways

ReNIO 在机制榜中命中 B：它不是从候选中硬删轨迹，而是把 sample-level 选择表现为稳定化的 trajectory reweighting。

## Citation

> _ReNIO: Reweighting Negative Trajectory Importance for LLM On-Policy Distillation_. arXiv:2606.23104, 2026. [原文](https://arxiv.org/abs/2606.23104)

---

[[opd/data-selection/|返回 OPD 数据筛选专题]]

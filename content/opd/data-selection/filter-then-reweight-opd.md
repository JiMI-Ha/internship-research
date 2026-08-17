---
title: "FiRe-OPD：轨迹硬过滤与 Token 软重加权"
created: 2026-08-17
published: 2026-08-17
modified: 2026-08-17
type: paper
tags: [paper, OPD, data-selection, trajectory-selection, token-selection]
source_url: https://arxiv.org/abs/2606.02684
---

> [!summary] 解读结论
> FiRe-OPD 将筛选粒度拆开处理：先按教师对 student rollout 的平均对数似然丢弃低质量轨迹，再在保留轨迹内用“教师置信度 × 学生困惑度”对 token 软加权。论文的直接证据支持“trajectory 适合硬过滤、token 适合软重加权”，但没有处理错误 prefix 对后续 token 监督可靠性的影响。

## 基本信息

- **论文**：[Filter, Then Reweight: Rethinking Optimization Granularity in On-Policy Distillation](https://arxiv.org/abs/2606.02684)
- **arXiv**：2606.02684，2026-06-01 预印本。
- **当前专题关系**：直接覆盖 rollout / trajectory 筛选（B）和 token 级重加权（D），数据筛选专项分为 **2/4**。

## Motivation

标准 OPD 对所有 trajectory 和 token 均匀施加监督，但 student rollout 中教师信号的质量并不相同。论文认为既有选择方法通常只在 trajectory 或 token 一个粒度工作；在 token 层硬删除位置还会造成不可逆的信息损失和不连续优化。

## Method

1. **Trajectory 硬过滤**：对一条 student rollout 计算教师平均 token log-probability

   \[
   s(y)=\frac{1}{T}\sum_{t=1}^{T}\log \pi_T(y_t\mid x,y_{<t}).
   \]

   在 batch 内排序，默认丢弃最低 **20%** trajectory。

2. **Token 软重加权**：教师置信度由归一化负熵表示，学生困惑度由归一化熵表示；默认权重为

   \[
   w_t=(1+\alpha c_t^T)(1+\beta c_t^S),\quad \alpha=\beta=1.
   \]

   以 batch 内归一化权重缩放 token advantage，再用于 PPO-style clipped OPD loss。

## Experimental Setup

- **模型 / 场景**：Qwen3-30B-A3B-Instruct → Qwen3-4B 的 strong-to-weak；Qwen3-4B 数学 teacher/student；数学与代码双教师 → Qwen3-4B 的 multi-teacher。
- **数据 / 训练**：DeepMath-103K（difficulty-6 filtered）及多教师混合集；3 epochs、batch 1024、最大回复 16,384 token、8×A100。
- **比较**：OPD、ExOPD、TIP、REOPOLD、EOPD、Uni-OPD，以及 SFT / GRPO 参考。
- **评测**：8 个数学 benchmark 与 HumanEval+、MBPP+、LiveCodeBench 代码评测。

## Results

| 设置                    |      对照 | FiRe-OPD | 原文支持的结论                                                     |
| ----------------------- | --------: | -------: | ------------------------------------------------------------------ |
| Strong-to-weak 数学平均 | OPD 58.70 |    60.83 | 比 OPD 高 2.13；AIME24、AIME25、HMMT-Feb 分别高 6.25、4.17、3.75。 |
| 单教师数学平均          | OPD 61.21 |    61.74 | 增益较小，但仍高于 OPD。                                           |
| 多教师数学平均          |  OPD 基线 |    51.88 | 报告比 OPD 高 4.84；Minerva 高 18.81。                             |
| 多教师代码平均          |  OPD 基线 |    64.16 | 报告比 OPD 高 4.37；HumanEval+ 上学生高于两位教师。                |

不同设置的教师、学生与评测不同；这些数字不用于跨论文绝对排名。

## Ablation / Robustness

- 去除 student-confusion weighting 的损失最大（−2.24），其次为 trajectory filtering（−1.84），再是 teacher confidence（−0.96）。
- 仅 trajectory filter 已优于全量 OPD（59.30 vs. 58.70）。
- `20%` 过滤比例最好：10% 为 58.53，40% 为 58.08。
- 四种 hard/soft 组合中，**trajectory hard + token soft** 为 60.83，高于 trajectory/token 都 hard（58.23）、都 soft（58.68）和 trajectory soft + token hard（58.55）。

## Sensitivity / Boundary Conditions

- 过滤比例过低或过高都会下降；论文在该设置中采用 20%。
- \(\alpha\ge1\) 时结果相对稳定，\(\beta\) 的敏感性较弱。
- token 权重独立计算，不包含 prefix 连续性信息。

## Limitations

- 没有建模错误或不兼容 prefix 如何降低后续教师监督可信度；这与 [[opd/data-selection/prune-opd|Prune-OPD]] 和 [[opd/data-selection/prefix-guided-opd|PG-OPD]] 的问题不同。
- 当前实验以数学和代码为主；跨域、长 agent 轨迹及无 verifier 场景仍需核验。

## Takeaways

在本专题机制榜中，FiRe-OPD 同时命中 B、D 两项：它提供的关键不是一个统一的“数据价值分”，而是粒度结论——**整条 trajectory 可以硬过滤，token 更适合连续重加权**。

## Citation

> _Filter, Then Reweight: Rethinking Optimization Granularity in On-Policy Distillation_. arXiv:2606.02684, 2026. [原文](https://arxiv.org/abs/2606.02684)

---

[[opd/data-selection/|返回 OPD 数据筛选专题]]

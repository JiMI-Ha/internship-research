---
title: "RVPO：通过方差正则实现风险敏感对齐"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
authors: "Ivan Montero, Tomasz Jurczyk, Bhuwan Dhingra"
tags:
  - paper
  - RLHF
  - multi-objective
  - alignment
  - reward-aggregation
source_url: https://arxiv.org/abs/2605.05750
---

> [!summary] 一句话结论
> RVPO 的主要价值不是让每个单项都无条件上涨，而是阻止模型用容易指标的高分补偿关键约束失败，从而改善瓶颈约束和训练稳定性。

## 基本信息

- **论文**：[RVPO: Risk-Sensitive Alignment via Variance Regularization](https://arxiv.org/abs/2605.05750)
- **作者**：Ivan Montero、Tomasz Jurczyk、Bhuwan Dhingra（Apple）
- **版本**：arXiv:2605.05750v1，2026-05-07
- **关键词**：多目标 RLHF、风险敏感优化、方差正则、SoftMin

## Motivation

多目标 RLHF 需要同时优化正确性、安全性、格式和表达质量等目标，但现有 critic-less 方法在聚合多个奖励时存在两种缺陷。

### GRPO：尺度支配

GRPO 直接累加原始奖励，再在 rollout group 内标准化。连续、高方差或无界奖励会压过稀疏、小尺度的二元约束。例如，执行正确性的高分可能淹没 XML 格式错误。

### GDPO：约束忽略

GDPO 分别标准化每个奖励通道，解决了尺度不一致，却仍用算术平均聚合：

$$
A_{\mathrm{GDPO}}=\frac{1}{M}\sum_{j=1}^{M}Z_j=\mu_Z
$$

均值目标允许 **loss compensation**：某个关键约束的严重失败，可以被另一个容易目标的超额表现抵消。模型因此可能学会利用容易指标，而系统性忽略最难满足的约束。

> [!example] 论文中的直接证据
> Qwen2.5-7B 使用 GDPO 时，Communication Quality 达到 47.0%，但 Completeness 只有 11.1%。虽然各通道经过标准化、名义上权重相同，实际优化仍集中于容易目标。

作者由此把目标从“最大化奖励总和”改写为“最大化跨目标的一致表现”。

## Method

### 1. 独立标准化奖励通道

对同一 prompt 采样 $G$ 个回答。每个奖励通道 $j$ 分别在 group 内计算：

$$
Z_j^{(g)}=\frac{R_j^{(g)}-\mu_j}{\sigma_j+\epsilon}
$$

这一步继承 GDPO 的尺度无关性。

### 2. 用跨目标方差惩罚不一致

直观目标是在平均奖励上减去同一 rollout 内各奖励通道的方差：

$$
A_{\mathrm{explicit}}^{(g)}=\mu_Z^{(g)}-\beta\left(\sigma_Z^{(g)}\right)^2
$$

注意这里的方差是 **跨奖励目标** 计算，而不是跨 rollout 计算。方差越大，说明某些目标可能正在以牺牲其他目标为代价获得高分。

### 3. 用 SoftMin 替代显式二次惩罚

低维奖励空间中的样本方差不稳定，而且二次惩罚会随偏差无界增长。论文最终采用负 LogSumExp，也就是平滑 SoftMin：

$$
A_{\mathrm{RVPO}}^{(g)}=-\frac{1}{k}\log\left(\frac{1}{M}\sum_{j=1}^{M}e^{-kZ_j^{(g)}}\right)
$$

$k$ 是风险系数，控制模型对最差目标的关注程度：

$$
\lim_{k\to0}A_{\mathrm{RVPO}}=\mu_Z,\qquad
\lim_{k\to\infty}A_{\mathrm{RVPO}}=\min_j Z_j
$$

- $k\to0$：退化为 GDPO 的均值聚合。
- $k\to\infty$：退化为只优化最差目标的 hard-min。
- 中间值：在平均性能与最坏目标之间连续调节。

二阶泰勒展开进一步给出：

$$
A_{\mathrm{RVPO}}\approx\mu_Z-\frac{k}{2}\sigma_Z^2
$$

因此 SoftMin 可以理解为一个会在大偏差时自然饱和的平滑方差惩罚。

### 4. 风险课程

高维 rubric 任务中，作者将 $k$ 从 0.5 线性增加到 2.0：训练早期先用接近均值的目标建立通用能力，随后逐渐加强瓶颈约束。最终 advantage 还会在 batch 内重新白化，再用于带 KL 惩罚的 clipped policy-gradient 更新。

## Experimental Setup

| 场景               | 数据与奖励                                                  | 模型                  | 评测                      |
| ------------------ | ----------------------------------------------------------- | --------------------- | ------------------------- |
| Rubrics-as-Rewards | RaR-Medicine / RaR-Science；每题 5–17 个 LLM 判定的独立标准 | Qwen2.5 3B / 7B / 14B | HealthBench、GPQA-Diamond |
| Tool Calling       | RLLA-4k；执行正确性 + XML 格式约束                          | Qwen2.5 1.5B / 3B     | BFCL-v3                   |

主要基线包括 GRPO、GDPO、hard-min、显式方差惩罚，以及 RaR 原论文中的单奖励 GRPO。

## Results

### HealthBench：更强的总体表现与稳定性

| 模型 | GDPO 最佳 / 最终 |  RVPO 最佳 / 最终 |
| ---- | ---------------: | ----------------: |
| 3B   |    0.192 / 0.117 | 0.189 / **0.147** |
| 7B   |    0.198 / 0.026 | **0.230 / 0.204** |
| 14B  |    0.215 / 0.000 | **0.261 / 0.236** |

14B 上，RVPO 相比 GDPO 的最佳分数为 **0.261 vs. 0.215**，差异显著（$p<0.001$）。更关键的是，GDPO 在训练末期降到 0，而 RVPO 仍保持 0.236。

### 7B 分项：优化压力转向瓶颈约束

| HealthBench 维度      |  GDPO |      RVPO |   变化 |
| --------------------- | ----: | --------: | -----: |
| Communication Quality | 47.0% |     45.1% | -1.9pp |
| Instruction Following | 32.5% |     30.1% | -2.4pp |
| Accuracy              | 30.0% | **33.3%** | +3.3pp |
| Context Awareness     | 18.3% | **21.2%** | +2.9pp |
| Completeness          | 11.1% | **15.2%** | +4.1pp |

RVPO 略微牺牲两个容易维度，换来三个瓶颈维度的提升，使总体分数从 0.198 上升至 0.230。这正是论文所声称的“动态难度加权”。

### GPQA-Diamond：保持能力，但证据有限

RVPO 没有明显损害域外科学推理，并且训练末期相对稳定。但测试集只有 198 题，单点估计的 95% 置信区间约为 ±6.5%，所有方法都位于误差范围内，因此不能声称准确率显著提升。

### Tool Calling：更快满足格式约束

RVPO 更快、更稳定地同时收敛到执行正确和格式合规。在 BFCL-v3 上，各方法最终准确率接近：

- 1.5B：RVPO 与 GDPO 均为 71.9%。
- 3B：RVPO 为 80.4%，GDPO 为 80.7%。

因此低维场景中的主要收益是瓶颈约束的学习速度与训练稳定性，而不是最终 benchmark 准确率。

## Ablation

- 固定 $k=5$ 获得最高峰值 0.241，但最终下降至 0.095。
- $k=0.5\rightarrow2.0$ 的峰值为 0.230，最终仍有 0.204，稳定性最佳。
- 均值端点 GDPO（$k=0$）最终为 0.026；hard-min（$k=\infty$）最终为 0。
- 过高风险系数会让“最差目标”频繁切换，造成优化振荡；过低则不足以阻止约束忽略。

## Limitations

1. **风险系数敏感**：最佳 $k$ 取决于奖励维数、group size 和目标冲突程度。
2. **需要课程设计**：高维、动态奖励空间通常需要从较低 $k$ 开始 anneal。
3. **可能放大奖励噪声**：SoftMin 会关注最低 Z-score，即使低分来自不可靠的 reward model。
4. **优先级来自难度而非语义**：RVPO 自动关注最难目标，但不保证它就是业务上最重要的目标。
5. **实验独立重复有限**：rubric 实验在每个模型尺度只报告单次训练；跨尺度一致性不能完全替代同尺度多随机种子验证。

## Takeaways

- 多奖励独立标准化只能解决尺度问题，不能解决均值聚合中的损失补偿。
- SoftMin 是一种计算代价很低的风险敏感聚合器，额外训练开销低于 1%。
- 实际使用时不要直接采用 hard-min；高维奖励空间优先尝试从低风险逐渐升高的课程。
- 这篇论文最有说服力的证据是 HealthBench 的瓶颈维度改善与训练稳定性，而不是 GPQA 或 BFCL 的绝对准确率提升。

## Citation

```bibtex
@article{montero2026rvpo,
  title={RVPO: Risk-Sensitive Alignment via Variance Regularization},
  author={Montero, Ivan and Jurczyk, Tomasz and Dhingra, Bhuwan},
  journal={arXiv preprint arXiv:2605.05750},
  year={2026}
}
```

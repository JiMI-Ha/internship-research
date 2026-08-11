---
title: "GDPO：逐奖励归一化避免多奖励优势坍缩"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Shih-Yang Liu, Xin Dong, Ximing Lu, Shizhe Diao, Peter Belcak, Mingjie Liu, Min-Hung Chen, Hongxu Yin, Yu-Chiang Frank Wang, Kwang-Ting Cheng, Yejin Choi, Jan Kautz, Pavlo Molchanov"
aliases:
  - papers/gdpo
tags:
  - paper
  - RL
  - reward-resemble
  - multi-objective
  - reward-aggregation
  - GRPO
source_url: https://arxiv.org/abs/2601.05242
---

> [!summary] 一句话结论
> 多奖励 GRPO 的问题不只在 reward 权重：先求和再做组内归一化会把不同奖励组合压成相同 advantage。GDPO 先逐通道归一化再聚合，保留了训练信号的分辨率。

## 基本信息

- **论文**：[GDPO: Group reward-Decoupled Normalization Policy Optimization for Multi-reward RL Optimization](https://arxiv.org/abs/2601.05242)
- **版本**：arXiv:2601.05242v1，2026-01-09
- **关键词**：多奖励 RL、GRPO、advantage normalization、训练稳定性

## Motivation

多目标训练常把多个 reward 相加，再直接套用 GRPO。论文指出，组内标准化只看聚合后的标量；不同 reward 向量只要总和相同，就会得到相同 advantage。随着 rollout 或 reward 数增加，可区分的 advantage 组数进一步减少，导致格式、长度等稀疏约束被抹平，甚至提前训练失败。

## Method

GDPO 对每个 prompt 的每个 reward 通道分别做组内标准化：

$$
A_k^{(i,j)}=\frac{r_k^{(i,j)}-\operatorname{mean}_g r_k^{(i,g)}}{\operatorname{std}_g r_k^{(i,g)}+\epsilon}.
$$

随后按目标权重聚合各通道 advantage，并在 batch 级再做一次归一化，使 advantage 的数值范围不随 reward 数量增长。它不改变 GRPO 的 clipped policy objective，主要改动发生在 reward 到 advantage 的映射。

## Experimental Setup

- Tool calling：Qwen2.5-Instruct 1.5B/3B，正确性 reward + 格式 reward，五次训练；在 BFCL-v3 上评估。
- 数学推理：DeepSeek-R1 1.5B/7B 与 Qwen3-4B-Instruct，正确率 + 4K token 长度约束；在 AIME、MATH、AMC、Minerva、OlympiadBench 上评估。
- 代码推理：同时优化通过率、长度和 bug ratio，用于检查三奖励扩展性。
- 主要基线为标准 GRPO 和去掉标准差项的 GRPO。

## Results

- BFCL-v3 上，1.5B 的平均准确率由 GRPO 的 **30.18%** 提升到 **32.81%**，格式正确率由 **76.33%** 提升到 **80.66%**；3B 的对应结果为 **39.20% → 40.87%** 与 **81.64% → 82.23%**。
- 数学任务中，GDPO 相比 GRPO 在 AIME 上最高提升约 **6.3 个百分点**，并把多个模型的超长回答比例压到 1% 左右或更低。
- 收益并非所有单项都严格提高；更稳定的结论是 accuracy–constraint trade-off 与训练收敛更好。

## Ablation

只从 GRPO 中移除标准差归一化虽然增加 advantage 多样性，却使 1.5B tool-calling 模型的格式正确率降到 **0%**。这说明问题不能靠简单取消标准化解决；逐奖励标准化与 batch 级尺度控制需要配套使用。

## Limitations

- 实验最多覆盖三个 reward，尚未证明高维 rubric 下仍稳定。
- reward 权重与难度差异仍需人工设定；GDPO 解决信号坍缩，不解决目标语义优先级。
- 主要是自动 benchmark，缺少真实用户偏好与长期策略行为验证。
- 代码、数学和 tool calling 的可验证 reward 比开放式业务 reward 更干净，外推需谨慎。

## Takeaways

- 多奖励训练应先检查 advantage 是否保留 reward 向量差异，再讨论更复杂的聚合器。
- GDPO 是低侵入性的强基线；RVPO 等风险敏感聚合应在它解决尺度问题后再比较。
- 对业务中的硬格式或长度约束，单看平均 reward 会掩盖训练失败。

## Citation

```bibtex
@article{liu2026gdpo,
  title={GDPO: Group reward-Decoupled Normalization Policy Optimization for Multi-reward RL Optimization},
  author={Liu, Shih-Yang and Dong, Xin and Lu, Ximing and others},
  journal={arXiv preprint arXiv:2601.05242},
  year={2026}
}
```

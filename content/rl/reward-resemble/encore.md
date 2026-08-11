---
title: "ENCORE：用评分熵组合多头安全奖励"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Xiaomin Li, Xupeng Chen, Jingxuan Fan, Eric Hanchen Jiang, Mingye Gao"
aliases:
  - papers/encore
tags:
  - paper
  - RL
  - reward-resemble
  - reward-model
  - safety
  - reward-aggregation
source_url: https://arxiv.org/abs/2503.20995
---

> [!summary] 一句话结论
> ENCORE 观察到安全规则评分熵越高，区分人类偏好的准确率越低；它按 $e^{-H/\tau}$ 给多头 reward 加权，以几乎零额外训练成本提升 RewardBench safety。

## 基本信息

- **论文**：[ENCORE: Entropy-guided Reward Composition for Multi-head Safety Reward Models](https://arxiv.org/abs/2503.20995)
- **版本**：arXiv:2503.20995v2，2025-11-11
- **关键词**：multi-head RM、entropy weighting、安全规则、reward composition

## Motivation

多头 RM 可为每条安全规则单独评分，但简单均匀加权默认所有 head 同样可靠；学习权重又增加训练和可解释性成本。论文在 HH-RLHF 与 PKU-SafeRLHF 上发现，接近均匀分布的高熵评分往往对 chosen/rejected 区分力较弱。

## Method

先用 Llama3-70B-Instruct 按十条安全规则标注回答，训练多头 RM。对第 $k$ 个 head 的评分分布计算熵 $H_k$，再使用：

$$
w_k=\frac{\exp(-H_k/\tau)}{\sum_j\exp(-H_j/\tau)},\qquad
r(x,y)=\sum_kw_kr_k(x,y),
$$

默认 $\tau=2$。理论分析表明，在 Bradley–Terry 优化下，高熵、低区分力 head 的最优权重也趋近于零。

## Experimental Setup

- HH-RLHF 与 PKU-SafeRLHF 合并约 70K 偏好对，十条 GPT-4 辅助选出的安全规则。
- Llama3.1-8B 多头 RM；比较随机/均匀权重、单规则、Bradley–Terry、MoE 与 LLM-as-a-judge。
- RewardBench safety 五个子集；另换 FsFairX-Llama3-8B backbone 检查泛化。

## Results

- 三组数据上的离散熵—准确率 Pearson 相关为 **-0.87、-0.96、-0.93**，相关很强，但仍是观测关系。
- Llama3.1-8B 上，ENCORE safety 平均准确率 **88.5**，高于多头 MoE 的 **86.0**，也高于 Claude-3.5 judge 的 81.6。
- 主要增益来自 DoNotAnswer：MoE **77.2**，ENCORE **91.9**；XSTest-respond 略从 73.6 降至 72.4，说明并非所有子集都改善。

## Ablation

随机、均匀和单规则权重都落后于熵权重；换 backbone 后总体趋势仍在。连续核密度估计得到的熵相关较弱，论文因此采用离散评分熵。

## Limitations

- 熵低可能来自 head 过度确定或输出坍缩，不必然等于判断正确。
- 规则、标签和评测都集中在安全偏好，不能直接外推到通用质量维度。
- 多头 RM 的训练标注依赖 70B judge；“training-free”只指组合阶段，不代表整个系统无训练成本。
- RewardBench 子集规模与分布有限，缺少 policy RL 后的最终行为实验。

## Takeaways

- Head 权重可先用信息量统计做无训练基线，再比较学习式 gating。
- 熵只能衡量分布形态，业务中还应结合校准、覆盖率和人工准确率。
- 逐子集结果比总平均更重要；ENCORE 对 over-refusal 方向仍有轻微退化信号。

## Citation

```bibtex
@article{li2025encore,
  title={ENCORE: Entropy-guided Reward Composition for Multi-head Safety Reward Models},
  author={Li, Xiaomin and Chen, Xupeng and Fan, Jingxuan and Jiang, Eric Hanchen and Gao, Mingye},
  journal={arXiv preprint arXiv:2503.20995},
  year={2025}
}
```

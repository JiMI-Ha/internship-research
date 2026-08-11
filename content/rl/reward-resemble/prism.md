---
title: "PRISM：不要混合奖励，而要组合策略"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Ruiming Liang, Yi Zhong, Yizhen Yuan, Yinan Zheng, Tianyi Tan, Tianyue Wang, Haiyun Guo, Jinqiao Wang, Xianyuan Zhan"
aliases:
  - papers/prism
tags:
  - paper
  - RL
  - reward-resemble
  - multi-reward
  - policy-composition
  - RLHF
  - safety-alignment
source_url: https://arxiv.org/abs/2607.29246
---

> [!summary] 一句话结论
> PRISM 不在标量奖励中提前折中多个目标，而是分别学习各目标的 positive policy，再用共享 negative policy 抵消共同失败模式，并在推理时组合 logits；它在科学推理、工具调用和帮助性—安全性任务中总体优于奖励混合基线，但实验最多只有 3 个奖励，权重仍需手工设定，计算开销也随目标数线性增长。

## 基本信息

- **论文**：[Don't Mix Rewards, Mix Policies: Policy Decomposition and Optimization for Multi-Reward RL](https://arxiv.org/abs/2607.29246)
- **作者**：Ruiming Liang、Yi Zhong、Yizhen Yuan、Yinan Zheng、Tianyi Tan、Tianyue Wang、Haiyun Guo、Jinqiao Wang、Xianyuan Zhan
- **版本**：arXiv:2607.29246v1，2026-07-31
- **关键词**：多奖励强化学习、策略分解、product of experts、负策略、logit 组合

## Motivation

多奖励 RL 通常先把正确性、格式、安全和帮助性等奖励加权成一个标量，再训练一条策略。这会把三个困难揉在一起：

1. 不同奖励尺度和稀疏程度不同，固定加权容易让某一项支配训练；
2. 一个 rollout 同时收到多种甚至冲突的梯度，优化过程不稳定；
3. 训练完成后权衡被固化，部署时想调整安全或帮助性需要重新训练。

作者提出一个结构性替代：每个目标先训练自己的专家策略，部署时再组合这些策略。这样，“学会目标”与“决定目标权重”被分开，权重可以在推理时修改。

## Method

### 1. Positive policies 与共享 negative policy

对每个奖励 $k$，PRISM 学习一条偏向成功行为的 positive policy $\pi_k^+$。所有奖励的失败样本则共同训练一条 negative policy $\pi^-$，用于刻画需要压低的通用失败模式。

目标策略写成 policy product 与 negative ratio：

$$
\pi^*(o\mid q)\propto
\frac{\prod_k \pi_k^+(o\mid q)^{\alpha_k}}
{\pi^-(o\mid q)^\gamma}.
$$

$\alpha_k$ 决定第 $k$ 个目标的强度，$\gamma$ 决定对共同失败模式的抑制。

### 2. 在 token logits 上直接组合

实现时不需要显式归一化整条序列概率。每一步 token 的组合 logit 为：

$$
z_t^*=\sum_k\alpha_k z_{k,t}^+-\gamma z_t^-.
$$

这允许用户在推理阶段调节目标权重，而无需重新进行 RL。组合 rollout 也让各分支在它们最终共同产生的分布上学习，而不是各自孤立训练后再生硬拼接。

### 3. 单 backbone、prefix-conditioned branches

为避免保存 $K+1$ 个完整模型，PRISM 使用共享 backbone，并通过不同 prefix 激活 positive / negative 分支。positive 分支更新共享 backbone；训练 negative branch 时只更新 negative prefix，不把梯度回传到 backbone，以避免“失败行为”污染公共表示。

## Experimental Setup

| 场景          | 模型 / 数据                                                         | 目标与评测                             |
| ------------- | ------------------------------------------------------------------- | -------------------------------------- |
| 科学推理      | DeepSeek-R1-Distill-Qwen-1.5B；Qwen2.5-1.5B / 3B；ScienceQA 与 GPQA | 多个推理奖励，报告综合准确率           |
| 工具调用      | ToolRL 训练，BFCL-v3 测试                                           | 调用正确性与格式等多个奖励，报告 Acc/B |
| 帮助性—安全性 | Qwen2.5-3B                                                          | 多个帮助性数据集与安全集合上的平均评分 |

比较对象包括把奖励先加权或归一化后再训练的多奖励 RL 方法，以及共享 positive policy、无 negative policy、独立 rollout 等结构消融。

## Results

### 科学推理

| 基座                          | PRISM overall | 最强对照 |   差值 |
| ----------------------------- | ------------: | -------: | -----: |
| DeepSeek-R1-Distill-Qwen-1.5B |     **62.73** |    44.96 | +17.77 |
| Qwen2.5-1.5B                  |     **71.34** |    63.30 |  +8.04 |
| Qwen2.5-3B                    |     **69.31** |    68.71 |  +0.60 |

优势随基座与任务而变化：前两个设置差距明显，3B 设置则只有 0.60 分，因此不能把最大提升当成所有规模上的稳定效果。

### 工具调用与帮助性—安全性

- BFCL-v3 的总体 Acc/B：PRISM **53.46**，GDPO **52.13**。
- 帮助性—安全性实验中，PRISM 在报告的平均指标上均略高于对照；例如 Alpaca 评分为 **3.41 vs. 3.26**。

这些结果方向一致，但绝对差距较小。论文更有力地证明了该分解可以工作，而不是证明它在所有任务上都有大幅收益。

## Ablation

BFCL-v3 Acc/B 的结构消融如下：

| 变体                     |     Acc/B |
| ------------------------ | --------: |
| PRISM                    | **53.46** |
| 共享一个 positive policy |     52.56 |
| 移除 negative policy     |     52.84 |
| 各 branch 独立 rollout   |     52.48 |

三种改动都下降，支持“目标专属 positive 分支、共享 negative 分支、组合策略 rollout”各自有贡献。不过差距在 0.62–0.98 分之间，论文没有为这张表提供足以判断稳定性的多随机种子统计。

## Limitations

1. 实验最多组合 3 个奖励，尚未证明分支数量较大时仍能稳定扩展。
2. $\alpha_k$ 与 $\gamma$ 由人工指定；PRISM把权衡推迟到推理阶段，但没有自动解决权重选择。
3. rollout 和前向计算量、显存会随奖励分支数量近似线性增长，共享 backbone 并未消除计算成本。
4. 多分支共享参数仍可能发生表示干扰，prefix conditioning 不能保证专家完全独立。
5. 部分任务上的提升很小，且报告中的统计不确定性有限，需要更多 seeds 和更广泛任务验证。

## Takeaways

- PRISM 的关键洞见是把“各目标能力学习”和“目标权衡”分开：先得到专家，再在 logits 上组合。
- negative policy 相当于显式建模多个任务共有的失败方向，而不是要求每个 positive expert 重复学习回避它。
- 推理时可调权重适合需求会变化的部署环境，但它并没有消除选择权重与验证安全边界的责任。
- 当前证据支持最多三目标的小规模组合；更高维奖励、计算成本和稳定性仍是主要开放问题。

## Citation

```bibtex
@article{liang2026prism,
  title={Don't Mix Rewards, Mix Policies: Policy Decomposition and Optimization for Multi-Reward RL},
  author={Liang, Ruiming and Zhong, Yi and Yuan, Yizhen and Zheng, Yinan and Tan, Tianyi and Wang, Tianyue and Guo, Haiyun and Wang, Jinqiao and Zhan, Xianyuan},
  journal={arXiv preprint arXiv:2607.29246},
  year={2026}
}
```

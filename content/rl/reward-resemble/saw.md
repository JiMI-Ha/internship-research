---
title: "SAW：按奖励信息量动态调权，缓解多目标异步饱和"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
business_fit: 0
paper_solidity: 0
authors: "Yuchen He, Baolong Bi, Shenghua Liu, Huaming Liao, Yuyao Ge, Bolin Wan, Siqian Tong, Juan Chen, Jiafeng Guo, Xueqi Cheng"
aliases:
  - papers/saw
tags:
  - paper
  - RL
  - reward-resemble
  - multi-objective
  - dynamic-weighting
  - reward-aggregation
  - GRPO
  - GDPO
source_url: https://arxiv.org/abs/2606.07705
---

> [!summary] 一句话结论
> SAW 保留线性奖励求和，只用当前 batch 中各奖励维度的变异系数估计“还有多少可学习信息”：低变异维度降权，高变异维度升权。它在两个双奖励任务上以不到 3% 的时间开销改善 GRPO/GDPO，但“低方差 = 已学会”只是代理假设，并未在高维奖励或开放式 Reward Model 上得到验证。

## 基本信息

- **论文**：[SAW: Stage-Aware Dynamic Weighting for Multi-Objective Reinforcement Learning in Large Language Models](https://arxiv.org/abs/2606.07705)
- **版本**：arXiv:2606.07705v1，2026-06-05
- **代码**：[Zhaolutuan/SAW](https://github.com/Zhaolutuan/SAW)
- **关键词**：多奖励 RL、动态权重、变异系数、GRPO、GDPO、异步收敛

## Motivation

多目标 RL 通常固定权重并线性求和：

$$
r_{\mathrm{sum}}^{(i,j)}=\sum_{k=1}^{n}\omega_k r_k^{(i,j)}.
$$

问题不只是各奖励尺度不同，而是各目标的学习速度不同。论文在 ToolRL 中观察到：正确性奖励约在第 25–30 步趋于平台，格式奖励则更晚才进入快速学习期。已经接近饱和的维度只剩很小的随机波动，仍会通过固定权重进入策略更新：

- **GRPO** 先聚合 reward 再组内归一化，饱和维度的残余噪声可能抵消仍在学习维度的真实差异。
- **GDPO** 先把每个维度归一化为单位方差，反而会把饱和维度的微小噪声放大到与真实信号相同的量级；即使没有 reward collapse，它仍固定占用 $1/n$ 的 advantage 预算。

作者因此把问题定义为 **reward learning asynchrony**：优化预算应随每个维度当前的信息量变化，而不是在整个训练过程中固定分配。

## Method

### 1. 用变异系数估计实时信息量

对 batch 中第 $k$ 个奖励维度，先计算均值与标准差，再定义：

$$
\mathrm{CV}_k=\frac{\sigma_k}{\mu_k+\delta}.
$$

CV 以均值归一化标准差，因此比原始方差更能跨量纲比较。论文将高 CV 解释为 batch 内仍存在可区分的好坏样本，低 CV 则表示该维度已经趋同、提供的信息减少。

若奖励可能为负，先用已知理论下界平移：

$$
\tilde r_k^{(j)}=r_k^{(j)}-r_k^{\min}+\delta,
$$

再在 $\tilde r_k$ 上计算 CV。所有 CV 都接近零时退回等权。

### 2. 按相对 CV 分配权重

基础动态权重为：

$$
\omega_k'=\frac{\mathrm{CV}_k}{\sum_{l=1}^{n}\mathrm{CV}_l}.
$$

- **接入 GRPO**：直接令 $\omega_k=\omega_k'$，在 reward 层做加权求和，再执行标准 GRPO 组内归一化。
- **接入 GDPO**：先逐奖励计算归一化 advantage，再令 $\omega_k=n\omega_k'$ 后聚合，乘 $n$ 是为了保持与等权 GDPO 相近的 advantage 尺度。

SAW 不保存跨 step 状态，也没有可学习参数；每一步仅根据当前 batch 的均值和标准差重算权重。业务优先级仍可用静态系数 $\alpha_k$ 保留：

$$
r_{\mathrm{sum}}^{(j)}=\sum_k \omega_k\alpha_k r_k^{(j)}.
$$

由于 CV 对乘法尺度不变，$\alpha_k$ 控制语义优先级，$\omega_k$ 控制当前训练预算。

## Experimental Setup

### ToolRL

- 基座：Qwen2.5-1.5B-Instruct 与 Qwen2.5-3B-Instruct，使用 verl、4 张 NVIDIA A100 80GB。
- 训练集：4,000 条工具调用数据，其中 ToolACE 2,000、Hammer 1,000、xLAM 1,000。
- 两个奖励：格式奖励 $R_{\mathrm{format}}\in\{0,1\}$；正确性奖励 $R_{\mathrm{correct}}\in[-3,3]$。
- 评估：BFCL-v4 的 Non-Live 1,150、Live 1,381、Multi-Turn 800 条；每个实例评估 4 次后取均值。

### Reddit TL;DR

- 基座：Qwen2.5-1.5B-Instruct；随机取 2,560 条训练、256 条评估。
- 两个奖励：质量与简洁性，均由 Gemini-3-flash-preview-nothinking 按 rubric 给出 0–10 分；温度 0.1。
- 同一套 judge 与 rubric 同时用于训练和评估；评估运行 4 次并对实例分数取均值。

基线包括等权 GRPO、等权 GDPO，以及论文 [[rl/reward-resemble/dynamic-reward-weighting|Dynamic Reward Weighting]] 的梯度调权版本。

## Results

### Tool calling

| 模型 / 框架         | 等权基线 Overall Acc |       +SAW |     变化 |
| ------------------- | -------------------: | ---------: | -------: |
| Qwen2.5-1.5B / GRPO |               32.55% | **33.53%** | +0.98 pp |
| Qwen2.5-1.5B / GDPO |               33.82% | **34.02%** | +0.20 pp |
| Qwen2.5-3B / GRPO   |               36.27% | **36.35%** | +0.08 pp |
| Qwen2.5-3B / GDPO   |               35.58% | **36.62%** | +1.04 pp |

SAW 对总体准确率均有改善，但子集结果并非全面领先：例如 1.5B 的 GRPO+Gradient 在 Non-Live 上高于 GRPO+SAW，GDPO+Gradient 在 Live 与 Multi-Turn 上也更高。因此更稳妥的结论是 **整体 trade-off 改善，而非每个指标都占优**。

训练曲线显示，在正确性约第 25–30 步饱和后，GRPO+SAW 的格式奖励更快上升，而正确性基本不受损；GDPO 下三种方法最终奖励接近，SAW 的主要作用发生在训练早中期。

### Reddit TL;DR

| 框架 | 等权总分 | +SAW 总分 | 质量 / 简洁性 |
| ---- | -------: | --------: | ------------: |
| GRPO |    18.20 | **18.80** |   9.15 / 9.65 |
| GDPO |    18.80 | **19.07** |   9.35 / 9.72 |

两个 reward 在整个训练中都没有明显饱和，SAW 仍改善两项分数，说明收益不只来自“某一维先完全学完”的单一场景。不过评估集只有 256 条，且训练与评估共享同一个 LLM judge，结果更接近同一评分器下的一致性改善，而不是独立的人类偏好验证。

### 计算开销

在 ToolRL 中，SAW 相对 GRPO/GDPO 的单步 wall-clock 增幅为 **0.9%–2.7%**；梯度调权增幅为 **158.7%–188.7%**。SAW 的计算量是 batch 统计量级 $O(nN)$，不需要每个目标额外做一次前向与反向传播。

## Ablation 与机制证据

论文没有提供完整的组件消融，例如没有分别移除 reward offset、全零回退、GDPO 的 $\times n$ 尺度补偿，也没有直接比较 batch-level 与 group-level CV。现有证据主要是：

- 等权、梯度调权与 SAW 的同框比较；
- GRPO 与 GDPO 两种接入位置的交叉验证；
- per-dimension reward/CV 曲线与 wall-clock 对照。

这些结果支持“低成本动态调权有效”，但尚不足以证明 CV 是最佳饱和度指标，或性能提升完全由论文提出的噪声机制导致。

## Limitations

- **CV 不具平移不变性**：为了让均值为正而加入的 offset 会压缩 CV 动态范围；未知理论下界的 learned reward model 需要另行估计下界或归一化。
- **只有两个奖励维度**：ToolRL 和 TL;DR 都是 $n=2$，尚无证据表明十几个 rubric 维度下仍稳定。
- **低方差不等于已经学会**：恒定但有偏的 judge、reward collapse 或模式坍缩同样可能产生低 CV；SAW 只观察分布离散度，不能识别语义正确性。
- **无跨步平滑**：权重完全由当前 batch 决定，可能受 batch 组成影响；论文未验证 EMA、权重下限或变化限幅。
- **验证范围有限**：只测试 GRPO/GDPO、Qwen2.5 和两类任务；对 PPO、REINFORCE、开放式人类反馈及更多模型的外推仍待验证。
- **评估独立性有限**：TL;DR 的训练 reward 与测试评分来自同一 Gemini judge，缺少人评或异构 judge 交叉验证。

## Takeaways

- 如果目标是“先等权、再静态业务调权、最后动态调权”，SAW 可以作为第三阶段的低成本首选：先用 $\alpha_k$ 固定业务底线，再用 CV 分配实时训练预算。
- 在接 SAW 之前，应先用 [[rl/reward-resemble/gdpo|GDPO]] 检查 reward 到 advantage 的信息是否坍缩；两者处理的是不同层面的问题，可以组合。
- 工程实现应额外记录每维均值、方差、CV、动态权重与离线真实性能；若 CV 下降但验证指标没有改善，不应把它解释为“已经学会”。
- 高风险目标最好设置最小权重或硬约束，避免仅因当前 batch 低方差就被动态机制长期忽略。

## Citation

```bibtex
@article{he2026saw,
  title={SAW: Stage-Aware Dynamic Weighting for Multi-Objective Reinforcement Learning in Large Language Models},
  author={He, Yuchen and Bi, Baolong and Liu, Shenghua and Liao, Huaming and Ge, Yuyao and Wan, Bolin and Tong, Siqian and Chen, Juan and Guo, Jiafeng and Cheng, Xueqi},
  journal={arXiv preprint arXiv:2606.07705},
  year={2026}
}
```

---
title: "CAN：通过最优对偶化实现一次训练的安全对齐"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Xinmeng Huang, Shuo Li, Edgar Dobriban, Osbert Bastani, Hamed Hassani, Dongsheng Ding"
aliases:
  - papers/optimal-dualization-can
tags:
  - paper
  - RL
  - reward-resemble
  - safety-alignment
  - constrained-optimization
  - duality
  - DPO
source_url: https://arxiv.org/abs/2405.19544
---

> [!summary] 一句话结论
> CAN 先在离线样本上求满足安全 margin 的最优拉格朗日乘子，再把 reward 与 safety 合成一次无约束训练目标，避免反复交替更新策略和乘子；MOCAN 在 Alpaca-7B / PKU-SafeRLHF 上形成更优的经验 Pareto 前沿，预测 margin 与实测置信区间基本对应，但证据只来自一个 7B 模型和单一约束，并依赖代理 reward / safety model。

## 基本信息

- **论文**：[One-Shot Safety Alignment for Large Language Models via Optimal Dualization](https://arxiv.org/abs/2405.19544)
- **作者**：Xinmeng Huang、Shuo Li、Edgar Dobriban、Osbert Bastani、Hamed Hassani、Dongsheng Ding
- **版本**：arXiv:2405.19544v3，2024-11-22；NeurIPS 2024
- **方法族**：CAN（Constrained Alignment via optimal dualizatioN）、MOCAN、PECAN
- **关键词**：安全约束、最优对偶化、一次训练、Pareto 前沿、离线拉格朗日优化

## Motivation

安全对齐希望在提高帮助性 reward 的同时，保证模型相对参考策略至少达到某个 safety improvement。常见的拉格朗日 RL 方法在训练中交替更新策略与乘子，代价高、超参数敏感，而且策略变化会让约束估计不断漂移。

DPO 一类一次性离线优化更简单，却通常把多个目标用固定权重合并，不能直接保证给定安全 margin。论文提出的问题是：能否先在不训练策略的情况下求出正确的约束权重，然后只训练一次模型？

## Method

### 1. 带 KL 正则的安全约束目标

对 prompt $x$ 与回答 $y$，优化 reward $r(x,y)$，并要求相对参考策略 $\pi_{\mathrm{ref}}$ 的 safety 特征 $h(x,y)$ 改善至少达到指定 margin。KL 正则系数 $\beta$ 限制策略偏移。

把约束引入拉格朗日乘子 $\lambda\ge0$ 后，对固定 $\lambda$ 的最优策略具有指数倾斜形式。由此可消去策略变量，得到只关于 $\lambda$ 的闭式对偶函数：

$$
D(\lambda)=\beta\,\mathbb{E}_x
\log\mathbb{E}_{y\sim\pi_{\mathrm{ref}}}
\exp\left(\frac{r(x,y)+\langle\lambda,h(x,y)\rangle}{\beta}\right).
$$

约束 margin 的常数项按论文定义并入对偶目标；核心是 $D(\lambda)$ 可用参考策略的离线采样估计，无需在每次更新 $\lambda$ 后重新训练模型。

### 2. CAN 的两阶段训练

1. 从 $\pi_{\mathrm{ref}}$ 为一批 prompts 采样大量 responses，计算 reward 与 safety 特征；
2. 在这些固定样本上优化低维对偶变量，得到 $\lambda^*$；
3. 只进行一次以 $r+\langle\lambda^*,h\rangle$ 为目标的无约束偏好优化。

因此 “one-shot” 指模型训练只做一次，不是只用一条样本或一个梯度步骤。

### 3. MOCAN 与 PECAN

- **MOCAN**：使用显式 reward model 和 safety / cost model 计算离线分数。
- **PECAN**：不要求显式评分模型，而用预先对齐策略与参考策略的 log-probability ratio 构造相应信号。

PECAN 更接近纯偏好优化，但它要求预对齐策略的概率比能够良好校准真实 reward / safety；论文实验显示这一假设会带来性能损失。

## Experimental Setup

| 项目     | 设置                                              |
| -------- | ------------------------------------------------- |
| 基座     | 复现的 Alpaca-7B                                  |
| 数据     | PKU-SafeRLHF-30K，约 27K train / 3K test          |
| 代理模型 | Beaver reward model 与 cost model                 |
| 对偶估计 | 1,000 prompts，每个采样 128 responses             |
| 对照     | SFT、DPO、Safe-RLHF 及不同固定 / 最优乘子设置     |
| 评测     | GPT-4 成对评测与 model-based reward / safety 分数 |
| 计算     | 单张 NVIDIA A6000，完整流程约 15 小时             |

## Results

### 预测安全 margin 与实测结果基本一致

| $\lambda$ | 预测 safety improvement | Bootstrap 95% CI |
| --------: | ----------------------: | ---------------: |
|      0.35 |                    0.09 |   $[0.02, 0.67]$ |
|      0.50 |                    1.20 |   $[1.24, 1.91]$ |
|      2.00 |                    5.39 |   $[5.00, 5.39]$ |

预测值与实测区间并非逐项完全重合，例如 $\lambda=0.50$ 的预测 1.20 略低于区间下界 1.24；但整体随 $\lambda$ 增大的趋势和量级吻合，支持离线对偶估计可控制安全水平的主张。

### MOCAN 的经验 Pareto 前沿

在 model-based 和 GPT-4 评测中，MOCAN 的多个 safety margin 设置形成一条优于 SFT、DPO 与 Safe-RLHF 对照的经验 Pareto 前沿：达到相近安全水平时 reward 更高，或相近 reward 时更安全。

PECAN 也呈现可控权衡，但整体略弱于 MOCAN。论文将差距归因于预对齐模型的 log-probability ratio 对真实 reward / safety 校准不足；这是合理解释，但实验没有完全隔离其他可能原因。

### 样本与计算效率

- 对偶变量在约 600 个 prompts 后趋于稳定。
- 每个 prompt 少于约 100 个 responses 时，重要性加权估计偏保守。
- 单 A6000 约 15 小时；作者估算至少比对照快 25%，但部分对照成本来自配置推算，而非完全同硬件端到端计时，因此应把 25% 视为近似值。

## Ablation

1. **对偶 prompt 数量**：prompt 增至约 600 后 $\lambda^*$ 变化变小，说明低维对偶估计不需要覆盖全部训练数据。
2. **每个 prompt 的 response 数**：样本少于约 100 时估计偏保守；128 responses 是准确性与采样成本的折中。
3. **MOCAN vs. PECAN**：去掉显式 reward / safety model 后仍可控制方向，但 Pareto 表现下降，显示概率比校准是 PECAN 的瓶颈。
4. **不同 margin**：改变约束 margin 能沿 Pareto 前沿移动，而不是每个目标都重新搜索固定混合权重。

## Limitations

1. 理论与实现基于 Bradley-Terry 类偏好模型，未验证更一般的非传递或上下文依赖偏好。
2. 实验只有一个安全约束、一个 7B 基座与单一主要数据集，扩展到多个约束和更大模型仍待验证。
3. MOCAN 依赖 proxy reward / safety models；如果代理模型有偏差，精确满足的只是代理约束。
4. PECAN 依赖预对齐模型的 log-probability calibration，实验中已经观察到性能差距。
5. 离线采样来自参考策略；目标策略偏移过大时，重要性估计与覆盖可能变差。
6. 训练时间优势部分基于间接估算，不能视为严格的系统 benchmark。

## Takeaways

- CAN 把昂贵的“策略—乘子交替训练”化为“先解低维对偶，再训练一次策略”。
- 它比固定加权更接近产品中的约束需求：先指定安全 margin，再由数据反推出权重。
- 离线对偶优化可以相对省样本，但每个 prompt 仍需大量候选回答以稳定估计指数加权项。
- 当前最强证据是 MOCAN 在单约束 7B 设置上的 Pareto 改善；跨模型、跨约束的普适性还没有得到证明。

## Citation

```bibtex
@inproceedings{huang2024oneshot,
  title={One-Shot Safety Alignment for Large Language Models via Optimal Dualization},
  author={Huang, Xinmeng and Li, Shuo and Dobriban, Edgar and Bastani, Osbert and Hassani, Hamed and Ding, Dongsheng},
  booktitle={Advances in Neural Information Processing Systems},
  year={2024}
}
```

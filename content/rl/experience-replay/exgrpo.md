---
title: "ExGRPO：按经验价值选择历史成功轨迹"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, RL, RLVR, experience-replay, GRPO, off-policy]
source_url: https://arxiv.org/abs/2510.02245
---

> [!summary] 核心结论
> ExGRPO 是 RLEP 最直接的算法继承者：不再随机回放所有旧成功答案，而是优先选择当前仍有学习价值的问题和低熵轨迹，并显式保留历史行为概率来处理 mixed-policy 更新。

## 基本信息

- **论文**：[ExGRPO: Learning to Reason from Experience](https://arxiv.org/abs/2510.02245)
- **版本**：ICLR 2026 conference paper；arXiv:2510.02245

## Motivation

成功轨迹并非一直有用：太简单的问题很快失去梯度，太难的问题可能只有偶然命中；高熵、低置信的历史答案也可能与当前策略差距过大。RLEP 的随机成功回放没有回答“哪条经验在当前时刻最值得学”，固定 replay 比例还可能压缩新的探索。

## Method

1. 用当前成功率估计 prompt 难度，优先抽取成功率居中的样本，而不是已饱和或几乎不可解的问题。
2. 在成功经验中，按当前 policy 下的序列熵筛选更稳定、置信更高的轨迹。
3. 训练 batch 约由 50% fresh rollout 与 50% replay 构成；保存 behavior log-prob，使用 mixed-policy objective 与 policy shaping 控制分布偏移。
4. 采用 delayed start，等当前策略具备基本解题能力后再开启 replay，避免早期经验质量不足。

## Experimental Setup

- **模型**：覆盖 1.5B–8B 的五种 backbone/初始化设置，核心对照包含 Qwen2.5-Math-7B。
- **任务**：数学 RLVR，并区分训练分布内（ID）和分布外（OOD）评测。
- **比较**：GRPO/RLVR 基线、随机经验回放，以及不同 replay ratio、prompt 难度与轨迹选择策略。

## Results

- 在 Qwen2.5-Math-7B 上，论文报告 ID 平均分 **45.3→48.3**，OOD 平均分 **56.4→58.3**。
- 跨全部 backbone，论文汇总相对 on-policy 的 ID/OOD 平均增益为 **+3.5/+7.6 分**；1.5B–8B 设置都观察到提升。
- 这些数字来自论文各自的聚合评测，不能与不同训练集和采样预算的 RLEP 绝对分数直接排名。

## Ablation

- 约 50% replay 优于 75%；历史数据占比过高时，后期探索和最终上限受损。
- 中等难度 prompt 与低熵成功轨迹的组合优于无差别随机 replay。
- delayed start、behavior probability 和 policy shaping 都是稳定训练的重要组成；这说明收益并非仅来自“多训练旧答案”。

## Limitations

- 经验价值主要由成功率和序列熵代理，未必等于长期策略改进价值。
- 仍以可验证数学任务为主；对开放式 reward、长工具链和 verifier 噪声的适用性未充分验证。
- 50% replay 是较高占比，算力节省与最终性能需要按具体系统重新权衡。

## Takeaways

ExGRPO 给 RLEP 的关键升级是把 replay 从“有就回放”变成“按当前学习价值回放”。实践中最值得复用的是**当前刚好能学会的题 + 当前策略仍能理解的低熵正确轨迹**。

## Citation

Zhan et al. _ExGRPO: Learning to Reason from Experience_. ICLR 2026, arXiv:2510.02245.

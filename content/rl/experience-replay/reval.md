---
title: "ReVal：用 Bellman 更新与 Replay Buffer 训练 LLM"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
business_fit: 3
paper_solidity: 4
tags: [paper, RL, value-based, experience-replay, off-policy, reasoning]
source_url: https://arxiv.org/abs/2603.23355
---

> [!summary] 核心结论
> ReVal 把 LLM token logits 解释为隐式 Q-value，用 Bellman residual 反复训练历史轨迹。它从 policy-gradient replay 转向 value-based off-policy RL，完整训练平均分提高，但摘要中的 4.3× 只来自单题收敛实验。

## 基本信息

- **论文**：[Off-Policy Value-Based Reinforcement Learning for Large Language Models](https://arxiv.org/abs/2603.23355)
- **方法名**：ReVal

## Motivation

PPO/GRPO 天然偏 on-policy，重复使用旧轨迹需要 importance correction，且比率方差随 policy gap 增大。经典 value-based RL 更适合 replay buffer，但把离散动作 Q-learning 直接扩展到巨大词表并不容易。论文尝试从模型已有 logits 中构造可训练的 token value。

## Method

1. 将每个 token 的 logit/能量解释为相对 Q-value。
2. 根据序列 reward 构造 token-level Bellman residual，训练模型满足价值一致性。
3. 把历史轨迹存入 FIFO replay buffer，在收集 fresh 数据之间执行多次 value updates。
4. 配合 reward shaping、KL 正则与超参数 β 控制价值尺度和策略漂移。

## Experimental Setup

- **模型**：DeepSeek-R1-Distill-1.5B、Qwen2.5-Math-7B。
- **评测**：AIME24、AIME25、AMC、MATH、Minerva、Olympiad、GPQA，使用 avg@16。
- **对照**：GRPO 与 on-policy value-based TBRM；另用难度不同的单题测试复用次数与收敛速度。

## Results

| 模型                     | GRPO 平均 | ReVal 平均 |
| ------------------------ | --------: | ---------: |
| DeepSeek-R1-Distill-1.5B |      43.4 |   **45.6** |
| Qwen2.5-Math-7B          |      38.4 |   **39.6** |

- 单题实验平均 **4.3×** 更快达到目标分数（难/中/易分别约 3.6×、4.1×、5.2×）。这不是完整训练的 4.3× wall-clock。
- 一项完整成本对比中，generation 次数 580→470，总时间 **7.5h→6.3h**，约下降 **18%**。

## Ablation

- 论文分别考察 KL regularization、β 与 reward design；这些设计会影响 Q-value 尺度和训练稳定性。
- rollout 极少（N=1）时 replay 价值更明显，支持“生成稀缺时多做 value update”的动机。
- on-policy TBRM 未达到 ReVal，说明收益不只来自 value formulation，也来自 off-policy 复用。

## Limitations

- logits 作为 Q-value 是建模选择，不保证具有严格校准的跨状态可比性。
- 4.3× 是受控单题收敛数字，不能当作端到端训练加速标题。
- 结果仍集中在数学任务，Bellman bootstrap 在噪声 reward 下可能累积误差。

## Takeaways

ReVal 表明 replay 不必被限制在 PPO/GRPO 目标内。若生成远贵于梯度更新，value-based 多次更新可能更合算，但应报告完整 wall-clock，并检查 bootstrap 误差。

## Citation

Wang et al. _Off-Policy Value-Based Reinforcement Learning for Large Language Models_. arXiv:2603.23355, 2026.

---
title: "KDRL：统一知识蒸馏与强化学习吸收教师推理"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, RL, knowledge-distillation, expert-trajectory, reasoning]
source_url: https://arxiv.org/abs/2506.02208
---

> [!summary] 核心结论
> KDRL 在同一目标中结合教师知识蒸馏和 RL，让学生既学习外部推理分布又根据 verifier reward 自我改进。1.5B 学生的 KDRL-Annealing 平均 57.2，高于 GRPO 54.6 和 SFT 51.5。

## 基本信息

- **论文**：[KDRL: Post-Training Reasoning LLMs via Unified Knowledge Distillation and Reinforcement Learning](https://arxiv.org/abs/2506.02208)
- **作者**：Hongling Xu、Qi Zhu、Heyuan Deng、Jinpeng Li、Lu Hou、Yasheng Wang、Lifeng Shang、Ruifeng Xu、Fei Mi

## Motivation

SFT 只模仿单条教师答案，可能损失分布信息；标准 KD 能传递 token 概率，却不直接优化任务 reward；纯 RL 对弱学生又有探索冷启动。论文尝试在一次 post-training 中统一“跟老师学”和“按结果自我修正”。

## Method

1. 从 teacher 获取推理分布/轨迹，对 student 施加知识蒸馏目标。
2. 同时对 student rollout 使用可验证 reward 和 RL 目标。
3. KDRL-Annealing 随训练调整 KD 与 RL 的相对强度，使早期更多吸收、后期更多探索。
4. 对部分 token 做 masking，减少冗长、低价值的蒸馏计算。

## Experimental Setup

- **学生**：1.5B 模型。
- **教师**：Skywork-OR1-Math-7B。
- **训练**：280 steps。
- **评测**：多项数学推理 benchmark；比较 SFT、GRPO、KD-RKL、KDRL 及退火版本。

## Results

| 方法           |   平均分 |
| -------------- | -------: |
| SFT            |     51.5 |
| GRPO           |     54.6 |
| KD-RKL         |     56.1 |
| KDRL           |     56.8 |
| KDRL-Annealing | **57.2** |

KDRL 同时高于单独 RL 和单独蒸馏类基线，但上限与成本依赖 7B teacher。

## Ablation

- $k=2$ 的设置优于 $k=3$，说明增加教师候选/内部更新并非单调有利。
- masking 可减少 **1.4K+ tokens** 而基本保持准确率，提高了知识传递效率。
- Annealing 比固定 KD/RL 比例再高 0.4 分，支持动态转移训练重心。

## Limitations

- 不是严格经验 replay：知识主要来自外部教师，而非学生自己的历史成功。
- 只重点验证 1.5B student 与特定 7B teacher，教师选择敏感性有限。
- 平均分差距较小，缺少更广泛随机种子时应避免过度强调 0.4 分优势。

## Takeaways

KDRL 说明外部轨迹注入不必在 SFT 与 RL 二选一。更稳的方案是早期利用教师降低搜索难度，随后逐步把优化权交给任务 reward。

## Citation

Xu et al. _KDRL: Post-Training Reasoning LLMs via Unified Knowledge Distillation and Reinforcement Learning_. arXiv:2506.02208, 2025.

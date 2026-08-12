---
title: "LUFFY：全失败时用外部专家轨迹做 Off-Policy Guidance"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
business_fit: 5
paper_solidity: 4
tags: [paper, RLVR, off-policy, expert-trajectory, reasoning]
source_url: https://arxiv.org/abs/2504.14945
---

> [!summary] 核心结论
> LUFFY 在 on-policy rollout 全失败时引入 DeepSeek-R1 等专家轨迹，并通过 mixed-policy advantage 与 policy shaping 缩小模仿僵化和 policy gap。Qwen2.5-Math-7B 六项平均 50.1，较既有 RLVR 高 6.4 分。

## 基本信息

- **论文**：[Learning to Reason under Off-Policy Guidance](https://arxiv.org/abs/2504.14945)
- **方法名**：LUFFY

## Motivation

弱模型对困难问题可能永远采不到正奖励，纯 on-policy RLVR 无法启动；直接用 SFT 模仿强模型则容易让学生只追随专家表面表达，且专家轨迹概率在学生策略下极低。论文要在保留探索的同时利用外部推理知识。

## Method

1. 当当前模型对某 prompt 的 rollout 全失败时，引入 DeepSeek-R1 等强模型的正确轨迹。
2. 将专家与当前策略轨迹组成 mixed-policy batch，重新设计 advantage 计算。
3. 用 regularized importance sampling 做 policy shaping，限制学生对远离自身分布 token 的僵硬模仿。
4. 对 clipping 做相应调整，使稀有正轨迹仍能产生有效更新。

## Experimental Setup

- **主模型**：Qwen2.5-Math-7B，并验证 1.5B 及 Llama3.1-8B 等弱基座。
- **训练**：主设置 8×A100、500 steps。
- **评测**：AIME24/25、AMC、MATH-500、Minerva、OlympiadBench；另有三项 OOD 测试。

## Results

- 六个数学 benchmark 平均 **50.1**，相对既有 RLVR 平均高 **6.4 分**。
- OOD 平均 **57.8**，相对最佳 RLVR 对照高 **6.2 分**。
- 相对纯 on-policy RL，论文报告平均高 4.6 分；在纯 on-policy 几乎无法训练的弱模型上仍能启动学习。

## Ablation

- Mixed-Policy RL 平均 44.4；加入 shaping 后 47.8；再配合 NoClip 设计达到 **50.1**。
- shaping 系数 $γ=0.1$ 最佳，向上或向下调整都会下降。
- 直接 SFT、SFT+RL 或简单加入 SFT loss 都不及完整 LUFFY，支持“安全吸收”比直接模仿重要。

## Limitations

- 依赖可获取、可许可的强教师轨迹，不能视为纯 self-improvement。
- 教师质量和风格会决定上限，也可能带来数据污染。
- 主要证据仍是数学 verifier；开放式任务中专家答案的 reward 和 policy gap 更难处理。

## Takeaways

LUFFY 解决的是 RLEP 无法覆盖的冷启动：模型从未成功时，自己的 buffer 为空。关键不是简单塞入专家答案，而是用 mixed-policy shaping 让学生逐步吸收。

## Citation

Yan et al. _Learning to Reason under Off-Policy Guidance_. arXiv:2504.14945, 2025.

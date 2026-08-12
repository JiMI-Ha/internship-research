---
title: "Trajectory Balance with Asynchrony：解耦异步探索与学习"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
business_fit: 3
paper_solidity: 4
tags: [paper, RL, off-policy, asynchronous, GFlowNet, experience-replay]
source_url: https://arxiv.org/abs/2503.18929
---

> [!summary] 核心结论
> TBA 让多个异步 searcher 持续向共享 replay buffer 提供多样轨迹，再用 GFlowNet 的 trajectory-balance loss 学习。它的重点是系统级探索—学习解耦，而非 GRPO 中追加少量旧答案。

## 基本信息

- **论文**：[Trajectory Balance with Asynchrony: Decoupling Exploration and Learning for Fast, Scalable LLM Post-Training](https://arxiv.org/abs/2503.18929)
- **简称**：TBA

## Motivation

同步 on-policy RL 会让训练器等待生成，actor 数增加后仍受最慢 worker 限制；严格 on-policy 还无法充分使用并行搜索积累的轨迹。论文希望让探索器和 learner 独立运行，同时用适合 off-policy 数据的目标维持多样性。

## Method

1. 多个异步 searcher 使用不同探索状态持续生成轨迹。
2. 轨迹进入共享 replay buffer，并按 reward 与 recency 等信号抽样。
3. learner 使用 trajectory-balance loss，使轨迹概率与 reward 匹配，而不是直接使用 PPO/GRPO importance-ratio 目标。
4. 搜索与梯度更新并行，周期性同步策略参数。

## Experimental Setup

- **任务**：数学推理、偏好微调与 automated red teaming。
- **模型/系统**：覆盖 GPT-2、Llama 3.2 1B 等设置；根据任务进行 compute-matched 或 wall-clock 比较。
- **对照**：VinePPO、异步 DPO、同步 GFlowNet 等。

## Results

- 数学推理的 compute-matched 对比中，TBA 相对性能可比的 VinePPO **接近 50× 更快**，准确率高 **1.8 个百分点**。
- 偏好微调中，相对速度优化的异步 DPO 约 **5×** 加速。
- automated red teaming 中，相对非分布式同步 GFlowNet 约 **7×** 加速。

这些速度数字来自不同任务和匹配协议，不能相互合并，也不能当作通用训练加速倍数。

## Ablation

- 异步 searcher 数和 buffer 采样方式影响覆盖度与吞吐。
- trajectory-balance 梯度方差较高，论文每个 query 使用的响应数多于 RLOO 类方法（如 20 vs. 4）。
- 纯系统异步与 loss 设计共同贡献速度，无法只归因于 buffer。

## Limitations

- 更高的每题采样数会增加瞬时生成需求。
- GFlowNet/TB 目标与常见 GRPO recipe 差异大，迁移成本高。
- 跨任务速度对比依赖硬件、并发和匹配条件，复现时必须逐项核对。

## Takeaways

TBA 适合大规模 actor—learner 架构：buffer 是解耦接口，trajectory balance 是 off-policy 学习接口。它回答的是“怎样持续消费异步探索”，而非“怎样回放一小部分旧正确答案”。

## Citation

Bartoldson et al. _Trajectory Balance with Asynchrony: Decoupling Exploration and Learning for Fast, Scalable LLM Post-Training_. arXiv:2503.18929, 2025.

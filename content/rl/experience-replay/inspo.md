---
title: "INSPO：用失败经验进化 Instruction，而非直接回放给 Actor"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
business_fit: 4
paper_solidity: 4
tags: [paper, RL, agent, instruction-optimization, experience-replay]
source_url: https://arxiv.org/abs/2512.01945
---

> [!summary] 核心结论
> INSPO 让 instruction 与 policy 共同进化：失败轨迹进入 replay buffer 后，主要供 LLM optimizer 反思并生成新 instruction，而不是直接作为 actor 的梯度样本。Qwen2.5-3B 七项平均 EM 38.2%，比 Search-R1 高 6 个百分点。

## 基本信息

- **论文**：[Agentic Policy Optimization via Instruction-Policy Co-Evolution](https://arxiv.org/abs/2512.01945)
- **方法名**：INSPO

## Motivation

多轮搜索 agent 的系统 instruction 通常固定，policy 即使更新，也可能持续受同一提示策略限制。失败轨迹直接做负样本容易受到长程 credit assignment 干扰。论文改为用历史失败告诉一个 instruction proposer“策略规则哪里需要改”。

## Method

1. 维护 7 个 instruction candidates，并根据各自 rollout reward 更新重要性权重。
2. policy 正常用 RL 训练；低表现 instruction 定期被淘汰。
3. 从 replay buffer 抽取失败轨迹，交给 LLM optimizer 做 self-reflection，生成新的 instruction。
4. 用低成本 proxy 子集验证候选，只有表现好的 instruction 才进入 population。
5. 推理时选权重最高的单条 instruction，不保留 ensemble 成本。

## Experimental Setup

- **模型**：Qwen2.5-3B/7B。
- **任务**：七个检索增强问答 benchmark，多轮 search tool 使用。
- **关键配置**：population=7；每次反思随机取 4 条失败轨迹；验证子集 200 个样本。

## Results

- Qwen2.5-3B 七项平均 EM **38.2%**，Search-R1 为 **32.2%**，提高 **6.0 个百分点**。
- 完整方法优于使用静态 instruction 的 inference 与 tool-integrated baselines。
- 额外成本包括约 11 次 optimizer API 调用和候选验证推理，不能视为零成本提升。

## Ablation

- 固定 population、不做剪枝的平均分为 **33.0%**；加入 prune/expand 和完整 generate-and-verify 后继续提升。
- top-1 parent 用于进化优于保留多个 parent。
- 候选验证是防止反思产生劣质 instruction 污染 population 的关键。

## Limitations

- replay 间接作用于 instruction，不是通用 actor experience replay。
- 依赖外部 LLM optimizer，带来 API 成本和可复现性问题。
- 只在搜索型 QA agent 验证，工具、环境和提示模板变化可能影响进化规则。

## Takeaways

INSPO 提供另一条利用失败经验的路径：如果轨迹级梯度难分配，就让失败案例改写“做事规则”。它更接近策略程序进化，而非旧轨迹重复训练。

## Citation

Zhou et al. _Agentic Policy Optimization via Instruction-Policy Co-Evolution_. arXiv:2512.01945, 2025.

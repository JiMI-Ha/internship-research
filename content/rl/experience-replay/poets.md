---
title: "POETS：不确定性感知的 Policy Ensemble 与 Experience Replay"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
business_fit: 3
paper_solidity: 4
tags: [paper, RL, policy-ensemble, Thompson-sampling, experience-replay]
source_url: https://arxiv.org/abs/2605.07775
---

> [!summary] 核心结论
> POETS 用共享主干上的轻量 LoRA policy ensemble 估计认知不确定性，再以 Thompson sampling 选择策略。普通 GRPO 在重复上下文/replay 下容易过拟合，POETS 能维持探索多样性；16 个 head 的总 runtime overhead 为 7.7%。

## 基本信息

- **论文**：[POETS: Uncertainty-Aware LLM Optimization via Compute-Efficient Policy Ensembles](https://arxiv.org/abs/2605.07775)
- **版本**：arXiv:2605.07775

## Motivation

Experience replay 会重复展示相同 context，单一 policy 容易迅速过拟合到已经发现的模式并失去探索。科学优化问题尤其需要区分“已知高 reward”和“尚不确定但可能更好”的区域。论文把 epistemic uncertainty 显式加入 RL 采样。

## Method

1. 一个共享 transformer trunk 搭配多个末层 LoRA branches，形成低成本 policy ensemble。
2. 各 branch 在 bootstrap/不同经验上更新，保持策略差异。
3. 用 Thompson sampling 从 ensemble 的 reward posterior 中选择策略，平衡探索与利用。
4. 与 replay buffer 结合时，ensemble uncertainty 防止相同 context 被单一策略过早记死。

## Experimental Setup

- **实验**：25 个随机 seeds。
- **任务**：FAQ 优化、蛋白搜索、量子电路设计，以及 Qwen3-8B 的 AIME RLVR。
- **AIME 设置**：AIME1983–2024 训练、AIME2026 验证；测试 on-policy 与 replay $T=4$。
- **默认 ensemble**：16 heads，单 H200 测量工程成本。

## Results

- 在四类搜索/优化任务中，POETS 相对普通 GRPO 保持更高策略多样性，并改善优化轨迹。
- replay $T=4$ 时，GRPO 更易在重复 context 上过拟合；POETS 的 held-out AIME2026 曲线更稳。
- 16-head 的总生成+训练时间由 118.0s/round 增至 127.1s/round，overhead **7.7%**；论文观察 8 heads 已基本充分多样化。

## Ablation

- ensemble size 增大提升不确定性表达，但 8→16 的边际收益有限。
- LoRA rank 过小会让 heads 不够多样；rank 增大提高 Jensen–Shannon divergence。
- replay 场景比纯 on-policy 更能显出 ensemble 的抗过拟合作用。

## Limitations

- 多数任务更接近 contextual bandit，而不是长程 credit assignment。
- 科学搜索目标与普通语言 benchmark 差异大，结论不能自动外推。
- LoRA heads 虽便宜，仍增加显存（16 heads 峰值约 +16.8%）和训练复杂度。

## Takeaways

POETS 指出 replay 的稳定性不只可用 clipping 解决，也可通过**维护多个有分歧的 policy**保留探索。适合反复优化同一批问题的科学发现任务。

## Citation

Menet, Krause, Rahimi. _POETS: Uncertainty-Aware LLM Optimization via Compute-Efficient Policy Ensembles_. arXiv:2605.07775, 2026.

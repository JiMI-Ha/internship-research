---
title: "RLEP：用成功轨迹回放加速 LLM 推理强化学习"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
business_fit: 4
paper_solidity: 3
tags: [paper, RL, RLVR, experience-replay, GRPO, reasoning]
source_url: https://arxiv.org/abs/2507.07451
---

> [!summary] 核心结论
> RLEP 用“先完成一轮 RL 建立成功轨迹库，再从同一基座模型重训”的两阶段方案，以少量历史正确答案帮助策略更快恢复并超过旧峰值。它验证了 LLM RL 中 self-replay 的可行性，但尚未系统解决轨迹陈旧、经验选择和端到端建库成本。

## 基本信息

- **论文**：[RLEP: Reinforcement Learning with Experience Replay for LLM Reasoning](https://arxiv.org/abs/2507.07451)
- **作者**：Hongzhi Zhang、Jia Fu、Jingyuan Zhang、Kai Fu、Qi Wang、Fuzheng Zhang、Guorui Zhou
- **版本**：arXiv:2507.07451v1，2025-07-10
- **代码**：[Kwai-Klear/RLEP](https://github.com/Kwai-Klear/RLEP)

## Motivation

标准 on-policy RLVR 的 rollout 通常只训练一次就被丢弃，已经探索出的正确推理路径无法持续提供监督。与此同时，GRPO 在一组答案全错或全对时缺少组内 reward 方差，训练可能停滞；策略也可能在达到高点后遗忘有效路径。问题因此是：能否复用模型自己的历史成功经验，同时保留 fresh rollout 的探索能力？

## Method

1. **建立经验库**：先完成一轮 vanilla RL，用该轮 checkpoint 对每题采样 64 个候选，只保存 verifier 判定正确的完整轨迹，并要求每题至少有两条有效路径。
2. **从基座模型重训**：不是继续第一轮 checkpoint，而是从同一个 base model 重新开始。每题生成 16 条当前策略 rollout，并随机加入 2 条历史正确轨迹。
3. **混合更新**：fresh 与 replay 样本共享组内 reward baseline，再用 token-level、非对称 clipping 的 GRPO 目标更新。replay 负责找回旧能力，fresh rollout 负责继续探索。

## Experimental Setup

- **模型**：Qwen2.5-Math-7B。
- **训练基线**：去掉 dynamic sampling、mini-batch 为 64 的强化 DAPO；每个 rollout batch 512 个样本。
- **经验采样**：temperature 0.7、top-p 0.95，每题 64 次，只保留正确轨迹。
- **评测**：AIME 2024、AIME 2025，以及训练未见的 AMC 2023。
- **回放比例**：每题 16 fresh + 2 replay；论文称单步额外耗时小于 5 秒。

## Results

| 指标                         |  Baseline |          RLEP | 结论               |
| ---------------------------- | --------: | ------------: | ------------------ |
| AIME 2024 best accuracy      |     38.2% |     **39.9%** | +1.7 个百分点      |
| AIME 2025 best accuracy      |     19.8% |     **22.3%** | +2.5 个百分点      |
| AMC 2023 accuracy            |     77.0% |     **82.2%** | +5.2 个百分点      |
| 达到 AIME 2024 baseline 峰值 | 380 steps | **135 steps** | 更新步数约降至 36% |

RLEP 在 AIME 2025 约 50 步后超过 baseline 的最佳值。135 vs. 380 是**优化步数**，不能直接写成 2.8× wall-clock 加速，因为建库还需要额外完成第一轮 RL 和离线采样。

## Ablation

- 加入失败答案做正负混合 replay，没有相对“只回放成功轨迹”产生可测收益。作者认为错误空间过于分散，但这只是解释，不是独立验证的因果结论。
- 论文只验证了 16:2 的主要配置，没有系统扫描 buffer 容量、轨迹新鲜度、难度或熵选择。

## Limitations

- 只验证一个 7B 数学模型，没有跨随机种子置信区间。
- 经验库需要额外一轮完整 RL；端到端成本弱于只报告第二轮收敛步数时的观感。
- replay 轨迹与 fresh rollout 共用 baseline，对 behavior-policy gap 的处理较弱。
- 只保存完整正确答案，无法利用失败轨迹中的好 prefix 或中间状态。

## Takeaways

RLEP 是理解这一方向的最小范式：**少量成功旧轨迹可以加速并改善 RL，但 fresh rollout 仍不可替代**。后续 ExGRPO、BAPO 与 Replay-Enhanced RePO 分别补上了经验价值评估、buffer freshness 和 on/off-policy 统计分离。

## Citation

```bibtex
@article{zhang2025rlep,
  title={RLEP: Reinforcement Learning with Experience Replay for LLM Reasoning},
  author={Zhang, Hongzhi and Fu, Jia and Zhang, Jingyuan and Fu, Kai and Wang, Qi and Zhang, Fuzheng and Zhou, Guorui},
  journal={arXiv preprint arXiv:2507.07451},
  year={2025}
}
```

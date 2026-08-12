---
title: "EFRAME：Exploration–Filter–Replay 拯救全失败难题"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, RL, RLVR, experience-replay, exploration, multimodal]
source_url: https://arxiv.org/abs/2506.22200
---

> [!summary] 核心结论
> EFRAME 专门处理当前策略整组全错的 hard prompts：提高探索强度捕获稀有正确轨迹，过滤后存入 buffer，再把这些 gold trajectories 注回训练。

## 基本信息

- **论文**：[EFRAME: Deeper Reasoning via Exploration-Filter-Replay Reinforcement Learning Framework](https://arxiv.org/abs/2506.22200)
- **版本**：arXiv:2506.22200，preprint

## Motivation

GRPO 遇到一组 rollout 全失败时 advantage 退化，最需要学习的难题反而没有梯度。简单扩大所有题的采样数成本很高。论文要用定向探索为这些 hard prompts 找到至少一条可验证正轨迹，再把稀有成功转化为可重复训练的监督。

## Method

EFRAME 包含三个阶段：

1. **Exploration**：识别当前全失败问题，提高采样温度或探索预算。
2. **Filter**：用 verifier 过滤候选，只保留正确的 gold trajectories。
3. **Replay**：把稀有正轨迹存入 buffer，并在后续对应 prompt 的训练组中回放。

与全局固定比例回放不同，它只在“当前策略不会”的区域集中增加经验。

## Experimental Setup

- **领域**：文本数学推理与多模态推理。
- **任务**：包括 Geometry3K 等几何题。
- **比较**：标准 RLVR 与 EFRAME；评估文本、多模态平均成绩及代表性数据集。

## Results

| 设置                    | Baseline |    EFRAME |
| ----------------------- | -------: | --------: |
| 文本任务平均            |     55.1 |  **60.2** |
| 多模态任务平均          |    54.19 | **55.13** |
| Geometry3K（GRPO 对照） |    50.75 | **55.41** |

文本平均相对 GRPO 提高 5.1 分，多模态平均只提高 0.94 分。Geometry3K 中，EFRame 相对未训练的 Qwen2.5-VL-7B-Instruct（38.44）提高 16.97 分，相对 GRPO（50.75）提高 4.66 分；论文正文将 16.97 分与 GRPO 对照混写，解读时以图 3 数值为准。

## Ablation

- 只加探索会产生大量无效候选，Filter 决定了 buffer 的精度。
- 只回放普通成功样本不能同样解决全失败题，定向 hard-prompt exploration 是关键。
- 探索强度、过滤质量和 replay 次数共同决定收益，三者并非可互换。

## Limitations

- 对可靠 verifier 依赖很强；误判的“gold”会被反复放大。
- hard-prompt 额外采样可能很昂贵，论文中的准确率增益不等于端到端成本必然下降。
- 文本与多模态组件同时变化，对每个机制的严格归因有限。

## Takeaways

EFRAME 适合解决**全零 reward 造成的训练盲区**。它与 RLEP 的区别在于：不是对所有训练样本均匀加入旧成功，而是先用额外探索救出当前解不开的题，再按需 replay。

## Citation

Wang et al. _EFRAME: Deeper Reasoning via Exploration-Filter-Replay Reinforcement Learning Framework_. arXiv:2506.22200, 2025.

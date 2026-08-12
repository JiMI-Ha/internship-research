---
title: "Efficient RL Training with Experience Replay：系统扫描 Buffer 的性能—计算 Pareto"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
business_fit: 5
paper_solidity: 5
tags: [paper, RL, experience-replay, buffer, efficiency, off-policy]
source_url: https://arxiv.org/abs/2604.08706
---

> [!summary] 核心结论
> 这项工作不追求单点最高分，而是系统研究 buffer size、replay ratio、staleness、样本多样性与正样本偏置，给出“以较少生成保持性能”的经验规律；最佳配置报告最多约 40% 计算节省。

## 基本信息

- **论文**：[Efficient RL Training for LLMs with Experience Replay](https://arxiv.org/abs/2604.08706)
- **作者**：Charles Arnal、Vivien Cabannes、Taco Cohen、Julia Kempe、Remi Munos

## Motivation

LLM 经验回放论文经常只展示一个 buffer 配方，难以区分收益来自更多 updates、正样本偏置还是数据新鲜度。更重要的是，算法最终分数提高不代表生成成本真的下降。论文目标是建立可复现的性能—计算 Pareto，而不是再提出一个复杂命名算法。

## Method

研究采用 FIFO replay buffer，把 fresh 与历史 rollout 按比例混合，并控制：

- buffer 容量与最大陈旧度；
- replay ratio 和每批 fresh 数据量；
- 是否偏置采样正奖励样本；
- 历史数据的多样性；
- GRPO 与更耐 off-policy 的 Asymmetric REINFORCE 等优化器。

## Experimental Setup

- 在 LLM 推理 RL 设置中进行多组系统扫描。
- 关键曲线每个配置使用至少 4 个随机种子，部分实验使用 10 个，并报告 median/IQR，而不是只取最好一次。
- 同时比较最终性能与生成/训练计算量。

## Results

- 合理配置可在保持可比性能时报告**最多约 40% 计算节省**。
- 较小、较新的 buffer 往往比无界历史库更稳。
- 对正样本进行适度偏置能提高有效信号密度，但过强偏置会降低多样性。
- Asymmetric REINFORCE 比标准 GRPO 更能承受 stale replay；这说明 buffer 效果与底层优化器不可分割。

## Ablation

- replay ratio 并非越高越好：增加复用在早期有利，过高时会扩大 policy gap。
- buffer size 与 staleness 要联合解释；大容量常常只是容纳了更多过期轨迹。
- 保留多样性优于反复抽取少量高奖励答案。

## Limitations

- “计算节省”的口径仍依赖具体生成/训练成本比和硬件。
- 系统扫描得到的是经验规律，不保证在不同 context length、agent 环境或 reward 密度下保持最优。
- 多种子 median/IQR 比单次结果更可靠，但不同配置的种子数并不完全一致，小差异仍需谨慎解释。

## Takeaways

设计 replay 时应先画性能—计算 Pareto，再谈最高分。至少同时报告 replay ratio、buffer 最大年龄、正样本比例、rollout 数和 wall-clock，否则不同论文的“更高效”无法比较。

## Citation

Arnal et al. _Efficient RL Training for LLMs with Experience Replay_. arXiv:2604.08706, 2026.

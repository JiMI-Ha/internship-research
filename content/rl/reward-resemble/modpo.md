---
title: "MODPO：把多目标 RLHF 改写成直接偏好优化"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Zhanhui Zhou, Jie Liu, Jing Shao, Xiangyu Yue, Chao Yang, Wanli Ouyang, Yu Qiao"
aliases: [papers/modpo]
tags: [paper, RL, reward-resemble, multi-objective, DPO, Pareto]
source_url: https://arxiv.org/abs/2310.03708
---

> [!summary] 一句话结论
> MODPO 把其他目标的 reward margin 加进主目标 DPO，使每个权重向量直接训练一个 Pareto policy；它避免 PPO/value model，计算资源约为 MORLHF 的三分之一。

## 基本信息

- **论文**：[Beyond One-Preference-Fits-All Alignment: Multi-Objective Direct Preference Optimization](https://arxiv.org/abs/2310.03708)
- **版本**：arXiv:2310.03708v4，2024-08-17
- **关键词**：multi-objective DPO、Pareto front、reward margin、pluralistic alignment

## Motivation

为不同偏好权重分别跑 PPO 既不稳定又昂贵；标准 DPO 只有一个 chosen/rejected 目标，也无法表达其他维度。MODPO 寻找与 KL 正则 MORLHF 理论等价的直接优化形式。

## Method

选一个目标提供偏好对，把其余目标的 RM 分差作为 margin 加到 DPO logit 中；权重向量决定各 margin 系数。模型因而同时充当 policy 与组合 reward 的隐式表示。每个权重点仍需一次微调，但无需在线采样、value model 或 PPO。

## Experimental Setup

- 安全对齐：helpfulness 与 harmlessness。
- 长文本问答：多个质量目标；附录扩展到三目标。
- 比较 MORLHF、线性加权 DPO、DPO soups、best-of-128 与 SFT，评估经验 Pareto front 和 KL。

## Results

MODPO 在安全与长问答的 reward 空间形成与 MORLHF 相当或更外侧的 Pareto front，并报告约 **3×** 计算节省。结果主要以 front 图和自动 RM 评估呈现，缺少统一单点数字；因此更可靠的结论是“同预算下覆盖 trade-off 更高效”，而非所有权重点都显著更优。

## Ablation

权重扫描显示 margin 能连续移动 front；三目标实验规模较小。线性权重与 soup 基线无法稳定覆盖相同边界，但论文没有充分比较条件化单模型方案。

## Limitations

- 每个偏好权重仍训练独立模型，权重连续变化时存储和维护成本高。
- 假设目标可线性组合，非凸或词典序约束不适用。
- 主要依赖自动 evaluator，没有人类评估。
- 多轮对话、数学和高维目标尚未验证。

## Takeaways

- 已有各维 RM 时，MODPO 是比多次 PPO 更轻的 Pareto 基线。
- Reward margin 的尺度与校准直接决定 trade-off，不能只设置权重而忽略量纲。
- 若需要一个模型覆盖连续偏好，应与 COS-DPO/CPO 等条件化方案比较。

## Citation

```bibtex
@article{zhou2023modpo,
  title={Beyond One-Preference-Fits-All Alignment: Multi-Objective Direct Preference Optimization},
  author={Zhou, Zhanhui and Liu, Jie and Shao, Jing and others},
  journal={arXiv preprint arXiv:2310.03708},
  year={2023}
}
```

---
title: "RewardBench：系统评测 Reward Model 的困难偏好集"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Nathan Lambert, Valentina Pyatkin, Jacob Morrison, LJ Miranda, Bill Yuchen Lin, Khyathi Chandu, Nouha Dziri, Sachin Kumar, Tom Zick, Yejin Choi, Noah A. Smith, Hannaneh Hajishirzi"
aliases:
  - papers/rewardbench
tags:
  - paper
  - RL
  - reward-resemble
  - reward-modeling
  - benchmark
source_url: https://arxiv.org/abs/2403.13787
---

> [!summary] 一句话结论
> RewardBench 不用普通偏好集的平均准确率掩盖问题，而是集中测试 chat、hard chat、safety 和 reasoning 中“细微但可验证”的胜负；它适合筛 RM，却尚未证明榜单分数能预测下游 RLHF 效果。

## 基本信息

- **论文**：[RewardBench: Evaluating Reward Models for Language Modeling](https://arxiv.org/abs/2403.13787)
- **版本**：arXiv:2403.13787v2，2024-06-09
- **关键词**：reward model evaluation、preference benchmark、DPO reward

## Motivation

RM 决定 RLHF 优化方向，却长期缺少统一且困难的公开评测。旧测试集常与训练集重叠，或只测明显风格差异，无法揭示事实错误、代码 bug、拒答偏差和推理失败。

## Method

RewardBench 汇集 prompt–chosen–rejected 三元组，按 Chat、Chat Hard、Safety、Reasoning 分类，并加入有可核查胜负依据的对比。统一以“RM 是否给 chosen 更高分”计算准确率；既支持显式 classifier RM，也从 DPO policy 与 reference policy 的 log-ratio 恢复隐式 reward。

## Experimental Setup

- 评测从 400M 到 70B 的公开 RM。
- 比较直接偏好 classifier、DPO 隐式 reward、不同数据与模型规模。
- 另列旧有 preference test sets，分析训练集重叠与可比性。
- 重点检查 refusal、instruction following、事实和 reasoning failure。

## Results

榜单显示没有单一 RM 在所有类别都稳定领先：不少模型在 Chat 较强，却在 Reasoning 或 Safety 大幅下降；DPO 隐式 RM 在部分旧测试集和困难集上表现不同。论文最可靠的结论是**分项失衡普遍存在**，而不是某个架构绝对最好。

## Ablation

按 7B 模型、DPO 规模和旧测试集分别比较后，模型规模总体有利但不能消除类别短板。部分在旧集高分的 RM 使用过这些数据训练，说明旧集结果可能被重叠夸大。论文没有把 RewardBench 分数与完整 PPO 结果做系统相关性验证。

## Limitations

- benchmark 准确率尚未证实能预测 RLHF 后的策略质量或抗 hacking 能力。
- 聚合分数对类别权重敏感，可能掩盖业务最重要的短板。
- 公开题目可能进入后续训练数据，榜单会逐渐污染。
- chosen/rejected 二元标签仍不能表达细粒度 rubric 与不确定性。

## Takeaways

- RM 选型要看 Safety、Reasoning、Hard Chat 分项，不只看总分。
- 最好建立私有、业务分布外的 RewardBench 补充集。
- 它是训练前筛选工具，不能替代真实策略 rollout 和人工红队。

## Citation

```bibtex
@article{lambert2024rewardbench,
  title={RewardBench: Evaluating Reward Models for Language Modeling},
  author={Lambert, Nathan and Pyatkin, Valentina and Morrison, Jacob and others},
  journal={arXiv preprint arXiv:2403.13787},
  year={2024}
}
```

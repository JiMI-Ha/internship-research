---
title: "RGR-GRPO：Rubric 同时提供奖励与离线探索指导"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Baolong Bi, Shenghua Liu, Yiwei Wang, Siqian Tong, Lingrui Mei, Yuyao Ge, Yilong Xu, Jiafeng Guo, Xueqi Cheng"
aliases:
  - papers/rgr-grpo
tags:
  - paper
  - RL
  - reward-resemble
  - rubric
  - exploration
  - GRPO
source_url: https://arxiv.org/abs/2511.12344
---

> [!summary] 一句话结论
> RGR-GRPO 不只用 rubric 判分，还根据最好 rollout 的失败项生成修订轨迹作为 off-policy 指导，在多学科推理中扩大探索并缓解纯在线 RL 的熵坍缩。

## 基本信息

- **论文**：[Reward and Guidance through Rubrics: Promoting Exploration to Improve Multi-Domain Reasoning](https://arxiv.org/abs/2511.12344)
- **版本**：arXiv:2511.12344v2，2025-11-19
- **关键词**：rubric reward、off-policy guidance、exploration、GRPO

## Motivation

RLVR 多集中在有唯一答案的数学任务；纯在线 GRPO 又只能围绕当前 policy 的样本探索，容易卡在已有解法。直接混入离线正确答案会造成分布偏移和熵爆炸。论文希望让 rubric 同时给出密集 reward 与“下一步应改哪里”的结构化指导。

## Method

Rubric 包含 factual 与 process 两类标准。在线 rollout 先逐项评分；系统从组内最好但仍失败的回答出发，根据未满足标准生成自我修订轨迹，再把这些 off-policy 样本与在线样本混合更新。Rubric 因此既定义 reward，又约束离线指导不偏离当前问题。

## Experimental Setup

- Qwen2.5 3B/7B base，训练 400 步，每 40 步评估。
- 14 个 benchmark，覆盖数学、物理、化学和通用推理。
- 比较 Outcome-GRPO、Likert-GRPO、Rubric-GRPO，以及 Critique-GRPO、LUFFY 等 off-policy 方法。

## Results

- 相比可验证在线 RL，四类任务平均提升分别为 **+7.0%、+5.4%、+8.4%、+6.6%**。
- 7B 上，RGR-GRPO 相对 base 平均提升 **25.1%**，相对官方 instruct 提升 **6.7%**，比纯在线 Rubric-GRPO 高 **3.7%**。
- 3B 综合平均为 **45.5**，高于 Outcome-GRPO 42.9 与 Rubric-GRPO 43.6。
- Pass@k 与训练熵曲线表明探索更持久，但这些机制指标并不单独证明答案质量来自 rubric 指导。

## Ablation

只有 rubric reward 已优于 outcome/Likert；只有通用 critique/off-policy 数据则不稳定。完整方法的优势来自“按失败标准修订”与在线样本混合，说明离线数据的相关性比简单增加正确轨迹更重要。

## Limitations

- Rubric 和修订都由模型产生，错误标准可能同时污染 reward 与 guidance。
- 主要是学术推理 benchmark，尚未验证对话、工具或真实业务过程。
- 报告最佳 checkpoint，可能高估相对固定训练预算下的稳定收益。
- 论文未提供大规模人类评估；多项指标仍依赖自动答案或模型 judge。

## Takeaways

- Rubric 可以从“评分表”升级为“探索控制器”，但必须限制离线修订的分布偏移。
- 对开放任务，可优先修订最好回答的明确失败项，而不是无差别加入教师答案。
- 应同步监控 entropy、pass@k 和逐项 rubric 命中率，不能只看平均 reward。

## Citation

```bibtex
@article{bi2025rgr,
  title={Reward and Guidance through Rubrics: Promoting Exploration to Improve Multi-Domain Reasoning},
  author={Bi, Baolong and Liu, Shenghua and Wang, Yiwei and others},
  journal={arXiv preprint arXiv:2511.12344},
  year={2025}
}
```

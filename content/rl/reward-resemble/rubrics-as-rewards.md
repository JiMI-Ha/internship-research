---
title: "RaR：把实例级 Rubric 直接变成强化学习奖励"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Anisha Gunjal, Anthony Wang, Elaine Lau, Vaskar Nath, Yunzhong He, Bing Liu, Sean Hendryx"
aliases:
  - papers/rubrics-as-rewards
tags:
  - paper
  - RL
  - reward-resemble
  - rubric
  - GRPO
  - reward-design
source_url: https://arxiv.org/abs/2507.17746
---

> [!summary] 一句话结论
> 与直接让 judge 打一个 Likert 总分相比，把每道题拆成实例级 rubric 再做奖励，能为开放式医疗与科学推理提供更细的训练信号；但固定加权和较脆弱，整体判断反而表现更好。

## 基本信息

- **论文**：[Rubrics as Rewards: Reinforcement Learning Beyond Verifiable Domains](https://arxiv.org/abs/2507.17746)
- **版本**：arXiv:2507.17746v2，2025-10-03
- **关键词**：rubric reward、开放式任务、GRPO、reward aggregation

## Motivation

RLVR 在数学和代码中依赖可自动核验的唯一结果，医疗回答等开放任务却同时要求正确、完整、安全和表达清楚。单一 Likert reward 隐藏了失败原因，也让小 judge 难以稳定比较细微差异。论文研究实例级 rubric 能否把这种多维判断转成 on-policy RL 信号。

## Method

每个 prompt 生成 7–20 个带 Essential、Important、Optional、Pitfall 标签的标准。论文比较两种聚合：

$$
r_{\text{explicit}}(x,y)=\frac{\sum_j w_jc_j(x,y)}{\sum_jw_j},
$$

其中 judge 独立判断每项是否满足；`RaR-Implicit` 则把全部标准交给 judge，让它综合输出 1–10 分。另有固定通用 rubric、直接 Likert 和带参考答案 Likert 基线。奖励用于 GRPO 更新 Qwen2.5-7B。

## Experimental Setup

- RaR-Medicine 与 RaR-Science 各约 20K prompts；rubric 由 GPT-4o 或 o3-mini 基于参考答案生成。
- 每题采样 16 个回答，用 gpt-4o-mini 判分，在 8×H100 上训练。
- 医疗用 HealthBench，科学用 GPQA-Diamond；GPQA 重复十次并报告 95% 置信区间。

## Results

- `RaR-Implicit` 相比 Direct-Likert 在 HealthBench 的相对提升最高 **31%**，在 GPQA-Diamond 最高 **7%**。
- GPQA 平均准确率图中，RaR-Implicit 为 **37.6%**，高于 Direct-Likert 的 **34.8%**；HealthBench 总分也从 Direct-Likert 的 **22.7%** 提升到 **29.7%**。
- Rubric 对所有 judge 尺度都提高人类偏好区分准确率，对小模型帮助最大。
- 结果支持“结构化监督优于单分数”，但不等于所有 rubric 聚合都可靠。

## Ablation

- 固定通用 rubric 明显落后于实例级 rubric。
- HealthBench-1k 上，无类别权重为 **38.8%**，全 rubric 为 **37.2%**，说明手工标签权重没有稳定增益。
- 有参考答案指导的 o3-mini rubric 得到 **35.9%**；无参考时不同模型约为 31.1%–34.2%，显示 rubric 质量依赖外部 grounding。

## Limitations

- 只验证医疗与科学，尚未覆盖对话、tool use 和 agent 任务。
- 仅比较显式加权与隐式整体判断，未研究动态或学习式权重。
- Rubric 与奖励仍依赖现成 LLM judge；生成模型和参考答案的偏差会传入策略。
- HealthBench 与训练 rubric 都采用相近评价范式，存在评价结构对齐带来的优势。

## Takeaways

- Rubric 的主要价值是分解判断，而不只是把多个二元分数相加。
- 固定权重便于审计，但当前证据显示隐式聚合更强；业务上需要在可解释性与效果之间单独验证。
- 没有可靠参考或专家 grounding 时，rubric 自动生成质量是核心瓶颈。

## Citation

```bibtex
@article{gunjal2025rubrics,
  title={Rubrics as Rewards: Reinforcement Learning Beyond Verifiable Domains},
  author={Gunjal, Anisha and Wang, Anthony and Lau, Elaine and others},
  journal={arXiv preprint arXiv:2507.17746},
  year={2025}
}
```

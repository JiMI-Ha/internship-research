---
title: "Constitutional AI：用原则与 AI Feedback 训练无害助手"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Yuntao Bai et al."
aliases:
  - papers/constitutional-ai
tags:
  - paper
  - RL
  - reward-resemble
  - RLAIF
  - safety-alignment
source_url: https://arxiv.org/abs/2212.08073
---

> [!summary] 一句话结论
> Constitutional AI 用一小组可读原则替代无害性人工偏好：先让模型自我批评和修改，再用 AI 生成的比较标签训练 preference model 与 RLAIF；它减少了无害性标注依赖，但没有消除人类监督或 evaluator 偏差。

## 基本信息

- **论文**：[Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073)
- **版本**：arXiv:2212.08073v1，2022-12-15
- **关键词**：Constitutional AI、RLAIF、critique-revision、harmlessness

## Motivation

逐条收集安全偏好成本高，也把规范隐藏在大量标签中。既有 harmless RLHF 还容易奖励一律回避。作者希望把监督集中成可审查的自然语言原则，并让模型在拒绝有害请求时仍解释原因、保持有用。

## Method

方法分两阶段：

1. **Constitutional SFT**：对红队提示生成初始回答，按随机抽取的原则产生 critique，再据此 revision；用最终修改回答做监督微调。
2. **RLAIF**：对同一提示采样回答对，让模型依据宪法原则选择更无害的回答；将 AI 无害性偏好与人工 helpfulness 标签混合训练 preference model，再用 RL 优化策略。

因此论文只替代了无害性标签；初始 helpful RLHF 模型和 helpfulness 数据仍来自人类。

## Experimental Setup

- 比较从预训练到 52B 参数的模型。
- 用 438 个 HHH 二元比较检查 AI 监督能力。
- 以 crowdworker 的 helpfulness / harmlessness Elo 评估 SL-CAI、RL-CAI、带 CoT 的 RL-CAI 与人工反馈 RLHF。
- 另分析 critique-revision、多轮修改和 chain-of-thought 的作用。

## Results

52B 实验中，RL-CAI 在相近 helpfulness 下取得更高 harmlessness，形成优于人工无害性反馈基线的前沿；crowdworker 也更偏好其非回避式回答。论文还发现模型规模增大时 AI 识别有害回答的能力提高，CoT 进一步改善；但图中 Elo 只适合比较相对差异，不应解读成绝对安全率。

## Ablation

- 先生成 critique 再 revision，比直接要求 revision 更无害。
- 多轮 critique-revision 可继续降低有害性。
- Constitutional SFT 负责把策略拉到合适分布，后续 RLAIF 显著提高可靠性。
- CoT 改善比较判断，并在 52B RL 运行中给出更好的 helpfulness–harmlessness trade-off。

## Limitations

- 原则是为研究目的以较为临时、迭代的方式选取，未解决谁来制定“宪法”。
- helpfulness 仍使用人类标签，不能称为完全自监督对齐。
- AI 同时生成监督与接受监督，可能继承同一模型的盲点。
- 结果来自特定模型族和当时的红队分布，不等于部署安全保证。

## Takeaways

- 最大价值是把安全目标从不可读标签集合提升为可审计原则。
- 业务应用需要独立验证原则覆盖率、冲突处理和 judge 可靠性。
- critique、revision 和 preference reward 是互补环节，不应只保留最后一个标量 reward。

## Citation

```bibtex
@article{bai2022constitutional,
  title={Constitutional AI: Harmlessness from AI Feedback},
  author={Bai, Yuntao and Kadavath, Saurav and Kundu, Sandipan and others},
  journal={arXiv preprint arXiv:2212.08073},
  year={2022}
}
```

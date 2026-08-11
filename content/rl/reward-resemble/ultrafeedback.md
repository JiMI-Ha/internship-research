---
title: "UltraFeedback：规模化收集多维 AI Feedback"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Ganqu Cui, Lifan Yuan, Ning Ding, Guanming Yao, Bingxiang He, Wei Zhu, Yuan Ni, Guotong Xie, Ruobing Xie, Yankai Lin, Zhiyuan Liu, Maosong Sun"
aliases:
  - papers/ultrafeedback
tags:
  - paper
  - RL
  - reward-resemble
  - AI-feedback
  - preference-data
source_url: https://arxiv.org/abs/2310.01377
---

> [!summary] 一句话结论
> UltraFeedback 用 GPT-4 对大规模、多来源回答做 instruction following、truthfulness、honesty 和 helpfulness 等多维评分与批评，成为许多开源偏好工作的数据底座；规模优势明显，但也把 GPT-4 的偏好系统性蒸馏进数据。

## 基本信息

- **论文**：[UltraFeedback: Boosting Language Models with Scaled AI Feedback](https://arxiv.org/abs/2310.01377)
- **版本**：arXiv:2310.01377v2，2024-07-16
- **关键词**：AI feedback、preference data、multi-aspect rating、critique

## Motivation

高质量人类偏好昂贵、题目覆盖有限，阻碍开源 alignment。作者认为有效 AI feedback 的关键不是只换一个强 judge，而是同时扩大 prompt / response 的规模和多样性，并抑制位置、风格等标注偏差。

## Method

从多个指令源采样约 64K instructions，为每条收集多个不同模型回答，形成约 250K conversations。GPT-4 对每个回答从多个维度给 1–5 分并提供 rationale，累计超过 **1M** 条反馈。数据既可转成 chosen/rejected 训练 RM，也可训练 critique model；作者再用 best-of-$n$ 与 RL 改善 LLaMA 系模型。

## Experimental Setup

- prompt 覆盖事实问答、写作、角色扮演、推理等类别。
- 回答来自不同能力和风格的开源模型。
- 评估 AI–human 一致性、RM / critique model 和下游聊天能力。
- 比较过滤、采样与去偏流程对数据质量的作用。

## Results

基于 UltraFeedback 的 RM、best-of-$n$ 和 RL 均显著改善作者的开源聊天模型，并推动后续大量 DPO 数据集。论文的核心实证是“规模化多维 AI feedback 能训练出更强模型”，但版本迭代和下游配方复杂，单个数字不适合脱离具体模型直接横比。

## Ablation

数据多样性与反馈规模均有贡献；只增加同质回答不如扩展 instruction 和模型来源。多维 absolute ratings 可派生 pairwise preference，但配对会丢失分项原因。论文也检查 AI 与人类反馈的一致和分歧案例，而非假设 GPT-4 永远正确。

## Limitations

- GPT-4 的偏好、知识错误和风格偏见被大规模复制。
- 多数反馈是单轮英文，复杂多轮、安全和专业任务覆盖有限。
- 训练/评测模型可能与 GPT-4 judge 风格相似，形成 self-preference。
- absolute rating 的标尺漂移会影响跨样本可比性。

## Takeaways

- 若关心多个业务维度，应保存原始维度分与 rationale，不要只发布 pairwise winner。
- AI feedback 适合扩规模，人类应集中审查高风险和 judge 分歧样本。
- 使用该数据训练的 RM 需要额外的业务分布外校准。

## Citation

```bibtex
@article{cui2023ultrafeedback,
  title={UltraFeedback: Boosting Language Models with Scaled AI Feedback},
  author={Cui, Ganqu and Yuan, Lifan and Ding, Ning and others},
  journal={arXiv preprint arXiv:2310.01377},
  year={2023}
}
```

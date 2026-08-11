---
title: "Synthetic Critiques：用自然语言批评增强 Reward Model"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Zihuiwen Ye, Fraser Greenlee-Scott, Max Bartolo, Phil Blunsom, Jon Ander Campos, Matthias Gallé"
aliases:
  - papers/synthetic-critiques
tags:
  - paper
  - RL
  - reward-resemble
  - reward-modeling
  - critique
source_url: https://arxiv.org/abs/2405.20850
---

> [!summary] 一句话结论
> 在偏好对旁加入 LLM 生成的自然语言 critique，让 RM 先看到“为什么好/坏”再预测标量，尤其能提升小数据、弱基座和推理型比较；但论文没有验证这种 RM 真能改善下游 RL。

## 基本信息

- **论文**：[Improving Reward Models with Synthetic Critiques](https://arxiv.org/abs/2405.20850)
- **版本**：arXiv:2405.20850v2，2024-10-18
- **关键词**：reward model、synthetic critique、data efficiency、interpretability

## Motivation

普通 RM 只从 winner/loser 学一个标量，很容易抓长度、措辞等表面 shortcut，也浪费了偏好背后的理由。高质量人工 rationale 昂贵，作者因此让 LLM 自动生成 instruction following、正确性和风格批评。

## Method

对每个 prompt–response 生成自然语言 critique，并把 critique 与原输入一起提供给 RM；RM 仍以成对偏好损失训练标量 score。作者改变 critique 生成模型的能力，并比较生成式 judge 与判别式 RM，以确认收益来自 critique 内容而非单纯增加 token。

## Experimental Setup

- RM 起点包含 LLaMA-7B base、Command-35B base 和已偏好调优的 Command R-35B。
- critique 由从 LLaMA2-7B-Chat 到 GPT-4-Turbo 的多种模型生成。
- 在 RewardBench 四个子集与 PandaLM 上评估排序准确率。
- 扫描偏好数据规模与 critique 质量。

## Results

大多数设置中加入 critique 都优于无 critique，GPT-4-Turbo critique 对较弱基座的提升最大。收益集中在 Reasoning、Chat Hard 和低数据区；论文估计在特定低数据设置里，一个高质量 critique-enhanced 样本最高可抵约 **40** 个普通偏好样本。强偏好模型或数据充足时增益明显缩小。

## Ablation

- critique 生成器越强，测试表现通常越高，但不是每个数据集严格单调。
- 弱 base RM 的收益大于已经偏好调优的 RM。
- 生成式 judge 加 critique 也改善，说明 critique 可作为显式推理中间层。
- 数据量增大后边际价值下降。

## Limitations

- 只评估 RM benchmark 排序，没有用该 RM 做 PPO / DPO 并测最终策略。
- 合成 critique 会幻觉或给出错误理由。
- 高质量 critique 依赖昂贵教师模型，成本优势取决于复用规模。
- 对强基座和大数据设置的提升有限。

## Takeaways

- 适合把 rubric 级原因保留下来，避免训练数据只剩 winner 标记。
- 需要把 critique 正确性单独质检，不能因解释流畅就视为可靠。
- 最重要的后续验证是策略是否更难 reward hack，而不只是 RewardBench 更高。

## Citation

```bibtex
@article{ye2024improving,
  title={Improving Reward Models with Synthetic Critiques},
  author={Ye, Zihuiwen and Greenlee-Scott, Fraser and Bartolo, Max and others},
  journal={arXiv preprint arXiv:2405.20850},
  year={2024}
}
```

---
title: "HelpSteer：把 Helpfulness 拆成五个可控属性"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Zhilin Wang, Yi Dong, Jiaqi Zeng, Virginia Adams, Makesh Narsimhan Sreedhar, Daniel Egert, Olivier Delalleau, Jane Polak Scowcroft, Neel Kant, Aidan Swope, Oleksii Kuchaiev"
aliases:
  - papers/helpsteer
tags:
  - paper
  - RL
  - reward-resemble
  - multi-attribute
  - preference-data
source_url: https://arxiv.org/abs/2311.09528
---

> [!summary] 一句话结论
> HelpSteer 不只标“是否有用”，还分别标 helpfulness、correctness、coherence、complexity 和 verbosity，让模型可控制风格并减少把“更长”误当“更好”的 shortcut。

## 基本信息

- **论文**：[HelpSteer: Multi-attribute Helpfulness Dataset for SteerLM](https://arxiv.org/abs/2311.09528)
- **版本**：arXiv:2311.09528v1，2023-11-16
- **关键词**：multi-attribute feedback、SteerLM、helpfulness

## Motivation

普通偏好对没有解释回答为什么更好，模型可能只学会长度等数据伪影。作者希望把帮助性的组成部分显式标出，既用于分析相关性，也让生成时能指定复杂度和详细程度。

## Method

HelpSteer 收集约 **37K** 个英文 prompt–response 样本，每个回答对五个属性给 Likert 分数：总体 helpfulness、correctness、coherence、complexity、verbosity。训练时把期望属性值作为条件 token 输入 SteerLM，用 attribute-conditioned SFT 直接学习受控生成。

## Experimental Setup

- 以 Llama 2 70B 训练 SteerLM。
- 使用 MT-Bench 测帮助性、TruthfulQA 等测事实性，并做人工比较。
- 与 Llama 2 70B Chat 和当时开源聊天模型比较。
- 检查 verbosity / complexity 的用户可控性。

## Results

HelpSteer 训练的 Llama 2 70B 在 MT-Bench 得分 **7.54**，论文称为当时未使用更强专有模型蒸馏数据的开源模型最高分。模型相对 Llama 2 70B Chat 更 truthful、coherent，并能按条件改变 verbosity 与 complexity；这些结论来自单一英文数据和当时的 judge 体系。

## Ablation

多属性条件让同一模型在不同 verbosity / complexity 档位生成，而不是为每个偏好训练单独策略。论文分析属性相关性，说明总体 helpfulness 与 correctness/coherence 强相关，同时 verbosity 不能单独代表质量。缺少对每个属性去除后的完整训练消融。

## Limitations

- 只有英文，且标注者均位于美国，文化代表性有限。
- 37K 规模较小，长尾知识与安全场景覆盖不足。
- 各属性并非真正独立，条件值可能组合成训练中少见的配置。
- MT-Bench judge 分数不能替代真实用户偏好。

## Takeaways

- 数据层面保留多属性比只留 winner/loser 更适合业务复盘。
- verbosity 应作为独立控制量，不应隐式混入 helpfulness reward。
- 若目标是训练 RM 而非 controllable SFT，应同时查看后续 HelpSteer2。

## Citation

```bibtex
@article{wang2023helpsteer,
  title={HelpSteer: Multi-attribute Helpfulness Dataset for SteerLM},
  author={Wang, Zhilin and Dong, Yi and Zeng, Jiaqi and others},
  journal={arXiv preprint arXiv:2311.09528},
  year={2023}
}
```

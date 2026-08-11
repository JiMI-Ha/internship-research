---
title: "BeaverTails：解耦 helpfulness 与 harmlessness 的安全偏好数据"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Jiaming Ji, Mickel Liu, Juntao Dai, Xuehai Pan, Chi Zhang, Ce Bian, Ruiyang Sun, Yizhou Wang, Yaodong Yang"
aliases:
  - papers/beavertails
tags:
  - paper
  - RL
  - reward-resemble
  - safety-data
  - constrained-RL
source_url: https://arxiv.org/abs/2307.04657
---

> [!summary] 一句话结论
> BeaverTails 的核心贡献是把“有用”和“无害”分开标：它支持独立训练 reward 与 cost，并显示解耦后的 PPO-Lagrangian 优于把两者混成一个偏好分数；数据规模大，但安全边界与标注文化仍是人工定义。

## 基本信息

- **论文**：[BeaverTails: Towards Improved Safety Alignment of LLM via a Human-Preference Dataset](https://arxiv.org/abs/2307.04657)
- **版本**：arXiv:2307.04657v3，2023-11-07
- **关键词**：safety preference、reward/cost decomposition、Safe RLHF

## Motivation

单一“更喜欢哪个回答”会把 helpfulness 和 harmlessness 混在一起，无法区分是内容有用还是只是更安全，也使策略很难满足显式安全约束。作者因此分别收集安全标签、帮助性排序和无害性排序。

## Method

数据集包含 **333,963** 个 QA 的安全元标签与 14 类风险标注，以及 **361,903** 对 helpfulness / harmlessness 比较。实验分别训练 Alpaca-7B reward model 与 cost model；cost 同时学习安全正负号和成对无害性排序。策略用 PPO-Lagrangian 最大化 reward，并以动态乘子限制 cost。

## Experimental Setup

- RM、cost model 与策略均基于 Alpaca-7B。
- 静态模型在留出集上评估排序和安全分类。
- 策略以 GPT-4 判断相对 Alpaca-7B 的 helpfulness / harmlessness 胜率。
- 对照包括 14 个分类器的 mean/max cost、混合单一偏好 PPO，以及 HH-RLHF PPO。

## Results

Reward model 排序准确率为 **78.13%**；cost model 的安全符号准确率为 **95.62%**，无害性排序准确率为 **74.37%**。Safe-RLHF 相对 Alpaca-7B 的 helpfulness / harmlessness 胜率分别为 **85.57% / 82.57%**；单一混合偏好 PPO 为 **65.07% / 68.64%**。结果支持“解耦优于混合”，但胜率由 GPT-4 judge 产生。

## Ablation

成对 cost 排序优于 14 类 classifier mean/max；max 又优于 mean，说明风险类别数量不与严重程度线性对应。解耦 reward/cost 也同时优于单一混合偏好 PPO 和 HH-PPO。高温采样仍能产生明显不安全回答，说明平均评测提升不是硬安全保证。

## Limitations

- 数据为英文且由特定标注规范定义，文化和场景迁移有限。
- 策略结论主要来自 Alpaca-7B 与 GPT-4 自动评估。
- cost model 仍可能被分布外策略利用；附录显示温度为 1.0 时存在严重失败案例。
- CC BY-NC 4.0 限制部分商业使用。

## Takeaways

- 它是 Safe RLHF 类方法的重要数据基础，而不只是又一个安全分类集。
- 业务中最好分别保留质量 reward、风险 cost 和风险类别，不要压成一个分数。
- cost 的排序信息可能比“是否违规”的二元分类更适合训练动态约束。

## Citation

```bibtex
@article{ji2023beavertails,
  title={BeaverTails: Towards Improved Safety Alignment of LLM via a Human-Preference Dataset},
  author={Ji, Jiaming and Liu, Mickel and Dai, Juntao and others},
  journal={arXiv preprint arXiv:2307.04657},
  year={2023}
}
```

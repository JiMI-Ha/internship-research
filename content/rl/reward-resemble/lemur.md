---
title: "LEMUR：从多位教师偏好联合学习多目标 Reward 与 Policy"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Manith Adikari, Bei Peng, Samuele Vinanzi, Angelo Cangelosi"
aliases: [papers/lemur]
tags: [paper, RL, reward-resemble, multi-objective, preference-learning, continuous-control]
source_url: https://arxiv.org/abs/2607.29559
---

> [!summary] 一句话结论
> LEMUR 为不同教师分别学习 objective-specific reward model，再用 MORL 优化一组 trade-off policy；它比把冲突反馈池化成单 RM 更接近 oracle，但证据来自 scripted teacher 的控制环境。

## 基本信息

- **论文**：[LEMUR: Learning to Align with Multi-Objective Reinforcement Learning from Preference Feedback](https://arxiv.org/abs/2607.29559)
- **版本**：arXiv:2607.29559v1，2026-07-31
- **关键词**：preference-based RL、MORL、multi-teacher、reward relabeling

## Motivation

MORL 通常假设每个目标 reward 已知；偏好 RL 又主要只学单一 reward。若不同教师分别关注效率、性能等冲突目标，把反馈混成一个 RM 会制造相互矛盾的标签。

## Method

LEMUR 先用状态熵内在奖励预训练探索，获得多样轨迹；然后每位教师训练独立 reward model，并在交互中继续查询偏好。MO-SAC/MORL-D 使用 reward 向量学习多组 policy；replay buffer 不存旧 reward，而是在采样时用最新 RM 动态 relabel，缓解 reward 非平稳。

## Experimental Setup

- MO-LunarLander、MO-Hopper、MO-HalfCheetah、MO-MetaWorld。
- scripted teacher 由不可见的真实 reward 分量生成偏好；主要是两个冲突教师，五个随机种子。
- 比较单 RM 池化、均值 utilitarian、MORAL、PbMORL、FPbRL 与 oracle。

## Results

LEMUR 在四环境的两目标曲线上最接近 oracle。Hypervolume 在 Hopper 为 **3.67e6**（PbMORL 2.24e6），MetaWorld 为 **2.15e6**（1.43e6）；front sparsity 也明显更低。对标签噪声、反馈预算减少和更多目标的消融保持优势。

## Ablation

池化冲突反馈的 Naive 与均值 Utilitarian 几乎不学习；单一 weight-conditioned RM 的 PbMORL 也落后于分教师 RM。在线更新与动态 relabel 优于固定离线 reward，但组件贡献没有在所有环境完全拆分。

## Limitations

- 没有真实人类教师；scripted preference 比真实标注更一致且更可分。
- 采用线性 scalarization，不能覆盖非凸 front。
- 是连续控制与机器人环境，不是 LLM policy，迁移到文本需额外验证。
- 多教师身份与目标一一对应，现实中一个人可能同时表达多种冲突价值。

## Takeaways

- 冲突来源明确时，为每个来源保留独立 RM 比池化标签更合理。
- 在线 RM 更新必须同步 relabel 历史经验，否则 policy 会追逐过时 reward。
- 对 LLM 的价值主要是机制参考，不能把控制环境结果直接当成语言对齐证据。

## Citation

```bibtex
@article{adikari2026lemur,
  title={LEMUR: Learning to Align with Multi-Objective Reinforcement Learning from Preference Feedback},
  author={Adikari, Manith and Peng, Bei and Vinanzi, Samuele and Cangelosi, Angelo},
  journal={arXiv preprint arXiv:2607.29559},
  year={2026}
}
```

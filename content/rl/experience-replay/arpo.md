---
title: "ARPO：GUI Agent 的 Group Relative Policy Optimization 与经验回放"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, RL, GUI-agent, experience-replay, GRPO]
source_url: https://arxiv.org/abs/2505.16282
---

> [!summary] 核心结论
> ARPO 把 GRPO 扩展到 GUI 多步 agent：当同一任务的整组交互全为零奖励时，从 FIFO buffer 注入历史非零奖励轨迹。它在 OSWorld 上明显优于基座和普通 GRPO，并缓解了 OOD 退化。

## 基本信息

- **论文**：[ARPO: End-to-End Policy Optimization for GUI Agents with Experience Replay](https://arxiv.org/abs/2505.16282)
- **作者**：Fanbin Lu、Zhisheng Zhong、Shu Liu、Chi-Wing Fu、Jiaya Jia

## Motivation

GUI agent 的轨迹长、动作空间大且成功稀疏，一组 rollout 很容易全部失败，导致 GRPO 没有相对 advantage。重新探索一条成功操作序列成本远高于短答案生成。论文希望利用同任务早期偶然成功的轨迹恢复训练信号。

## Method

1. 按 GUI task 组织 trajectory group，使用端到端 outcome reward 做 group-relative 更新。
2. 将非零 reward 的历史交互轨迹存入经验池。
3. 当前 group 全零时，从同任务 buffer 中注入历史非零轨迹；正常组不强制 replay。
4. 用 FIFO 删除过旧经验，降低 agent policy 和环境状态分布变化造成的 staleness。

## Experimental Setup

- **基座**：UI-TARS 系列视觉语言 GUI agent。
- **任务**：OSWorld 标准与 OSWorld Hard，并补充 in-domain/OOD 分析。
- **对照**：原始 UI-TARS、普通 GRPO 与 ARPO。

## Results

| 设置         |  Base |  GRPO |      ARPO |
| ------------ | ----: | ----: | --------: |
| OSWorld      | 23.5% | 26.0% | **29.9%** |
| OSWorld Hard | 18.2% | 20.9% | **23.8%** |

- In-domain：base 43.8%、GRPO 68.8%、ARPO **81.25%**。
- OOD：base 55.2%、GRPO 52.08%、ARPO **56.3%**。ARPO 恢复到略高于基座，但 OOD 增益远小于 in-domain。

## Ablation

- 经验池消融显示 replay 在全零组中有额外贡献，不能只用普通 GRPO 解释全部提升。
- 结构化按任务分组和 FIFO freshness 是有效回放的前提。
- OOD 结果表明 replay 可缓解过拟合，但证据只有小幅单点提升。

## Limitations

- GUI 环境存在状态不可复现和界面变化，历史动作序列不一定仍可执行。
- OOD 仅比基座高 1.1 个百分点，不能强称显著泛化提升。
- 依赖任务 ID 对齐历史轨迹；开放式电脑使用中的任务匹配更困难。

## Takeaways

ARPO 将 EFRAME/Polaris 式“全失败 rescue”带到多步 agent。对稀疏奖励任务，按任务索引的近期成功轨迹比全局随机 replay 更合理。

## Citation

Lu et al. _ARPO: End-to-End Policy Optimization for GUI Agents with Experience Replay_. arXiv:2505.16282, 2025.

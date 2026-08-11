---
title: "实习调研"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
---

<div class="research-hero">
  <div class="research-kicker">Internship Research Library</div>
  <h1>实习调研</h1>
  <p>把论文读成可以复用的判断：为什么做、怎么做、结果是否真的成立。</p>
</div>

> [!abstract] 阅读原则
> 不只记录论文“说了什么”，还要区分问题证据、方法机制、实验结果与适用边界。

## 最新调研

### [[rl/reward-resemble/rvpo|RVPO：通过方差正则实现风险敏感对齐]]

`RL` · `Reward Resemble 系列`

多目标 RLHF 为什么会忽略关键约束？RVPO 用 SoftMin 将奖励聚合从“追求平均值”改为“兼顾最弱项”，并在 HealthBench 上改善瓶颈约束与训练稳定性。

- **Motivation**：均值聚合允许容易目标的高分掩盖关键约束失败。
- **Method**：对各奖励通道 Z-normalize，再用带风险系数的 SoftMin 聚合。
- **Results**：14B HealthBench 最佳分数从 GDPO 的 0.215 提升至 0.261。

[[rl/reward-resemble/rvpo|阅读全文 →]]

## 内容地图

- **[[papers/|论文调研]]**：按 Motivation、Method、Results、Limitations 结构整理。
- **[[rl/|RL]] → [[rl/reward-resemble/|Reward Resemble 系列]]**：奖励设计、聚合与优化方法。
- **方法笔记**：沉淀可跨论文复用的算法与实验设计知识。
- **实习观察**：记录工程实践、复现过程和阶段性判断。

> [!tip] 使用方式
> 按 `Ctrl + K` 搜索主题；通过正文中的双链和右侧关系图继续探索。

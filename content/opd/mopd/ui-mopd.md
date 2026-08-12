---
title: "UI-MOPD：Motivation、Method 与 Results 解读"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
tags: [paper, OPD, MOPD, paper-reading, capability-integration]
source_url: https://arxiv.org/abs/2607.04425
---

> [!summary] 解读结论
> GUI 合版的难点不是共享视觉编码，而是不能把平台特有动作语义平均掉；按平台路由并只在低 reward 轨迹上加 KL 更合适。

## 基本信息

- **论文**：[UI-MOPD](https://arxiv.org/abs/2607.04425)
- **arXiv**：2607.04425
- **分类**：直接方法、改进与诊断
- **在 MOPD 图谱中的位置**：跨平台 GUI 合版：整合 desktop 与 mobile 专家，同时保留各平台动作 convention。
- **证据口径**：方法或机制级证据；优先读取论文中的对照、消融与失败案例。

## Motivation

桌面与移动 GUI 共享视觉理解和规划能力，但动作语义不同；混合 SFT、Mixed-RL 或权重合并容易把点击、滑动、键盘等平台 convention 平均掉。

**解读**：作者真正关注的是多教师能力整合中的具体瓶颈，而不是简单地把更多训练数据混在一起。

## Method

构建近 10K 条 Uni-GUI 跨平台轨迹，分别训练 desktop/mobile 教师；学生 rollout 按平台路由教师，并只在 task feedback 不足的低 reward rollout 上启用教师 KL anchor。

**关键机制**：关键机制可以概括为：跨平台 GUI 合版：整合 desktop 与 mobile 专家，同时保留各平台动作 convention。

## Experimental Setup

论文构建近 10K 条 Uni-GUI 跨平台轨迹，分别训练桌面和移动教师，再在 OSWorld 与 MobileWorld 上比较统一学生、参数合并与其他整合策略。

## Results

OSWorld 和 MobileWorld success rate 分别为 38.2% 与 12.0%，相对 base model 提升 12.7% 与 55.8%，并优于参数匹配的整合策略。移动端绝对成功率仍低，说明统一 GUI agent 远未解决。

**结果怎么读**：GUI 合版的难点不是共享视觉编码，而是不能把平台特有动作语义平均掉；按平台路由并只在低 reward 轨迹上加 KL 更合适。

## Limitations

MobileWorld 的绝对成功率仍只有 12.0%；数据与动作空间集中在桌面和移动两类平台，不能说明方法已解决更广泛的具身或网页交互泛化。

## Takeaways

GUI 合版的难点不是共享视觉编码，而是不能把平台特有动作语义平均掉；按平台路由并只在低 reward 轨迹上加 KL 更合适。

## Citation

> UI-MOPD. arXiv:2607.04425. [原文](https://arxiv.org/abs/2607.04425)

---

[[opd/mopd/|返回 MOPD 逐篇解读目录]] · [[opd/mopd/mopd-capability-integration|查看 MOPD 横向综合]]

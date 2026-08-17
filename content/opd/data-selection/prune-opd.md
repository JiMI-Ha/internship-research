---
title: "Prune-OPD：按 Prefix Drift 截断不可靠的长轨迹监督"
created: 2026-08-17
published: 2026-08-17
modified: 2026-08-17
type: paper
tags: [paper, OPD, data-selection, prefix-drift, long-horizon]
source_url: https://arxiv.org/abs/2605.07804
---

> [!summary] 解读结论
> Prune-OPD 不在 rollout 完成后挑选整条轨迹，而是持续监控每个位置的师生 top-k overlap；当 drift 事件累计时，降低后缀监督权重并动态缩短生成长度。其证据支持“长 trajectory 的后缀不应默认与前缀同样可靠”，但 overlap 不能识别候选 token 排序不同的情形。

## 基本信息

- **论文**：[Prune-OPD: Efficient and Reliable On-Policy Distillation for Long-Horizon Reasoning](https://arxiv.org/abs/2605.07804)
- **arXiv**：2605.07804，2026-05-08 预印本。
- **当前专题关系**：直接覆盖 prefix drift / 长轨迹可靠性控制（C），数据筛选专项分为 **1/4**。

## Motivation

学生生成的长 prefix 会逐步偏离教师的 reasoning distribution；在严重 drift 后继续把教师 dense reward 均匀施加在后缀，既浪费计算，也可能让不可靠梯度压过前缀的有效信号。固定生成长度无法同时解决“截得过早”和“后缀无效”的问题。

## Method

1. 每个位置计算师生 top-k overlap：

   \[
   O_\tau=\frac{|K^S_\tau\cap K^T_\tau|}{k}.
   \]

2. 当 \(O_\tau<\gamma\) 时记一次 drift event；默认 \(\gamma=0.7\)。累计 event 后，线性降低该位置及后续位置的可靠性权重，并保留基础权重 \(w_{base}=0.5\)。
3. 根据仍高于可靠性阈值的位置数估计有效长度；batch-level controller 依照触达当前长度预算的样本比例，动态扩大或缩小最大 rollout length。

## Experimental Setup

- **数据**：DAPO-Math-17K。
- **模型**：五组 DeepSeek、JustRL、Qwen3、Skywork teacher/student pair，含高 overlap 对照组。
- **比较**：标准 OPD、固定 4K 截断、top-p action-acceptance 版本与 overlap 版本。
- **评测**：AMC23、AIME24/25、HMMT24/25，pass@1；报告 wall-clock 时间。

## Results

| 设置                        |     对照 |                Prune-OPD | 原文支持的结论                                                    |
| --------------------------- | -------: | -----------------------: | ----------------------------------------------------------------- |
| 低 / 中 compatibility pairs | 标准 OPD | 训练时间减少 37.6%–68.0% | 大体保持或略改善 accuracy。                                       |
| DeepSeek-1.5B / DeepSeek-7B |    12.5h |                     4.0h | 时间减少 68.0%；AMC23 66.4 → 65.9、AIME24 33.5 → 33.3，接近持平。 |
| 高 compatibility control    | 标准 OPD |          时间仅减少 2.9% | controller 倾向扩展窗口，而非盲目截断。                           |

## Ablation / Robustness

- reliability-based 截断比固定 4K 截断更能保住有用长 prefix。
- overlap ratio 比 top-p action-acceptance 更适合该设置；后者更严格，可能误丢有效 token。
- \(\gamma\) 从 0.6 提到 0.9 时，速度与 accuracy 形成单调 trade-off；默认 0.7 作为平衡点。
- 对低 overlap Qwen pair，论文分析认为收益不只来自节省时间，也来自移除 drift 后缀的噪声梯度。

## Sensitivity / Boundary Conditions

- 阈值 \(\gamma\) 决定速度—质量折中，不能直接迁移到所有 teacher/student pair。
- 方法假设 drift 大致累积；若低 overlap 后重新恢复兼容性，线性累计衰减不会恢复权重。

## Limitations

- top-k overlap 可能忽略教师和学生拥有相同候选 token、但排序概率很不同的情况。
- 当前只在数学及 DeepSeek/Qwen/Skywork pair 验证；agent、多轮任务和异构教师未测试。
- 方法通过缩放 OPD reward 实现，未为零可靠性 token 设计 GRPO fallback。

## Takeaways

Prune-OPD 在机制榜只命中 C：它是**轨迹内部**的可靠性控制，不等同于从多个 rollout 中挑一条，也不等同于 token importance ranking。

## Citation

> _Prune-OPD: Efficient and Reliable On-Policy Distillation for Long-Horizon Reasoning_. arXiv:2605.07804, 2026. [原文](https://arxiv.org/abs/2605.07804)

---

[[opd/data-selection/|返回 OPD 数据筛选专题]]

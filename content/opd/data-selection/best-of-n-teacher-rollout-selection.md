---
title: "BRTS：从多个教师 Rollout 中选择辅助蒸馏轨迹"
created: 2026-08-17
published: 2026-08-17
modified: 2026-08-17
type: paper
tags: [paper, OPD, data-selection, trajectory-selection, teacher-rollout]
source_url: https://arxiv.org/abs/2605.09725
---

> [!summary] 解读结论
> BRTS 不只使用一条随机教师 rollout，而是在多条教师候选中优先选择正确、且与学生 top-k support 更重叠的轨迹；没有正确候选时再使用带 ground truth 的恢复步骤。选择机制清楚，但对可验证数学题和可用标准答案的依赖限制了直接迁移范围。

## 基本信息

- **论文**：[On-Policy Distillation with Best-of-N Teacher Rollout Selection](https://arxiv.org/abs/2605.09725)
- **arXiv**：2605.09725，2026-05-10 预印本。
- **当前专题关系**：直接覆盖 rollout / trajectory 筛选或重加权（B），数据筛选专项分为 **1/4**。

## Motivation

单条教师 rollout 有高随机性，且强教师生成的轨迹不一定是学生最容易吸收的轨迹。BRTS 希望从多个教师候选里选择同时具备任务正确性与学生局部 support 对齐的辅助 trajectory。

## Method

三层 waterfall 选择：

1. 采样 \(N\) 条未条件化教师 rollout；在正确候选中选 student top-k overlap 最高者。
2. 若没有正确候选，向教师隐式注入 ground truth 作为验证信号，再采样一次；只有结果正确才接受。
3. 若前两层均失败，退回到第一层中 student top-k overlap 最高的候选。

总 loss 由 student rollout 上的 teacher-context KL 与已选教师轨迹上的辅助 teacher-context loss 组成，论文默认辅助项权重 \(\lambda=10\)。

## Experimental Setup

- **模型**：JustRL-1.5B teacher / DeepSeek-1.5B student；另有 DeepSeek-R1-Distill-Qwen-7B teacher 替换实验。
- **数据**：DAPO-Math-17K。
- **训练**：默认 \(N=4\)，top-k=16；student temperature 1.0，teacher temperature 0.7。
- **比较**：标准 OPD（2 条 student rollout）。
- **评测**：AIME24、AIME25、AMC23，以 4 次采样的 mean、best-of-4 与 majority-vote 报告。

## Results

| 指标 / 设置               |                              BRTS 结果 | 原文支持的结论                                |
| ------------------------- | -------------------------------------: | --------------------------------------------- |
| AIME24，\(N=4\)           | mean 0.400；best 0.599；majority 0.431 | 多候选 teacher selection 下取得论文所报表现。 |
| AMC23，\(N=4\)            |                 mean 0.684；best 0.800 | 数学评测有提升。                              |
| teacher-swap，AIME24 mean |                          0.317 → 0.367 | 替换教师时仍报告增益。                        |

## Ablation / Robustness

- 2 条 Tier-1 candidate 的准确率为 52.73%；增加到 4 条为 66.70%。
- 2 条 Tier-1 + 1 条 Tier-2 recovery 为 69.53%，支持 ground-truth recovery 有额外贡献。
- \(N=4\) 的 step 时间为 460s，\(N=1\) 为 281s；选择增益伴随明显 teacher rollout 成本。

## Sensitivity / Boundary Conditions

- 候选数 \(N\) 增加能提高选择空间，但增加 compute。
- 选择将 correctness 与 student top-k overlap 绑定；没有可靠正确性标签时，Tier-2 不能直接使用。

## Limitations

- 范围限制在有 exact ground-truth answer 的数学推理。
- 论文也指出，无标准答案时需要 learned verifier 或更强模型替代，尚未验证。
- 辅助 teacher-generated trajectory 使其并非只依赖严格的 student on-policy 轨迹。

## Takeaways

BRTS 在机制榜中命中 B：它是**教师候选 trajectory 选择**，与选择 student rollout、截断 drift suffix 或选择 token 不同。

## Citation

> _On-Policy Distillation with Best-of-N Teacher Rollout Selection_. arXiv:2605.09725, 2026. [原文](https://arxiv.org/abs/2605.09725)

---

[[opd/data-selection/|返回 OPD 数据筛选专题]]

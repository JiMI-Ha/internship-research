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

### [[rl/reward-resemble/prism|PRISM：不要混合奖励，而要组合策略]]

`RL` · `Reward Resemble 系列`

多奖励 RL 不再先把目标压成一个标量：PRISM 为每个目标学习 positive policy，用共享 negative policy 表示失败方向，再在 token logits 上组合。

- **Motivation**：固定奖励混合会造成尺度支配、梯度冲突，并把部署时权衡永久固化。
- **Method**：共享 backbone 上训练 prefix-conditioned 策略分支，按 $\sum_k\alpha_kz_k^+-\gamma z^-$ 推理。
- **Results**：科学推理 overall 最高达 62.73 vs. 44.96；BFCL-v3 Acc/B 为 53.46 vs. GDPO 52.13。

[[rl/reward-resemble/prism|阅读全文 →]]

### [[rl/reward-resemble/rule-based-rewards|Rule Based Rewards：把安全规范编译成可训练奖励]]

`RL` · `Reward Resemble 系列`

RBR 将自然语言安全政策拆成 LLM grader 可判定的 propositions，再从合成排序数据中拟合线性规则奖励。

- **Motivation**：政策持续变化，反复收集大规模真人安全偏好既慢又难稳定执行细粒度规范。
- **Method**：把规则概率的加权和叠加到帮助性 RM，并用 PPO 训练策略。
- **Results**：人工评测 Not-Unsafe / Not-Overrefuse 为 97.27% / 97.01%，F1 97.1%。

[[rl/reward-resemble/rule-based-rewards|阅读全文 →]]

### [[rl/reward-resemble/optimal-dualization-can|CAN：通过最优对偶化实现一次训练的安全对齐]]

`RL` · `Reward Resemble 系列`

CAN 在固定离线样本上先求满足安全 margin 的最优乘子，再用合成后的目标只训练一次策略。

- **Motivation**：交替训练策略与拉格朗日乘子成本高，固定权重又不能保证安全 margin。
- **Method**：利用 KL 正则策略的闭式对偶函数求 $\lambda^*$，再训练 $r+\langle\lambda^*,h\rangle$。
- **Results**：MOCAN 形成优于 SFT、DPO、Safe-RLHF 的经验 Pareto 前沿，预测 margin 与实测区间基本一致。

[[rl/reward-resemble/optimal-dualization-can|阅读全文 →]]

### [[rl/reward-resemble/constrained-dpo|C-DPO：用动态拉格朗日乘子约束直接偏好优化]]

`RL` · `Reward Resemble 系列`

C-DPO 按当前 reward–cost 拉格朗日分数重新决定 chosen / rejected，让安全压力随约束违反程度变化。

- **Motivation**：标准 DPO 只优化单一偏好，固定安全权重难以既满足阈值又保留 reward。
- **Method**：以 $r_\lambda=r-\lambda c$ 重标偏好对，交替做 DPO 与对偶梯度更新。
- **Results**：$\lambda=0.4$ 得到 reward $4.26\pm5.59$、cost $-0.58\pm16.70$；均值可行但方差很大。

[[rl/reward-resemble/constrained-dpo|阅读全文 →]]

### [[rl/reward-resemble/odin|ODIN：解耦质量与长度奖励，缓解 RLHF 奖励黑客]]

`RL` · `Reward Resemble 系列`

ODIN 让 Reward Model 分别学习质量与长度，策略优化时丢弃长度 head，避免靠冗长回答刷分。

- **Motivation**：偏好数据中的长度相关性会被 RL 策略放大成 verbosity reward hacking。
- **Method**：双 head ranking、长度去相关和权重正交，RL 时只使用质量奖励。
- **Results**：reward–length Pearson 从 0.451 降至 -0.030，排序准确率只由 70.1 降到 69.2。

[[rl/reward-resemble/odin|阅读全文 →]]

### [[llm-safety/over-refusal/or-bench|OR-Bench：规模化测量安全模型的过度拒答]]

`LLM Safety` · `Over-Refusal 系列`

OR-Bench 从危险 seeds 生成并审核 80K 条靠近拒答边界的安全 prompts，同时用 Hard-1K 和 toxic 集检查两侧错误。

- **Motivation**：小型诊断集覆盖有限，普通无害指令又不足以区分强模型。
- **Method**：多模型审核合成边界题，32 个模型统一测试 safe refusal 与 toxic rejection。
- **Results**：安全拒答与过拒的 Spearman 相关为 0.89，但这是跨模型相关而非因果证明。

[[llm-safety/over-refusal/or-bench|阅读全文 →]]

### [[llm-safety/over-refusal/xstest|XSTest：用最小安全—危险对照识别夸张安全行为]]

`LLM Safety` · `Over-Refusal 系列`

XSTest 用看似敏感但实际无害的 prompts 与最小编辑危险版本，检查模型理解语义还是只按关键词拒答。

- **Motivation**：只测试危险请求会让“永远拒答”的模型获得虚假的满分安全性。
- **Method**：250 条手工安全题、200 条 unsafe contrasts，人工标注 full / partial refusal。
- **Results**：原始 Llama-2-70B-chat 对安全题总拒答 59.6%，GPT-4 为 8.4%。

[[llm-safety/over-refusal/xstest|阅读全文 →]]

### [[rl/reward-resemble/safe-rlhf|Safe RLHF：用动态安全约束平衡有用与无害]]

`RL` · `Reward Resemble 系列`

RLHF 中“更有用”和“更安全”发生冲突时，Safe RLHF 分别学习 Reward Model 与 Cost Model，把安全写成约束，并用拉格朗日乘子随训练状态动态调整两者权重。

- **Motivation**：单一总体偏好让标注者隐式解决价值冲突，固定奖励权重又容易过度优化其中一侧。
- **Method**：解耦帮助性与无害性标注，在 PPO 中最大化 reward，同时约束期望 cost 不超过阈值。
- **Results**：三轮训练后，人工标注有害响应率由 53.08% 降至 2.45%，帮助性与无害性 Elo 同时上升。

[[rl/reward-resemble/safe-rlhf|阅读全文 →]]

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
- **[[llm-safety/|LLM Safety]] → [[llm-safety/over-refusal/|Over-Refusal 系列]]**：安全拒答、过度拒答与边界评测。
- **方法笔记**：沉淀可跨论文复用的算法与实验设计知识。
- **实习观察**：记录工程实践、复现过程和阶段性判断。

> [!tip] 使用方式
> 按 `Ctrl + K` 搜索主题；通过正文中的双链和右侧关系图继续探索。

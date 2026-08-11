---
title: "Reward Resemble：奖励设计与多目标对齐"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: topic
tags:
  - RL
  - RLHF
  - reward-modeling
  - multi-objective
  - safety-alignment
---

> [!abstract] 这个系列在维护什么
> Reward Resemble 归属于 [[rl/|RL]]，集中整理“模型究竟在优化什么”：奖励如何设计、多个目标如何组合、硬约束如何满足，以及 Reward Model 的偏差如何被策略放大。每篇笔记都要求区分论文主张、实验事实与证据边界。

当前已收录 **7 篇**论文，覆盖多奖励聚合、约束优化、规则奖励和 reward hacking。欢迎在群里推荐论文、认领阅读或直接提交笔记。

- **[推荐 / 认领一篇论文](https://github.com/JiMI-Ha/internship-research/issues/new?template=paper-review.yml)**
- **[[rl/reward-resemble/contribute|查看协作维护指南]]**
- **[打开 GitHub 仓库](https://github.com/JiMI-Ha/internship-research)**

## 收录范围

优先收录以下方向：

1. **Reward design**：规则奖励、可验证奖励、奖励塑形与 reward decomposition。
2. **Reward Model**：偏差、校准、鲁棒性、reward hacking 与去偏方法。
3. **Multi-objective alignment**：多奖励标准化、聚合、策略组合与 Pareto 优化。
4. **Constrained alignment**：安全 cost、拉格朗日方法、风险敏感或尾部约束。

一般不收录与奖励机制没有直接关系的通用 LLM 论文；安全 benchmark 可归入 [[llm-safety/|LLM Safety]]，并在确实能解释奖励设计时与本系列交叉链接。

## 研究地图

### 多奖励聚合与策略组合

- [[rl/reward-resemble/rvpo|RVPO：通过方差正则实现风险敏感对齐]] — 用 SoftMin 防止容易目标的高分补偿关键约束失败。
- [[rl/reward-resemble/prism|PRISM：不要混合奖励，而要组合策略]] — 分别学习目标专家与共享负策略，在推理时组合 logits。

### 安全约束与对偶优化

- [[rl/reward-resemble/safe-rlhf|Safe RLHF：用动态安全约束平衡有用与无害]] — 分离帮助性 reward 与安全 cost，并动态满足安全约束。
- [[rl/reward-resemble/constrained-dpo|C-DPO：用动态拉格朗日乘子约束直接偏好优化]] — 根据约束违反程度重标偏好并更新乘子。
- [[rl/reward-resemble/optimal-dualization-can|CAN：通过最优对偶化实现一次训练的安全对齐]] — 离线求最优对偶变量，再进行一次策略训练。

### 奖励构造、解耦与去偏

- [[rl/reward-resemble/rule-based-rewards|Rule Based Rewards：把安全规范编译成可训练奖励]] — 将自然语言安全政策拆成可组合规则并拟合权重。
- [[rl/reward-resemble/odin|ODIN：解耦质量与长度奖励，缓解 RLHF 奖励黑客]] — 用双 head Reward Model 去除可被策略利用的长度捷径。

## 快速对比

| 论文      | 核心问题                      | 主要机制                                          | 最强结果证据                                   | 阅读时要保留的判断                      |
| --------- | ----------------------------- | ------------------------------------------------- | ---------------------------------------------- | --------------------------------------- |
| RVPO      | 均值聚合掩盖弱项              | Z-normalize + SoftMin                             | 14B HealthBench 最佳 0.261 vs. GDPO 0.215      | 风险系数敏感，部分任务最终准确率接近    |
| PRISM     | 多奖励训练相互干扰            | positive policies / negative policy 的 logit 组合 | 科学推理部分设置提升明显                       | 最多只验证 3 个奖励，权重仍需手工选择   |
| Safe RLHF | 帮助性与安全性冲突            | Reward / Cost Model + 动态拉格朗日乘子            | 三轮后人工有害响应率 53.08% → 2.45%            | 算法、增量数据和红队迭代贡献混杂        |
| C-DPO     | DPO 缺少显式安全边界          | 按 $r-\lambda c$ 重标偏好                         | $\lambda=0.4$ 在平均 cost 上可行且 reward 最高 | 单 seed、方差大、训练与评测复用代理模型 |
| CAN       | 交替更新策略与乘子成本高      | 先离线求最优对偶，再训练一次                      | MOCAN 形成更优经验 Pareto 前沿                 | 只验证一个 7B 模型和单一安全约束        |
| RBR       | 安全政策更新依赖昂贵人工偏好  | LLM grader propositions + 线性规则奖励            | 人工评测 F1 97.1%                              | 受 grader 偏差与有限政策覆盖约束        |
| ODIN      | Reward Model 把长度当质量捷径 | 质量 / 长度双 head，RL 时只用质量 head            | Pearson 长度相关 0.451 → -0.030                | 只验证 verbosity hacking，人工样本较小  |

## 如何一起维护

1. **先推荐或认领**：在 [Paper Issue](https://github.com/JiMI-Ha/internship-research/issues/new?template=paper-review.yml) 留下论文链接，避免重复阅读。
2. **按统一证据结构写作**：至少包含 Motivation、Method、Experimental Setup、Results、Ablation、Limitations、Takeaways 与 Citation。
3. **给数字加边界**：核对正文、附录和图表；对小样本、无显著性检验或代理评测明确降级表述。
4. **通过 PR 合并**：按照 [[rl/reward-resemble/contribute|协作维护指南]] 更新页面与索引，构建通过后再合并。

> [!important] 共同标准
> 这里不追求“每篇论文都讲得很强”，而是追求主张可追溯、数字可核对、局限不省略。只读摘要或无法确认来源的结论暂不发布。

## 希望继续补齐的方向

- 多奖励权重的自动选择与大规模扩展；
- verbosity 之外的 reward hacking 与可验证缓解方法；
- Reward Model / LLM judge 的校准、鲁棒性和分布外评测；
- 期望约束之外的尾部风险、分组风险与多约束优化；
- 跨语言、长对话和真实部署分布中的奖励设计。

发现值得加入的论文，可以只提交链接和推荐理由；不要求推荐者必须完成全文笔记。

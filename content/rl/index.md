---
title: "RL"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-12
---

强化学习相关调研，关注训练目标、奖励设计、策略优化以及多目标对齐。

## 系列

- [[rl/reward-resemble/|Reward Resemble：奖励设计与多目标对齐]] — 奖励设计、Reward Model、多目标聚合与约束优化，并按主编评分排序。

## 论文

### Reward Resemble 扩展阅读

- [[rl/reward-resemble/rlep-experience-replay|RLEP 与 LLM Experience Replay：从成功轨迹复用到稳定 Off-Policy RL]]
- [[rl/reward-resemble/gdpo|GDPO：逐奖励归一化避免多奖励优势坍缩]]
- [[rl/reward-resemble/rubrics-as-rewards|RaR：把实例级 Rubric 直接变成强化学习奖励]]
- [[rl/reward-resemble/ares|ARES：从预训练文档自动合成 Rubric 强化学习数据]]
- [[rl/reward-resemble/checklist-feedback|RLCF：用指令级 Checklist 代替固定 Reward Model]]
- [[rl/reward-resemble/r3-rubric-agnostic-rm|R3：面向未见 Rubric 的可解释推理型 Reward Model]]
- [[rl/reward-resemble/rgr-grpo|RGR-GRPO：Rubric 同时提供奖励与离线探索指导]]
- [[rl/reward-resemble/encore|ENCORE：用评分熵组合多头安全奖励]]
- [[rl/reward-resemble/armorm-moe|ArmoRM-MoE：用多维绝对评分和门控学习可解释偏好]]
- [[rl/reward-resemble/projection-optimization|MOPO：用投影迭代实现非线性多目标与多群体 RLHF]]
- [[rl/reward-resemble/directional-preference-alignment|DPA：用偏好方向控制 Helpfulness–Verbosity Trade-off]]
- [[rl/reward-resemble/controllable-preference-optimization|CPO：用偏好 Token 条件化 3H 多目标对齐]]
- [[rl/reward-resemble/modpo|MODPO：把多目标 RLHF 改写成直接偏好优化]]
- [[rl/reward-resemble/cos-dpo|COS-DPO：一次条件训练覆盖多目标 Pareto Front]]
- [[rl/reward-resemble/rewarded-soups|Rewarded Soups：插值目标专家权重生成 Pareto 策略]]
- [[rl/reward-resemble/maxmin-rlhf|MaxMin-RLHF：按最弱群体效用对齐多样偏好]]
- [[rl/reward-resemble/steerlm|SteerLM：用多属性条件 SFT 替代复杂 RLHF]]
- [[rl/reward-resemble/lemur|LEMUR：从多位教师偏好联合学习多目标 Reward 与 Policy]]
- [[rl/reward-resemble/natural-language-constraints|NLCL：从自然语言示范学习安全约束]]
- [[rl/reward-resemble/constitutional-ai|Constitutional AI：用原则与 AI Feedback 训练无害助手]]
- [[rl/reward-resemble/salmon|SALMON：可按原则指令控制的 Reward Model]]
- [[rl/reward-resemble/beavertails|BeaverTails：解耦 helpfulness 与 harmlessness 的安全偏好数据]]
- [[rl/reward-resemble/reward-model-ensembles|Reward Model Ensembles：用保守聚合缓解过优化]]
- [[rl/reward-resemble/warm|WARM：在参数空间平均 Reward Models]]
- [[rl/reward-resemble/reward-overoptimization-scaling|Reward Model Overoptimization Scaling Laws：代理奖励越训越坏的定量规律]]
- [[rl/reward-resemble/synthetic-critiques|Synthetic Critiques：用自然语言批评增强 Reward Model]]
- [[rl/reward-resemble/rewardbench|RewardBench：系统评测 Reward Model 的困难偏好集]]
- [[rl/reward-resemble/healthbench|HealthBench：用医生编写的逐样本 Rubric 评估医疗对话]]
- [[rl/reward-resemble/helpsteer|HelpSteer：把 Helpfulness 拆成五个可控属性]]
- [[rl/reward-resemble/helpsteer2|HelpSteer2：用 10K 高质量偏好对训练强 Reward Model]]
- [[rl/reward-resemble/ultrafeedback|UltraFeedback：规模化收集多维 AI Feedback]]
- [[rl/reward-resemble/prometheus|Prometheus：按自定义 Rubric 评分的开源 Evaluator]]
- [[rl/reward-resemble/prometheus-2|Prometheus 2：统一绝对评分与成对排序的开源 Judge]]
- [[rl/reward-resemble/g-eval|G-Eval：用 CoT 与评分概率对齐人类 NLG 评价]]
- [[rl/reward-resemble/llm-as-a-judge|MT-Bench 与 Chatbot Arena：系统检验 LLM-as-a-Judge]]
- [[rl/reward-resemble/morl-practical-guide|MORL Practical Guide：从效用函数到 Pareto 解集的设计指南]]
- [[rl/reward-resemble/mgda|MGDA for MTL：以最小范数梯度寻找 Pareto Stationary 解]]
- [[rl/reward-resemble/pcgrad|PCGrad：投影冲突梯度的 Gradient Surgery]]
- [[rl/reward-resemble/cagrad|CAGrad：在平均目标附近改善最差任务梯度]]
- [[rl/reward-resemble/nash-mtl|Nash-MTL：把多任务梯度组合视为议价博弈]]

### 已有核心论文

- [[rl/reward-resemble/prism|PRISM：不要混合奖励，而要组合策略]] — 用策略分解替代训练前的多奖励混合。
- [[rl/reward-resemble/rule-based-rewards|Rule Based Rewards：把安全规范编译成可训练奖励]] — 用规则奖励平衡内容安全与过度拒答。
- [[rl/reward-resemble/optimal-dualization-can|CAN：通过最优对偶化实现一次训练的安全对齐]] — 先求安全约束的最优乘子，再一次性训练策略。
- [[rl/reward-resemble/constrained-dpo|C-DPO：用动态拉格朗日乘子约束直接偏好优化]] — 将动态安全约束加入 DPO。
- [[rl/reward-resemble/odin|ODIN：解耦质量与长度奖励，缓解 RLHF 奖励黑客]] — 解耦 Reward Model 中的质量与长度信号。
- [[rl/reward-resemble/safe-rlhf|Safe RLHF：用动态安全约束平衡有用与无害]] — 将安全建模为 Cost Model 约束，并动态平衡帮助性与无害性。
- [[rl/reward-resemble/rvpo|RVPO：通过方差正则实现风险敏感对齐]] — 用风险敏感聚合缓解多目标奖励的约束忽略。

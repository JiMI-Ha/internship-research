---
title: "论文调研"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
---

这里收录论文的结构化阅读笔记，重点回答三个问题：研究动机是否真实、方法如何解决问题、结果是否足以支持主张。

## 论文列表

- **RL / Reward Resemble**：[[rl/reward-resemble/gdpo|GDPO：逐奖励归一化避免多奖励优势坍缩]] — 多奖励归一化、GRPO
- **RL / Reward Resemble**：[[rl/reward-resemble/rubrics-as-rewards|RaR：把实例级 Rubric 直接变成强化学习奖励]] — rubric reward、开放域 RL
- **RL / Reward Resemble**：[[rl/reward-resemble/ares|ARES：从预训练文档自动合成 Rubric 强化学习数据]] — rubric synthesis、数据扩展
- **RL / Reward Resemble**：[[rl/reward-resemble/checklist-feedback|RLCF：用指令级 Checklist 代替固定 Reward Model]] — checklist、可解释奖励
- **RL / Reward Resemble**：[[rl/reward-resemble/r3-rubric-agnostic-rm|R3：面向未见 Rubric 的可解释推理型 Reward Model]] — rubric 泛化、RM
- **RL / Reward Resemble**：[[rl/reward-resemble/rgr-grpo|RGR-GRPO：Rubric 同时提供奖励与离线探索指导]] — rubric guidance、GRPO
- **RL / Reward Resemble**：[[rl/reward-resemble/encore|ENCORE：用评分熵组合多头安全奖励]] — 多头 RM、entropy
- **RL / Reward Resemble**：[[rl/reward-resemble/armorm-moe|ArmoRM-MoE：用多维绝对评分和门控学习可解释偏好]] — 多属性 RM、MoE
- **RL / Reward Resemble**：[[rl/reward-resemble/projection-optimization|MOPO：用投影迭代实现非线性多目标与多群体 RLHF]] — 非线性聚合、多群体
- **RL / Reward Resemble**：[[rl/reward-resemble/directional-preference-alignment|DPA：用偏好方向控制 Helpfulness–Verbosity Trade-off]] — 偏好方向、可控对齐
- **RL / Reward Resemble**：[[rl/reward-resemble/controllable-preference-optimization|CPO：用偏好 Token 条件化 3H 多目标对齐]] — 条件策略、多目标
- **RL / Reward Resemble**：[[rl/reward-resemble/modpo|MODPO：把多目标 RLHF 改写成直接偏好优化]] — multi-objective DPO
- **RL / Reward Resemble**：[[rl/reward-resemble/cos-dpo|COS-DPO：一次条件训练覆盖多目标 Pareto Front]] — one-shot DPO、Pareto
- **RL / Reward Resemble**：[[rl/reward-resemble/rewarded-soups|Rewarded Soups：插值目标专家权重生成 Pareto 策略]] — 权重插值、Pareto
- **RL / Reward Resemble**：[[rl/reward-resemble/maxmin-rlhf|MaxMin-RLHF：按最弱群体效用对齐多样偏好]] — max-min、公平性
- **RL / Reward Resemble**：[[rl/reward-resemble/steerlm|SteerLM：用多属性条件 SFT 替代复杂 RLHF]] — attribute-conditioned SFT
- **RL / Reward Resemble**：[[rl/reward-resemble/lemur|LEMUR：从多位教师偏好联合学习多目标 Reward 与 Policy]] — 多教师偏好、MORL
- **RL / Reward Resemble**：[[rl/reward-resemble/natural-language-constraints|NLCL：从自然语言示范学习安全约束]] — constraint learning、安全 RL
- **RL / Reward Resemble**：[[rl/reward-resemble/constitutional-ai|Constitutional AI：用原则与 AI Feedback 训练无害助手]] — RLAIF、原则监督
- **RL / Reward Resemble**：[[rl/reward-resemble/salmon|SALMON：可按原则指令控制的 Reward Model]] — instructable RM、原则干预
- **RL / Reward Resemble**：[[rl/reward-resemble/beavertails|BeaverTails：解耦 helpfulness 与 harmlessness 的安全偏好数据]] — safety data、reward/cost
- **RL / Reward Resemble**：[[rl/reward-resemble/reward-model-ensembles|Reward Model Ensembles：用保守聚合缓解过优化]] — ensemble、过优化
- **RL / Reward Resemble**：[[rl/reward-resemble/warm|WARM：在参数空间平均 Reward Models]] — weight averaging、RM
- **RL / Reward Resemble**：[[rl/reward-resemble/reward-overoptimization-scaling|Reward Model Overoptimization Scaling Laws：代理奖励越训越坏的定量规律]] — Goodhart、scaling law
- **RL / Reward Resemble**：[[rl/reward-resemble/synthetic-critiques|Synthetic Critiques：用自然语言批评增强 Reward Model]] — critique、RM
- **RL / Reward Resemble**：[[rl/reward-resemble/rewardbench|RewardBench：系统评测 Reward Model 的困难偏好集]] — RM benchmark
- **RL / Reward Resemble**：[[rl/reward-resemble/healthbench|HealthBench：用医生编写的逐样本 Rubric 评估医疗对话]] — 医疗 rubric、benchmark
- **RL / Reward Resemble**：[[rl/reward-resemble/helpsteer|HelpSteer：把 Helpfulness 拆成五个可控属性]] — multi-attribute data
- **RL / Reward Resemble**：[[rl/reward-resemble/helpsteer2|HelpSteer2：用 10K 高质量偏好对训练强 Reward Model]] — preference data、RM
- **RL / Reward Resemble**：[[rl/reward-resemble/ultrafeedback|UltraFeedback：规模化收集多维 AI Feedback]] — AI feedback、多维评分
- **RL / Reward Resemble**：[[rl/reward-resemble/prometheus|Prometheus：按自定义 Rubric 评分的开源 Evaluator]] — rubric evaluator
- **RL / Reward Resemble**：[[rl/reward-resemble/prometheus-2|Prometheus 2：统一绝对评分与成对排序的开源 Judge]] — absolute / pairwise judge
- **RL / Reward Resemble**：[[rl/reward-resemble/g-eval|G-Eval：用 CoT 与评分概率对齐人类 NLG 评价]] — CoT judge、NLG
- **RL / Reward Resemble**：[[rl/reward-resemble/llm-as-a-judge|MT-Bench 与 Chatbot Arena：系统检验 LLM-as-a-Judge]] — judge bias、人类偏好
- **RL / Reward Resemble**：[[rl/reward-resemble/morl-practical-guide|MORL Practical Guide：从效用函数到 Pareto 解集的设计指南]] — MORL、utility
- **RL / Reward Resemble**：[[rl/reward-resemble/mgda|MGDA for MTL：以最小范数梯度寻找 Pareto Stationary 解]] — MGDA、Pareto
- **RL / Reward Resemble**：[[rl/reward-resemble/pcgrad|PCGrad：投影冲突梯度的 Gradient Surgery]] — gradient conflict
- **RL / Reward Resemble**：[[rl/reward-resemble/cagrad|CAGrad：在平均目标附近改善最差任务梯度]] — worst-task gradient
- **RL / Reward Resemble**：[[rl/reward-resemble/nash-mtl|Nash-MTL：把多任务梯度组合视为议价博弈]] — Nash bargaining、公平性

- **RL / Reward Resemble**：[[rl/reward-resemble/prism|PRISM：不要混合奖励，而要组合策略]] — 多奖励 RL、策略分解、logit 组合
- **RL / Reward Resemble**：[[rl/reward-resemble/rule-based-rewards|Rule Based Rewards：把安全规范编译成可训练奖励]] — 安全政策、规则奖励、过度拒答
- **RL / Reward Resemble**：[[rl/reward-resemble/optimal-dualization-can|CAN：通过最优对偶化实现一次训练的安全对齐]] — 约束优化、对偶化、一次训练
- **RL / Reward Resemble**：[[rl/reward-resemble/constrained-dpo|C-DPO：用动态拉格朗日乘子约束直接偏好优化]] — DPO、安全成本、拉格朗日约束
- **RL / Reward Resemble**：[[rl/reward-resemble/odin|ODIN：解耦质量与长度奖励，缓解 RLHF 奖励黑客]] — Reward Model、长度偏差、reward hacking
- **LLM Safety / Over-Refusal**：[[llm-safety/over-refusal/or-bench|OR-Bench：规模化测量安全模型的过度拒答]] — 80K 边界样本、安全—过拒权衡
- **LLM Safety / Over-Refusal**：[[llm-safety/over-refusal/xstest|XSTest：用最小安全—危险对照识别夸张安全行为]] — 最小对照、过度拒答、安全评测
- **RL / Reward Resemble**：[[rl/reward-resemble/safe-rlhf|Safe RLHF：用动态安全约束平衡有用与无害]] — 安全 RLHF、奖励与成本解耦、拉格朗日约束
- **RL / Reward Resemble**：[[rl/reward-resemble/rvpo|RVPO：通过方差正则实现风险敏感对齐]] — 多目标 RLHF、奖励聚合、约束忽略

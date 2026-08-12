---
title: "Reward Resemble：奖励设计与多目标对齐"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-12
type: topic
tags:
  - RL
  - RLHF
  - reward-modeling
  - multi-objective
  - safety-alignment
---

> [!abstract] 这个系列在看什么
> Reward Resemble 归属于 [[rl/|RL]]，集中整理“模型究竟在优化什么”：奖励如何设计、多个目标如何组合、硬约束如何满足，以及 Reward Model 的偏差如何被策略放大。

## 评分口径

- **业务契合度**：方法与当前业务问题、可落地场景和约束的匹配程度，满分 5 星。
- **Paper solid 度**：读过论文后，再评价问题定义、方法严密性、实验覆盖、对照公平性与结论可信度，满分 5 星。
- **完整评分**：两项都给分时，按总分从高到低排序；总分相同时，业务契合度更高的论文优先。
- **仅业务**：只给业务契合度、不评价 solid 时，表示尚未读或因业务不相关而不准备继续读；缺失项不会按 0 分计算。
- **待评价**：业务契合度也没有给分时，放在榜单最后。

评分只表达主编当前判断，不等同于论文的客观价值；随着业务目标或新增证据变化，可以继续修改。

## 四项专项推荐分

页面另列一份与主编星级**完全独立**的固定推荐榜。以下四项各命中一项加 1 分，满分 4 分：

1. **Reward Resemble / 组合集成**：方法直接组合、拆分、条件化或集成多路 reward、Reward Model、评分项或目标策略。
2. **显式加分项 / 减分项**：方法直接使用正负规则、reward/cost、bonus/penalty 或反补偿项。
3. **量纲、尺度与归一化**：论文直接处理 reward、loss 或 gradient 的尺度、归一化、校准或尺度不变性；只研究模型参数规模的 scaling law 不计。
4. **梯度冲突**：论文显式分析或修改相冲突的目标梯度；只说多个业务目标存在冲突不计。

专项分只回答“方法是否直接涉及这四类问题”，不评价实验质量，也不会读取或改变业务契合度与 Paper solid 度。榜单保留 0 分论文作为背景材料，避免筛选口径不透明。

## 研究地图

### Rubric Reward 与组合

- [[rl/reward-resemble/rvpo|RVPO：通过方差正则实现风险敏感对齐]] — 用 SoftMin 防止容易目标补偿关键约束失败。
- [[rl/reward-resemble/prism|PRISM：不要混合奖励，而要组合策略]] — 分别学习目标专家，在推理时组合 logits。
- [[rl/reward-resemble/gdpo|GDPO：逐奖励归一化避免多奖励优势坍缩]] — 先逐 reward 标准化，再聚合 advantage。
- [[rl/reward-resemble/rubrics-as-rewards|RaR：把实例级 Rubric 直接变成强化学习奖励]] — 用逐样本、可核查标准扩展开放域 RL。
- [[rl/reward-resemble/ares|ARES：从预训练文档自动合成 Rubric 强化学习数据]] — 自动生成 rubric 以扩展覆盖率。
- [[rl/reward-resemble/checklist-feedback|RLCF：用指令级 Checklist 代替固定 Reward Model]] — 将反馈拆为可解释检查项。
- [[rl/reward-resemble/r3-rubric-agnostic-rm|R3：面向未见 Rubric 的可解释推理型 Reward Model]] — 让 RM 对新 rubric 做推理与泛化。
- [[rl/reward-resemble/rgr-grpo|RGR-GRPO：Rubric 同时提供奖励与离线探索指导]] — rubric 同时控制 reward 和探索。
- [[rl/reward-resemble/encore|ENCORE：用评分熵组合多头安全奖励]] — 按 reward head 不确定性动态聚合。

### 多目标 Trade-off 与可控策略

- [[rl/reward-resemble/armorm-moe|ArmoRM-MoE：用多维绝对评分和门控学习可解释偏好]] — prompt-conditioned gate 学习属性权重。
- [[rl/reward-resemble/projection-optimization|MOPO：用投影迭代实现非线性多目标与多群体 RLHF]] — 用非线性聚合突破线性 scalarization。
- [[rl/reward-resemble/directional-preference-alignment|DPA：用偏好方向控制 Helpfulness–Verbosity Trade-off]] — 在权重空间用方向调节偏好。
- [[rl/reward-resemble/controllable-preference-optimization|CPO：用偏好 Token 条件化 3H 多目标对齐]] — 单模型按偏好向量切换行为。
- [[rl/reward-resemble/modpo|MODPO：把多目标 RLHF 改写成直接偏好优化]] — 为不同权重训练 Pareto policies。
- [[rl/reward-resemble/cos-dpo|COS-DPO：一次条件训练覆盖多目标 Pareto Front]] — 一次条件化训练覆盖偏好 profile。
- [[rl/reward-resemble/rewarded-soups|Rewarded Soups：插值目标专家权重生成 Pareto 策略]] — 在参数空间插值单目标专家。
- [[rl/reward-resemble/maxmin-rlhf|MaxMin-RLHF：按最弱群体效用对齐多样偏好]] — 用 max-min 防止牺牲少数群体。
- [[rl/reward-resemble/steerlm|SteerLM：用多属性条件 SFT 替代复杂 RLHF]] — 以属性条件直接控制生成。
- [[rl/reward-resemble/lemur|LEMUR：从多位教师偏好联合学习多目标 Reward 与 Policy]] — 联合学习 objective-specific RM 与策略。

### 安全约束与原则监督

- [[rl/reward-resemble/safe-rlhf|Safe RLHF：用动态安全约束平衡有用与无害]] — 分离 helpfulness reward 与 safety cost。
- [[rl/reward-resemble/constrained-dpo|C-DPO：用动态拉格朗日乘子约束直接偏好优化]] — 将动态安全约束加入 DPO。
- [[rl/reward-resemble/optimal-dualization-can|CAN：通过最优对偶化实现一次训练的安全对齐]] — 离线求最优对偶变量后一次训练。
- [[rl/reward-resemble/natural-language-constraints|NLCL：从自然语言示范学习安全约束]] — 从正负示范学习显式 cost。
- [[rl/reward-resemble/constitutional-ai|Constitutional AI：用原则与 AI Feedback 训练无害助手]] — critique-revision 与 RLAIF。
- [[rl/reward-resemble/salmon|SALMON：可按原则指令控制的 Reward Model]] — 让 RM 把自然语言原则作为条件输入。
- [[rl/reward-resemble/beavertails|BeaverTails：解耦 helpfulness 与 harmlessness 的安全偏好数据]] — 提供 reward/cost 分离的数据基础。
- [[rl/reward-resemble/rule-based-rewards|Rule Based Rewards：把安全规范编译成可训练奖励]] — 将安全政策编译为可组合规则。

### RM 过优化、集成与去偏

- [[rl/reward-resemble/reward-model-ensembles|Reward Model Ensembles：用保守聚合缓解过优化]] — 用 worst-case 或 uncertainty penalty 防 exploit。
- [[rl/reward-resemble/warm|WARM：在参数空间平均 Reward Models]] — 以单模型推理成本获得权重集成。
- [[rl/reward-resemble/odin|ODIN：解耦质量与长度奖励，缓解 RLHF 奖励黑客]] — 去掉可被利用的长度信号。
- [[rl/reward-resemble/reward-overoptimization-scaling|Reward Model Overoptimization Scaling Laws：代理奖励越训越坏的定量规律]] — 测量 Goodhart 曲线与规模规律。
- [[rl/reward-resemble/synthetic-critiques|Synthetic Critiques：用自然语言批评增强 Reward Model]] — 用解释信号减少表面 shortcut。
- [[rl/reward-resemble/rewardbench|RewardBench：系统评测 Reward Model 的困难偏好集]] — 分项测试 Chat、Safety 与 Reasoning。

### Rubric 数据与 LLM Judge

- [[rl/reward-resemble/healthbench|HealthBench：用医生编写的逐样本 Rubric 评估医疗对话]] — 48K+ 医生标准的开放式医疗评测。
- [[rl/reward-resemble/helpsteer|HelpSteer：把 Helpfulness 拆成五个可控属性]] — 多属性帮助性标注。
- [[rl/reward-resemble/helpsteer2|HelpSteer2：用 10K 高质量偏好对训练强 Reward Model]] — 小规模、高一致性 RM 数据。
- [[rl/reward-resemble/ultrafeedback|UltraFeedback：规模化收集多维 AI Feedback]] — 百万级多维 AI feedback。
- [[rl/reward-resemble/prometheus|Prometheus：按自定义 Rubric 评分的开源 Evaluator]] — rubric-conditioned 绝对评分。
- [[rl/reward-resemble/prometheus-2|Prometheus 2：统一绝对评分与成对排序的开源 Judge]] — 合并两种 evaluator 格式。
- [[rl/reward-resemble/g-eval|G-Eval：用 CoT 与评分概率对齐人类 NLG 评价]] — 早期 criteria-based LLM judge。
- [[rl/reward-resemble/llm-as-a-judge|MT-Bench 与 Chatbot Arena：系统检验 LLM-as-a-Judge]] — 测量位置、长度与自偏好。

### 通用多目标优化补充

- [[rl/reward-resemble/morl-practical-guide|MORL Practical Guide：从效用函数到 Pareto 解集的设计指南]] — 区分效用、SER/ESR 与 coverage set。
- [[rl/reward-resemble/mgda|MGDA for MTL：以最小范数梯度寻找 Pareto Stationary 解]] — 最小范数凸组合任务梯度。
- [[rl/reward-resemble/pcgrad|PCGrad：投影冲突梯度的 Gradient Surgery]] — 投影负内积任务梯度。
- [[rl/reward-resemble/cagrad|CAGrad：在平均目标附近改善最差任务梯度]] — 在平均性能附近保护最差任务。
- [[rl/reward-resemble/nash-mtl|Nash-MTL：把多任务梯度组合视为议价博弈]] — 用 Nash bargaining 实现比例公平。

## 收录范围

1. **Reward design**：规则奖励、可验证奖励、奖励塑形与 reward decomposition。
2. **Reward Model**：偏差、校准、鲁棒性、reward hacking 与去偏方法。
3. **Multi-objective alignment**：多奖励标准化、聚合、策略组合与 Pareto 优化。
4. **Constrained alignment**：安全 cost、拉格朗日方法、风险敏感或尾部约束。

安全 benchmark 归入 [[llm-safety/|LLM Safety]]；只有在能直接解释奖励设计时才与本系列交叉链接。

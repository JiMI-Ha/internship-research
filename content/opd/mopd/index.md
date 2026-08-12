---
title: "MOPD：多教师 On-Policy Distillation"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: topic
tags: [MOPD, OPD, multi-teacher, capability-integration, model-merging]
---

> [!abstract] 这个系列在看什么
> MOPD 从同一学生分叉训练多个领域专家，再让学生在自己的 rollout 上接受对应教师的 token 级监督，以一次训练完成能力合版。本系列区分方法创新、失败机制、工业应用与邻近基础工作。

## 核心调研

- [[opd/mopd/mopd-capability-integration|MOPD 合版：多教师 On-Policy Distillation 的能力整合、失败模式与工程选型]] — 对 39 篇相关论文逐篇整理 Motivation、Method 和 Results，并补充横向实验、失败机制、局限与工程选型。

## 收录范围

1. 直接提出、修改或诊断 Multi-Teacher On-Policy Distillation 的论文。
2. 明确把多专家 OPD 用于统一模型后训练的技术报告。
3. 能直接解释 MOPD 成败的 OPD、知识融合与参数合并基础工作。

一般单教师 OPD 不做穷举；不同模型、数据、训练预算和评测协议之间不按绝对分数直接排名。

## 逐篇论文解读

下面每个入口都是站内独立 Markdown 笔记，正文直接给出 Motivation、Method、Experimental Setup、Results、Limitations 与 Takeaways；原始 arXiv 只放在各笔记的“基本信息”中。

### A. 直接方法、改进与诊断

- [[opd/mopd/mimo-v2-flash|1. MiMo-V2-Flash Technical Report]] — 大规模 MOPD 可以让一个学生接近多个专项教师，但“多数能力接近”比“所有能力无损继承”更符合证据。
- [[opd/mopd/nemotron-cascade-2|2. Nemotron-Cascade 2]] — MOPD 不只适合并行专家合版，也可以把历史 checkpoint 变成“能力记忆”，快速修复顺序 RL 的遗忘。
- [[opd/mopd/copd|3. Co-Evolving Policy Distillation（CoPD）]] — 教师与学生的距离会随专项 RL 不断扩大；越早、越持续地交换策略分布，最后合版越容易。
- [[opd/mopd/camopd|4. Counteraction-Aware MOPD（CaMOPD）]] — 多教师问题不只发生在同一 token 的分布融合，也发生在共享参数上的跨 batch 梯度冲突；分时更新比盲目平均更可靠。
- [[opd/mopd/mopd|5. MOPD: Multi-Teacher On-Policy Distillation]] — MOPD 的关键不是找绝对最强教师，而是让教师在学生实际访问的 prefix 上提供既有增量、又可吸收的监督。
- [[opd/mopd/deepseek-v4|6. DeepSeek-V4]] — 这篇报告最可信的贡献是证明多教师全词表蒸馏能在工业规模被调度，而不是证明某个最终分数由 MOPD 单独带来。
- [[opd/mopd/h-opd|7. H-OPD: Heterogeneous Multi-Teacher Multimodal OPD]] — 当教师能力互补时，prompt 级固定路由过粗；同一轨迹内按 token 仲裁可以让感知与逻辑教师分别发挥作用。
- [[opd/mopd/ui-mopd|8. UI-MOPD]] — GUI 合版的难点不是共享视觉编码，而是不能把平台特有动作语义平均掉；按平台路由并只在低 reward 轨迹上加 KL 更合适。
- [[opd/mopd/top-k-misses-decision|9. When Top-K Misses the Decision]] — 选择 Top-k 时要审计决策 token 是否在 support 中，不能只看 retained probability mass。
- [[opd/mopd/promptsd|10. PROMPTSD]] — 多教师不一定要复制多套完整模型；冻结同一骨干、只训练任务 prompt，可以主动控制 teacher-student drift。
- [[opd/mopd/regen|11. REGEN]] — 当教师 serving 是主要瓶颈时，REGEN 提供明显的成本优势，但换来的是部分任务上的监督密度损失。
- [[opd/mopd/physics-multi-turn-planning|12. The Physics of Multi-Turn Long-Horizon Planning]] — MOPD 能整合的是可共享的行为模式；若专家程序知识完全冲突，继续调 loss 也未必能让无条件单模型同时表示它们。
- [[opd/mopd/smopd|13. SMOPD]] — 当一个统一 reward 归一化仍压制稀疏目标时，可以先让专项教师学到各自峰值，再在学生状态上合版。
- [[opd/mopd/ls-mopd|14. LS-MOPD]] — 教师本身更强不代表更适合蒸馏；对学生而言，稳定且兼容的 prefix 可能比教师单点最低错误率更重要。

### B. 工业模型与技术报告

- [[opd/mopd/baichuan-m3|15. Baichuan-M3]] — 三阶段 recipe 的价值在于先让学生进入可蒸馏区域，再用 on-policy 信号修正学生自己的错误状态。
- [[opd/mopd/glm-5|16. GLM-5]] — 把历史 checkpoint 作为多教师是一种实用的抗遗忘方案，但现有报告主要提供系统可行性证据。
- [[opd/mopd/kat-coder-v2|17. KAT-Coder-V2]] — MOPD 在这里解决的是多种代码环境无法共享统一 reward 与 rollout 基础设施的问题，而不是单独创造代码能力。
- [[opd/mopd/kwai-keye-vl-2|18. Kwai Keye-VL-2.0]] — 报告证明大规模跨模态教师路由可以进入统一后训练，但不能据此计算 MOPD 对最终榜单的净贡献。
- [[opd/mopd/nemotron-3-ultra|19. Nemotron 3 Ultra]] — warm-up 的作用是让学生先进入教师可识别的思考区域；没有可访问的共同 prefix，再强的教师也提供不了有效更新。
- [[opd/mopd/nebulaexp-8b|20. NebulaExp-8B]] — 相比只给最终模型总分的报告，这篇提供了较清楚的 OPD/MOPD 组件证据，支持小数据下的密集监督价值。
- [[opd/mopd/kat-coder-v2-5|21. KAT-Coder-V2.5]] — 长轨迹里前缀漂移会逐步放大；在不可信后段继续强行对齐，可能比主动截断更伤模型。
- [[opd/mopd/mach-mind-4-flash|22. Mach-Mind-4-Flash]] — 合版会同时出现保留、损失和正迁移；逐教师消融比只看最终平均分更能判断每位教师是否真正贡献能力。
- [[opd/mopd/solar-open-2|23. Solar Open 2]] — 这篇最值得读的是 250B、12 教师下的 serving 与异步工程，而不是把最终模型排名当作纯方法对照。
- [[opd/mopd/motif-3|24. Motif 3]] — 工业合版不只要保能力，还要保护推理栈契约；冻结 router/MTP 是稳定性选择，不代表全参更新一定更差。
- [[opd/mopd/orbit|25. ORBIT]] — 多教师合版也可以整合同一任务的不同计算 Pareto 点，但必须保留显式 mode 条件才能避免平均成一种行为。

### C. OPD、参数合并与知识融合基础

- [[opd/mopd/gkd|26. GKD: On-Policy Distillation of Language Models]] — MOPD 之所以强调 on-policy，根本原因是教师必须在学生真正会进入的错误状态上给反馈。
- [[opd/mopd/minillm|27. MiniLLM]] — reverse KL 适合让容量有限的学生聚焦教师高概率模式，但它不会自动解决多位教师之间的模式冲突。
- [[opd/mopd/rethinking-opd|28. Rethinking On-Policy Distillation]] — OPD 成功需要“教师真有新能力”和“学生能进入教师的思考模式”同时成立，只有更高 benchmark 分数并不够。
- [[opd/mopd/simple-opd|29. Simple-OPD]] — warm-up 首先在对齐“怎么思考”，不只是灌输答案；近饱和 LoRA 可在兼容性和通用能力之间取得更好平衡。
- [[opd/mopd/tide-mismatch-matters|30. TIDE: Mismatch Matters]] — 只监督学生采样 token 会同时漏掉教师想要但学生从不采的分支，也可能纵容教师近零概率的循环 token。
- [[opd/mopd/opd-survey|31. A Survey of On-Policy Distillation for LLMs]] — 适合用来建立概念坐标，但具体 MOPD 工程决策仍要回到原论文的教师构造、路由与 support 细节。
- [[opd/mopd/model-soups|32. Model Soups]] — 当模型同源且仍在同一低误差 basin，权重平均是极便宜基线；超出该条件时，MOPD 的行为级监督更有价值。
- [[opd/mopd/task-arithmetic|33. Task Arithmetic]] — Task Arithmetic 是无需再训练的强基线，但 MOPD 主实验中的汇总分仍明显低于 on-policy 合版。
- [[opd/mopd/ties-merging|34. TIES-Merging]] — TIES 说明很多合版损失来自 delta 干涉，但参数层修复不能替代 MOPD 在学生状态上的行为纠错。
- [[opd/mopd/dare|35. DARE]] — DARE 适合降低参数合并干涉和成本，但它解决的是权重冗余，不是 on-policy 能力迁移。
- [[opd/mopd/adamerging|36. AdaMerging]] — 固定 merge coefficient 往往过粗；若不愿运行教师，至少应让合并权重随任务或层自适应。
- [[opd/mopd/fusellm|37. FuseLLM]] — FuseLLM 证明不同架构也能在输出分布层融合，但缺少学生状态反馈时仍会保留 exposure bias。
- [[opd/mopd/fusechat|38. FuseChat]] — 当模型结构差异太大不能直接 merge 时，可以先做行为对齐再合并；这与 MOPD 的共同点是先缩小模型间距离。
- [[opd/mopd/nemotron-cascade|39. Nemotron-Cascade]] — 它解释了 Nemotron-Cascade 2 为什么需要跨阶段教师：顺序 RL 简化基础设施，却把能力回退留给后续恢复阶段。

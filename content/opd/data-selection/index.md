---
title: "OPD 数据筛选：Prompt、Rollout、Prefix 与 Token 监督"
created: 2026-08-17
published: 2026-08-17
modified: 2026-08-17
type: topic
tags: [OPD, data-selection, prompt-selection, trajectory-selection, token-selection]
---

> [!abstract] 这个专题在看什么
> 标准 On-Policy Distillation 通常对学生生成 rollout 的所有轨迹、所有位置施加教师监督；本专题研究哪些 prompt、rollout、长轨迹前缀和 token 值得进入或保留在 OPD 训练中。重点不是给论文做“效果总分”，而是记录每篇工作直接覆盖了哪一种数据筛选机制。

## 范围与边界

- **收录**：直接在 OPD 中选择、过滤、重加权或截断 prompt、student rollout、trajectory prefix 或 token 的论文。
- **保留为机制参考**：MOPD 中的 gap 选样、support 审计和长轨迹截断；它们只在明确改变训练样本或监督位置时计入专项分。
- **不计入专项分**：仅提出新的 OPD loss、教师路由、教师强度比较或事后诊断、但没有实际选择训练数据/监督位置的工作。
- **比较边界**：不同论文使用的教师、学生、任务、训练 token、rollout 预算和评测协议不同；本页不按跨论文 benchmark 数字排序。

## 数据筛选机制榜

专项分只回答“论文的**方法设计**是否直接覆盖下列机制”，**不评价效果大小、论文质量或业务价值**，因此不把不同实验设置下的结果混成总分。

| 机制                                     | +1 的判定标准                                                         |
| ---------------------------------------- | --------------------------------------------------------------------- |
| **A. Prompt / curriculum 筛选**          | 明确决定哪些 prompt 在当前阶段进入 OPD 训练，而非仅按领域路由。       |
| **B. Rollout / trajectory 筛选或重加权** | 明确选择、过滤、重加权或从多个候选中挑选 student/teacher trajectory。 |
| **C. Prefix drift / 长轨迹可靠性控制**   | 根据 prefix 兼容性或漂移，截断、降权或停止后续监督。                  |
| **D. Token 级选择 / 重加权**             | 选择、屏蔽或加权部分 token 的 OPD loss。                              |

**排序规则**：专项分降序；同分按论文标题排序。`unknown` 不计作未覆盖：未读到完整机制或论文没有实际部署该机制时，标为“未计分 / 待核”。

| 专项分 | 论文                                                     |                      A                      |  B  |  C  |  D  | 计分依据 |
| -----: | -------------------------------------------------------- | :-----------------------------------------: | :-: | :-: | :-: | -------- |
|    2/4 | [[opd/data-selection/filter-then-reweight-opd            |      FiRe-OPD：Filter, Then Reweight]]      |     |  ✓  |     | ✓        | 整条 rollout 按教师似然硬过滤；保留轨迹内按教师置信度和学生困惑度软加权 token。    |
|    2/4 | [[opd/data-selection/sead                                |        SEAD：Competence-Aware OPD]]         |  ✓  |     |     | ✓        | 按学生初始通过率逐步放开 prompt；按师生熵将 token 分区监督。                       |
|    1/4 | [[opd/data-selection/best-of-n-teacher-rollout-selection | BRTS：Best-of-N Teacher Rollout Selection]] |     |  ✓  |     |          | 在多个教师 rollout 中按正确性和学生 top-k overlap 做瀑布式选择。                   |
|    1/4 | [[opd/data-selection/finding-decision-supporting-tokens  |     DEAR：Decision-Supporting Tokens]]      |     |     |     | ✓        | 保留高熵 decision token，并选择与 decision anchor 相关的 evidence token。          |
|    1/4 | [[opd/data-selection/prefix-guided-opd                   |         PG-OPD：Prefix-Guided OPD]]         |     |  ✓  |     |          | 用短 prefix 的师生 top-k overlap 决定哪些 rollout candidate 继续生成。             |
|    1/4 | [[opd/data-selection/prune-opd                           |                 Prune-OPD]]                 |     |     |  ✓  |          | 按逐位置 top-k overlap drift 递减监督可靠性并动态缩短 rollout。                    |
|    1/4 | [[opd/data-selection/renio                               |   ReNIO：Negative Trajectory Importance]]   |     |  ✓  |     |          | 用 pivotal token 的 student/teacher log-ratio 给 student-generated output 重加权。 |
|    1/4 | [[opd/data-selection/token-teachability-opd              |        TA-OPD：Token Teachability]]         |     |     |     | ✓        | 只监督同时具备分歧和 teacher-to-student support compatibility 的 token。           |
|    1/4 | [[opd/data-selection/token-importance-opd                |           TIP：Token Importance]]           |     |     |     | ✓        | 用 student entropy 与师生 divergence 的 Soft-OR 选择 token。                       |

## 机制地图

| 训练决策点                       | 当前直接证据                                                                                                                                                                                                                                                           | 仍需区分的问题                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 哪些 prompt 进入当前阶段         | [[opd/data-selection/sead\|SEAD]]                                                                                                                                                                                                                                      | pass-rate 难度是否能迁移到 code、agent 或无 verifier 的任务。                      |
| 多条 rollout 中哪条继续生成/训练 | [[opd/data-selection/prefix-guided-opd\|PG-OPD]]、[[opd/data-selection/filter-then-reweight-opd\|FiRe-OPD]]、[[opd/data-selection/renio\|ReNIO]]、[[opd/data-selection/best-of-n-teacher-rollout-selection\|BRTS]]                                                     | teacher likelihood、prefix overlap、pivotal-token gap 与正确性何时相互冲突。       |
| 长 trajectory 在哪里停止监督     | [[opd/data-selection/prune-opd\|Prune-OPD]]                                                                                                                                                                                                                            | overlap 低后能否重新恢复；不同推理风格是否被误判为 drift。                         |
| 一条保留轨迹中哪些 token 学习    | [[opd/data-selection/token-importance-opd\|TIP]]、[[opd/data-selection/finding-decision-supporting-tokens\|DEAR]]、[[opd/data-selection/token-teachability-opd\|TA-OPD]]、[[opd/data-selection/filter-then-reweight-opd\|FiRe-OPD]]、[[opd/data-selection/sead\|SEAD]] | entropy、divergence、decision evidence 与 support compatibility 并不是可互换信号。 |

## 重要诊断证据（不计入方法机制榜）

- [[opd/mopd/top-k-misses-decision|When Top-K Misses the Decision]]：高 retained probability mass 不保证关键行为切换 token 仍在 teacher support 中。
- [[opd/mopd/camopd|CaMOPD]]：teacher-student log-probability gap 可用于聚焦修正需求高的样本，但仅在两个垂直领域验证，且可能遗漏师生共同自信但共同错误的样本。
- **Unmasking On-Policy Distillation**（arXiv:2605.10889）：给出 gradient-alignment 诊断与正对齐 token 的 oracle 上界；该 oracle 需要训练时不可得的成功概率，因此不作为可部署筛选方法计分。

## 逐篇阅读

- [[opd/data-selection/filter-then-reweight-opd|FiRe-OPD：Filter, Then Reweight]] — trajectory 硬过滤与 token 软重加权的粒度组合。
- [[opd/data-selection/sead|SEAD：Competence-Aware OPD]] — prompt curriculum、token entropy zoning 与训练阶段退火。
- [[opd/data-selection/prefix-guided-opd|PG-OPD：Prefix-Guided OPD]] — 用 128-token probe 分配完整 rollout 预算。
- [[opd/data-selection/prune-opd|Prune-OPD]] — 以 prefix drift 识别不可靠监督后缀。
- [[opd/data-selection/renio|ReNIO：Negative Trajectory Importance]] — 不依赖最终 correctness label 的 trajectory 重加权。
- [[opd/data-selection/best-of-n-teacher-rollout-selection|BRTS：Best-of-N Teacher Rollout Selection]] — 从多个教师样本中选取学生更易吸收的辅助轨迹。
- [[opd/data-selection/token-importance-opd|TIP：Token Importance]] — entropy 与 divergence 的 token 选择基线。
- [[opd/data-selection/finding-decision-supporting-tokens|DEAR：Decision-Supporting Tokens]] — 将 decision token 与其相关 evidence token 一起保留。
- [[opd/data-selection/token-teachability-opd|TA-OPD：Token Teachability]] — 用 teacher 在学生 support 内的概率质量区分可教与不可教分歧。

## 下一轮问题

1. 在统一 OPD 实验预算下，prompt、trajectory、prefix 和 token 四层筛选能否独立贡献，还是会相互替代？
2. Top-k overlap、teacher likelihood、divergence 与 support compatibility 的排序是否在 math 以外仍稳定？
3. 未提供可靠 final-answer verifier 的 agent / tool-use 环境，如何验证 ReNIO 或 BRTS 类选择信号？
4. 多教师 OPD 中，筛选能否同时处理教师路由错误、跨领域梯度冲突和领域覆盖配额？

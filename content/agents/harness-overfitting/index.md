---
title: "Agent Harness 依赖与过拟合：论文与博客排序"
created: 2026-08-17
published: 2026-08-17
modified: 2026-08-17
type: topic
tags: [agents, harness, overfitting, generalization, evaluation, SWE-bench]
source_url: https://arxiv.org/abs/2607.12227
---

> [!abstract] Topic Brief
> **原始业务 Query**：调研 agent 场景下，模型对 harness / scaffold / 工具环境依赖造成泛化能力弱的现象。
>
> **当前问题重述**：当模型在固定 agent harness 中训练、调参或被反复 benchmark 后，它学到的是可迁移任务能力，还是对特定 system prompt、工具 schema、观测格式、动作空间、verifier、预算和控制器的适配？
>
> **核心动机**：Kimi K3 报告明确提示在固定 harness 上训练存在过拟合风险；DeepSeek V4 Pro 的类似说法目前只能作为社区传闻，不能当作证据。

## 当前结论

最直接的研究主线不是“agent 泛化差”这个宽问题，而是更可操作的 **harness-induced overfitting**：固定 harness 下的训练收益，是否在语义等价但结构不同的 harness 上消失。证据强弱大致分三层：

1. **直接证据**：Harness evolution / HarnessCompass / Kimi K3 这类工作把 harness 作为训练或优化对象，并显式讨论跨 harness 泛化或固定 harness 过拟合。
2. **强诊断证据**：SWE-agent、Mind2Web、OSWorld、WebArena 等揭示 ACI、观测格式、动作空间和环境实现会显著改变 agent 表现。
3. **评测有效性证据**：SWE-ABS、SWE-bench live / rebench / benchmark disclosure audit 等说明公开测试、污染、预算与披露不足会放大“看似能力提升、实际适配评测 harness”的风险。

> [!warning] 证据边界
> DeepSeek V4 Pro “harness 过拟合”的说法如果没有官方报告、可复现实验或公开消融，只应作为检索线索，不进入核心证据链。

## 排序指标

总分不代表论文“质量”，只代表对本专题的研究价值。

```text
AdjustedScore =
(0.30*HS + 0.25*GC + 0.15*HLR + 0.20*ER + 0.10*RL) / 3 * 100
- Penalties
```

| 指标    | 含义                                                       | 0 分           | 1 分               | 2 分               | 3 分                                                    |
| ------- | ---------------------------------------------------------- | -------------- | ------------------ | ------------------ | ------------------------------------------------------- |
| **HS**  | Harness Specificity：是否直接研究 harness / scaffold / ACI | 只谈一般 agent | 提到 prompt 或工具 | 分析某一层 harness | harness 是核心变量                                      |
| **GC**  | Generalization Coverage：是否测跨 harness / 跨环境泛化     | 无泛化         | 只跨任务           | 跨环境或 held-out  | 语义等价 harness 迁移                                   |
| **HLR** | Harness-Layer Resolution：能定位哪层导致失败               | 不可定位       | 单层粗粒度         | 多层比较           | prompt / tool / obs / action / verifier / budget 可分解 |
| **ER**  | Evidence Rigor：证据强度                                   | 传闻           | 案例或博客         | benchmark / 消融   | 多设置、对照、隐藏或 live 验证                          |
| **RL**  | Research Leverage：对后续实验设计帮助                      | 低             | 背景               | 可复用设计         | 可直接转成实验协议                                      |

### 扣分规则

- `-10`：只有社区传闻，无官方或实验支持。
- `-8`：只有 benchmark 分数，不披露 prompt、工具、预算或推理设置。
- `-6`：train / eval 在同一 benchmark family，缺少 held-out、live 或 mutation。
- `-5`：只用 LLM judge，没有规则、人类或执行验证。
- `-5`：没有 baseline 或没有 test-time-scaling baseline。
- `-3`：没有失败分析。
- `-3`：没有 cost、token、step 或 retry budget 披露。

## 总榜：优先阅读顺序

| Rank | 来源                                                                                          | 分数 | 证据等级   | 为什么排在这里                                                                                                             |
| ---: | --------------------------------------------------------------------------------------------- | ---: | ---------- | -------------------------------------------------------------------------------------------------------------------------- |
|    1 | [Rethinking the Evaluation of Harness Evolution for Agents](https://arxiv.org/abs/2607.12227) |   95 | Core       | 直接把 harness evolution 的评估拆成泛化问题，适合作为本文题目的理论入口。                                                  |
|    2 | [HarnessCompass](https://arxiv.org/abs/2608.01918)                                            |   93 | Core       | 目标就是把自动 harness evolution 引向更 generalizable、effective 的 harness，最贴近“训练 harness 会不会过拟合”。           |
|    3 | [Kimi K3 Technical Report](https://moonshotai.github.io/Kimi-K3/)                             |   87 | Core       | 关键动机来源：固定 harness 训练会带来过拟合风险；但它是模型报告，实验拆解通常不如专门论文细。                              |
|    4 | [SWE-agent](https://arxiv.org/abs/2405.15793)                                                 |   83 | Strong     | ACI 明确影响 SWE agent 能力；能说明“同一模型 + 不同接口”不是等价系统。                                                     |
|    5 | [Mind2Web](https://arxiv.org/abs/2306.06070)                                                  |   82 | Strong     | Web agent 的跨网站、跨任务泛化 benchmark；适合观察 DOM / HTML 观测与动作选择的泛化限制。                                   |
|    6 | [AutoHarness](https://arxiv.org/abs/2603.03329)                                               |   81 | Strong     | 自动合成 code harness 来提升 agent，说明 harness 本身能成为优化对象，也带来适配风险。                                      |
|    7 | [AI Agents That Matter](https://arxiv.org/abs/2407.01502)                                     |   80 | Strong     | 强调 agent 评测要控制成本、随机性、scaffold 与可复现性；适合作为方法论约束。                                               |
|    8 | [OSWorld](https://arxiv.org/abs/2404.07972)                                                   |   78 | Strong     | 真实桌面环境、多模态观测和长程动作暴露 GUI harness 对 agent 成败的影响。                                                   |
|    9 | [SWE-ABS](https://arxiv.org/abs/2603.00520)                                                   |   78 | Strong     | 通过 adversarial benchmark strengthening 暴露 test-based benchmark 成功率膨胀，是 verifier / test harness 过拟合的强证据。 |
|   10 | [SWE-bench Goes Live!](https://arxiv.org/abs/2505.23419)                                      |   76 | Strong     | 用 live task 对抗公开 benchmark 污染和重复调参，适合设计时间切分或在线评测。                                               |
|   11 | [WebArena](https://arxiv.org/abs/2307.13854)                                                  |   75 | Strong     | 提供真实网站环境与工具交互任务，是研究 web harness realism 的基础 benchmark。                                              |
|   12 | [What Twelve LLM Agent Benchmark Papers Disclose](https://arxiv.org/abs/2605.21404)           |   74 | Strong     | 直接审计 agent benchmark 披露项，可作为论文筛选和复现实验 checklist。                                                      |
|   13 | [BrowserGym](https://arxiv.org/abs/2407.13525)                                                |   72 | Strong     | 统一 web agent 环境有利于控制 harness 变量，也提醒统一接口本身可能成为适配对象。                                           |
|   14 | [CodeAct](https://arxiv.org/abs/2402.01030)                                                   |   71 | Strong     | 说明把动作空间改成 executable code action 会显著改变 agent 行为，属于 action-space harness 证据。                          |
|   15 | [Agentless](https://arxiv.org/abs/2407.01489)                                                 |   70 | Strong     | 用简化 pipeline 挑战复杂 agent scaffold，帮助区分模型能力、检索编辑流程和 agent 编排收益。                                 |
|   16 | [VisualWebArena](https://arxiv.org/abs/2401.13649)                                            |   69 | Useful     | 把视觉观测引入 web tasks，适合分析 screenshot / DOM / accessibility tree 之间的观测差异。                                  |
|   17 | [WebLINX](https://arxiv.org/abs/2402.05930)                                                   |   68 | Useful     | 多轮真实网站导航数据，能补充 observation history 和 dialogue context 维度。                                                |
|   18 | [SeeAct](https://arxiv.org/abs/2401.01614)                                                    |   67 | Useful     | GUI automation agent，适合拆解选择元素、动作格式和网页观测管线。                                                           |
|   19 | [SWE-rebench](https://arxiv.org/abs/2505.20411)                                               |   67 | Useful     | 自动收集去污染 SWE task，有助于降低 benchmark memory 和公开样本反复调参。                                                  |
|   20 | [SWE-Bench+](https://arxiv.org/abs/2410.06992)                                                |   66 | Useful     | 增强 SWE-bench 类评测，核心价值在于提醒 public tests 与任务构造会影响分数解释。                                            |
|   21 | [SWE-Gym](https://arxiv.org/abs/2412.21139)                                                   |   65 | Useful     | 面向训练 SWE agents 的环境，适合研究训练环境 family 与评测环境 family 的重合度。                                           |
|   22 | [SWE-smith](https://arxiv.org/abs/2504.21798)                                                 |   64 | Useful     | 扩展 SWE agent 训练数据，需关注生成数据是否继承同一 harness 的结构偏差。                                                   |
|   23 | [R2E-Gym](https://arxiv.org/abs/2504.07164)                                                   |   63 | Useful     | 程序化环境与混合 verifier 对训练很有用，也需要检查 verifier 泛化。                                                         |
|   24 | [SWE-RL](https://arxiv.org/abs/2502.18449)                                                    |   61 | Useful     | RL 训练 SWE agents 的代表，适合讨论 reward / verifier 是否诱导 benchmark-specific 行为。                                   |
|   25 | [Kimi K2 Technical Report](https://moonshotai.github.io/Kimi-K2/)                             |   57 | Background | 对 agentic coding / tool-use 背景有用，但不如 Kimi K3 直接提出固定 harness 过拟合风险。                                    |
|   26 | DeepSeek V4 Pro harness overfitting rumors                                                    |   25 | Anecdotal  | 目前只作检索线索；没有官方或可复现实验前，不纳入证据链。                                                                   |

## 按 harness 层归类

| Harness 层                    | 代表来源                                             | 主要诊断问题                                                                          |
| ----------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **System prompt / scaffold**  | SWE-agent, Agentless, AI Agents That Matter          | 是模型能力变强，还是 prompt / controller / retry policy 更会利用 benchmark？          |
| **Tool schema / API**         | SWE-agent, CodeAct, AutoHarness                      | 工具名、参数 schema、返回格式变化后，能力是否保持？                                   |
| **Observation format**        | Mind2Web, WebArena, VisualWebArena, OSWorld, WebLINX | DOM、HTML、accessibility tree、screenshot、line-numbered file view 是否导致不同策略？ |
| **Action space**              | CodeAct, SeeAct, BrowserGym, OSWorld                 | JSON action、shell、code action、鼠标键盘动作之间是否可迁移？                         |
| **Verifier / reward / tests** | SWE-ABS, SWE-bench Goes Live, SWE-rebench, R2E-Gym   | 模型是否学会通过 weak tests，而非真正修复问题？                                       |
| **Controller / budget**       | AI Agents That Matter, SWE-agent, Agentless          | steps、tokens、parallel sampling、重试和 oracle selection 是否被公平披露与控制？      |
| **Benchmark disclosure**      | What Twelve LLM Agent Benchmark Papers Disclose      | prompt、工具、预算、grader、污染控制是否足以复现和解释分数？                          |

## 论文筛选思路

### 先筛“是否直接回答 harness 依赖”

优先读同时满足以下条件的来源：

1. 把 harness / scaffold / ACI / environment / verifier 作为显式变量；
2. 有跨 harness、跨环境、live、hidden 或 mutation 评测；
3. 披露 prompt、工具、动作空间、观测格式、预算和 grader；
4. 有失败分析，而不只是最终榜单分数；
5. 能转化为自己的最小实验：同一任务、同一模型、多个语义等价 harness。

### 再筛“能否转成实验设计”

本课题最小可行实验可以设计成：

1. 固定任务集合与模型；
2. 构造 3–5 个语义等价但结构不同的 harness，例如工具 schema 改写、观测格式改写、动作空间改写、verifier 强化、预算固定；
3. 在 Harness A 上调 prompt / train / RL；
4. 在 A、B、C、D 上同时测试；
5. 用 `InHarnessGain - CrossHarnessGain` 定义 harness overfitting gap；
6. 对每层 harness 做 ablation，定位 gap 来自 prompt、tool、obs、action、verifier 还是 budget。

## 建议必读 15 篇

1. Rethinking the Evaluation of Harness Evolution for Agents
2. HarnessCompass
3. Kimi K3 Technical Report
4. SWE-agent
5. AutoHarness
6. AI Agents That Matter
7. Mind2Web
8. OSWorld
9. SWE-ABS
10. SWE-bench Goes Live!
11. WebArena
12. What Twelve LLM Agent Benchmark Papers Disclose
13. BrowserGym
14. CodeAct
15. Agentless

## 下一轮问题

1. Kimi K3 所说固定 harness 过拟合，具体发生在训练数据、RL 环境、tool-use scaffold 还是 eval adapter？需要从报告和后续技术博客继续抽取证据。
2. SWE / Web / GUI 三类 agent 的 harness perturbation 是否能共用一套指标，还是必须按动作空间分别设计？
3. 如何避免把“harness 更差导致失败”误判成“模型过拟合”？需要让各 harness 在人类或强 oracle 下保持等价可解。
4. 需要建立一个 disclosure checklist：没有 prompt、tool schema、budget、grader 和 contamination control 的来源，默认降权。

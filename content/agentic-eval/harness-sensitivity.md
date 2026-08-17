---
title: "Agentic Benchmark Harness 敏感性：为什么榜单分数不是裸模型能力"
created: 2026-08-17
published: 2026-08-17
modified: 2026-08-17
type: paper
tags:
  - paper
  - agentic-eval
  - benchmark
  - harness
  - scaffold
  - business-metrics
source_url: https://arxiv.org/abs/2405.15793
business_fit: 5
paper_solidity: 4
---

> [!summary] 调研结论
> Agentic benchmark 分数应解释为系统级表现，而不是裸模型能力。模型、agent scaffold、tool schema、context management、inference provider、sandbox 和 evaluator 任一环节变化，都可能显著改变结果。业务上应优先跟踪“同一业务 harness 下的端到端成功率、稳定性、成本、人工介入率和返工损失”，而不是直接采购或训练到公开榜单最高分。

## 基本信息

- **主题**：agentic benchmark 的 harness / scaffold / protocol 敏感性
- **主来源**：[SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://arxiv.org/abs/2405.15793)
- **辅助来源**：[Agentless](https://arxiv.org/abs/2407.01489)、[Terminal-Bench 2.0](https://arxiv.org/abs/2601.11868)、[Do Agent Optimizers Compound?](https://arxiv.org/abs/2607.14004)、[WebArena](https://arxiv.org/abs/2307.13854)、[OSWorld](https://arxiv.org/abs/2404.07972)、[τ-bench](https://arxiv.org/abs/2406.12045)、[AgentBench](https://arxiv.org/abs/2308.03688)、[Aider leaderboard](https://aider.chat/docs/leaderboards/)、[Kimi K3 Tech Blog](https://www.kimi.com/blog/kimi-k3)、[Kimi Vendor Verifier](https://kimi.com/blog/kimi-vendor-verifier.html)
- **证据口径**：多源主题调研；不是某一篇论文的单一结论。不同来源的 benchmark、模型代际和实现细节不可直接横向排名。
- **核心判断**：agentic benchmark score = model × scaffold × tool interface × context policy × inference stack × evaluator。

## Motivation

传统 benchmark 往往把一次 prompt 到一次答案的准确率近似当作模型能力；但 agentic benchmark 测的是长轨迹任务：模型要搜索、编辑、调用工具、浏览网页、操作 GUI、运行测试、恢复错误并在有限预算内提交结果。在这种设置下，公开榜单的分数很容易混入 harness 和系统工程优势。

对业务选型而言，这会带来三类误判：

1. **把系统分数误读成裸模型能力**：某模型在原生 IDE 或厂商 agent 中分数高，不代表迁移到内部工具链后仍高。
2. **把 harness 适配误读成泛化能力**：针对公开任务集优化 prompt、工具、检索和 patch validation，可能提升榜单但降低新任务迁移。
3. **忽视上线成本与稳定性**：同样的 resolved rate 可能对应完全不同的 token 成本、人工接管率、错误返工率和安全风险。

因此，这个主题要回答的问题不是“哪个模型榜单最高”，而是：**如何把 agentic benchmark 拆成可复现、可迁移、可上线的业务指标。**

## Method

### 1. 把 harness 拆成可审计组件

本调研把 agentic benchmark 中的 harness / scaffold 分成八类变量：

1. **任务执行环境**：Docker、VM、terminal、browser、GUI、repo sandbox。
2. **agent scaffold**：ReAct loop、planner、executor、retriever、reflection、retry、patch validation、context compaction。
3. **tool interface**：搜索、编辑、运行测试、点击、API 调用、文件系统和 terminal action schema。
4. **observation format**：stdout、file viewer、DOM、accessibility tree、screenshot、summarized search result、compressed history。
5. **prompt / system instruction**：是否给 demonstration、是否启用 CoT / thinking、是否提示任务不可达、输出格式约束。
6. **context management**：历史 observation 保留策略、thinking history 回传、上下文压缩、max tokens。
7. **inference / deployment stack**：temperature、top_p、reasoning effort、第三方 API、量化、KV cache、fallback、安全 guard。
8. **evaluator / judge**：unit tests、hidden tests、LLM judge、task-specific scripts、pass@k / pass^k、人工复核。

### 2. 用多源证据判断敏感性

优先采纳三类证据：

- **直接 ablation**：同一模型、同一任务集，只改变 interface / scaffold。SWE-agent 是最强证据。
- **leaderboard / benchmark protocol footnote**：官方说明评测的是 agent system 或 best scaffold，而不是裸模型。Terminal-Bench 和 Kimi K3 footnotes 属于此类。
- **系统复现 / 工程验证**：第三方部署、参数、KV cache、tool schema、fallback 等造成分数异常。Kimi Vendor Verifier 和 Aider leaderboard 属于此类。

## Experimental Setup

这是主题调研而非单实验复现。纳入的主要 benchmark 覆盖以下场景：

| 场景                   | 代表来源                       | 与 harness 敏感性的关系                                                                  |
| ---------------------- | ------------------------------ | ---------------------------------------------------------------------------------------- |
| 代码修复               | SWE-agent、Agentless、Aider    | 搜索、编辑、diff format、patch validation、test running 直接影响 resolved rate。         |
| 终端长任务             | Terminal-Bench 2.0             | 同一模型可搭配多个 agent scaffold；官方报告会选择 best scaffold。                        |
| Web agent              | WebArena                       | observation/action space、prompt 中的 unachievable hint、evaluator 影响成功率。          |
| GUI / desktop agent    | OSWorld                        | screenshot、accessibility tree、pyautogui action、task-specific scripts 决定可操作边界。 |
| Tool + user simulation | τ-bench、AgentBench、ToolBench | API schema、policy prompt、user simulator、max actions 和 format compliance 影响结果。   |
| 厂商 agent benchmark   | Kimi K3、Kimi Vendor Verifier  | harness、thinking history、第三方部署和 fallback 被官方列为影响因素。                    |

## Results

### 1. SWE-agent：同一底座模型换 ACI，SWE-bench 分数显著变化

SWE-agent 明确提出 Agent-Computer Interface（ACI）概念，认为 LM agent 不是普通人类用户，需要专门设计的搜索、浏览、编辑和反馈接口。论文报告：

- 使用 GPT-4 Turbo，SWE-agent 在 full SWE-bench 上解决 **12.47%**，在 SWE-bench Lite 上解决 **18.00%**。
- 相比只用 Linux shell 的 Shell-only agent，SWE-agent 在 Lite 上有 **64% 相对提升**；论文还概括为多解决 **10.7 个百分点**。
- ACI ablation 显示：搜索接口、编辑接口、file viewer window、context management 都会改变 resolved rate。

关键细节包括：

- summarized search 比 iterative search 更适合模型；后者会诱导模型逐条翻结果，耗尽预算或上下文。
- 专门的 edit action 能把多步 bash/sed/重写文件流程压成单步，并给出即时反馈。
- linting guardrail 能阻止错误 edit 级联传播。
- file viewer 不是越大越好：太少看不到上下文，full file 又会污染上下文。
- history processing 比完整保留所有 observation 更有效。

**结论**：这是 harness 敏感性的强证据。同一模型、同一 benchmark，interface 设计足以显著改变分数。

### 2. Agentless：强 SWE-bench 结果可以来自 pipeline，而非完整 autonomous agent loop

Agentless 把 SWE-bench 问题拆成 localization、repair、patch validation 三阶段，而不是让 agent 自由探索。论文摘要报告 Agentless 在 SWE-bench Lite 上达到 **32.00%**（96 个正确修复），成本约 **$0.70**。

这说明 SWE-bench 分数可能主要来自：

- hierarchical localization；
- skeleton representation；
- search/replace diff format；
- 多候选 patch generation；
- reproduction test generation；
- patch validation / reranking。

**结论**：SWE-bench leaderboard 上比较的是完整解题系统。复杂 agent loop 不是唯一强路线，结构化 pipeline 也能改变分数解释。

### 3. Terminal-Bench：官方报告按 best agent scaffold 展示模型结果

Terminal-Bench 2.0 包含 **89 个** terminal tasks，每个任务有 instruction、Docker container、tests 和 oracle solution。论文评估 **6 个 agents × 16 个 frontier models**，共 **32,155 trials**。

最关键的是 Figure 1 caption：**每个模型报告分数时使用的 agent scaffold 是为了最大化性能而选择的**。论文还创建了 Terminus 2，作为一个相对中性的 scaffold，只提供 headless terminal tool，用 Bash 完成任务。

此外，Terminal-Bench 使用 Harbor harness 运行任务，任务通过 container state 和 tests 验证。

**结论**：Terminal-Bench 明确把 scaffold 当作评测系统的一部分。榜单高分不是裸模型分，而是模型与兼容 scaffold 的最佳组合分。

### 4. Harness optimization 会造成静态 benchmark 增益和迁移风险

Do Agent Optimizers Compound? 在 Terminal-Bench 2.0 hard tasks 上比较 GEPA、Meta Harness、RELAI-VCL。它的搜索空间包括 prompts、harness code、tools、workflow、memory、skill、code。

报告中的 lifelong average pass rate：

- baseline：**58.7%**；
- GEPA：**66.0%**；
- Meta Harness：**64.6%**；
- RELAI-VCL：**76.4%**。

但它也指出 GEPA 在 Phase 1 静态优化后迁移到新任务时低于 baseline，解释为对 Phase 1 过拟合。

**结论**：agent harness 可以被 benchmark-driven optimized；静态任务集涨分不等于新任务泛化。这是“harness-level benchmark overfitting”的近似直接证据。

### 5. WebArena：prompt 和 observation/action space 会显著改变 web agent 成功率

WebArena 把环境定义为 state、action、observation、transition。它提供 screenshot、HTML DOM tree、accessibility tree 等 observation 形式，baseline 使用带 element ID 的 accessibility tree，让 agent 发出类似 `click [1582]` 的动作。

论文报告 GPT-4 best agent 端到端成功率约 **14.41%**，人类约 **78.24%**。它还分析了 unachievable hint：提示模型在不可完成任务时停止，可以帮助识别不可达任务，但也会让 GPT-4 错误地把许多可完成任务判断为 impossible。去掉该 hint 会提升可完成任务上的整体成功率。

**结论**：在 web agent benchmark 中，prompt 的细微差异、observation 表示和 action schema 会改变 agent 行为与分数。

### 6. OSWorld：GUI agent 的能力边界由 observation/action interface 定义

OSWorld 在真实计算机环境中评估 GUI / desktop agent，支持 screen capture、accessibility tree、VM controller 和 task-specific evaluation scripts。Action space 使用 pyautogui 风格动作，包括 click、drag、type、hotkey、scroll、WAIT、FAIL、DONE 等。

论文报告最强 LLM/VLM agent baseline 约 **12.24%**，人类约 **72.36%**。同时，论文指出某些任务需要 task-specific scaffolding，例如打开 debugging ports、创建 VS Code extension 或读取软件内部文件。

**结论**：GUI benchmark 的分数与 observation/action interface 强耦合；如果 action space 不支持某些人类操作，agent 能力会被 protocol 上限截断。

### 7. τ-bench / AgentBench：tool schema、user simulator、format compliance 和 max actions 是分数的一部分

τ-bench 由 JSON database、Python API tools、Markdown domain policy、task instances 和 simulated user 组成。实验设置中每个任务最多 **30 agent actions**，main results 至少 **3 trials per task**，agent temperature = 0.0，user simulator temperature = 1.0。论文报告即使 best gpt-4o function calling agent 平均成功率超过 60%，pass^8 也会低于 25%，说明多轮可靠性远低于单次平均成功率。

AgentBench 则把 interactive evaluation 中的失败类型分成 Context Limit Exceeded、Invalid Format、Invalid Action、Task Limit Exceeded 和 Complete。这些失败本身就依赖 harness 的格式约束、action space 和轮数上限。

**结论**：tool-use agent benchmark 不是只测“会不会回答”，而是测在给定 API、policy、user simulator 和动作预算内能否稳定完成任务。

### 8. Aider 和 Kimi 官方材料：工程 leaderboard 已把 harness 参数显式化

Aider leaderboard 明确展示 edit format、reasoning effort、thinking tokens、architect/editor mode、pass rate、well-formed rate 和 cost。不同模型适配不同 edit format（diff、diff-fenced、whole、architect、editor-diff），这说明代码修改协议本身就是分数的一部分。

Kimi K3 Tech Blog 的 benchmark footnotes 也明确写到：K3 结果使用 reasoning effort = max，并在不同 benchmark 中使用 Kimi Code、Claude Code 或 Codex 等不同 agentic harness。K3 的 limitation 还指出：K3 在 preserved thinking history mode 下训练，如果 agent harness 没有按要求传回全部 historical thinking content，或中途从其他模型切到 K3，generation quality 可能高度不稳定。

Kimi Vendor Verifier 进一步指出，benchmark score anomaly 可能来自 decoding 参数误用、thinking content 回传、第三方 API 与官方 API 差异、KV cache bug、量化退化、vision preprocessing 和 tool calling JSON schema。

**结论**：厂商和工程 leaderboard 已经承认，agentic benchmark 分数受 harness、history、参数、部署和 fallback 影响。

## Ablation / Robustness

从已有材料看，最值得做的 robustness check 不是重复跑同一 leaderboard，而是做 **harness sensitivity analysis**：

1. **同模型，多 harness**：同一模型分别接入 raw bash、Terminus 2、OpenHands、mini-SWE-agent、Claude Code / Codex / Kimi Code 类 agent，比较成功率、成本和失败类型。
2. **同 harness，多模型**：把候选模型放进同一 neutral harness，排除厂商原生 scaffold 优势。
3. **tool schema perturbation**：改 tool 名称、参数顺序、JSON/XML schema、edit format、search result format，测分数波动。
4. **prompt perturbation**：改 system prompt、是否给 demonstration、是否提示不可达任务、是否要求最终答案格式。
5. **context policy perturbation**：保留 full history、压缩 old observations、只保留 last N steps、是否回传 thinking history。
6. **budget perturbation**：max steps、max tokens、wall-clock、并行 rollout 数和 retry 次数。
7. **deployment perturbation**：官方 API、第三方 API、量化版本、不同 temperature/top_p/reasoning effort。
8. **private / temporal split**：公开任务、fresh tasks、新业务工单、隐藏测试和滚动任务集分开报告。

如果某模型在原 harness 很强，但在 tool schema、context policy 或 neutral harness 下大幅掉分，应降级为“protocol-fit advantage”，不能直接当作通用能力优势。

## Sensitivity / Boundary Conditions

### 什么时候榜单分数仍然有用？

公开 agentic benchmark 仍然有价值，尤其适合：

- 观察前沿能力是否已经跨过某类任务门槛；
- 找到强 scaffold / tool design 的工程模式；
- 做候选模型初筛；
- 暴露典型失败类型。

### 什么时候不能直接用于业务决策？

以下情况必须重新评测：

1. 线上工具和 benchmark harness 不同。
2. 业务任务有私有 repo、私有 API、权限系统或安全 guard。
3. 成本、时延、人工接管、合规风险比单次成功率更重要。
4. 榜单使用厂商原生 agent，而业务计划只调用裸 API。
5. 任务需要长上下文、长时间运行或多轮状态保持。
6. 业务数据分布晚于公开 benchmark，或存在强时间漂移。

## 业务指标推荐

> [!tip] 总口径
> 业务指标应以“同一业务 harness 下的端到端闭环”为主，公开 benchmark 只做先验。建议把指标分成北极星指标、质量指标、稳定性指标、成本效率指标、风险指标和迁移指标六层。

### 1. 北极星指标：业务任务净成功率

**Business-Verified Resolution Rate（BVRR）**

- 定义：在真实或高保真业务任务中，agent 最终交付物通过业务验收的比例。
- 分母：进入 agent 流程的任务数。
- 分子：无需人工实质返工即可被接受的任务数。
- 验收者：自动测试、业务规则、人工 reviewer 或混合 evaluator。
- 为什么比 benchmark resolved rate 更好：它绑定真实业务 harness、真实工具和真实验收标准。

建议拆分：

- `BVRR@1`：一次运行成功率；
- `BVRR@retry`：允许自动 retry 后成功率；
- `BVRR-human-accepted`：人工最终接受率；
- `BVRR-no-regression`：成功且没有引入回归的比例。

### 2. 稳定性指标：同任务多次运行一致性

**Pass^k / Reliability@k**

- 定义：同一任务运行 k 次，全部成功的比例。
- 参考 τ-bench：平均成功率高不代表多次稳定；pass^8 可能显著低于 pass^1。
- 业务含义：如果一个 agent 只在 5 次里偶尔成功一次，自动化上线价值很低。

推荐指标：

- `Pass^3`：同任务 3 次都成功；
- `Pass@3`：3 次至少 1 次成功，适合有并行采样和 rerank 的离线场景；
- `Variance of outcome`：同任务输出差异度；
- `Flaky Success Rate`：曾成功但重跑失败的任务比例。

### 3. 成本效率指标：单位成功成本

**Cost per Verified Success（CPVS）**

- 定义：总推理、工具、沙箱、人工审核成本 / 验收成功任务数。
- 应包含：input token、output token、tool execution、sandbox time、parallel rollouts、人工 reviewer 时间。

推荐同时看：

- `Tokens per Success`；
- `Wall-clock per Success`；
- `Tool Calls per Success`；
- `GPU/API Cost per Success`；
- `Retry Cost Ratio`：retry 成本 / 首次运行成本。

业务上常见情况是 A 模型成功率略高，但 CPVS 高很多；这时不一定值得上线。

### 4. 人工介入指标：节省了多少人力，而不是跑出了多少分

**Human Intervention Rate（HIR）**

- 定义：任务中需要人工提示、纠错、接管或返工的比例。
- 细分：
  - `Clarification Needed Rate`：需要人补充需求；
  - `Manual Tool Fix Rate`：工具调用失败后需人工处理；
  - `Reviewer Edit Rate`：reviewer 必须改交付物；
  - `Full Takeover Rate`：人类完全接管。

**Net Human Time Saved（NHTS）**

- 定义：人工 baseline 用时 -（agent 运行等待 + 人工指导 + review + 返工）用时。
- 这是比“成功率”更接近业务 ROI 的指标。

### 5. 质量与返工指标：成功不能只看最终通过

**Post-Acceptance Defect Rate（PADR）**

- 定义：agent 交付物通过初验后，在后续使用中暴露缺陷的比例。
- 对 coding agent，可包括：
  - hidden tests fail；
  - regression bugs；
  - style / maintainability rejection；
  - security review fail。

**Rework Load（返工负担）**

- `Lines / files modified by reviewer`；
- `Review comments per task`；
- `Reopen Rate`；
- `Rollback Rate`；
- `Incident-linked Agent Change Rate`。

### 6. 风险指标：安全、权限和错误动作

**Unsafe / Unauthorized Action Rate**

- 定义：agent 执行越权、破坏性、泄露数据或违反业务 policy 的动作比例。
- 适用于代码、终端、浏览器、客服 API 和内部运营 agent。

建议拆分：

- `Policy Violation Rate`；
- `Unauthorized Tool Call Rate`；
- `Destructive Action Attempt Rate`；
- `Sensitive Data Exposure Rate`；
- `Guardrail False Block Rate`：过度拦截导致任务失败的比例。

### 7. Harness 迁移指标：公开榜单能否迁到内部工具链

**Harness Transfer Ratio（HTR）**

- 定义：内部业务 harness 成功率 / 公开或厂商原生 harness 成功率。
- 例：某模型在厂商 agent 上 SWE-bench 60%，在内部 repo agent 上业务成功率 30%，HTR = 0.5。

**Protocol Sensitivity Index（PSI）**

- 定义：对 prompt、tool schema、context policy、max steps 做扰动后，成功率的相对波动。
- 简化计算：`PSI = std(success_rate across harness variants) / mean(success_rate)`。
- PSI 高说明模型 / scaffold 对协议很敏感，上线需谨慎。

### 8. 长任务过程指标：不要只看最终结果

对 long-horizon agent，建议记录：

- `Planning Error Rate`：计划方向错误；
- `Localization Accuracy`：是否找到正确文件 / 页面 / API；
- `Tool Error Recovery Rate`：工具失败后能否恢复；
- `Context Loss Rate`：是否忘记早期约束；
- `Looping / Stuck Rate`：重复无效动作或超过 step limit；
- `Checkpoint Progress Score`：部分完成度，避免只有 sparse final reward。

### 9. 推荐上线看板

| 层级   | 指标                                            | 用途                           |
| ------ | ----------------------------------------------- | ------------------------------ |
| 北极星 | BVRR                                            | 是否真的完成业务任务。         |
| 稳定性 | Pass^3、Flaky Success Rate                      | 是否可重复、可托管。           |
| 成本   | CPVS、Wall-clock per Success                    | 是否划算。                     |
| 人效   | HIR、NHTS                                       | 是否真的省人。                 |
| 质量   | PADR、Reopen Rate、Rollback Rate                | 是否制造后续债务。             |
| 风险   | Unauthorized Action Rate、Policy Violation Rate | 是否可安全上线。               |
| 迁移   | HTR、PSI                                        | 榜单能力能否迁到内部 harness。 |
| 过程   | Tool Error Recovery、Context Loss、Looping Rate | 定位优化 scaffold 的方向。     |

## Limitations

1. 本文是主题调研，不是对所有 benchmark 的统一复现实验。
2. 不同来源的模型、任务版本、时间点、API 和 harness 不一致，不能直接用表格数字横向排名。
3. Kimi K3、Aider、Kimi Vendor Verifier 等材料属于官方/工程文档，不是 peer-reviewed 论文，但对真实部署很有参考价值。
4. Do Agent Optimizers Compound? 是技术报告，贴近 harness overfitting，但还需要更多独立复现。
5. DeepSeek V4-Pro 是否存在 harness 训练过拟合，当前没有直接公开证据；本文只说明 agentic benchmark 具备强 harness 敏感性和过拟合风险。

## Takeaways

1. **agentic benchmark score 是 system score**：模型、工具、prompt、上下文、部署和 evaluator 共同决定结果。
2. **SWE-agent 是最强直接证据**：同一 GPT-4 Turbo 在不同 ACI 下 SWE-bench Lite resolved rate 显著变化。
3. **Terminal-Bench 把 best scaffold 写进协议**：报告模型分数时会选择性能最高的兼容 agent scaffold。
4. **Agentless 改变了 SWE-bench 的解释**：强结果可以来自 localization / repair / validation pipeline，而非完整 autonomous loop。
5. **厂商 footnotes 很重要**：Kimi K3 明确区分 Kimi Code、Claude Code、Codex，并警告 thinking history 回传影响质量。
6. **业务选型应看内部 harness 下的 BVRR、CPVS、HIR、PADR、HTR 和 PSI**，而不是直接追公开榜单第一。
7. **如果怀疑某模型 harness overfit，先做 sensitivity analysis**：同模型多 harness、同 harness 多模型、tool schema perturbation、private temporal split 和 transfer test。

## Citation

> Yang et al. SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering. arXiv:2405.15793. [原文](https://arxiv.org/abs/2405.15793)

> Xia et al. Agentless: Demystifying LLM-based Software Engineering Agents. arXiv:2407.01489. [原文](https://arxiv.org/abs/2407.01489)

> Merrill et al. Terminal-Bench: Benchmarking Agents on Hard, Realistic Tasks in Command Line Interfaces. arXiv:2601.11868. [原文](https://arxiv.org/abs/2601.11868)

> Zhou et al. WebArena: A Realistic Web Environment for Building Autonomous Agents. arXiv:2307.13854. [原文](https://arxiv.org/abs/2307.13854)

> Xu et al. OSWorld: Benchmarking Multimodal Agents for Open-Ended Tasks in Real Computer Environments. arXiv:2404.07972. [原文](https://arxiv.org/abs/2404.07972)

---

[[agentic-eval/|返回 Agentic Evaluation]] · [[papers/|返回论文调研]]

---
title: "开放式生成后训练：近年论文排序"
created: 2026-08-18
published: 2026-08-18
modified: 2026-08-18
type: topic
tags:
  - RLHF
  - post-training
  - preference-optimization
  - AI-feedback
  - open-ended-generation
source_url: https://arxiv.org/abs/2402.04792
---

> [!abstract] Topic Brief
> **原始 Query**：Post-training for Non-Verifiable Open-Ended Generation。
>
> **当前科研口径**：只把 2024–2026 的近期工作放入主排序；2020–2023 的 RLHF、Constitutional AI、DPO 等作为背景。这里关注聊天、指令跟随、总结、写作、安全对齐这类没有确定 verifier 的开放式生成，而不是主要依赖数学、代码或工具执行 verifier 的 RL。
>
> **决策目标**：帮助科研阅读排序：哪些近期论文最值得先读，哪些更适合作为 diagnostic / evaluation companion。

## 当前结论

最近一批工作可以按四条线理解：

1. **online / on-policy feedback**：解决静态偏好数据与当前策略分布不匹配的问题，代表是 OAIF、RLHF Workflow、INPO、RTO。
2. **AI feedback 与 self-feedback**：把监督从人工偏好扩展到 GPT-4 / Claude / LLM judge / self-judge，代表是 UltraFeedback、Self-Rewarding、Self-Reference AI Feedback。
3. **偏好目标函数变化**：从 DPO 扩展到 binary feedback、校准、加速、Nash / general preference、token-level reward，代表是 KTO、Cal-DPO、APO、DiscoPOP、RTO。
4. **评估与失效模式**：open-ended post-training 的主要风险是优化 judge 而不是真实人类偏好，因此 RewardBench、AlpacaEval 2、Critical Evaluation of AI Feedback、Reward Model Robustness 必须一起读。

> [!warning] 证据边界
> 本榜单不是“论文客观质量榜”，而是针对“近期、非可验证、开放式生成后训练”这个题目的阅读优先级。不同论文的 benchmark、judge、base model、训练预算不兼容，不能把 raw win rate 直接横向比较。

## 推荐指标

总分只表示对本专题的研究价值，满分 100。

```text
Score = 20*FT + 20*FS + 25*MN + 20*EV + 15*RF
```

每项取 0–1。若要人工快速打分，可以先按 0–5 分评估，再除以 5。

| 指标   | 含义                                            | 高分标准                                                                                       | 低分情况                                                  |
| ------ | ----------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **FT** | Frontier Topic Fit：前沿贴合度                  | 2024+，直接处理 post-training、instruction/chat/summarization/writing/safety 等开放式生成      | 老背景论文；只和关键词相关；主要是 math/code verifier     |
| **FS** | Feedback Scalability：反馈信号可扩展性          | 降低 human pairwise 依赖，支持 AI feedback、binary feedback、online feedback、self-feedback    | 只依赖昂贵静态人工 pairwise preference，且没有扩展机制    |
| **MN** | Mechanism Novelty：机制新颖性                   | 改变 feedback 形式、training regime、objective、reward source 或 preference assumption         | 只是把 DPO / PPO 换数据集或换 benchmark                   |
| **EV** | Evaluation Trustworthiness：评估可信度          | 有 human eval、多个 judge、length control、win/tie/loss、多任务、失败案例或公开复现资源        | 只用单一 LLM judge；没有长度/位置偏差控制；只报单一平均分 |
| **RF** | Robustness & Failure Analysis：鲁棒性与失效分析 | 分析 reward hacking、judge bias、distribution shift、overoptimization、self-reward collapse 等 | 只报提升，不分析为什么失败或是否只是迎合 judge            |

## 总榜：近期优先阅读顺序

| Rank | 论文                                                                                                                                  |      年份 | 分数 | 证据等级        | 为什么排在这里                                                                                                                                   | 主要 unknowns                                                                                  |
| ---: | ------------------------------------------------------------------------------------------------------------------------------------- | --------: | ---: | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
|    1 | [Direct Language Model Alignment from Online AI Feedback](https://arxiv.org/abs/2402.04792)                                           |      2024 |   90 | Core            | 直接把 DPO/IPO/SLiC 变成 online/on-policy，用 LLM annotator 标注当前策略样本，精准命中“非可验证开放式生成 + AI feedback + distribution shift”。  | 依赖 annotator 质量与 prompt；online AI feedback 是否引入 judge drift 和同源偏差仍需更多验证。 |
|    2 | [UltraFeedback: Boosting Language Models with Scaled AI Feedback](https://arxiv.org/abs/2310.01377)                                   |      2024 |   87 | Core            | 百万级 GPT-4 多维反馈、critique、reward model 与 open-source chat alignment，是 scaled AI feedback 的核心数据入口。                              | GPT-4 偏好、长度偏好和风格偏好可能被数据继承；训练 judge 与评估 judge 的独立性需要检查。       |
|    3 | [A Critical Evaluation of AI Feedback for Aligning Large Language Models](https://arxiv.org/abs/2402.12366)                           |      2024 |   85 | Core Diagnostic | 直接质疑 RLAIF 收益来源，指出强 teacher / critic mismatch 可能解释很多提升；是防止“AI feedback 神话化”的必读反证。                               | 更像诊断论文，不提供一个完整替代 post-training pipeline。                                      |
|    4 | [KTO: Model Alignment as Prospect Theoretic Optimization](https://arxiv.org/abs/2402.01306)                                           |      2024 |   84 | Core            | 把 paired preference 降为 desirable / undesirable binary feedback，贴近真实用户 thumbs-up/down 数据；机制上区别于 DPO。                          | prospect-theory 建模与真实偏好仍有距离；部分评估依赖 judge，online shift 不是主问题。          |
|    5 | [Self-Rewarding Language Models](https://arxiv.org/abs/2401.10020)                                                                    |      2024 |   82 | Core            | 模型同时当 generator 与 judge，迭代生成偏好数据并用 DPO 自我改进；非常贴合 self-feedback 前沿。                                                  | self-confirmation、reward hacking、judge collapse 风险高，实验证据范围仍有限。                 |
|    6 | [RLHF Workflow: From Reward Modeling to Online RLHF](https://arxiv.org/abs/2405.07863)                                                |      2024 |   79 | Strong          | 给出开源 online iterative RLHF recipe，连接 reward modeling、online preference collection、DPO/PPO 实践和 AlpacaEval / Arena-Hard 等开放式评测。 | 更偏系统报告和 recipe；proxy preference model 不是实时真人反馈。                               |
|    7 | [Iterative Nash Policy Optimization: Aligning LLMs with General Preferences via No-Regret Learning](https://arxiv.org/abs/2407.00617) |      2024 |   78 | Strong          | 不完全依赖 Bradley-Terry reward 假设，把 RLHF 放到 general preference / game-theoretic 框架中，适合理论切入。                                    | 理论假设与大规模真实部署的距离、以及和常规 DPO/RLHF 的公平成本比较仍需细读。                   |
|    8 | [DPO Meets PPO: Reinforced Token Optimization for RLHF](https://arxiv.org/abs/2404.18922)                                             | 2024/2025 |   77 | Strong          | 试图结合 DPO 的 token-level 信号和 PPO 训练，缓解序列级稀疏 reward；对 open-ended RLHF 的 credit assignment 有启发。                             | PPO 复杂度回来了；token-level reward 是否稳定对应人类整体偏好仍不完全清楚。                    |
|    9 | [Cal-DPO: Calibrated Direct Preference Optimization for Language Model Alignment](https://arxiv.org/abs/2412.14516)                   |      2024 |   74 | Useful          | 关注 DPO implicit reward 的尺度校准，指出只优化相对差值可能不足；适合作为 DPO 失效分析阅读。                                                     | 主要是 DPO objective 增量改进；开放式 human eval 覆盖和失效边界需核对。                        |
|   10 | [Accelerated Preference Optimization for Large Language Model Alignment](https://arxiv.org/abs/2410.06293)                            |      2024 |   73 | Useful          | 从 proximal / momentum 视角统一并加速 preference optimization，在 AlpacaEval 2.0 等开放式 benchmark 上报告收益。                                 | 更偏优化加速；核心 feedback / evaluation bottleneck 没有根本改变。                             |
|   11 | [Discovering Preference Optimization Algorithms with and for Large Language Models](https://arxiv.org/abs/2406.08414)                 |      2024 |   72 | Useful          | 用 LLM 自动搜索 preference optimization loss，提出 DiscoPOP；作为 meta-optimization 很有研究味道。                                               | 自动发现的 loss 是否跨模型、跨任务稳定，以及是否过拟合搜索 benchmark，需要谨慎。               |
|   12 | [Self-Play Fine-Tuning Converts Weak Language Models to Strong Language Models](https://arxiv.org/abs/2401.01335)                     |      2024 |   70 | Adjacent        | 不需要新增 preference data，用 SFT 数据与 self-generated responses 做 self-play；能启发无人工偏好场景。                                          | 更像 SFT 后自博弈，不是典型 preference / judge feedback；对真实开放式偏好的保证有限。          |
|   13 | [Self-Augmented Preference Optimization: Off-Policy Paradigms for Language Model Alignment](https://arxiv.org/abs/2405.20830)         |      2024 |   69 | Useful          | 用 self-augmentation、EMA 与 replay buffer 扩展偏好优化，连接 off-policy 数据复用和自生成负样本。                                                | off-policy / replay 会重新引入分布陈旧问题；需看刷新机制和失败分析。                           |
|   14 | [Quality-Diversity through AI Feedback](https://arxiv.org/abs/2310.13032)                                                             | 2023/2024 |   66 | Adjacent        | 用 AI feedback 指导 creative writing 等开放式搜索，强调不仅要质量还要多样性。                                                                    | 不是标准 LLM post-training pipeline，更像 search / evolution；可迁移性需验证。                 |
|   15 | [Aligning LLMs from Self-Reference AI Feedback with One General Principle](https://arxiv.org/abs/2406.11190)                          |      2024 |   65 | Adjacent        | 用 self-reference AI feedback 和一般原则构造偏好数据，是 Constitutional AI/RLAIF 后续方向。                                                      | 原则过粗可能掩盖具体偏好；AI 反馈质量和 position bias 处理需细读。                             |

## 逐篇详细解读

### 1. Direct Language Model Alignment from Online AI Feedback

- **Problem**：DPO、IPO、SLiC 这类 direct alignment from preferences 方法通常使用预先收集好的偏好数据；训练过程中策略逐渐偏离这些数据的生成分布，导致 offline / off-policy mismatch。
- **Method**：OAIF 在每个训练迭代从当前策略采样两个回答，再用 LLM annotator 选择更优回答，把 DPO / IPO / SLiC 改造成 online、on-policy 的偏好优化。
- **Experimental Setup**：论文在 TL;DR summarization、Anthropic Helpfulness、Anthropic Harmlessness 等开放式任务上比较 online DPO / IPO / SLiC 与 offline 版本，也与 RLHF / RLAIF 作为参照。
- **Reported Results**：作者报告 online DAP 方法相对 offline 版本有明显人类偏好优势；在 TL;DR 任务中，online DPO 在四路比较中相对 SFT、RLHF、RLAIF 获得更高偏好率。
- **Why It Matters**：它把“开放式生成没有 verifier，只能靠偏好判断”与“训练数据必须跟当前策略同步”这两个问题直接连起来。
- **Limitations**：LLM annotator 的偏差会进入训练；如果训练 judge 与评估 judge 同源，可能高估效果；online feedback 的成本和稳定性也需要单独评估。
- **Takeaway**：如果研究重点是近期 post-training，OAIF 是最好的入口之一，因为它提出的问题比单纯换 DPO loss 更基础。

### 2. UltraFeedback: Boosting Language Models with Scaled AI Feedback

- **Problem**：高质量 human feedback 昂贵且覆盖有限，open-source alignment 很难获得足够多样的偏好、评分和 critique 数据。
- **Method**：用 GPT-4 对大规模 instruction-response 数据提供多维 scalar scores 和 textual critiques，并据此训练 reward model、critique model，再用于 best-of-n、PPO / RLAIF 风格的 chat model 增强。
- **Experimental Setup**：数据覆盖多来源指令与多模型回答；实验包括 reward model 在人类偏好数据上的一致性、best-of-n 选择、chat benchmark 和 AI / human evaluation。
- **Reported Results**：论文报告构造了超过百万级 AI feedback，并显示基于 UltraFeedback 的 reward model 和训练流程可以提升开源 chat 模型表现。
- **Why It Matters**：它是 scaled AI feedback 方向的核心数据论文，决定了很多后续 open-source preference optimization 的数据基础。
- **Limitations**：GPT-4 的风格偏好、长度偏好和安全偏好会被继承；AI feedback 与真实人类偏好的一致性不是常量，随任务和样本变化。
- **Takeaway**：适合作为“AI feedback 能否规模化替代 human feedback”的正方样本，但必须和批判性评估论文一起读。

### 3. A Critical Evaluation of AI Feedback for Aligning Large Language Models

- **Problem**：很多 RLAIF 论文把性能提升归因于 AI feedback 或 RL，但真正的收益可能来自更强 teacher 生成了更好的 SFT 数据，或 critic / teacher 能力不匹配。
- **Method**：系统比较 SFT、RLAIF、不同 teacher / critic 组合和评估协议，检查 AI feedback 的增益是否仍然成立。
- **Experimental Setup**：围绕 instruction following / open-ended alignment 任务，分析 base model family、teacher model、critic model 和 evaluation protocol 对结果的影响。
- **Reported Results**：论文报告简单用更强 teacher 做 SFT 可在一些设置中超过完整 RLAIF pipeline，并指出 RLAIF 收益对模型族、评估协议和 critic 选择高度敏感。
- **Why It Matters**：它提醒科研读者不要把“用了 AI feedback 后变好”直接解释为“AI feedback post-training 方法有效”。
- **Limitations**：它更像 diagnostic / critique，不是一个新的完整后训练算法；结论也依赖其选择的模型、teacher 和评估集合。
- **Takeaway**：任何 AI feedback 论文都应检查 teacher、critic、judge 三者是否混淆，否则很容易误判贡献来源。

### 4. KTO: Model Alignment as Prospect Theoretic Optimization

- **Problem**：DPO / RLHF 通常需要 paired preference，但真实产品里更常见的是单条回答的 like / dislike、desirable / undesirable 标记。
- **Method**：KTO 从 Kahneman-Tversky prospect theory 出发，构造只需二元好坏反馈的 human-aware loss，不要求每个 prompt 下成对比较。
- **Experimental Setup**：论文在多个 LLM 尺度和 alignment 数据上比较 KTO、DPO、SFT 等方法，包含开放式 judge / human preference 评估和闭式任务。
- **Reported Results**：作者报告 KTO 在 1B–30B 等尺度上匹配或超过 DPO，并能在 desirable 样本严重不足时保持竞争力。
- **Why It Matters**：它把 post-training 的数据需求从 pairwise preference 降到 binary feedback，对真实用户反馈系统很重要。
- **Limitations**：prospect-theory loss 是有用归纳偏置，但不等于真实人类效用模型；online distribution shift 和 judge bias 不是它主要解决的问题。
- **Takeaway**：如果你的研究关注“更便宜、更真实的反馈形式”，KTO 比很多 DPO 小改更值得优先读。

### 5. Self-Rewarding Language Models

- **Problem**：如果 human feedback 和强外部 judge 都很贵，模型能否自己生成训练样本、自己评价回答并持续自我改进？
- **Method**：模型先通过 seed instruction-following 和 evaluation data 获得生成与打分能力；每轮生成 prompts 和 candidate responses，再用自身 LLM-as-a-Judge 能力给分，构造 preference pairs，最后用 DPO 进入下一轮。
- **Experimental Setup**：论文比较不同迭代版本模型的 instruction-following 能力和 reward-model / judge 能力，重点观察 M1、M2、M3 是否逐轮提升。
- **Reported Results**：作者报告 M2 明显优于 M1，M3 继续优于 M2，并且 self-rewarding 训练相对 SFT baseline 有较高胜率。
- **Why It Matters**：它是 self-feedback / self-alignment 的代表，直接触及“无 verifier 开放式生成能否自我改进”的核心问题。
- **Limitations**：最大风险是 self-confirmation：模型可能学会讨好自己的 judge，而不是更符合人类偏好；迭代越多是否 collapse 需要更强诊断。
- **Takeaway**：科研上很有启发，但不能只看 win rate，必须重点看 judge 独立性、多样性和退化机制。

### 6. RLHF Workflow: From Reward Modeling to Online RLHF

- **Problem**：许多开源 RLHF 实现停留在 offline preference learning，缺少可复现的 online iterative RLHF recipe。
- **Method**：构建偏好 / reward model，用 proxy preference model 近似 human feedback，再展示 online iterative RLHF 的数据收集、模型更新和评估流程。
- **Experimental Setup**：围绕 LLaMA / Mistral 等开源模型，在 AlpacaEval 2.0、Arena-Hard、MT-Bench、TruthfulQA、HumanEval 等任务上测试。
- **Reported Results**：论文报告通过 SFT + iterative RLHF 可以在多个聊天和指令跟随 benchmark 上获得强结果，并发布模型、数据和代码流程。
- **Why It Matters**：它不一定是最原创的方法论文，但对复现实验、工程 pipeline 和后续研究 baseline 很重要。
- **Limitations**：核心反馈来自 proxy preference model，不是真正实时 human feedback；系统报告中的工程选择很多，单独归因较难。
- **Takeaway**：适合作为 online RLHF 实验搭建参考，而不是只作为新 objective 来读。

### 7. Iterative Nash Policy Optimization

- **Problem**：Bradley-Terry reward 假设可能不足以刻画复杂人类偏好，尤其是开放式生成中偏好可能非传递、上下文相关、多目标冲突。
- **Method**：把 RLHF 放到 general preference framework 中，用 game-theoretic / Nash policy 视角建模，并用 no-regret learning 进行 iterative policy optimization。
- **Experimental Setup**：论文在 AlpacaEval 2.0、Arena-Hard 等开放式 alignment benchmark 上比较 INPO 与其他 online / offline RLHF 方法。
- **Reported Results**：作者报告基于 LLaMA-3-8B SFT 的模型在 AlpacaEval 2.0 和 Arena-Hard 上有较强 win rate，优于若干 online RLHF baseline。
- **Why It Matters**：它的价值在于放松常见的 reward / Bradley-Terry 假设，适合从理论角度研究“偏好不是单一标量奖励”的问题。
- **Limitations**：理论框架与真实多群体人类偏好仍有距离；benchmark judge 是否能体现 general preference 复杂性也不确定。
- **Takeaway**：适合做理论和 preference modeling 方向的读者，不一定是最快落地的 pipeline。

### 8. DPO Meets PPO: Reinforced Token Optimization for RLHF

- **Problem**：标准 RLHF 用序列级 reward，credit assignment 稀疏；DPO 简单稳定但通常是 offline、sequence-level pairwise learning。
- **Method**：RTO 将 RLHF 视为 MDP，利用 DPO 提供 token-wise response quality 表征，再结合 PPO 进行后续策略优化。
- **Experimental Setup**：论文比较 RTO、PPO、DPO 和其他直接偏好学习算法，在 AlpacaEval 2、Arena-Hard 等开放式 benchmark 上评估。
- **Reported Results**：作者报告 RTO 相对 PPO 和若干 DPO-style baseline 在 AlpacaEval 2、Arena-Hard 上有提升。
- **Why It Matters**：它关注 open-ended generation 中 reward 稀疏和 token-level credit assignment 的问题，是 DPO/PPO 融合线的重要代表。
- **Limitations**：引入 PPO 后复杂度和调参成本上升；token-level 信号是否真的对应人类整体偏好，需要更多 human eval 支撑。
- **Takeaway**：适合关注 RLHF optimization mechanics 的研究，不应简单归类为“DPO 又一个变体”。

### 9. Cal-DPO

- **Problem**：DPO 主要优化 implicit reward 的相对差值，可能忽略 reward 绝对尺度和校准，导致偏好学习不稳定或次优。
- **Method**：Cal-DPO 在 DPO 框架中加入校准思想，使 implicit reward 与 ground-truth / target reward scale 更可比。
- **Experimental Setup**：论文在多种标准 alignment benchmark 上把 Cal-DPO 与 DPO、IPO 等 off-the-shelf preference optimization 方法比较。
- **Reported Results**：作者报告 Cal-DPO 能显著改善若干现有方法的 alignment 表现，并给出理论优势分析。
- **Why It Matters**：它把注意力从“chosen 是否大于 rejected”转向“implicit reward 是否可校准”，有助于解释 DPO 的失效边界。
- **Limitations**：仍然主要在 contrastive preference optimization 范式内；对 AI judge bias、online distribution shift 的处理有限。
- **Takeaway**：适合作为 DPO 深入阅读的第二层材料，尤其适合研究 reward scale / calibration 的人。

### 10. Accelerated Preference Optimization

- **Problem**：偏好优化本质上是优化问题，DPO / iterative DPO / SPPO 等方法可能收敛慢或训练效率不高。
- **Method**：APO 把 iterative preference optimization 看成 proximal point method，并引入 Nesterov momentum 加速，统一多种 preference optimization 算法。
- **Experimental Setup**：论文在 AlpacaEval 2.0 等开放式 alignment benchmark 上与 DPO、iterative DPO、SPPO 等方法比较。
- **Reported Results**：作者报告 APO 在理论上有更快收敛率，在实证上优于若干强 baseline。
- **Why It Matters**：它适合研究“同样反馈数据下，优化过程如何更高效”的问题。
- **Limitations**：主要解决 optimization efficiency，不直接解决 feedback 质量、judge 偏差或 preference plurality。
- **Takeaway**：如果关注训练效率和理论统一，值得读；如果关注开放式评估可信度，它不是核心论文。

### 11. Discovering Preference Optimization Algorithms with and for Large Language Models / DiscoPOP

- **Problem**：preference optimization loss 通常由研究者手工设计，搜索空间很大，人类设计可能受限。
- **Method**：用 LLM 迭代提出、实现和评估新的 preference optimization loss，最终发现 DiscoPOP，一种混合 logistic 与 exponential 风格的 loss。
- **Experimental Setup**：论文用自动发现流程在训练任务上搜索 loss，再测试其在 held-out tasks 上的迁移表现。
- **Reported Results**：作者报告 DiscoPOP 达到或超过当时若干 preference optimization baseline，并展示 loss 可迁移到未见任务。
- **Why It Matters**：它把 LLM 用于 alignment algorithm discovery，本身是 meta-research，也提示 preference loss 仍有未探索空间。
- **Limitations**：自动搜索容易过拟合搜索基准；新 loss 的可解释性、稳定性和跨模型可靠性需要额外验证。
- **Takeaway**：适合寻找新 objective 的研究者，但需要用严格 held-out 和 human eval 防止“benchmark loss overfitting”。

### 12. Self-Play Fine-Tuning Converts Weak Language Models to Strong Language Models

- **Problem**：SFT 后模型仍与高质量 human demonstration 分布有差距，但额外 preference data 昂贵。
- **Method**：SPIN 让当前模型与早期自身生成的数据进行 self-play，学习区分 human demonstration 与 self-generated response，从而逐步逼近目标数据分布。
- **Experimental Setup**：论文在 HuggingFace Open LLM Leaderboard、MT-Bench、Big-Bench 等 benchmark 上评估 SPIN 相对 SFT、DPO 等方法的效果。
- **Reported Results**：作者报告 SPIN 能提升弱模型，并在一些设置中超过使用额外 GPT-4 preference data 的 DPO。
- **Why It Matters**：它提供了“不增加人工偏好数据也能继续后训练”的路线，对 non-verifiable 任务有迁移启发。
- **Limitations**：它依赖已有 SFT target data，并不直接学习真实 pairwise human preference；是否适合长期开放式 assistant alignment 仍需验证。
- **Takeaway**：放在 adjacent 合理：机制相关，但它不是最直接的 AI feedback / preference post-training 论文。

### 13. Self-Augmented Preference Optimization

- **Problem**：传统 DPO 依赖静态、预收集的成对偏好数据，适应性和探索不足。
- **Method**：SAPO 使用 self-play / self-augmentation 生成负样本，并结合 EMA model 与 replay buffer 做 off-policy 数据探索和利用。
- **Experimental Setup**：论文在 LLaMA3-8B、Mistral-7B 等模型上，用 Open LLM Leaderboard、IFEval、AlpacaEval 2.0、MT-Bench 等 benchmark 评估。
- **Reported Results**：作者报告 SAPO 匹配或超过 DPO、ORPO、SPIN 等离线对比基线。
- **Why It Matters**：它把 preference optimization 和 replay / off-policy paradigm 结合，适合思考数据复用与分布陈旧之间的平衡。
- **Limitations**：off-policy replay 可能重新引入 policy mismatch；self-generated negatives 的质量和多样性决定上限。
- **Takeaway**：适合和 OAIF 对照读：一个强调 online/on-policy，一个强调 self-augmented/off-policy reuse。

### 14. Quality-Diversity through AI Feedback

- **Problem**：开放式创意生成不只追求单一最优答案，还希望覆盖多样、高质量的候选空间；传统优化很难定义质量和多样性指标。
- **Method**：QDAIF 用 LLM 生成变体，并用 AI feedback 评价质量与多样性，通过 quality-diversity search 改进候选集合。
- **Experimental Setup**：论文在 creative writing 等任务中比较 QDAIF 与非 QD 控制方法，并包含人类评估来检查 AI 评价与人类判断的一致性。
- **Reported Results**：作者报告 QDAIF 能覆盖更多高质量、多样化文本区域，人类评价与 AI feedback 在一定程度上一致。
- **Why It Matters**：它提醒 open-ended generation 的目标不一定是单一 win rate，也可以是质量—多样性 coverage。
- **Limitations**：它更像 search / evolutionary generation，不是主流 LLM post-training；AI 对多样性的度量可能本身带偏。
- **Takeaway**：适合作为 creative/open-ended generation 的 adjacent reading，用来扩展“后训练只优化平均偏好”的视角。

### 15. Aligning LLMs from Self-Reference AI Feedback with One General Principle

- **Problem**：AI feedback 通常依赖强大外部模型、复杂原则和精心设计的标注 prompt，成本与可控性仍然较高。
- **Method**：让模型先给出自己的参考回答，再基于参考回答批评其他回答，并用简单 general principle 产生偏好判断；结合 self-consistency 和 preference strength 处理 position bias 等问题。
- **Experimental Setup**：论文使用 Llama2-Chat 级别模型作为 annotator，构造偏好数据并训练 policy model，再在 benchmark 上评估。
- **Reported Results**：作者报告 13B / 70B Llama2-Chat annotator 在该框架下能产生较高质量偏好反馈，训练出的 policy model 在若干 benchmark 上有优势。
- **Why It Matters**：它把 Constitutional AI 的原则监督推进到 self-reference AI feedback，探索弱一些的模型是否也能提供有用反馈。
- **Limitations**：一个 general principle 可能过粗，无法覆盖复杂用户偏好；self-reference 可能强化模型自身偏见。
- **Takeaway**：适合作为 RLAIF 后续方向阅读，但主榜排名低于 OAIF / UltraFeedback / KTO，因为证据和泛化边界更需要核对。

## 100 篇全量扩展指标榜

下面不再按年代排，而是把扩充后的 100 篇统一套用前面的五项指标：**FT / FS / MN / EV / RF**。分数仍然服务于本专题的科研阅读优先级：越靠前越应该优先精读；越靠后越偏历史根、评测背景、相邻机制或补 related work。主榜 15 篇保留在上方作为“精读入口”，这里给出更大的 100 篇排序面。

| Rank | Paper                                                                                                                                  |      Year | Score | Type                  | 为什么排在这里                                                                       | Caveat                                                          |
| ---: | -------------------------------------------------------------------------------------------------------------------------------------- | --------: | ----: | --------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
|    1 | [Direct Language Model Alignment from Online AI Feedback](https://arxiv.org/abs/2402.04792)                                            |      2024 |    90 | Online AI Feedback    | online / on-policy + AI feedback 精准命中本题，直接处理静态偏好数据分布漂移。        | LLM annotator 偏差和训练成本仍是核心瓶颈。                      |
|    2 | [UltraFeedback](https://arxiv.org/abs/2310.01377)                                                                                      | 2023/2024 |    87 | AI Feedback Data      | scaled GPT-4 feedback 数据入口，影响大量 open-source preference training。           | AI feedback 的长度、风格和安全偏好会被继承。                    |
|    3 | [A Critical Evaluation of AI Feedback](https://arxiv.org/abs/2402.12366)                                                               |      2024 |    85 | Diagnostic            | 直接拆解 RLAIF 收益来源，是判断 AI feedback 是否真的有效的反证必读。                 | 诊断强，替代训练算法弱。                                        |
|    4 | [KTO](https://arxiv.org/abs/2402.01306)                                                                                                |      2024 |    84 | Objective             | 用 desirable / undesirable 二元反馈替代 pairwise preference，贴近真实用户反馈。      | prospect-theory 假设不等于真实偏好模型。                        |
|    5 | [Self-Rewarding Language Models](https://arxiv.org/abs/2401.10020)                                                                     |      2024 |    82 | Self-Improve          | 模型自生成、自评估并用 DPO 迭代训练，是 self-feedback 代表。                         | self-confirmation、judge collapse、偏见放大风险高。             |
|    6 | [RLHF Workflow: From Reward Modeling to Online RLHF](https://arxiv.org/abs/2405.07863)                                                 |      2024 |    79 | Online RLHF           | 给出开源 online iterative RLHF recipe，适合复现实验和搭建 pipeline。                 | 反馈来自 proxy preference model，归因较复杂。                   |
|    7 | [Iterative Nash Policy Optimization](https://arxiv.org/abs/2407.00617)                                                                 |      2024 |    78 | General Preference    | 用 game-theoretic Nash policy 处理 general preferences，弱化 BT reward 假设。        | 理论复杂，benchmark 是否体现非传递偏好不确定。                  |
|    8 | [DPO Meets PPO / RTO](https://arxiv.org/abs/2404.18922)                                                                                | 2024/2025 |    77 | Objective / RL        | 结合 DPO token-level 信号与 PPO，针对开放式 RLHF 的 credit assignment。              | PPO 复杂度和 token-credit 假设需要谨慎。                        |
|    9 | [RewardBench](https://arxiv.org/abs/2403.13787)                                                                                        |      2024 |    76 | Reward Model Eval     | 系统评估 reward model 的 Chat、Safety、Reasoning 等能力，直接影响训练可信度。        | benchmark 覆盖有限，不能替代部署评估。                          |
|   10 | [Preference Fine-Tuning Should Leverage Suboptimal, On-Policy Data](https://arxiv.org/abs/2404.14367)                                  |      2024 |    75 | Online Data           | 强调 on-policy 甚至 suboptimal response 对偏好微调的重要性，补足 offline DPO 盲点。  | on-policy 数据收集成本高，也可能放大当前策略盲点。              |
|   11 | [Cal-DPO](https://arxiv.org/abs/2412.14516)                                                                                            |      2024 |    74 | Calibration           | 校准 DPO implicit reward 绝对尺度，补足只看相对差值的问题。                          | 仍在 contrastive preference 框架内。                            |
|   12 | [Accelerated Preference Optimization](https://arxiv.org/abs/2410.06293)                                                                |      2024 |    73 | Optimization          | 用 proximal / momentum 视角加速 preference optimization，并统一若干目标。            | 主要改善优化效率，不解决 feedback 可信度。                      |
|   13 | [DiscoPOP](https://arxiv.org/abs/2406.08414)                                                                                           |      2024 |    72 | Objective Discovery   | 用 LLM 自动发现 preference optimization loss，拓展 objective 搜索空间。              | 容易过拟合搜索 benchmark，需 held-out human eval。              |
|   14 | [Self-Play Fine-Tuning](https://arxiv.org/abs/2401.01335)                                                                              |      2024 |    70 | Self-Improve          | 用 human demos 与 self-generated responses 做 self-play，不需新增偏好数据。          | 不是直接 human/AI preference feedback。                         |
|   15 | [Self-Augmented Preference Optimization](https://arxiv.org/abs/2405.20830)                                                             |      2024 |    69 | Self-Improve          | self-augmentation、EMA 与 replay buffer 连接 off-policy 数据复用和偏好优化。         | off-policy replay 可能重新引入 policy mismatch。                |
|   16 | [Length-Controlled AlpacaEval](https://arxiv.org/abs/2404.04475)                                                                       |      2024 |    68 | Judge Eval            | 直接处理开放式 win rate 的长度偏差，是评估可信度关键 companion。                     | 评测修正，不是训练方法。                                        |
|   17 | [Multi-objective Reinforcement Learning from AI Feedback](https://arxiv.org/abs/2406.07295)                                            |      2024 |    68 | Multi-Objective       | 将 RLAIF 扩展到多目标反馈，贴近 helpfulness / harmlessness / style trade-off。       | 目标拆解与权重选择仍主观。                                      |
|   18 | [SimPO](https://arxiv.org/abs/2405.14734)                                                                                              |      2024 |    67 | Objective             | 简化 reference-free preference optimization，广泛用于 instruction tuning 对照。      | 简单性可能牺牲显式 KL 和安全控制。                              |
|   19 | [Quality-Diversity through AI Feedback](https://arxiv.org/abs/2310.13032)                                                              | 2023/2024 |    66 | Creative AI Feedback  | 用 AI feedback 优化质量与多样性，拓宽 open-ended 目标定义。                          | 更像 search / evolutionary generation，不是标准 post-training。 |
|   20 | [Aligning LLMs from Self-Reference AI Feedback](https://arxiv.org/abs/2406.11190)                                                      |      2024 |    65 | AI Feedback           | self-reference AI feedback 连接 Constitutional AI 与弱 judge 场景。                  | general principle 过粗，self-reference 可能强化偏见。           |
|   21 | [Are You Sure? Rank Them Again](https://arxiv.org/abs/2405.18952)                                                                      |      2024 |    65 | Data Quality          | 通过重复 ranking 提高 preference dataset 可靠性，直接服务 noisy feedback。           | 成本上升，系统性 judge bias 仍可能保留。                        |
|   22 | [Unified Preference Optimization](https://arxiv.org/abs/2405.17956)                                                                    |      2024 |    65 | Objective             | 统一多种 preference optimization 形式，适合梳理 preference frontier。                | 理论统一不等于 noisy open-ended feedback 下鲁棒。               |
|   23 | [Verbosity Bias in Preference Labeling by LLMs](https://arxiv.org/abs/2310.10076)                                                      |      2023 |    64 | Judge Bias            | 诊断 LLM judge 偏好冗长回答，直接影响 reward models 和偏好数据。                     | 主要是诊断，不提供完整训练修复。                                |
|   24 | [Aligning with Human Judgement](https://arxiv.org/abs/2403.16950)                                                                      |      2024 |    64 | Judge Eval            | 研究 pairwise preference 协议如何让 LLM evaluators 更接近人类。                      | pairwise agreement 不等于可安全用于 RL 的标量奖励。             |
|   25 | [Reward Model Routing in Alignment](https://arxiv.org/abs/2510.02850)                                                                  |      2025 |    64 | Reward Model          | 按样本路由到不同 RM，适合异质 open-ended objective。                                 | routing 错误会放大奖励偏差且难审计。                            |
|   26 | [Why Does RLAIF Work At All?](https://arxiv.org/abs/2603.03000)                                                                        |      2026 |    64 | AI Feedback Analysis  | 分析 AI-feedback alignment 成功机制，适合解释 RLAIF 条件。                           | 机制解释可能依赖简化假设。                                      |
|   27 | [A Roadmap to Pluralistic Alignment](https://arxiv.org/abs/2402.05070)                                                                 |      2024 |    63 | Pluralistic Alignment | 将 alignment 定义为多元、情境化偏好问题，补足单 reward 视角。                        | 更偏概念路线图，不是可直接复现算法。                            |
|   28 | [ORPO](https://arxiv.org/abs/2403.07691)                                                                                               |      2024 |    63 | Objective             | 合并 SFT 与 preference optimization，不需要 reference model，工程上简单。            | 去掉 reference 后 KL 和安全约束更难解释。                       |
|   29 | [HRLAIF](https://arxiv.org/abs/2403.08309)                                                                                             |      2024 |    63 | AI Feedback           | 将 RLAIF 用于 open-domain helpfulness 和 harmlessness 改善。                         | AI evaluator 的规范会塑造输出价值观。                           |
|   30 | [Value-Incentivized Preference Optimization](https://arxiv.org/abs/2405.19320)                                                         |      2024 |    63 | Online / Offline      | 连接 offline preference optimization 与 online RLHF，补充 value 视角。               | subjective reward 下 value estimate 可能不稳定。                |
|   31 | [Generative Reward Models](https://arxiv.org/abs/2410.12832)                                                                           |      2024 |    63 | Reward Model          | 用生成式方式表达 reward，扩展超出 scalar preference 的反馈形式。                     | 更难校准，也更难直接用于稳定 RL。                               |
|   32 | [Toward Evaluative Thinking](https://arxiv.org/abs/2504.20157)                                                                         |      2025 |    63 | Evolving RM           | 用 evolving reward models / prompts 抵抗 reward hacking。                            | adaptive evaluator 会引入非平稳性。                             |
|   33 | [Temporal Self-Rewarding Language Models](https://arxiv.org/abs/2508.06026)                                                            |      2025 |    63 | Self-Rewarding        | 用 past-future 解耦 chosen / rejected，缓解 self-reward drift。                      | 仍依赖自生成比较，长期迭代可能漂移。                            |
|   34 | [Training Dialogue Systems by AI Feedback](https://arxiv.org/abs/2501.12698)                                                           |      2025 |    62 | AI Feedback           | 用 AI feedback 优化整体对话印象，直接面向 open dialogue quality。                    | holistic impression reward 高度 evaluator-dependent。           |
|   35 | [Process-based Self-Rewarding Language Models](https://arxiv.org/abs/2503.03746)                                                       |      2025 |    62 | Self-Rewarding        | 将 self-rewarding 从 outcome 扩展到 process-level signal。                           | process reward 可能奖励貌似合理的错误推理。                     |
|   36 | [Reward Hacking in the Era of Large Models](https://arxiv.org/abs/2604.13602)                                                          |      2026 |    62 | Reward Hacking        | 梳理大模型时代 reward hacking 机制和 emergent misalignment。                         | survey / taxonomy，不是单一缓解方法。                           |
|   37 | [Joint Preference Optimization](https://arxiv.org/abs/2404.00530)                                                                      |      2024 |    61 | Objective             | 处理 heterogeneous positives / negatives 的联合偏好优化。                            | grouping 和比较结构引入额外设计选择。                           |
|   38 | [Self-Play Preference Optimization](https://arxiv.org/abs/2405.00675)                                                                  |      2024 |    61 | Self-Improve          | 用 self-play 生成偏好改进信号，连接 SPIN 与偏好优化。                                | self-play 可能 plateau 或 exploit learned evaluator。           |
|   39 | [WPO](https://arxiv.org/abs/2406.11827)                                                                                                |      2024 |    61 | Objective             | 通过 preference example weighting 改善 alignment training。                          | 权重可能放大 spurious judge pattern。                           |
|   40 | [CREAM](https://arxiv.org/abs/2410.12735)                                                                                              |      2024 |    61 | Self-Rewarding        | 用 consistency regularization 稳定 self-rewarding language models。                  | 一致性不等于与外部人类偏好一致。                                |
|   41 | [Voting with the Graph](https://arxiv.org/abs/2510.15514)                                                                              |      2025 |    61 | AI Feedback           | 用 preference graph 拓扑一致性稳定 RLAIF。                                           | graph smoothing 可能压制真实 preference pluralism。             |
|   42 | [Online Data Selection Is Implicit Alignment](https://arxiv.org/abs/2607.07023)                                                        |      2026 |    61 | Online Data           | 把 online data selection 本身视为 alignment 机制，补充 feedback 选择视角。           | 数据选择是间接机制，不能替代明确偏好反馈。                      |
|   43 | [Direct Preference Optimization with an Offset](https://arxiv.org/abs/2402.10571)                                                      |      2024 |    60 | Objective             | 研究 DPO margin / offset 处理，改善偏好边界建模。                                    | 需要调 offset，收益可能数据集相关。                             |
|   44 | [Directional Preference Alignment](https://arxiv.org/abs/2402.18571)                                                                   |      2024 |    60 | Multi-Objective       | 用偏好方向控制 helpfulness、verbosity 等多目标 trade-off。                           | 线性方向可能漏掉非线性价值冲突。                                |
|   45 | [Optimization-based Prompt Injection Attack to LLM-as-a-Judge](https://arxiv.org/abs/2403.17710)                                       |      2024 |    60 | Judge Safety          | 证明 LLM judge 可被攻击，关系到 RLAIF 和 evaluator robustness。                      | 关注攻击评估，不是完整 post-training pipeline。                 |
|   46 | [Chatbot Arena](https://arxiv.org/abs/2403.04132)                                                                                      |      2024 |    60 | Human Eval            | 提供大规模人类 pairwise preference 平台，是开放式 chat 评估核心来源。                | 受用户群、prompt mix 和展示方式影响。                           |
|   47 | [Prometheus 2](https://arxiv.org/abs/2405.01535)                                                                                       |      2024 |    60 | Judge Model           | 统一绝对评分与成对排序的开源 evaluator。                                             | evaluator 训练数据和真实人类偏好的距离仍需检查。                |
|   48 | [Pairwise or Pointwise?](https://arxiv.org/abs/2504.14716)                                                                             |      2025 |    60 | Judge Protocol        | 比较 pairwise / pointwise feedback protocol 的 LLM judge bias。                      | protocol bias 不一定预测下游 RL 失效。                          |
|   49 | [Robust Preference Optimization via Dynamic Target Margins](https://arxiv.org/abs/2506.03690)                                          |      2025 |    60 | Robust PO             | 动态调整 preference margin，提升噪声偏好下的鲁棒性。                                 | margin schedule 增加超参且可能数据集特化。                      |
|   50 | [MARS](https://arxiv.org/abs/2602.17658)                                                                                               |      2026 |    60 | Reward Model Data     | 用 margin 和 semantic-aware augmentation 改善 RM 训练数据。                          | synthetic augmentation 仍继承 generator bias。                  |
|   51 | [Random Is Hard to Beat](https://arxiv.org/abs/2604.02766)                                                                             |      2026 |    60 | Online DPO            | 检验 online DPO 中 active selection 是否优于 random。                                | 结论可能依赖模型和候选池。                                      |
|   52 | [ODRPO](https://arxiv.org/abs/2605.12667)                                                                                              |      2026 |    60 | Ordinal Reward        | 将离散 ordinal reward 分解以做更鲁棒 policy optimization。                           | ordinal 分解可能丢失开放式偏好细节。                            |
|   53 | [Permutative Preference Alignment](https://arxiv.org/abs/2410.04346)                                                                   |      2024 |    59 | Listwise PO           | 从 listwise ranking 学习，比 pairwise 捕获更丰富偏好。                               | listwise 标注成本高，候选集合敏感。                             |
|   54 | [Self-Consistency of Internal Reward Models](https://arxiv.org/abs/2502.08922)                                                         |      2025 |    59 | Self-Rewarding        | 用内部 reward model 一致性改善 self-rewarding LM。                                   | internal consistency 可能仍偏离人类偏好。                       |
|   55 | [GEOALIGN](https://arxiv.org/abs/2606.26917)                                                                                           |      2026 |    59 | Rollout Curation      | 用 geometric rollout curation 增强 LLM RL 稳健性。                                   | curation criteria 可能 benchmark-specific。                     |
|   56 | [Self-Rewarding Contrastive Prompt Distillation](https://arxiv.org/abs/2402.11907)                                                     |      2024 |    58 | Self-Improve          | 用 self-rewarding 与 contrastive distillation 对齐模型，不显式依赖人工偏好。         | 自奖励 prompt 是否泛化需要检验。                                |
|   57 | [Triple Preference Optimization](https://arxiv.org/abs/2405.16681)                                                                     |      2024 |    58 | Objective             | 用三元偏好丰富 pairwise 信号，尝试单步更好对齐。                                     | triple 数据更难收集，候选组成影响大。                           |
|   58 | [Inverse Constitutional AI](https://arxiv.org/abs/2406.06560)                                                                          |      2024 |    58 | AI Feedback           | 将偏好压缩为原则，为原则监督和 RLAIF 提供反向建模思路。                              | 原则压缩可能抹去少数偏好和上下文细节。                          |
|   59 | [Anchored Preference Optimization and Contrastive Revisions](https://arxiv.org/abs/2408.06266)                                         |      2024 |    58 | Objective             | 用 anchors 和 contrastive revisions 缓解偏好 underspecification。                    | 需要高质量 revisions，规模化困难。                              |
|   60 | [PopAlign](https://arxiv.org/abs/2410.13785)                                                                                           |      2024 |    58 | Data Diversity        | 通过多样 contrast pattern 扩展 alignment 数据覆盖。                                  | diversity heuristic 不一定等于真实用户价值多样性。              |
|   61 | [Beyond the Surface](https://arxiv.org/abs/2508.03550)                                                                                 |      2025 |    58 | Judge Alignment       | 用内部表示增强 LLM judge 与人类一致性。                                              | representation-based 方法未必跨 judge 架构迁移。                |
|   62 | [Reflective Preference Optimization](https://arxiv.org/abs/2512.13240)                                                                 |      2025 |    58 | Online PO             | 用 on-policy reflection 和 hints 改善偏好优化。                                      | reflection 质量可能受同一模型弱点限制。                         |
|   63 | [mDPO](https://arxiv.org/abs/2406.11839)                                                                                               |      2024 |    57 | Multimodal PO         | 将 DPO 条件化到多模态输入，避免忽略图像条件。                                        | 多模态相邻，文本 assistant 相关性主要是机制迁移。               |
|   64 | [Alignment Reduces Conceptual Diversity](https://arxiv.org/abs/2411.04427)                                                             |      2024 |    57 | Evaluation            | 诊断 alignment 可能降低概念多样性，是 open-ended generation 的重要副作用。           | 诊断为主，非训练修复。                                          |
|   65 | [From Generation to Judgment](https://arxiv.org/abs/2411.16594)                                                                        |      2024 |    57 | Judge Survey          | 总结 LLM-as-a-judge 的机会和挑战，适合梳理 evaluator 风险。                          | survey 不验证单一训练 recipe。                                  |
|   66 | [LLMs-as-Judges Survey](https://arxiv.org/abs/2412.05579)                                                                              |      2024 |    57 | Judge Survey          | 系统梳理 LLM-based evaluation 方法、bias 与协议。                                    | 广而不深，不能替代实验对照。                                    |
|   67 | [Igniting Creative Writing in Small LMs](https://arxiv.org/abs/2508.21476)                                                             |      2025 |    57 | Creative AI Feedback  | 针对 creative writing 比较 LLM-as-judge 与 multi-agent refined rewards。             | 创意质量高度主观，跨体裁泛化不确定。                            |
|   68 | [Is DPO Superior to PPO?](https://arxiv.org/abs/2404.10719)                                                                            |      2024 |    56 | Objective Study       | 系统比较 DPO 与 PPO 等 alignment objective，适合校准方法选择。                       | 结论依赖实现细节和 benchmark。                                  |
|   69 | [Prometheus](https://arxiv.org/abs/2310.08491)                                                                                         |      2023 |    55 | Rubric Judge          | 开源 rubric-conditioned evaluator，可用于开放式回答打分。                            | Judge 自身仍需校准和偏差评估。                                  |
|   70 | [Safe RLHF](https://arxiv.org/abs/2310.12773)                                                                                          |      2023 |    54 | Safety / Constraint   | 将 helpfulness reward 与 safety cost 分离，用约束优化处理安全 trade-off。            | 约束阈值和 cost model 质量决定效果。                            |
|   71 | [MODPO](https://arxiv.org/abs/2310.03708)                                                                                              |      2023 |    54 | Multi-Objective DPO   | 把多目标 RLHF 改写成直接偏好优化，服务 Pareto trade-off。                            | 多目标偏好权重仍需指定或采样。                                  |
|   72 | [MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685)                                                                         |      2023 |    53 | Judge Eval            | 系统化 LLM-as-a-judge 和 Arena 评测，后续开放式模型评估绕不开。                      | LLM judge 有位置、长度、自偏好等偏差。                          |
|   73 | [RLAIF vs. RLHF](https://arxiv.org/abs/2309.00267)                                                                                     |      2023 |    53 | AI Feedback           | 直接比较 AI feedback 作为 human preference labels 可扩展替代物的效果。               | 早于很多 2024–2026 judge robustness 讨论。                      |
|   74 | [Direct Preference Optimization](https://arxiv.org/abs/2305.18290)                                                                     |      2023 |    52 | Objective             | DPO 是 2024+ preference optimization 变体的共同起点。                                | 仍依赖静态 pairwise preference 和 BT-style 假设。               |
|   75 | [G-Eval](https://arxiv.org/abs/2303.16634)                                                                                             |      2023 |    52 | Judge Eval            | 用 GPT-4 + CoT 做 NLG 评价，推动 criteria-based LLM judge。                          | 早期 judge 方法，鲁棒性和校准不足。                             |
|   76 | [OpenAssistant Conversations](https://arxiv.org/abs/2304.07327)                                                                        |      2023 |    50 | Data                  | 公开 assistant 对话与偏好数据，对 open alignment 社区很重要。                        | 数据质量和分布不等同于真实部署用户。                            |
|   77 | [SLiC-HF](https://arxiv.org/abs/2305.10425)                                                                                            |      2023 |    50 | Objective             | 用 human feedback 校准 sequence likelihood，是 DPO 前后重要替代路线。                | 2023 方法，后续 online / AI feedback 版本更前沿。               |
|   78 | [AlpacaFarm](https://arxiv.org/abs/2305.14387)                                                                                         |      2023 |    50 | Evaluation            | 提供 learning-from-feedback 方法比较与模拟评估框架。                                 | simulator 和 proxy evaluator 不能替代真实人类偏好。             |
|   79 | [Constitutional AI](https://arxiv.org/abs/2212.08073)                                                                                  |      2022 |    49 | AI Feedback           | 用原则、critique-revision 和 AI preference 训练 harmless assistant，是 RLAIF 源头。  | 原则选择和 AI supervisor 偏差仍是核心风险。                     |
|   80 | [Training Language Models with Language Feedback](https://arxiv.org/abs/2204.14146)                                                    |      2022 |    48 | Language Feedback     | 从自然语言 critique 学习，而不只用 scalar reward 或 pairwise label。                 | 规模较小，尚非完整现代 pipeline。                               |
|   81 | [Training a Helpful and Harmless Assistant with RLHF](https://arxiv.org/abs/2204.05862)                                                |      2022 |    47 | Safety RLHF           | Anthropic HH RLHF 奠定 helpfulness / harmlessness 偏好数据和在线迭代框架。           | 早期 assistant RLHF，truthfulness 不是核心目标。                |
|   82 | [InstructGPT](https://arxiv.org/abs/2203.02155)                                                                                        |      2022 |    46 | RLHF                  | 建立 SFT → RM → PPO 的 instruction-following RLHF 标准 pipeline。                    | 旧基线，应作为背景而非近期主榜。                                |
|   83 | [Learning to Summarize from Human Feedback](https://arxiv.org/abs/2009.01325)                                                          |      2020 |    45 | RLHF                  | 用人类摘要偏好训练 reward model 并 PPO 优化，是主观文本质量 RLHF 里程碑。            | 任务集中在 summarization，非通用 assistant。                    |
|   84 | [WebGPT](https://arxiv.org/abs/2112.09332)                                                                                             |      2021 |    44 | RLHF / QA             | 用人类偏好训练浏览器辅助长答案，连接 factuality、source grounding 与 RLHF。          | 偏检索问答，不是纯开放式 assistant。                            |
|   85 | [Sparrow](https://arxiv.org/abs/2209.14375)                                                                                            |      2022 |    44 | Safety RLHF           | 用 targeted human judgements 训练更有帮助、无害、合规的对话 agent。                  | 2022 系统，后续被 RLAIF / Constitutional AI 扩展。              |
|   86 | [LIMA](https://arxiv.org/abs/2305.11206)                                                                                               |      2023 |    43 | SFT Alignment         | 论证少量高质量 SFT 可激发强 assistant 行为，挑战“必须大量 RLHF”的直觉。              | 不解决偏好优化和安全 trade-off。                                |
|   87 | [RRHF](https://arxiv.org/abs/2304.05302)                                                                                               |      2023 |    43 | Objective             | 用 ranked responses 对齐模型，绕开显式 PPO。                                         | 相对后续 DPO / KTO 影响小。                                     |
|   88 | [RAFT: Reward rAnked FineTuning](https://arxiv.org/abs/2304.06767)                                                                     |      2023 |    42 | Objective             | 用 reward-ranked samples 做 fine-tuning，是 reward-guided SFT 的早期路线。           | 依赖已有 reward ranking，机制较直接。                           |
|   89 | [Self-Instruct](https://arxiv.org/abs/2212.10560)                                                                                      |      2022 |    41 | Synthetic Data        | 用自生成指令扩展 SFT 数据，是后续 self-improvement 和 synthetic alignment 数据基础。 | SFT 数据生成，不是 preference optimization。                    |
|   90 | [HELM](https://arxiv.org/abs/2211.09110)                                                                                               |      2022 |    40 | Evaluation            | 提供多维 holistic evaluation，提醒开放式模型不能只看单一 win rate。                  | 评测框架，不是后训练方法。                                      |
|   91 | [LaMDA](https://arxiv.org/abs/2201.08239)                                                                                              |      2022 |    39 | Dialogue System       | 将 quality、safety、groundedness 作为对话模型核心指标，影响 assistant alignment。    | 系统细节公开有限，方法不如 RLHF 论文可复现。                    |
|   92 | [RealToxicityPrompts](https://arxiv.org/abs/2009.11462)                                                                                |      2020 |    38 | Evaluation            | 提供 open-ended toxic degeneration 评测，影响后续安全 reward 和 refusal 评估。       | 评测数据，不是训练方法。                                        |
|   93 | [Teaching Language Models to Support Answers with Verified Quotes](https://arxiv.org/abs/2203.11147)                                   |      2022 |    38 | RLHF / Grounding      | 用 human feedback 训练引用支持答案，说明偏好训练可约束开放式答案形式。               | 专门面向 quote-supported QA。                                   |
|   94 | [Red Teaming Language Models with Language Models](https://arxiv.org/abs/2202.03286)                                                   |      2022 |    37 | Safety Data           | 用模型生成 adversarial prompts，为安全 post-training 提供数据生成思路。              | 主要是 red-teaming，不是优化算法。                              |
|   95 | [Fine-Tuning Language Models from Human Preferences](https://arxiv.org/abs/1909.08593)                                                 |      2019 |    36 | Objective             | GPT-2 时代把 reward model + PPO 用到文本生成，是 LLM RLHF 的直接前身。               | 模型和任务都较小，不能代表现代 assistant alignment。            |
|   96 | [Better Rewards Yield Better Summaries](https://arxiv.org/abs/1909.01214)                                                              |      2019 |    34 | Reward Design         | 探索无 reference summarization 的 reward 设计，连接开放式摘要与 reward learning。    | 不是主流 human preference RLHF。                                |
|   97 | [Feed Yourself, Chatbot!](https://arxiv.org/abs/1901.05415)                                                                            |      2019 |    33 | Data / Online         | 研究部署后从用户交互收集反馈并继续学习，是 online feedback 的早期对话版本。          | 反馈和模型较简单，不是现代偏好优化。                            |
|   98 | [Way Off-Policy Batch Deep RL of Implicit Human Preferences in Dialog](https://arxiv.org/abs/1907.00456)                               |      2019 |    32 | Dialogue RL           | 用 implicit human preference 改善对话系统，提前触及 deployed feedback。              | 传统 dialogue agent，非 instruction-following LLM。             |
|   99 | [Deep Reinforcement Learning from Human Preferences](https://arxiv.org/abs/1706.03741)                                                 |      2017 |    31 | Foundation            | 经典 deep RLHF：用成对人类偏好训练 reward model，再优化 policy。                     | 主要是 Atari / MuJoCo，不是文本生成。                           |
|  100 | [TAMER: Interactively Shaping Agents via Human Reinforcement](https://www.cs.utexas.edu/~pstone/Papers/bib2html-links/KCAP09-knox.pdf) |      2009 |    28 | Foundation            | 早期把人类即时评价当作强化信号塑造 agent policy，是 RLHF 的概念源头之一。            | 非语言、非深度模型，只适合作为历史根。                          |

## Diagnostic / evaluation companion

这些不一定是“后训练方法”，但决定 open-ended post-training 论文是否可信。

| 推荐级 | 论文 / 资源                                                                                         | 为什么要一起读                                                                               |
| ------ | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 必读   | [RewardBench](https://arxiv.org/abs/2403.13787)                                                     | 评测 reward model 的 Chat、Safety、Reasoning 等分项能力，避免只相信单一 RM 分数。            |
| 必读   | [Length-Controlled AlpacaEval](https://arxiv.org/abs/2404.04475)                                    | 直接处理 AlpacaEval / LLM judge 的长度偏差；open-ended win rate 不控长度会很危险。           |
| 必读   | [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685)          | 系统讨论 LLM judge 的位置偏差、长度偏差、自偏好和与人类一致性。                              |
| 必读   | [On the Robustness of Reward Models for Language Model Alignment](https://arxiv.org/abs/2505.07271) | 研究 reward model overoptimization 与 OOD 泛化，适合判断 RLHF/RLAIF 是否只是 exploit proxy。 |
| 有用   | [AlpacaFarm](https://arxiv.org/abs/2305.14387)                                                      | instruction-following 方法比较与模拟评估框架，可作为早期对照。                               |

## 背景论文：不要放主榜，但要引用

| 背景论文                                                                                                | 在综述中的作用                                                                                         |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [Learning to summarize from human feedback](https://arxiv.org/abs/2009.01325)                           | 主观生成质量可用 human preference + reward model + PPO 优化的早期证据。                                |
| [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155) | 通用 instruction-following RLHF pipeline 的经典起点。                                                  |
| [Training a Helpful and Harmless Assistant with RLHF](https://arxiv.org/abs/2204.05862)                 | open-ended assistant helpfulness / harmlessness、在线迭代和 preference model overoptimization 的基础。 |
| [Constitutional AI](https://arxiv.org/abs/2212.08073)                                                   | RLAIF、principle-based critique / revision 的源头。                                                    |
| [Direct Preference Optimization](https://arxiv.org/abs/2305.18290)                                      | 2024+ preference optimization 论文的共同背景。                                                         |

## 研究 gap

1. **AI feedback 的因果收益不清楚**：很多 RLAIF pipeline 的提升可能来自更强 teacher / critic，而非 RL 或在线反馈本身。
2. **online feedback 与 judge drift 的 trade-off**：OAIF 缓解 off-policy 问题，但训练中的 annotator prompt、judge 版本、模型自偏好可能变成新分布漂移。
3. **self-rewarding 的退化机制缺少系统诊断**：需要专门测 self-confirmation、judge collapse、diversity loss 和 reward hacking。
4. **binary / scalar / critique feedback 的统一比较不足**：KTO、UltraFeedback、critique models、rubric rewards 都降低 pairwise 依赖，但还缺少同一任务、同一模型、同一预算下的比较。
5. **评估本身是瓶颈**：open-ended 任务很容易把“模型变好”误判为“更会讨好 GPT-4 judge”或“回答更长”。

## 建议阅读顺序

1. OAIF：先理解 online/on-policy feedback 为什么重要。
2. UltraFeedback + Critical Evaluation of AI Feedback：一正一反理解 AI feedback 的规模化与风险。
3. KTO + Cal-DPO：理解 DPO 之后 feedback 形式和 implicit reward 校准的变化。
4. Self-Rewarding + SPIN：理解 self-improvement 的诱惑和风险。
5. RewardBench + AlpacaEval 2 + LLM-as-a-Judge：补齐评估可靠性，否则很难判断上述论文的结果是否可信。

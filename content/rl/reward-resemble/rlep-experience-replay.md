---
title: "RLEP 与 LLM Experience Replay：从成功轨迹复用到稳定 Off-Policy RL"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
authors: "Hongzhi Zhang, Jia Fu, Jingyuan Zhang, Kai Fu, Qi Wang, Fuzheng Zhang, Guorui Zhou 等"
aliases: [papers/rlep-experience-replay]
tags: [paper, RL, RLVR, experience-replay, off-policy, reasoning, GRPO]
source_url: https://arxiv.org/abs/2507.07451
---

> [!summary] 一句话结论
> **ExGRPO 是 RLEP 最直接的算法继承者，BAPO 是更完整的 buffer 管理方案，Replay-Enhanced RePO 则是最清楚的单次训练内 replay 基线。** RLEP 证明“少量成功旧轨迹 + 大量 fresh rollout”可以更快恢复并突破先前峰值；后续工作说明，真正决定 replay 成败的是经验价值、样本新鲜度、off-policy 修正与探索保留，而不是“有 buffer”本身。

## 基本信息与证据口径

- **核心论文**：[RLEP: Reinforcement Learning with Experience Replay for LLM Reasoning](https://arxiv.org/abs/2507.07451)
- **作者**：Hongzhi Zhang、Jia Fu、Jingyuan Zhang、Kai Fu、Qi Wang、Fuzheng Zhang、Guorui Zhou
- **版本**：arXiv:2507.07451v1，2025-07-10，技术报告
- **代码与数据**：[Kwai-Klear/RLEP](https://github.com/Kwai-Klear/RLEP)
- **阅读范围**：逐篇核对正文中的方法、实验设置、主结果、消融与局限；表中数字都是各论文在自身设置下报告的结果，**不同模型、数据、采样预算和评测协议之间不能直接按绝对分数排名**。
- **特殊口径**：[POER](https://openreview.net/forum?id=AoCqLYhTD8) 的 OpenReview 正文受访问验证限制，本页只保留可由公开索引摘要核对的机制，不展开结果数字；[Polaris Rollout-Rescue](https://hkunlp.github.io/blog/2025/Polaris) 是工程博客中的训练组件，不作为独立算法论文处理。

## Motivation

标准 on-policy RLVR 通常生成一批昂贵 rollout，只使用一次便丢弃。这样同时造成三个问题：

1. **经验浪费**：一次探索发现的正确推理链不能在后续更新中持续提供监督。
2. **难题零梯度**：GRPO 一组回答全错或全对时，组内 reward 没有方差，难以产生有效更新。
3. **训练不稳**：策略可能在发现好路径后又遗忘；但直接复用旧轨迹又会引入 behavior policy 与当前 policy 的分布差异。

因此关键问题不是简单的“要不要 replay”，而是：**回放什么、回放多少、保存多久、怎样修正 policy gap，以及如何避免旧成功经验压垮新探索。**

## Method：RLEP 基准机制

RLEP 把训练拆成两次旅程：

1. **Experience collection**：先完成一轮 vanilla RL，用其 checkpoint 对每道题采样 64 个候选；只保存 verifier 判定正确的轨迹，并要求每题至少有两条有效路径。
2. **Replay-based training**：从同一个 base model 重新开始训练。每题生成 $G=16$ 条当前策略的 fresh rollout，再随机加入 $M=2$ 条历史正确轨迹，形成 $G'=G+M$ 的混合组。
3. **共同更新**：fresh 与 replay 样本共用组内 reward baseline，再使用 token-level、非对称 clipping 的 GRPO 更新。小比例 replay 负责迅速找回旧峰值，fresh rollout 继续探索更高上限。

这与通常“在同一次训练中维护 FIFO buffer”的方案不同：RLEP 先让第一轮 RL 建库，再从基础模型重训；它复用的是**完整、已验证的正确答案**，不是中间状态、失败 prefix 或外部专家答案。

## Experimental Setup

### RLEP 本身

- **模型**：Qwen2.5-Math-7B。
- **训练**：基于去掉 dynamic sampling、mini-batch 64 的强化 DAPO baseline；每个 rollout batch 512 个样本。
- **经验池**：第一轮 RL checkpoint 每题采样 64 次，temperature 0.7、top-p 0.95，只保留正确轨迹。
- **回放比例**：每题 16 fresh + 2 replay，单步额外耗时小于 5 秒。
- **评测**：AIME 2024、AIME 2025，并在未见的 AMC 2023 上离线评测。

### 跨论文比较时要控制什么

| 维度        | 典型差异                                               | 为什么会影响结论                                               |
| ----------- | ------------------------------------------------------ | -------------------------------------------------------------- |
| 策略规模    | 0.6B、1.5B、7B、8B、32B                                | 小模型更容易出现全错组，buffer 的收益可能被放大                |
| 经验来源    | 自身成功、失败 prefix、专家答案、MCTS 节点             | 对 policy gap、数据成本和可扩展性的要求不同                    |
| replay 时机 | 两阶段重训、同步 FIFO、异步 actor、按需 rescue         | 决定 staleness 与系统吞吐                                      |
| 目标函数    | GRPO/PPO、Trajectory Balance、Bellman update、混合 SFT | “replay 有效”不能脱离优化器解释                                |
| 成本口径    | rollout 数、GPU-hours、每步时间、完整 wall-clock       | 这些数字不能互换；收敛步数减少也不必然等于同倍 wall-clock 加速 |

## Results：RLEP 是否真的有效

| 指标                         |  Baseline |          RLEP | 可支持的结论                                |
| ---------------------------- | --------: | ------------: | ------------------------------------------- |
| AIME 2024 best accuracy      |     38.2% |     **39.9%** | 最终上限提高 1.7 个百分点                   |
| AIME 2025 best accuracy      |     19.8% |     **22.3%** | 最终上限提高 2.5 个百分点                   |
| AMC 2023 accuracy            |     77.0% |     **82.2%** | 在该未见数学集上提高 5.2 个百分点           |
| 达到 AIME 2024 baseline 峰值 | 380 steps | **135 steps** | 更新步数显著减少；不是 2.8× wall-clock 结论 |

RLEP 还在 AIME 2025 约 50 步后超过 baseline 最佳值。作者加入失败答案做正负混合 replay 时，没有测到相对“只回放成功轨迹”的进一步收益；论文将其归因于错误空间过于分散，但这只是合理解释，不是独立验证的因果结论。

证据边界也很明确：结果来自单一 7B 模型、数学训练域和一套 replay 配置，没有多随机种子统计，也没有系统扫描 buffer freshness、容量与 off-policy correction。因此它更像一个有效的概念验证，而不是已确定的通用最优 recipe。

## 最接近 RLEP 的方法

### 1. 完整轨迹 self-replay

| 方法                                                                                      | 核心机制                                                                                                                           | 论文报告的结果                                                                                                         | 与 RLEP 的主要区别                                                                               |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [ExGRPO](https://arxiv.org/abs/2510.02245)                                                | 按最新正确率挑中等难度题，在成功经验中选当前 policy 下低熵轨迹；约 50% replay，并使用历史行为概率、policy shaping 与 delayed start | Qwen2.5-Math-7B 的 ID/OOD 平均分别 45.3→48.3、56.4→58.3；跨 1.5B–8B 五种模型保持提升                                   | **最直接的 RLEP 继承者**：把随机成功回放升级为经验价值评估、buffer 管理和 mixed-policy objective |
| [BAPO / Buffer Matters](https://arxiv.org/abs/2602.20722)                                 | 混合 fresh 非零方差组、周期性重试的历史全错题、最近三步高质量轨迹；FIFO 加 importance ratio                                        | 跨数学、规划、视觉推理平均比 GRPO 高 12.5%；解决 40.7% 的 base model 持续失败问题；论文报告 rollout 约为 DAPO 的 1/2.5 | 不只回放正确答案，还检测“以前不会、现在开始会”的样本，并显式限制 freshness                       |
| [Replay-Enhanced RePO](https://arxiv.org/abs/2506.09340)                                  | 在单次训练中持续收集 rollout；异步检索 recent/reward/variance/full buffer，并分开估计 on/off-policy advantage                      | 五种模型均高于 GRPO；Qwen3-1.7B 数学平均 39.5→43.6，训练时间约增加 15%                                                 | RLEP 是“先建库再重训”，RePO 是一次 run 内不断积累和复用                                          |
| [DOTS + Rollout Replay](https://arxiv.org/abs/2506.05316)                                 | 预测当前 prompt 难度，优先选成功率约 50% 的题；只生成约 50% fresh rollout，其余取 FIFO 中近期有效 group                            | 六种设置总训练时间平均节省 40.7%（23.3%–61.65%），每步节省约 11%–13%；报告 3 次运行与 95% CI                           | 更强调 prompt 难度定向采样和减少在线生成，而非跨 run 恢复旧峰值                                  |
| [EFRame](https://arxiv.org/abs/2506.22200)                                                | Exploration–Filter–Replay：对当前全失败的 hard prompt 提高温度探索，只把 rare positive 存入 buffer 回放                            | 文本平均 55.1→60.2，多模态 54.19→55.13；Geometry3K 50.75→55.41                                                         | 只救援当前 policy 解不出的题；RLEP 对整个训练分布统一加入旧成功轨迹                              |
| [ReMix](https://arxiv.org/abs/2507.06892)                                                 | 前期以 40% 历史 + 60% on-policy、UTD=2、历史窗口 2 训练，随后切回纯 on-policy 并重置 reference                                     | 7B 平均 52.08→64.39，只用 0.011M rollout；相对 PPO 报告约 6× rollout 降低                                              | **不是全程固定比例混合**，而是“前期榨取历史数据，后期 policy reincarnation”的两阶段策略          |
| [Efficient RL Training for LLMs with Experience Replay](https://arxiv.org/abs/2604.08706) | 系统扫描 FIFO 容量、replay ratio、staleness、多样性与正样本偏置                                                                    | 最优配置报告最多约 40% compute 节省；至少 4 个 seeds，展示 median/IQR                                                  | 目标是性能—计算 Pareto 与可复现实证规律，不以单点最高分为主                                      |
| [Polaris Rollout-Rescue](https://hkunlp.github.io/blog/2025/Polaris)                      | 当前 group 全失败时，从 earlier-epoch buffer 取一条正确答案替换失败 rollout                                                        | 博客把它作为 Polaris 训练 recipe 的局部组件，没有隔离出可与 RLEP 对齐的独立结果                                        | 极简、按需触发，侵入性更小；证据等级低于独立算法论文                                             |
| [ARPO](https://arxiv.org/abs/2505.16282)                                                  | GUI agent 的 GRPO；一组全零时注入同任务的历史非零 reward 轨迹，FIFO 控制 stale                                                     | OSWorld 23.5→29.9，Hard 子集 18.2→23.8；OOD 55.2→56.3                                                                  | replay 逻辑接近 EFRame/Polaris，但任务是 GUI 多步 agent，OOD 增益较小                            |
| [Kimi k1.5](https://arxiv.org/abs/2501.12599)                                             | 缓存完整与 partial rollout，用于打散时序相关性并跨 iteration 续写                                                                  | 系统整体取得强推理结果，但论文没有 replay 组件的独立消融                                                               | replay 只是大型训练系统的一个组件，不能把整套模型成绩归因给它                                    |

### 2. Prefix、状态、搜索与 value replay

| 方法                                                                   | 回放对象与机制                                                                                 | 结果与边界                                                                                          | 为什么不是“普通 RLEP”                                                           |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [Retrospective Replay / RRL](https://arxiv.org/abs/2504.14363)         | PPO critic 在模型轨迹和 canonical solution 中找高 value prefix，再从中间状态继续 rollout       | APPS+ 31.7→35.2，GSM8K 68.8→70.7，MATH 33.3→34.3；早期 critic 可能不可靠，prefix 也可能本身错误     | 回放中间推理状态，目的是保住有希望的探索分支                                    |
| [POER](https://openreview.net/forum?id=AoCqLYhTD8)                     | 保存失败轨迹中仍正确或有希望的前缀，引导模型补完后续路径                                       | 本页只核对到公开索引摘要，未取得可可靠复核的正文，因此不列数字                                      | 经验不必是完整正确答案；与 RRL 同属 prefix/state replay                         |
| [Trajectory Balance with Asynchrony](https://arxiv.org/abs/2503.18929) | 异步 searcher 向共享 buffer 供给多样轨迹，以 reward/recency 采样并使用 Trajectory Balance loss | 在各自设置下，GSM8K 对可比 VinePPO 约快 50×且高 1.8 个百分点；TL;DR 约快 5×，red teaming 约快 7×    | 重点是探索—学习的系统解耦；trajectory-level loss 方差较高，需要更多每题响应     |
| [ReVal](https://arxiv.org/abs/2603.23355)                              | 把 LLM logits 解释为 Q-value，以 Bellman residual 和 FIFO buffer 反复更新历史轨迹              | 单题实验平均 4.3× 收敛加速；完整训练 1.5B 平均 43.4→45.6、7B 38.4→39.6，wall-clock 约 7.5h→6.2/6.3h | 从 policy-gradient replay 转为 value-based off-policy RL；4.3× 不是完整训练加速 |
| [DeepSearch](https://arxiv.org/abs/2509.25454)                         | 训练时 MCTS、全局 frontier、node-level $q$、hard-set progressive filtering 和正确解 cache      | 1.5B 平均 62.95 vs. 61.70；330 GPUh vs. 延长训练 1883.2 GPUh，约少 5.7×                             | 经验来自结构化树搜索，可复用中间节点并减少重复搜索，但只在数学上验证            |

## 使用外部或历史专家轨迹的方法

这些方法不一定 replay 当前模型自己的成功经验，但面对同一个核心风险：**高质量轨迹来自别的 policy，怎样吸收它而不被过大的 policy gap 破坏。**

| 方法                                                                              | 核心机制                                                                                | 论文中较稳妥的结果/边界                                                                                             |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [LUFFY](https://arxiv.org/abs/2504.14945)                                         | on-policy 一组全失败时引入 DeepSeek-R1 等强模型轨迹，并重做 advantage 与 policy shaping | 论文在数学推理上优于其 on-policy 和直接 imitation 对照；收益依赖外部教师质量与可获得性，不能视为纯 self-improvement |
| [RePO: Rephrasing Policy Optimization](https://arxiv.org/abs/2602.10819)          | 先让当前模型理解并把专家答案改写成自己的表达，再替换低 reward rollout                   | 论文报告优于标准 on-policy RL 与已有 hard-sample 方法；它与上面的 **Replay-Enhanced RePO** 是两篇不同论文           |
| [ReLIFT](https://arxiv.org/abs/2506.07527)                                        | 识别 RL 难以突破的问题，把高质量解存入 buffer，交错在线 RL 与 SFT                       | 跨评测平均比既有 RLVR 方法高 6.7 分，OOD 数学结果达到 52.6%；但 SFT 与 replay 的贡献绑定在一起                      |
| [CHORD / On-Policy RL Meets Off-Policy Experts](https://arxiv.org/abs/2508.11408) | 动态调节专家 SFT loss 与 on-policy GRPO loss，使模型先更多吸收专家，再逐步转向自主探索  | 论文在多种数学设置下优于 SFT-then-RL 与固定混合；核心贡献是 curriculum 权重，不是 buffer 本身                       |
| [KDRL](https://arxiv.org/abs/2506.02208)                                          | 在统一目标中结合知识蒸馏和 RL，吸收外部模型的推理知识                                   | 论文报告在数学推理上优于单独 RL 和蒸馏基线；成本和上限受 teacher 约束                                               |
| [POETS](https://arxiv.org/abs/2605.07775)                                         | 轻量 LoRA policy ensemble、Thompson sampling 与 experience replay，用于科学搜索/优化    | 相比普通 GRPO 展示更强的抗过拟合和搜索效率；任务与常规语言 benchmark 差异大                                         |
| [Inspo](https://arxiv.org/abs/2512.01945)                                         | 失败经验进入 buffer，但不直接更新 actor，而是让 LLM 反思并进化 instruction              | 在多轮工具推理任务上优于静态 instruction 基线；改进来自 instruction population 与 replay 的组合                     |

## 专门解决 replay / off-policy 稳定性的底层方法

| 方法                                                                                   | 解决的问题                                                                                                    | 对 RLEP 系方法的启示                                                                                  |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [Soft Policy Optimization](https://arxiv.org/abs/2503.05453)                           | 为 sequence model 构造在线 off-policy 目标，可利用离线数据；数学竞赛上 pass@10 高于 PPO，并报告更快、更省显存 | replay 不必被硬塞回标准 PPO/GRPO ratio，可从目标函数层面允许 off-policy 数据                          |
| [Tapered Off-Policy REINFORCE](https://arxiv.org/abs/2503.14286)                       | 对远离当前 policy 的轨迹逐渐降低权重，避免 importance sampling 的高方差                                       | 比“全收或全丢”的 clip 更平滑，适合控制陈旧经验贡献                                                    |
| [Asymmetric REINFORCE / AsymRE](https://arxiv.org/abs/2506.20520)                      | 正负 reward 分开处理，不依赖普通 PPO importance ratio                                                         | 后续 buffer 实证显示它比 GRPO 更能承受 stale 样本；但这不代表 staleness 无上限                        |
| [M2PO](https://arxiv.org/abs/2510.01161)                                               | 发现 stale rollout 存在“先增益、后崩溃”区间，用 second-moment trust constraint 限制更新                       | replay 的问题不只是均值 policy ratio；二阶矩能更早识别少数极端 token 带来的 collapse                  |
| [Revisiting GRPO: On-Policy and Off-Policy Training](https://arxiv.org/abs/2505.22257) | 分析 rollout policy 延迟和多次复用同批数据时的有效 loss 与 policy-improvement 边界                            | 报告“replay ratio”时必须同时交代 rollout lag、更新次数和 clip；否则算法名相同，实际优化目标也可能不同 |

## Ablation：哪些设计真正重要

| 设计问题                           | 证据                                                                                | 判断                                                                                                        |
| ---------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| replay 越多越好吗？                | ExGRPO 中 50% 优于 75%；ReMix 与系统性 buffer 研究都观察到高比例前期快、后期易降    | **不是。** fresh rollout 是防止过度利用和 policy drift 的必要对照信号                                       |
| 只存成功答案够吗？                 | RLEP 加入失败轨迹没有可测收益；RRL/POER 则表明“失败轨迹中的好 prefix”可能有用       | 完整失败答案价值低，不等于所有负经验都无用；需要状态级价值判断                                              |
| buffer 要不要保鲜？                | BAPO 只用最近三步高质量轨迹，ARPO 用 FIFO；M2PO 展示 stale data 的收益—崩溃区间     | freshness 是核心超参数，必须与 policy gap 或二阶 trust signal 联动                                          |
| 随机 replay 够吗？                 | ExGRPO 的中难度 prompt + 低熵成功轨迹优于无差别回放；DOTS 同样偏向约 50% 成功率问题 | replay 的边际价值由“当前还能学到多少”决定，不由历史 reward 单独决定                                         |
| on/off-policy advantage 能混算吗？ | Replay-Enhanced RePO 的 split advantage 明显优于 mixed advantage                    | behavior distribution 不同却共享归一化统计，可能扭曲相对优势；RLEP 的共同 baseline 是后续值得重新检验的简化 |
| 是否需要第二阶段回到 on-policy？   | ReMix 中不做 policy reincarnation 的版本最差                                        | 历史数据适合启动和加速，不一定适合主导收尾阶段                                                              |

## Limitations

### RLEP 论文的局限

- 只有 Qwen2.5-Math-7B 和数学域，没有跨模型规模、代码、agent 或多模态验证。
- 没有随机种子、置信区间或显著性检验；几个点的提升不能自动外推到其他训练 recipe。
- 经验池来自额外一轮完整 RL，若把建库成本计入端到端预算，经济性弱于只报告第二轮训练时看起来的程度。
- 随机选择成功轨迹，没有处理去重、难度、熵、多样性、容量和过期策略。
- replay 样本与 fresh rollout 共用 baseline，且对 behavior-policy gap 的处理较弱；后续 RePO、ExGRPO、BAPO 正是在补这一层。

### 整个方向的共同局限

- 多数论文仍以可验证数学题为主；verifier 可靠、reward 稀疏而明确，不代表开放式任务同样成立。
- 论文使用的成本口径不统一，常把 rollout 节省、训练步数、GPU-hours 与 wall-clock 混在一起。
- buffer 会放大 verifier 偏差：一个被错误判正的答案可能被训练多次。
- 高质量外部轨迹可能带来许可证、隐私、数据污染和 teacher dependence 问题。
- 许多方法同时更改采样、loss、数据和系统调度，难以把收益严格归因给 replay 单一组件。

## Takeaways

1. **想在 RLEP 上做最小升级**：先加 buffer freshness、behavior log-prob 和 split on/off-policy advantage，再比较随机 replay 与价值采样。
2. **想追最高数据效率**：以 DOTS/ReMix 的 rollout 降本为主线，并把完整建库成本、GPU-hours 和 wall-clock 一起报告。
3. **想救全错难题**：BAPO/EFRame/Polaris 的“重试 + rare positive rescue”比对全数据固定 replay 更有针对性。
4. **想利用不完整经验**：RRL/POER 的 prefix replay 更灵活，但依赖可靠 critic 或状态价值判断。
5. **想上大规模异步系统**：TBA 提供探索—学习解耦，M2PO/AsymRE 处理 stale rollout 稳定性；两层必须一起设计。
6. **评测必须三账合一**：最终准确率、探索/生成成本、端到端训练时间缺一不可。

## 推荐阅读顺序

1. [RLEP](https://arxiv.org/abs/2507.07451)：先理解“两阶段建库 + 少量成功轨迹回放”的最小范式。
2. [Replay-Enhanced RePO](https://arxiv.org/abs/2506.09340)：看同一训练 run 内如何组织 on/off-policy 数据和 advantage。
3. [ExGRPO](https://arxiv.org/abs/2510.02245)：学习经验价值、难度与熵如何进入采样，并看 replay ratio 消融。
4. [BAPO / Buffer Matters](https://arxiv.org/abs/2602.20722)：看 hard-sample revisit、freshness 和 importance correction 组合成完整 buffer 系统。
5. [Efficient RL Training for LLMs with Experience Replay](https://arxiv.org/abs/2604.08706)：建立 buffer size、staleness、replay ratio 与计算 Pareto 的系统认识。
6. [ReMix](https://arxiv.org/abs/2507.06892) → [M2PO](https://arxiv.org/abs/2510.01161) → [Revisiting GRPO](https://arxiv.org/abs/2505.22257)：理解“为什么复用前期有效、后期却可能崩”。
7. 按需求选分支：[RRL](https://arxiv.org/abs/2504.14363) 看 prefix replay，[DeepSearch](https://arxiv.org/abs/2509.25454) 看树搜索缓存，[ReVal](https://arxiv.org/abs/2603.23355) 看 value-based replay，[LUFFY](https://arxiv.org/abs/2504.14945) 看外部专家轨迹。

## Citation

```bibtex
@article{zhang2025rlep,
  title={RLEP: Reinforcement Learning with Experience Replay for LLM Reasoning},
  author={Zhang, Hongzhi and Fu, Jia and Zhang, Jingyuan and Fu, Kai and Wang, Qi and Zhang, Fuzheng and Zhou, Guorui},
  journal={arXiv preprint arXiv:2507.07451},
  year={2025}
}
```

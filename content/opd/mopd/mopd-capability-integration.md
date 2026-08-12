---
title: "MOPD 合版：多教师 On-Policy Distillation 的能力整合、失败模式与工程选型"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
authors: "Wenhan Ma, Jianyu Wei, Liang Zhao, Hailin Zhang, Bangjun Xiao, Lei Li, Qibin Yang, Bofei Gao, Yudong Wang, Rang Li, Jinhao Dong, Zhifang Sui, Fuli Luo 等"
aliases: [papers/mopd-capability-integration]
tags:
  [paper, RL, MOPD, on-policy-distillation, multi-teacher, capability-integration, model-merging]
source_url: https://arxiv.org/abs/2606.30406
---

> [!summary] 一句话结论
> **MOPD 是目前最有潜力的“训练式能力合版”路线，但不是任意专家之间的通用合并器。** 它让学生在自己的 rollout 上接受领域教师的 token 级监督，通常比 Mixed-RL、离线模仿和参数平均更完整地继承专家能力；真正决定成败的不是教师数量，而是教师与学生是否同源、prompt 路由是否覆盖正确，以及监督 support 是否包含决定行为分支的关键 token。

## 基本信息与证据口径

- **方法主论文**：[MOPD: Multi-Teacher On-Policy Distillation for Capability Integration in LLM Post-Training](https://arxiv.org/abs/2606.30406)
- **作者**：Wenhan Ma、Jianyu Wei、Liang Zhao、Hailin Zhang、Bangjun Xiao、Lei Li、Qibin Yang、Bofei Gao、Yudong Wang、Rang Li、Jinhao Dong、Zhifang Sui、Fuli Luo
- **版本**：arXiv:2606.30406，2026-06-29
- **工业起点**：[MiMo-V2-Flash Technical Report](https://arxiv.org/abs/2601.02780)，2026-01-06
- **术语**：本文的 MOPD 指 **Multi-Teacher On-Policy Distillation**，即把多个领域或训练阶段专家蒸馏进一个统一学生；它不是本站已有的 [[rl/reward-resemble/modpo|MODPO 多目标偏好优化]]。
- **收录范围**：截至 2026-08-12，收录标题、摘要或正文明确采用、修改或直接分析 MOPD 的工作，并补充最关键的 OPD、知识融合和参数合并基础论文。一般单教师 OPD 不做穷举。
- **比较原则**：下文数字均来自各论文自己的模型、数据和评测协议。大量工作仍是 2026 年新 preprint，**跨论文绝对分数不可直接排名**；没有随机种子或置信区间时，也不把小幅提升写成稳定优势。

## Motivation

### 为什么需要“合版”

现代 LLM 后训练经常把数学、代码、指令遵循、工具调用和 agent 能力拆开训练。每个领域独立做 RL/SFT 容易得到峰值更高的专家，但最终部署通常只能保留一个模型。几种直观合并方案都有结构性缺陷：

1. **Mixed-RL**：在一次 RL 中混合所有任务，稀疏 sequence reward 的尺度、验证成本和难度不同，领域之间会争夺 batch 与梯度预算。
2. **Cascade RL**：按领域顺序训练，后面的阶段可能覆盖前面已经得到的能力；训练顺序变成额外超参数。
3. **Off-policy finetuning**：只模仿教师预先生成的“正确轨迹”，学生测试时一旦走到教师数据没有覆盖的状态，错误会累积。
4. **Parameter merge**：平均权重或 task vector 很便宜，但专家漂移方向可能冲突；能否成功高度依赖 merge recipe。
5. **重新做多域 RL**：已经为专家支付过的专项 RL 计算没有被充分复用，而且工程上再次耦合所有领域。

MOPD 的问题设定因此是：**能否让每个领域团队并行训练自己的最强专家，再以一次统一训练把这些能力吸收到同一个学生中，同时避免离线模仿的 exposure bias？**

### 为什么必须是 on-policy

学生在推理时访问的是自己造成的状态分布，而非教师的完美前缀。MOPD 先让学生生成，再让对应教师评价学生实际走过的每一步，因此教师提供的是“如何修正学生当前行为”的密集信号，而不只是一个最终正确/错误 reward。这继承了 [GKD](https://arxiv.org/abs/2306.13649) 和 [MiniLLM](https://arxiv.org/abs/2306.08543) 的核心思想，但把单教师蒸馏扩展成 prompt-routed 多教师能力整合。

## Method

### 三阶段训练流程

1. **General SFT**：得到统一学生初始模型 $\pi_\theta$。
2. **Domain-specialized training**：从同一学生 checkpoint 出发，对数学、代码、IF、SWE、Tool Use 等领域分别做 RL/SFT，得到教师 $\pi_{\phi_d}$。
3. **MOPD integration**：从领域混合数据采样 prompt；学生自己生成 rollout；根据领域 $d(x)$ 路由到相应教师；教师在同一 student prefix 上 prefill，输出逐 token 分布；最后更新学生。

这里的关键不是让多个教师同时投票，而是**每个 prompt 由匹配的专家负责，所有教师共同写入一个学生参数空间**。

### 目标函数

主论文把目标写成学生轨迹上的逐 token reverse KL：

$$
\mathcal L_{\text{MOPD}}
=\mathbb E_{x,\,y\sim\pi_\theta}
\left[
\frac{1}{|y|}\sum_t
D_{\mathrm{KL}}\!\left(
\pi_\theta(\cdot\mid x,y_{<t})\;\|\;
\pi_{\phi_{d(x)}}(\cdot\mid x,y_{<t})
\right)
\right].
$$

论文提供两种工程实现：

- **Policy-gradient 形式**：把采样 token 上的 teacher/student log-ratio
  $\log\pi_{\phi_d}(y_t\mid s_t)-\log\pi_\theta(y_t\mid s_t)$ 当成 token advantage，再复用 PPO/GRPO 基础设施。
- **Top-$k$ distillation**：传输教师概率最大的 $k$ 个 token，降低跨节点传输量；主论文额外加入 $\pi_{\phi_d}(v)-\pi_\theta(v)$ 修正项，使截断目标仍在 top-$k$ support 上以教师分布为极小点。

[MiMo-V2-Flash](https://arxiv.org/abs/2601.02780) 还把 MOPD token advantage 与 outcome reward 合并：

$$
\hat A_t
=\log\frac{\pi_{\phi_{d(x)}}(y_t\mid s_t)}{\pi_\theta(y_t\mid s_t)}
+\alpha\hat A_{\mathrm{ORM}},
$$

因此教师负责提供密集的过程方向，ORM/规则 verifier 继续约束最终结果。

### MOPD 与常见“合并”的区别

| 路线                 | 数据来自哪里                        | 学生是否在自己的状态上学习 | 主要风险                         |
| -------------------- | ----------------------------------- | -------------------------- | -------------------------------- |
| 参数平均/Task Vector | 多个 checkpoint 的权重差分          | 否                         | 参数干涉、merge 系数敏感         |
| Off-policy SFT       | 教师提前生成的静态答案              | 否                         | exposure bias、只会模仿成功前缀  |
| Mixed-RL             | 学生 rollout + 各域 sequence reward | 是                         | reward 尺度与梯度冲突、训练耦合  |
| MOPD                 | 学生 rollout + 路由教师 token 分布  | **是**                     | 教师距离、路由覆盖、在线 serving |
| REGEN                | 专家 RL 已产生的 replay buffer      | 否，使用离线修正           | 信号较粗、分布偏移               |

### 工程实现要点

- 学生 rollout 服务、教师 prefill 服务和训练 worker 可以解耦；教师只需做 prefill，不负责 autoregressive generation。
- 同域 prompt 可动态 batch 到对应教师；[DeepSeek-V4](https://arxiv.org/abs/2606.19348) 进一步使用隐藏状态缓存和动态 teacher 调度，并支持 full-vocabulary OPD。
- 多轮 co-evolution 可以把第一次 MOPD 学生作为新底座，再分别训练更强专家并进行下一轮整合。
- Top-$k$ 能显著减小通信，但它压缩的是概率质量，不保证保留行为决策所需的 support；工具调用等模式切换任务必须额外审计。

## Experimental Setup

### 方法主论文

- **模型**：Qwen3-30B-A3B；工业验证使用 309B 总参数、15B active 的 MiMo-V2-Flash。
- **教师来源**：默认教师均从学生同一 checkpoint 分别做领域 RL，因而结构与初始分布相近。
- **领域**：Qwen3 实验覆盖 Math、Instruction Following、Software Engineering；MiMo 扩展到 Math、Code、IF、SWE、Tool Use。
- **评测**：AIME25、AIME26、IFBench、IFEval、SWE-bench Verified；MiMo 还报告 HMMT25、LiveCodeBench、$\tau^2$-Bench 和 $\tau^2$-Telecom。
- **基线**：Mix-RL、Cascade RL、Off-Policy Finetune、参数平均、Task Arithmetic，以及每域 RL Teacher 上界。
- **汇总指标**：由于不同领域的 teacher headroom 差异很大，作者先按“学生到对应教师”的能力差距归一化，再做跨域汇总；1.0 表示平均达到领域教师水平。
- **关键控制实验**：固定数据和超参数，比较 policy-gradient 与 $k=64$ Top-$k$；再把同源数学教师替换成更强但异源的 Qwen3-235B-A22B。

### 后续工作覆盖的设置

| 工作                                                    | 主要设置                                  | 它回答的问题                                      |
| ------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------- |
| [CoPD](https://arxiv.org/abs/2604.27083)                | 文本、图像、视频专家共同演化              | 能否在专家尚未漂移过远时持续互相吸收              |
| [CaMOPD](https://arxiv.org/abs/2605.27115)              | role-play 与医疗 QA；通用教师训练数据未知 | prompt 覆盖不完整时如何恢复通用能力并保护领域行为 |
| [REGEN](https://arxiv.org/abs/2607.19450)               | Qwen2.5-1.5B；数学、代码、指令遵循        | 能否回收专家 RL buffer，避免在线教师成本          |
| [PROMPTSD](https://arxiv.org/abs/2607.18293)            | Qwen3-1.7B-Base、Phi-4-mini；四任务       | 能否用同骨干 soft prompt 构造天然同源教师         |
| [UI-MOPD](https://arxiv.org/abs/2607.04425)             | 近 10K 桌面/移动交互轨迹                  | 能否保留平台特有动作语义而非平均行为              |
| [LS-MOPD](https://arxiv.org/abs/2608.03610)             | 普通话、粤语、英语 ASR                    | 语言教师路由及 acoustic prefix 是否应共享         |
| [Top-K Decision](https://arxiv.org/abs/2607.07050)      | Qwen3.5-9B、Llama-3.1-8B 工具调用         | 高概率质量是否等于覆盖关键行为决策                |
| [Physics of Planning](https://arxiv.org/abs/2607.24720) | 可控多环境长程规划                        | 多教师何时共享模式、何时灾难性遗忘                |

## Results

### 1. 主论文：Qwen3-30B-A3B 能否接近所有领域教师

| 方法                           | AIME25 |    AIME26 |   IFBench |    IFEval | SWE-bench Verified | 归一化分数 |
| ------------------------------ | -----: | --------: | --------: | --------: | -----------------: | ---------: |
| Student（SFT-only）            |  45.42 |     54.48 |     42.69 |     84.17 |              35.80 |     0.0000 |
| RL Teacher                     |  54.79 |     63.65 |     78.40 |     95.50 |              51.20 |     1.0000 |
| Mix-RL                         |  52.71 |     63.75 |     75.00 |     94.58 |              48.80 |     0.8818 |
| Cascade RL                     |  48.54 |     61.88 |     77.11 |     95.80 |              47.80 |     0.7752 |
| Off-Policy Finetune            |  51.56 |     63.44 | **80.95** |     93.35 |              45.80 |     0.8241 |
| Param-Merge（Avg.）            |  47.81 |     59.58 |     53.74 |     88.79 |              39.60 |     0.3280 |
| Param-Merge（Task Arithmetic） |  49.38 | **63.96** |     78.23 | **95.81** |              48.80 |     0.8574 |
| **MOPD**                       |  51.46 |     65.31 |     77.89 |     93.84 |          **50.40** | **0.9373** |

MOPD 并非在每个单项上都第一，但它的跨域 profile 最均衡：三个领域关闭约 91%–95% 的 teacher headroom，范围只有 0.044；Mix-RL 的汇总分数为 0.8818。论文还报告，MOPD 在 IF 约 25K 样本、SWE 约 30K 样本达到教师平台，而 Mix-RL 需要消耗每域完整的 150K–180K 样本预算才接近相近水平。这个比较支持“token 监督更 sample-efficient”，但没有单独给出等硬件 wall-clock 加速比。

### 2. 工业规模：MiMo-V2-Flash

| 模型           |   AIME25 |   HMMT25 |      LCB | IFBench | SWE-bench V. | $\tau^2$-Bench | $\tau^2$-Telecom |
| -------------- | -------: | -------: | -------: | ------: | -----------: | -------------: | ---------------: |
| Student        |     89.3 |     76.9 |     77.5 |    55.4 |         67.8 |           75.9 |             92.7 |
| Teacher        |     93.9 |     82.6 |     82.6 |    68.9 |         74.2 |           79.6 |             95.0 |
| **MOPD**       | **94.1** | **84.4** | **83.2** |    66.7 |         73.4 |       **80.3** |         **95.3** |
| MOPD - Teacher |     +0.2 |     +1.8 |     +0.6 |    -2.2 |         -0.8 |           +0.7 |             +0.3 |

这张表支持 MOPD 可以扩展到 309B MoE，并在多数列达到或略超对应教师；但 IFBench 和 SWE-bench Verified 仍分别低 2.2、0.8 点，所以“完全无损继承所有专家”并不成立。

### 3. 后续方法带来了什么

| 方法                                                   | 论文报告的主要结果                                                                              | 稳妥解释                                                                 |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [Nemotron-Cascade 2](https://arxiv.org/abs/2603.19220) | ArenaHard Hard Prompt 71.5→85.5，MOPD 52 步；RLHF 160 步达到 80.7                               | 在该能力恢复设置中，密集教师信号收敛更快；不是通用 3× wall-clock 结论    |
| [CoPD](https://arxiv.org/abs/2604.27083)               | 三类专家 Overall 58.12，静态 MOPD 56.99                                                         | 专家边强化边蒸馏可减轻后期分布距离；提升幅度依赖其多模态评测集合         |
| [PROMPTSD](https://arxiv.org/abs/2607.18293)           | Qwen3-1.7B 四任务平均 56.2，最强单任务基线 53.9                                                 | soft-prompt 教师保持同骨干几何，适合低成本多任务合并                     |
| [REGEN](https://arxiv.org/abs/2607.19450)              | 4×L40S 上训练吞吐 20.19×、单 token latency 5.28×；MATH 比 MOPD +1.1，MBPP/IFEval 分别 -2.1/-1.7 | 大幅降成本且总体接近 MOPD，但在线 token 监督在部分任务仍更强             |
| [UI-MOPD](https://arxiv.org/abs/2607.04425)            | OSWorld 38.2%，MobileWorld 12.0%                                                                | 在论文自己的统一 GUI 设置中优于参数匹配的整合策略；移动端绝对成功率仍低  |
| [SMOPD](https://arxiv.org/abs/2608.03092)              | helpful/harmless 等多奖励设置高于 GDPO                                                          | 先专项优化 reward 再合并是可行方向，但目前证据集中于论文选定的多奖励设置 |

## Ablation 与失败机制

### 1. 最重要的变量不是教师更强，而是教师离学生多远

同源 RL 教师与学生的初始逐 token KL 约为 0.04；把数学教师替换为绝对能力更强、但异源的 Qwen3-235B-A22B 后，初始 KL 约为 0.19。结果如下：

| 数学教师             | Loss            | AIME25 | AIME26 | 汇总分数 |
| -------------------- | --------------- | -----: | -----: | -------: |
| 同源 RL Teacher      | Policy gradient |  51.46 |  65.31 |   0.9373 |
| 同源 RL Teacher      | Top-$k$         |  51.77 |  64.79 |   0.9093 |
| 异源 Qwen3-235B-A22B | Policy gradient |  45.63 |  51.56 |   0.6003 |
| 异源 Qwen3-235B-A22B | Top-$k$         |   0.94 |   0.42 |  -1.1898 |

异源 Top-$k$ 训练约在第 18 步灾难性崩溃。这个控制实验反驳了“教师越强越好”：**教师必须在学生能访问、能理解的行为流形附近提供增量能力。** [Rethinking OPD](https://arxiv.org/abs/2604.13016) 把条件总结为兼容 thinking pattern 与真实 capability gap；[Simple-OPD](https://arxiv.org/abs/2608.06802) 则用 teacher-compatible CoT + LoRA warm-up 先缩小距离。

### 2. Top-$k$ 保留概率质量，不等于保留决策 support

[When Top-K Misses the Decision](https://arxiv.org/abs/2607.07050) 给出直接因果审计：在 Qwen3.5-9B 双教师工具场景中，response 教师 top-32 保留 99.99% 概率质量，却只在 0.4% 的 500 个 prompt 中包含行为切换 token `<tool_call>`；即使 $k=256$，覆盖率也只有 52.2%。

- Vanilla GKD：误调用 14.2%±2.1%，调用 recall 91.5%±1.7%。
- teacher/student top-32 support union：误调用降至 7.4%±0.6%，recall 降至 87.0%±2.0%。
- 把该 token 在所有位置强制补回可把误调用降至 3.7%±0.5%，但 recall 再下降 12.4 点。

因此 support 修复存在 restraint-capability trade-off，不能只看 retained probability mass。对 tool tag、JSON 入口、拒答/作答切换等离散行为，full-vocabulary 或 support-aware Top-$k$ 更安全。

### 3. 多教师梯度会互相抵消

[CaMOPD](https://arxiv.org/abs/2605.27115) 观察到，当用于恢复通用能力的 proxy prompt 与领域保持 prompt 不完全匹配教师原始分布时，直接混合会出现：

- **recovery-preservation counteraction**：恢复与保持梯度方向冲突；
- **weak-signal flattening**：所有样本等权平均，使真正需要修正的样本被稀释。

其方案是交替执行 recovery/preservation 更新，并按平均 teacher-student log-probability gap 选择高需求样本。论文在 role-play 和医疗 QA 设置中取得最好的通用恢复并维持领域行为；但它没有证明该调度在任意领域和模型规模上都最优。

### 4. 专家训练到收敛后再合并，可能已经太晚

[CoPD](https://arxiv.org/abs/2604.27083) 让专家在 RLVR 过程中周期性互相蒸馏，使行为模式持续保持可吸收距离。它优于静态 MOPD 的结果支持“尽早交换能力”，但也增加了专家训练之间的通信和耦合，牺牲了原始 MOPD 完全并行开发的部分优势。

### 5. 共享行为模式决定能否真正合版

[Physics of Multi-Turn Long-Horizon Planning](https://arxiv.org/abs/2607.24720) 在可控长程规划环境中观察到：

- 教师共享兼容 planning pattern 时，MOPD 能收敛到共享模式并跨环境泛化；
- 只有部分共享时，可以持续学习，但整合不完全；
- 行为完全冲突且没有共享模式时，会出现严重灾难性遗忘。

这说明 MOPD 能压缩“互补专家”，但不能凭空消解语义上不可兼容的策略目标。

### 6. Token agreement 本身也可能被骗

[TIDE](https://arxiv.org/abs/2608.09836) 指出学生可能通过重复循环获得局部 token agreement，却生成全局错误答案。它把 mismatch 分成：

- **student-excess**：学生生成、教师近零概率，log-ratio 可能无界；
- **student-deficit**：教师偏好、学生几乎不采样，普通 on-policy 更新看不到。

TIDE 用有界 Hellinger shaping 抑制 excess，再解析注入 teacher top-$K$ 补回 deficit；在强 mismatch 设置中 Avg@8 从 6.9% 提到 20.3%，平均响应长度缩短 3.6×。这是一般 OPD 结果，但直接解释了 MOPD 为什么不能只优化采样 token 上的表面一致性。

## 相关论文地图

### A. 直接提出、修改或诊断 MOPD

| 时间    | 论文                                                                            | 角色                                                 |
| ------- | ------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 2026-01 | [MiMo-V2-Flash](https://arxiv.org/abs/2601.02780)                               | 工业公开起点；MOPD + ORM、迭代 co-evolution          |
| 2026-03 | [Nemotron-Cascade 2](https://arxiv.org/abs/2603.19220)                          | 用跨阶段/多域教师恢复 Cascade RL 中退化能力          |
| 2026-04 | [Co-Evolving Policy Distillation](https://arxiv.org/abs/2604.27083)             | 专家边 RLVR 边互相 OPD，控制分布漂移                 |
| 2026-05 | [CaMOPD](https://arxiv.org/abs/2605.27115)                                      | 解耦冲突更新，按 teacher-student gap 选样本          |
| 2026-06 | [MOPD](https://arxiv.org/abs/2606.30406)                                        | 正式方法、公式、PG/Top-$k$ 实现与同源教师消融        |
| 2026-06 | [DeepSeek-V4](https://arxiv.org/abs/2606.19348)                                 | 10+ 专家、full-vocabulary、缓存与动态调度            |
| 2026-07 | [H-OPD](https://arxiv.org/abs/2607.02592)                                       | 异构多模态教师的 token 级动态仲裁                    |
| 2026-07 | [UI-MOPD](https://arxiv.org/abs/2607.04425)                                     | 桌面/移动 GUI 专家合并                               |
| 2026-07 | [When Top-K Misses the Decision](https://arxiv.org/abs/2607.07050)              | 决策 token 被截断的因果诊断与 support union          |
| 2026-07 | [PROMPTSD](https://arxiv.org/abs/2607.18293)                                    | 用 task soft prompt 构造同骨干多教师                 |
| 2026-07 | [REGEN](https://arxiv.org/abs/2607.19450)                                       | 用专家 RL replay + offline RL 替代在线教师           |
| 2026-07 | [Physics of Multi-Turn Long-Horizon Planning](https://arxiv.org/abs/2607.24720) | 研究共享、部分共享和冲突 planning pattern            |
| 2026-08 | [SMOPD](https://arxiv.org/abs/2608.03092)                                       | 多 reward 先专项训练，再以教师 mixture + anchor 合并 |
| 2026-08 | [LS-MOPD](https://arxiv.org/abs/2608.03610)                                     | 多语言 ASR 的语言路由和 acoustic prefix 设计         |

### B. 明确采用多专家 OPD 的模型/技术报告

- [Baichuan-M3](https://arxiv.org/abs/2602.06570)：Task RL → Offline Policy Distillation → MOPD 的医疗能力整合管线。
- [GLM-5](https://arxiv.org/abs/2602.15763)：用之前 SFT/RL checkpoint 做 cross-stage OPD，恢复早期阶段能力。
- [KAT-Coder-V2](https://arxiv.org/abs/2603.27703) 与 [KAT-Coder-V2.5](https://arxiv.org/abs/2607.05471)：把多个代码与 agent 专家统一到单模型。
- [Kwai Keye-VL-2.0](https://arxiv.org/abs/2606.10651)：视觉语言专家整合。
- [Nemotron 3 Ultra](https://arxiv.org/abs/2606.15007)：大规模 agentic reasoning 后训练中的 OPD 组件。
- [NebulaExp-8B](https://arxiv.org/abs/2606.26671)：在完整后训练消融管线中采用 OPD。
- [Mach-Mind-4-Flash](https://arxiv.org/abs/2607.09375)、[Solar Open 2](https://arxiv.org/abs/2607.20062)、[Motif 3](https://arxiv.org/abs/2608.09119)：在各自统一模型训练中使用同类多专家蒸馏。
- [ORBIT](https://arxiv.org/abs/2601.08310)：按推理预算整合专家，是“多专家统一部署”的邻近变体。

这些报告主要证明 MOPD 已进入工业 post-training recipe；若没有独立对照或组件消融，不能把整套模型的最终 benchmark 成绩归因给 MOPD。

### C. 基础与邻近路线

- **On-policy distillation**：[GKD](https://arxiv.org/abs/2306.13649)、[MiniLLM](https://arxiv.org/abs/2306.08543)、[Rethinking OPD](https://arxiv.org/abs/2604.13016)、[Simple-OPD](https://arxiv.org/abs/2608.06802)、[TIDE](https://arxiv.org/abs/2608.09836)、[OPD Survey](https://arxiv.org/abs/2604.00626)。
- **参数合并**：[Model Soups](https://arxiv.org/abs/2203.05482)、[Task Arithmetic](https://arxiv.org/abs/2212.04089)、[TIES](https://arxiv.org/abs/2306.01708)、[DARE](https://arxiv.org/abs/2311.03099)、[AdaMerging](https://arxiv.org/abs/2310.02575)。
- **行为/知识融合**：[FuseLLM](https://arxiv.org/abs/2401.10491)、[FuseChat](https://arxiv.org/abs/2408.07990)。
- **顺序专家前作**：[Nemotron-Cascade](https://arxiv.org/abs/2512.13607) 先展示 Cascade RL；Nemotron-Cascade 2 才加入 MOPD 做能力恢复。

## Limitations

1. **在线教师成本高**：每条学生 rollout 都要经过匹配教师 prefill；专家很多、序列很长时，教师显存、调度和网络通信可能成为瓶颈。
2. **同源假设很强**：最成功的设置通常从同一 base 分叉训练专家。已有证据明确显示，更强但异源的教师可能更差，甚至让训练崩溃。
3. **路由依赖元数据**：MOPD 默认知道每个 prompt 应交给哪个教师；多能力重叠、未知任务或错误标签下如何路由仍未解决。
4. **Top-$k$ 有行为盲区**：高 retained mass 不能保证关键决策 token 得到反向约束；增大 $k$ 也未必以可接受成本覆盖长尾 support。
5. **多教师冲突仍存在**：prompt 级路由减少同一样本上的教师冲突，却没有消除共享参数更新产生的跨任务干扰。
6. **“超过教师”不等于创造新能力**：部分单项略超教师可能来自共享知识、评测噪声或 ORM；MOPD 的主要作用仍是能力传递与整合。
7. **证据成熟度有限**：大多数相关论文集中在 2026 年，常缺少多随机种子、统一计算预算、长周期稳定性和独立复现。
8. **完全冲突的目标不可直接合并**：若专家没有兼容行为模式，单一学生参数化本身可能无法同时表示所有目标；这时应考虑条件策略、adapter、router 或推理时组合。

## 工程选型

| 场景                               | 优先方案                                      | 原因                                            |
| ---------------------------------- | --------------------------------------------- | ----------------------------------------------- |
| 同底座、多个 RL 专家，追求最高能力 | 主 MOPD；预算允许时 full-vocabulary           | 证据最直接，能利用学生状态上的密集监督          |
| 教师 serving 成本是主要瓶颈        | REGEN                                         | 回收专家 RL buffer，彻底解耦 rollout 与反向训练 |
| 专家已经明显漂移                   | CoPD、Simple-OPD warm-up 或重新从统一学生分叉 | 先恢复可吸收的 thinking-pattern 距离            |
| 通用教师数据未知、prompt 覆盖不全  | CaMOPD                                        | 分离恢复与保持更新，并聚焦高 gap 样本           |
| 多个 reward 互相牵制               | SMOPD                                         | 先让每个 reward 在专项教师中充分优化，再合并    |
| 异构多模态教师                     | H-OPD                                         | 不强制所有 token 固定服从单一同构教师           |
| 工具/JSON/拒答等模式切换           | full-vocabulary 或 support-aware Top-$k$      | 避免遗漏低概率但决定行为分支的 token            |
| 专家目标语义上完全冲突             | 条件化策略、adapter/router 或推理时组合       | 单模型无条件 MOPD 没有可靠保证                  |

## Takeaways

1. **MOPD 的本质是在线策略整合，不是 checkpoint averaging。** 它复用已经训练好的领域专家，却仍需要一次学生 on-policy 训练。
2. **同源性比绝对教师强度更重要。** 默认应从同一学生分叉专家；接入外部教师前先测 token KL、support overlap 和 rollout 行为差异。
3. **先审计路由和 support，再调 loss。** 很多失败不是 reverse-KL 公式本身，而是 prompt 给错教师或关键 token 根本没有进入监督集合。
4. **成本与能力之间存在明确分叉。** full-vocabulary MOPD 信号最完整；Top-$k$ 降通信但可能漏决策；REGEN 最省在线成本但在部分任务损失密集监督收益。
5. **“所有专家合成一个模型”只在存在共享表示时成立。** 对完全冲突能力，应保留显式条件或模块边界，而不是把遗忘归咎于训练没调好。

## 推荐阅读顺序

1. [MOPD 主论文](https://arxiv.org/abs/2606.30406)：先掌握三阶段流程、两种 loss 与同源教师消融。
2. [MiMo-V2-Flash](https://arxiv.org/abs/2601.02780) 与 [DeepSeek-V4](https://arxiv.org/abs/2606.19348)：理解工业规模下的 ORM 混合、full-vocabulary、缓存和调度。
3. [Rethinking OPD](https://arxiv.org/abs/2604.13016) 与 [Simple-OPD](https://arxiv.org/abs/2608.06802)：理解 teacher-student thinking pattern。
4. [When Top-K Misses the Decision](https://arxiv.org/abs/2607.07050) 与 [TIDE](https://arxiv.org/abs/2608.09836)：理解 token support 和 mismatch。
5. 按问题选读 [CoPD](https://arxiv.org/abs/2604.27083)、[CaMOPD](https://arxiv.org/abs/2605.27115)、[REGEN](https://arxiv.org/abs/2607.19450)、[H-OPD](https://arxiv.org/abs/2607.02592) 或 [SMOPD](https://arxiv.org/abs/2608.03092)。

## Citation

```bibtex
@article{ma2026mopd,
  title   = {MOPD: Multi-Teacher On-Policy Distillation for Capability Integration in LLM Post-Training},
  author  = {Ma, Wenhan and Wei, Jianyu and Zhao, Liang and Zhang, Hailin and Xiao, Bangjun and Li, Lei and Yang, Qibin and Gao, Bofei and Wang, Yudong and Li, Rang and Dong, Jinhao and Sui, Zhifang and Luo, Fuli},
  journal = {arXiv preprint arXiv:2606.30406},
  year    = {2026}
}
```

```bibtex
@article{xiaomi2026mimov2flash,
  title   = {MiMo-V2-Flash Technical Report},
  author  = {{Xiaomi LLM-Core Team}},
  journal = {arXiv preprint arXiv:2601.02780},
  year    = {2026}
}
```

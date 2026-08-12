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
> 本页对 **39 篇相关论文逐篇整理 Motivation、Method 和 Results**。总体判断是：MOPD 是目前最有潜力的“训练式能力合版”路线，但不是任意专家之间的通用合并器；真正决定成败的是教师与学生是否同源、prompt 路由是否正确，以及监督 support 是否包含关键决策 token。

## 基本信息与证据口径

- **方法主论文**：[MOPD: Multi-Teacher On-Policy Distillation for Capability Integration in LLM Post-Training](https://arxiv.org/abs/2606.30406)
- **作者**：Wenhan Ma、Jianyu Wei、Liang Zhao、Hailin Zhang、Bangjun Xiao、Lei Li、Qibin Yang、Bofei Gao、Yudong Wang、Rang Li、Jinhao Dong、Zhifang Sui、Fuli Luo
- **版本**：arXiv:2606.30406，2026-06-29
- **工业起点**：[MiMo-V2-Flash Technical Report](https://arxiv.org/abs/2601.02780)，2026-01-06
- **术语**：本文的 MOPD 指 **Multi-Teacher On-Policy Distillation**，即把多个领域或训练阶段专家蒸馏进一个统一学生；它不是本站已有的 [[rl/reward-resemble/modpo|MODPO 多目标偏好优化]]。
- **收录范围**：截至 2026-08-12，收录标题、摘要或正文明确采用、修改或直接分析 MOPD 的工作，并补充最关键的 OPD、知识融合和参数合并基础论文。一般单教师 OPD 不做穷举。
- **比较原则**：下文数字均来自各论文自己的模型、数据和评测协议。大量工作仍是 2026 年新 preprint，**跨论文绝对分数不可直接排名**；没有随机种子或置信区间时，也不把小幅提升写成稳定优势。

## 逐篇 Motivation / Method / Results

下面不再把多篇论文压成一套总论。每篇均单独回答三个问题；其中“无独立消融”表示论文把 MOPD 放在完整训练管线中，但没有提供足以隔离其贡献的对照，不能把最终模型总成绩全部归因给 MOPD。

## A. 直接提出、改进或诊断 MOPD

### 1. [[opd/mopd/mimo-v2-flash|MiMo-V2-Flash Technical Report]]

- **Motivation**：Mixed-RL 中不同领域的奖励密度、难度和训练预算互相牵制；分别训练专家虽然能达到更高峰值，却缺少可靠的统一部署手段。
- **Method**：从统一 SFT 学生分叉训练数学、代码、IF、SWE、Tool Use 等教师；学生生成 on-policy rollout，路由教师给出 token 级 log-ratio advantage，并可叠加 ORM advantage。蒸馏后的学生还能再次分叉为更强教师，形成 co-evolution。
- **Results**：309B 总参数、15B active 的 MiMo-V2-Flash 上，MOPD 相对对应教师在 AIME25/HMMT25/LCB/$\tau^2$-Bench/$\tau^2$-Telecom 分别为 +0.2/+1.8/+0.6/+0.7/+0.3，但 IFBench 和 SWE-bench Verified 仍低 2.2、0.8 点；因此是“多数能力接近或超过教师”，不是完全无损继承。

### 2. [[opd/mopd/nemotron-cascade-2|Nemotron-Cascade 2]]

- **Motivation**：Cascade RL 简化了异构领域训练，却可能在后续阶段损伤早期 checkpoint 已获得的能力，需要比重新做 RLHF 更快的恢复手段。
- **Method**：保存 Cascade RL 各阶段最强 checkpoint，当前学生在目标域自行 rollout，再由匹配的早期/领域教师提供逐 token on-policy distillation 信号；它承担的是跨阶段能力恢复，而非从零训练新技能。
- **Results**：ArenaHard v2 Hard Prompt 从 71.5 提升到 85.5、Creative Writing 从 40.6 到 71.0，只用 52 步；对照 RLHF 训练 160 步达到 80.7/71.2。结果支持更快的更新步数收敛，但论文没有给出同硬件 wall-clock 加速比。

### 3. [[opd/mopd/copd|Co-Evolving Policy Distillation（CoPD）]]

- **Motivation**：静态 MOPD 要等各专家独立训练完再合并，此时专家与学生的 thinking pattern 可能已经漂移太远，教师虽强却难以吸收。
- **Method**：多个分支一边在各自领域做 RLVR，一边周期性双向 OPD；持续知识交换让专家保持在彼此可吸收的距离，最后再做参数合并。三分支时使用 hub-and-spoke，避免全量两两蒸馏。
- **Results**：文本、图像、视频三分支实验的 Overall Avg. 为 58.12，静态 MOPD 为 56.99；双向蒸馏优于单向，持续 co-evolution 优于一次性蒸馏。优势来自其特定多模态设置，不能直接外推到所有语言任务。

### 4. [[opd/mopd/camopd|Counteraction-Aware MOPD（CaMOPD）]]

- **Motivation**：当通用教师的原始后训练数据不可得，只能使用 proxy general prompts 时，恢复通用能力的梯度会与保持领域行为的梯度互相抵消；等权平均还会稀释真正需要修正的样本。
- **Method**：把 general recovery 和 domain preservation 拆成交替更新，并按 teacher-student token log-probability gap 选取高修正需求样本；恢复分支看绝对 gap，保持分支看正向 gap。
- **Results**：在 role-play 与医疗 QA 两套设置中，CaMOPD 都取得最强的通用能力恢复并维持领域能力；医疗表中综合项为 45.00，Vanilla MOPD 为 42.86。梯度分析显示交替训练减少负向 cross-domain gradient dot product，但实验只覆盖两个垂直领域。

### 5. [[opd/mopd/mopd|MOPD: Multi-Teacher On-Policy Distillation]]

- **Motivation**：Mixed-RL 信号稀疏且领域耦合，Off-policy Finetune 有 exposure bias，参数合并又容易干涉；目标是并行开发专家后再统一吸收。
- **Method**：学生在混合 prompt 上 rollout，每个样本路由到对应同源 RL 教师，在学生访问的 prefix 上最小化 reverse KL。论文给出 sampled-token policy-gradient 和带偏差修正的 teacher Top-$k$ 两种实现。
- **Results**：Qwen3-30B-A3B 上归一化分数 0.9373，Mix-RL 为 0.8818；三个领域关闭 91%–95% teacher headroom。同源教师初始 KL 约 0.04；换成更强但异源的 Qwen3-235B 后约 0.19，Top-$k$ 约第 18 步崩溃，是“同源性比教师绝对强度更重要”的直接证据。

### 6. [[opd/mopd/deepseek-v4|DeepSeek-V4]]

- **Motivation**：在十余种 reasoning、agent、code 与通用能力之间做 mixed RL，会稀释每域信号并放大工程复杂度；工业规模还要求避免 full-vocabulary 教师通信成为瓶颈。
- **Method**：分别训练 10+ 专家，以统一模型为学生做 full-vocabulary reverse-KL OPD，并配套教师隐藏状态缓存、动态 teacher 调度和分布式服务；在其管线中 OPD 取代 mixed RL 做能力整合。
- **Results**：报告展示最终模型在长上下文、推理和 agent 评测上的整体能力，但没有给出可将增益只归因于 MOPD 的统一组件消融；可靠结论是 full-vocabulary、多教师缓存与调度在超大规模运行可行，而不是某个 benchmark 提升完全由 MOPD 造成。

### 7. [[opd/mopd/h-opd|H-OPD: Heterogeneous Multi-Teacher Multimodal OPD]]

- **Motivation**：多模态推理中，VL 教师更擅长感知，纯文本教师可能更擅长逻辑；按样本固定选一个教师会浪费同一条轨迹上不同 token 所需的互补能力。
- **Method**：把视觉内容转成文本描述供文本教师访问，并在同一 student trajectory 上按教师置信度做 token 级动态仲裁；监督 support 使用教师 Top-$k$ 的 union 控制成本。
- **Results**：Qwen3-VL-2B 学生上平均分 53.6，单 VL 教师 OPD/ExOPD 为 51.1/51.3；4B 学生平均分从 59.1 提至 61.7。结果表明异构教师可以互补，但验证集中在论文选取的多模态 reasoning benchmarks。

### 8. [[opd/mopd/ui-mopd|UI-MOPD]]

- **Motivation**：桌面与移动 GUI 共享视觉理解和规划能力，但动作语义不同；混合 SFT、Mixed-RL 或权重合并容易把点击、滑动、键盘等平台 convention 平均掉。
- **Method**：构建近 10K 条 Uni-GUI 跨平台轨迹，分别训练 desktop/mobile 教师；学生 rollout 按平台路由教师，并只在 task feedback 不足的低 reward rollout 上启用教师 KL anchor。
- **Results**：OSWorld 和 MobileWorld success rate 分别为 38.2% 与 12.0%，相对 base model 提升 12.7% 与 55.8%，并优于参数匹配的整合策略。移动端绝对成功率仍低，说明统一 GUI agent 远未解决。

### 9. [[opd/mopd/top-k-misses-decision|When Top-K Misses the Decision]]

- **Motivation**：Top-$k$ 保留几乎全部教师概率质量，并不代表保留了决定“调用工具还是直接回答”的低概率分支 token；遗漏后，一个教师能推动进入工具模式，另一个教师却无法提供反向梯度。
- **Method**：在 Qwen3.5-9B 与 Llama-3.1-8B 上审计 teacher support，做 matched restoration、非工具 placebo 与 teacher/student Top-$k$ support union 干预，追踪行为切换 token 与最终误调用的因果关系。
- **Results**：response 教师 Top-32 保留 99.99% 概率质量，却仅在 0.4% prompt 中包含 `<tool_call>`；support union 将 over-call 从 14.2%±2.1% 降到 7.4%±0.6%，但 call recall 从 91.5%±1.7% 降至 87.0%±2.0%，说明修复 support 也存在 restraint-capability trade-off。

### 10. [[opd/mopd/promptsd|PROMPTSD]]

- **Motivation**：全参或 LoRA 教师会相对学生产生 weight drift；把 gold answer 作为 privileged context 又可能诱发 post-hoc rationalization。多任务时需要既有新知识、又与学生表示几何一致的教师。
- **Method**：冻结同一 backbone，只为每个任务训练 soft prompt；按任务把 merged corpus 路由到对应 prompt teacher，学生做 reverse-KL on-policy distillation，推理时丢弃所有 prompt。
- **Results**：Qwen3-1.7B 四任务平均 56.2，最强单任务 OPD(PT) 为 53.9；Math 为 67.2 vs. 51.0。它同时保持通用 benchmark，但 Science/Tool/Biology/Math 四任务规模有限，尚不能证明任意任务组合都成立。

### 11. [[opd/mopd/regen|REGEN]]

- **Motivation**：标准 MOPD 虽把领域 RL 解耦，整合时仍要在线运行多个教师并耦合 rollout 与反向传播，扩展成本高。
- **Method**：回收专家 RL 已经产生的 replay buffer，用 asymmetric trajectory importance sampling 的 offline RL 训练 generalist；不再在线查询教师，把专家 RL 变成可复用的数据合成阶段。
- **Results**：4×L40S 上训练吞吐 20.19×、单 token latency 5.28×；GSM8K/MATH/HumanEval 基本接近或达到 MOPD，MBPP 与 IFEval 分别低 2.1、1.7 点。结论是显著降成本并大体保留能力，而非全面等价于在线 token 监督。

### 12. [[opd/mopd/physics-multi-turn-planning|The Physics of Multi-Turn Long-Horizon Planning]]

- **Motivation**：真实模型的预训练数据不透明，难以区分 MOPD 合并的是通用 planning pattern，还是不可互换的具体 procedural knowledge。
- **Method**：构造可控的多环境长程规划世界，系统改变任务长度、数据质量、planning knowledge 与 pattern overlap，再比较预训练、GRPO、单教师 OPD 和 MOPD。
- **Results**：共享兼容 pattern 时 MOPD 可收敛到共同模式并跨环境泛化；部分共享时支持 continual learning；完全不共享且冲突时发生严重遗忘。论文提供机制性边界，而不是可直接迁移到真实 benchmark 的统一提升数字。

### 13. [[opd/mopd/smopd|SMOPD]]

- **Motivation**：GDPO 虽逐 reward 归一化，仍无法同时处理密集与稀疏信号；把稀疏 reward 权重调高会学会格式，却牺牲准确率。
- **Method**：第一阶段用不同 reward-priority profile 训练 accuracy、format 或 helpful/harmless 专项教师；第二阶段在学生 prefix 上混合教师 Top-$k$ 分布，以 forward KL 蒸馏，并用 balanced GDPO sequence anchor 防止偏离整体任务。
- **Results**：在 Qwen2.5-1.5B 工具任务中，SMOPD format compliance 为 97.5%、综合分 87.1，对照 GDPO 为 8.8%/83.6；在 1.5B、3B、7B 及 helpful-harmless 设置中均优于 GDPO。证据仍局限于两类双 reward 结构。

### 14. [[opd/mopd/ls-mopd|LS-MOPD]]

- **Motivation**：多语言 ASR 的教师既有语言专长差异，也有 acoustic prefix 差异；更强的动态 prefix 教师不一定产生更适合学生吸收的梯度。
- **Method**：训练普通话/中文方言/英语专长教师和 generalist，按输入语言路由并加权多个教师 reverse-KL；同时比较冻结声学侧的 static prefix 与联合更新声学侧的 dynamic prefix。
- **Results**：只用 50K utterances，2.3B 学生最低平均错误率为 4.45%，优于 RL baseline 和 best-teacher oracle 的经验包络；教师阶段 dynamic prefix 略强，但蒸馏后 static prefix 最好，直接支持“兼容性可胜过教师单点强度”。

## B. 明确采用 MOPD 的模型与技术报告

### 15. [[opd/mopd/baichuan-m3|Baichuan-M3]]

- **Motivation**：医疗问诊包含事实知识、长流程咨询和多个专项能力；直接多任务 RL 容易早期优化冲突，单纯离线模仿又无法修正学生自己的错误状态。
- **Method**：三阶段管线：Task-specific RL 训练专项教师；Offline Policy Distillation 先做冷启动压缩；最后在混合领域 rollout 上以 ground-truth task reward 加多教师 reverse-KL 做 MOPD，并允许循环迭代。
- **Results**：最终模型在 HealthBench、HealthBench-Hallu 与 ScanBench 等医疗评测上取得强结果，但论文没有提供只开/关 MOPD 的完整组件消融；因此只能确认该三阶段 recipe 可运行，不能把全部医疗增益归因给 MOPD。

### 16. [[opd/mopd/glm-5|GLM-5]]

- **Motivation**：Reasoning RL、General RL、Agentic RL 顺序执行会累积损伤早期能力，最终 generalist 需要恢复以前阶段的技能。
- **Method**：在多阶段 RL 后加入 cross-stage on-policy distillation，把早期 SFT/Reasoning RL/General RL checkpoint 作为教师，对当前学生 rollout 做能力恢复。
- **Results**：报告称最终 GLM-5 同时保持 reasoning 与 general/agent 能力，但未给出 cross-stage OPD 的独立开关对照；最终整模型 benchmark 不能被解释为 OPD 的单独效果。

### 17. [[opd/mopd/kat-coder-v2|KAT-Coder-V2]]

- **Motivation**：SWE、WebCoding、Terminal、WebSearch 和 General coding 专家的训练环境与反馈差异很大；权重平均会遗忘，标准 RL 的 sequence feedback 又太稀疏。
- **Method**：五个领域分别做 SFT/RL，再让统一学生 rollout，按领域教师提供 token 级 OPD 监督，完成单模型部署。
- **Results**：最终模型报告 Landing Page 59.8、Slides 57.6、Data Visualization 67.6、Terminal-Bench Hard 46.8、$\tau^2$-Bench 93.9，并称保留专家级表现；但没有独立 MOPD vs. no-MOPD 表，不能隔离融合阶段贡献。

### 18. [[opd/mopd/kwai-keye-vl-2|Kwai Keye-VL-2.0]]

- **Motivation**：图像、长视频、纯文本 reasoning 与 agent tool-use 联合后训练会产生 multimodal alignment dilemma，例如 reasoning 变短或工具格式过度出现。
- **Method**：维护 13 个 RL 教师，覆盖 safety、文本数学、IF、code、视觉 STEM、OCR、grounding、counting、video 和 tool use；学生按模态/任务动态路由教师，以 on-policy token feedback 合并进 30B-A3B MoE。
- **Results**：最终模型在长视频与多模态 agent 评测上表现强，并保持通用 reasoning；报告没有把 Cross-Modal MOPD 从 Context-RL、Video-RL、DSA 和数据管线中独立消融，因而只能把它视为完整系统中的能力整合组件。

### 19. [[opd/mopd/nemotron-3-ultra|Nemotron 3 Ultra]]

- **Motivation**：混合越来越多 RLVR 环境会稀释单域 batch 信号；不同 SFT 路径的 agent 教师与学生还可能 reasoning behavior 不兼容。
- **Method**：训练十余个专项教师，先以轻量 SFT warm-up 对齐 student rollout，再做两轮异步 MOPD co-evolution；报告显式分析 warm-up 和 teacher support。
- **Results**：第二轮相对 RLVR 学生在 Terminal-Bench 44.5→54.0、SWE-bench Verified 65.8→71.7、TauBench Telecom 82.7→92.9；GDPVal warm-up 46.7 vs. no-warm-up 35.3。HLE 仅 25.6→26.7，说明学生很少采到教师新 reasoning path 时迁移有限。

### 20. [[opd/mopd/nebulaexp-8b|NebulaExp-8B]]

- **Motivation**：验证 MOPD 是否能作为不依赖 verifier 的后训练方式，并量化教师选择、样本难度和多教师整合，而非只给最终模型总分。
- **Method**：先做 single-teacher OPD 的 IF 实验，再用四个领域教师和 10K 样本做 MOPD；统一比较 SFT、GRPO、OPD 与 MOPD。
- **Results**：4K IF 样本的单教师 OPD 在 IFEval 比 RL baseline 高 3.26 点、总体平均高 4.43；四教师 MOPD 用 10K 样本令统一学生平均比 base 高 4.18，并在部分数学任务超过单教师上界。这是技术报告中较少见的组件级证据。

### 21. [[opd/mopd/kat-coder-v2-5|KAT-Coder-V2.5]]

- **Motivation**：仓库级 SWE 和长程 agent trajectory 会让 student prefix 逐步偏离教师训练分布，纯 on-policy KL 在长上下文后段可能不可靠。
- **Method**：五个专家按领域路由 reverse-KL；先用专家轨迹做 off-policy cold start，再根据 teacher-student drift 动态截断梯度，并按长度分层 batch 保住长样本比例。
- **Results**：最终模型在 PinchBench 获得论文所列最佳 agentic tool-use 结果，并在 repository SWE 上仅次于 Opus 4.8；但报告没有提供完整 no-MOPD 对照，无法把最终名次只归因于 cold start、drift truncation 或 MOPD。

### 22. [[opd/mopd/mach-mind-4-flash|Mach-Mind-4-Flash]]

- **Motivation**：Reasoning、General、Agent 专家用 mixed-reward RL 会出现 see-saw；生产系统还需要动态接入教师而不改训练核心。
- **Method**：动态多教师调度 + routed reverse-KL，把三个 RL track 的教师融合；训练系统统一 RL/OPD loss，并在融合后用 HMPO 单独压缩 token 长度。
- **Results**：MOPD 后 LiveCodeBench-V6 80.12 vs. 专家 80.23；IFBench 82.92 vs. 专家 82.65；SWE-bench Verified 71.10 vs. 专家 73.80；ClawEval 70.35 vs. 专家 67.23。移除 reasoning teacher 会令 reasoning benchmark 下降 2%–4%，展示了保留、损失与正迁移同时存在。

### 23. [[opd/mopd/solar-open-2|Solar Open 2]]

- **Motivation**：12 个 agent scenario 的专项教师需要合并到一个 250B 模型；离线教师 trace 会产生 exposure bias，而 full-vocabulary MOPD 在该规模又有服务成本。
- **Method**：每个 prompt 固定路由一个教师，在学生 rollout 上计算全词表 reverse-KL；用完全异步基础设施、teacher batching、通信与内存优化扩展到 12 教师和 250B。
- **Results**：最终 Solar Open 2 在 MMLU-Pro、LiveCodeBench 与 APEX-Agents 等评测上领先同量级开放模型，训练 KL 稳定下降且 entropy 未坍缩；但报告没有 MOPD 开关消融，系统总成绩不能作为独立因果证据。

### 24. [[opd/mopd/motif-3|Motif 3]]

- **Motivation**：reasoning、coding、tool use、专业工作、长上下文、拒答校准和 IF 的专项优化需要统一，同时不能破坏 MoE router 与 MTP speculative decoding。
- **Method**：从 general SFT 分叉六个 GRPO 教师和一个 SWE SFT 教师；学生按域 on-policy 蒸馏。教师训练和 MOPD 期间冻结 MTP、MoE router 与 expert-selection bias。
- **Results**：最终 314B/13.2B-active 模型在广泛评测上具有竞争力，且冻结的 MTP draft-token acceptance rate 未测到退化；没有 no-MOPD 组件对照，因此可靠结果主要是“七教师整合与固定路由/MTP 可以共同训练”。

### 25. [[opd/mopd/orbit|ORBIT]]

- **Motivation**：低、中、高、超高 reasoning effort 对应不同 accuracy-compute Pareto 点；分别部署多个 policy 成本高，直接混合又会丢失 mode control。
- **Method**：先用多阶段 RL 探索不同预算下的 frontier policy，再做 mode-aware parameter merge 初始化和 multi-teacher OPD，把各预算行为压进一个带 mode 控制的学生。
- **Results**：在 AIME24 的对齐样本预算比较中，on-policy fusion 略高于 offline distillation，并保持多档 reasoning 模式；论文把 merge 和 OPD 作为组合，未完全分离两者贡献。

## C. 解释 MOPD 成败的 OPD 与合并基础工作

### 26. [[opd/mopd/gkd|GKD: On-Policy Distillation of Language Models]]

- **Motivation**：传统 KD 只在固定教师序列上训练，autoregressive 学生推理时会进入未见过的错误 prefix，产生 exposure bias。
- **Method**：让学生生成部分或全部训练序列，再由教师在这些 student-generated states 上提供 token distribution；可选择不同 divergence，并能与 RLHF 联合。
- **Results**：在摘要、翻译、算术 reasoning 与 instruction tuning 上优于离线 KD 基线，并显示 on-policy 比例可控制质量与计算成本；它是 MOPD 的单教师算法基础，不研究多教师冲突。

### 27. [[opd/mopd/minillm|MiniLLM]]

- **Motivation**：forward KL 容易让容量较小的生成模型过度覆盖教师低概率区域，且固定教师输出仍有训练-推理分布差异。
- **Method**：改用 mode-seeking reverse KL，并推导在学生生成序列上的 policy-gradient 优化，同时加入单步分解、teacher-mixed sampling 和长度归一化稳定训练。
- **Results**：120M–13B 多种学生在 instruction following 上相对标准 KD 获得更精确回答、更好 calibration 与长文本生成；它支持 reverse-KL on-policy 设计，但目标主要是模型压缩而非能力合版。

### 28. [[opd/mopd/rethinking-opd|Rethinking On-Policy Distillation]]

- **Motivation**：OPD 有时成功、有时即使教师更强也失败，现有解释无法区分“分数更高”与“对学生真的有新能力”。
- **Method**：用 weak-to-strong reverse distillation、token overlap 和训练动态分析教师-学生 thinking pattern；提出 off-policy cold start 与 teacher-aligned prompt selection 两个修复策略。
- **Results**：成功 OPD 的共享高概率 token 集中约 97%–99% 概率质量；同家族 1.5B/7B 教师从学生视角可能几乎不可区分。论文验证 compatible pattern 与真实 capability gap 缺一不可，直接解释 MOPD 的同源教师边界。

### 29. [[opd/mopd/simple-opd|Simple-OPD]]

- **Motivation**：OPD 对 warm-up 极敏感，但 warm-up 到底在传正确答案、领域知识还是教师的思考形式并不清楚。
- **Method**：分别控制 CoT 来源、答案正确性、LoRA/全参训练和 warm-up 时长；据此提出用 teacher-generated CoT 做近饱和 LoRA warm-up，再进入 OPD。
- **Results**：与教师兼容的 CoT 是关键，即使答案错误也可提供与正确 rollout 相近的 warm-up 收益；LoRA 近饱和比全参 SFT 更平衡域内适配与 OOD 泛化。它给异源/远距离 MOPD 提供了可操作的初始化方案。

### 30. [[opd/mopd/tide-mismatch-matters|TIDE: Mismatch Matters]]

- **Motivation**：学生可以靠重复循环获得局部 token agreement，却生成全局错误答案；仅监督采样 token 还会遗漏教师偏好但学生从不采样的 deficit token。
- **Method**：区分 student-excess 与 student-deficit；用 bounded Hellinger shaping 抑制近零教师概率的 excess，并解析注入 teacher Top-$K$ 恢复 deficit mass。
- **Results**：强 teacher-student mismatch 下 Avg@8 从 6.9% 提至 20.3%，平均响应长度缩短 3.6×并减少格式失败。虽然是单教师 OPD，机制直接适用于 MOPD 的 token support 诊断。

### 31. [[opd/mopd/opd-survey|A Survey of On-Policy Distillation for LLMs]]

- **Motivation**：OPD 研究散落在 KD、RLHF 和 imitation learning，术语、divergence、信号来源与稳定化方法缺少统一框架。
- **Method**：把 OPD 形式化为学生轨迹上的 $f$-divergence 优化，按“优化什么、信号来自哪里、怎样稳定”三条轴整理文献，并连接 KL-constrained RL。
- **Results**：这是综述，不提出新训练结果；价值是汇总 exposure bias、teacher-student mismatch、长程成本等已知边界。不能把它当作 MOPD 专门综述或效果证据。

### 32. [[opd/mopd/model-soups|Model Soups]]

- **Motivation**：同一预训练模型用不同超参数微调后，选单一最佳 checkpoint 会浪费其他模型落在低误差 basin 中的信息。
- **Method**：对多个 fine-tuned checkpoint 做 uniform 或 greedy weight averaging，不增加推理成本。
- **Results**：在 ImageNet 等视觉任务上通常提高 accuracy 与分布外鲁棒性；但它要求权重空间可线性连接，无法在 student-visited states 上修正行为，是 MOPD 的参数合并对照而非 OPD 前作。

### 33. [[opd/mopd/task-arithmetic|Task Arithmetic]]

- **Motivation**：希望无需重新训练，就能组合或移除 fine-tuned 模型中的任务行为。
- **Method**：用 fine-tuned 权重减 base 权重得到 task vector，再对这些向量做加、减和缩放。
- **Results**：在多模型、多模态任务上展示任务向量可组合、取反和类比迁移；效果依赖向量干涉与缩放系数，主 MOPD 实验中 Task Arithmetic 汇总 0.8574，仍低于 MOPD 0.9373。

### 34. [[opd/mopd/ties-merging|TIES-Merging]]

- **Motivation**：Task Arithmetic 会同时受到大量冗余小更新和不同任务 delta 符号冲突影响。
- **Method**：Trim 小幅参数变化、Elect 每个坐标的主导符号，再只 Merge 与该符号一致的 delta。
- **Results**：在多任务、模型、模态设置中优于当时参数合并基线；它解决参数坐标冲突，却仍不观察学生实际生成状态，因此不能处理 exposure bias 或教师 support 缺失。

### 35. [[opd/mopd/dare|DARE]]

- **Motivation**：fine-tuning delta 高度冗余，直接叠加多个完整 delta 会增加干涉。
- **Method**：随机丢弃大部分 delta 参数，再按 $1/(1-p)$ 重缩放，作为其他 merge 方法的稀疏化插件。
- **Results**：论文报告可去掉 90% 甚至 99% delta 而基本保持单任务能力，并能合并多个同源模型；它极便宜，但成功依赖 homologous models，无法提供 MOPD 的在线纠错信号。

### 36. [[opd/mopd/adamerging|AdaMerging]]

- **Motivation**：固定 task-vector 系数不能适配任务相关性、层差异和分布漂移。
- **Method**：在无标签测试样本上最小化 entropy，自动学习 task-wise 或 layer-wise merge coefficient。
- **Results**：八任务实验相对当时 Task Arithmetic 报告约 11% 提升，并改善未见任务与 distribution shift；代价是需要目标分布数据和优化 merge 系数，仍属于权重空间整合。

### 37. [[opd/mopd/fusellm|FuseLLM]]

- **Motivation**：不同架构 LLM 不能直接平均权重，但它们的输出分布包含互补知识。
- **Method**：对齐不同 tokenizer 的 token distribution，把多个 source LLM 的生成分布融合为目标，再轻量训练一个 target LLM。
- **Results**：Llama-2、MPT、OpenLLaMA 来源模型的融合在 reasoning、commonsense 和 code 上提高目标模型表现；它证明异构行为分布可融合，但主要使用离线文本而非学生 on-policy trajectory。

### 38. [[opd/mopd/fusechat|FuseChat]]

- **Motivation**：多个 chat model 结构、规模和 tokenizer 不同，单纯权重合并不可行；全部在线蒸馏又成本高。
- **Method**：先用 token alignment 把异构 source chat model 两两蒸馏到同结构 target，再按 fine-tuning update magnitude 学习 merge coefficient 做参数融合。
- **Results**：FuseChat-7B 在 AlpacaEval 2.0、MT-Bench 上优于同规模基线，并接近更大的 Mixtral-8x7B 与 GPT-3.5-Turbo-1106；这是“先行为对齐、再参数合并”的邻近路线，不是 on-policy MOPD。

### 39. [[opd/mopd/nemotron-cascade|Nemotron-Cascade]]

- **Motivation**：多领域 prompt 的长度、验证延迟和 reward 特性差异大，混合 RL 基础设施复杂且 curriculum 难调。
- **Method**：按领域顺序执行 Cascade RL，并用阶段安排控制 reasoning、code、alignment 等训练；第一版尚未使用 MOPD。
- **Results**：14B 模型在 LiveCodeBench 等代码评测上超过其 DeepSeek-R1-0528 SFT teacher，并取得竞赛级结果；但顺序训练仍有能力回退风险，正是 Nemotron-Cascade 2 加入多域 OPD 的动机。

## 横向综合：共同 Motivation

### 为什么需要“合版”

现代 LLM 后训练经常把数学、代码、指令遵循、工具调用和 agent 能力拆开训练。每个领域独立做 RL/SFT 容易得到峰值更高的专家，但最终部署通常只能保留一个模型。几种直观合并方案都有结构性缺陷：

1. **Mixed-RL**：在一次 RL 中混合所有任务，稀疏 sequence reward 的尺度、验证成本和难度不同，领域之间会争夺 batch 与梯度预算。
2. **Cascade RL**：按领域顺序训练，后面的阶段可能覆盖前面已经得到的能力；训练顺序变成额外超参数。
3. **Off-policy finetuning**：只模仿教师预先生成的“正确轨迹”，学生测试时一旦走到教师数据没有覆盖的状态，错误会累积。
4. **Parameter merge**：平均权重或 task vector 很便宜，但专家漂移方向可能冲突；能否成功高度依赖 merge recipe。
5. **重新做多域 RL**：已经为专家支付过的专项 RL 计算没有被充分复用，而且工程上再次耦合所有领域。

MOPD 的问题设定因此是：**能否让每个领域团队并行训练自己的最强专家，再以一次统一训练把这些能力吸收到同一个学生中，同时避免离线模仿的 exposure bias？**

### 为什么必须是 on-policy

学生在推理时访问的是自己造成的状态分布，而非教师的完美前缀。MOPD 先让学生生成，再让对应教师评价学生实际走过的每一步，因此教师提供的是“如何修正学生当前行为”的密集信号，而不只是一个最终正确/错误 reward。这继承了 [[opd/mopd/gkd|GKD]] 和 [[opd/mopd/minillm|MiniLLM]] 的核心思想，但把单教师蒸馏扩展成 prompt-routed 多教师能力整合。

## 横向综合：MOPD Method

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

[[opd/mopd/mimo-v2-flash|MiMo-V2-Flash]] 还把 MOPD token advantage 与 outcome reward 合并：

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
- 同域 prompt 可动态 batch 到对应教师；[[opd/mopd/deepseek-v4|DeepSeek-V4]] 进一步使用隐藏状态缓存和动态 teacher 调度，并支持 full-vocabulary OPD。
- 多轮 co-evolution 可以把第一次 MOPD 学生作为新底座，再分别训练更强专家并进行下一轮整合。
- Top-$k$ 能显著减小通信，但它压缩的是概率质量，不保证保留行为决策所需的 support；工具调用等模式切换任务必须额外审计。

## 横向综合：Experimental Setup

### 方法主论文

- **模型**：Qwen3-30B-A3B；工业验证使用 309B 总参数、15B active 的 MiMo-V2-Flash。
- **教师来源**：默认教师均从学生同一 checkpoint 分别做领域 RL，因而结构与初始分布相近。
- **领域**：Qwen3 实验覆盖 Math、Instruction Following、Software Engineering；MiMo 扩展到 Math、Code、IF、SWE、Tool Use。
- **评测**：AIME25、AIME26、IFBench、IFEval、SWE-bench Verified；MiMo 还报告 HMMT25、LiveCodeBench、$\tau^2$-Bench 和 $\tau^2$-Telecom。
- **基线**：Mix-RL、Cascade RL、Off-Policy Finetune、参数平均、Task Arithmetic，以及每域 RL Teacher 上界。
- **汇总指标**：由于不同领域的 teacher headroom 差异很大，作者先按“学生到对应教师”的能力差距归一化，再做跨域汇总；1.0 表示平均达到领域教师水平。
- **关键控制实验**：固定数据和超参数，比较 policy-gradient 与 $k=64$ Top-$k$；再把同源数学教师替换成更强但异源的 Qwen3-235B-A22B。

### 后续工作覆盖的设置

| 工作                                   | 主要设置              | 它回答的问题                              |
| -------------------------------------- | --------------------- | ----------------------------------------- | ------------------------------------------------- |
| [[opd/mopd/copd                        | CoPD]]                | 文本、图像、视频专家共同演化              | 能否在专家尚未漂移过远时持续互相吸收              |
| [[opd/mopd/camopd                      | CaMOPD]]              | role-play 与医疗 QA；通用教师训练数据未知 | prompt 覆盖不完整时如何恢复通用能力并保护领域行为 |
| [[opd/mopd/regen                       | REGEN]]               | Qwen2.5-1.5B；数学、代码、指令遵循        | 能否回收专家 RL buffer，避免在线教师成本          |
| [[opd/mopd/promptsd                    | PROMPTSD]]            | Qwen3-1.7B-Base、Phi-4-mini；四任务       | 能否用同骨干 soft prompt 构造天然同源教师         |
| [[opd/mopd/ui-mopd                     | UI-MOPD]]             | 近 10K 桌面/移动交互轨迹                  | 能否保留平台特有动作语义而非平均行为              |
| [[opd/mopd/ls-mopd                     | LS-MOPD]]             | 普通话、粤语、英语 ASR                    | 语言教师路由及 acoustic prefix 是否应共享         |
| [[opd/mopd/top-k-misses-decision       | Top-K Decision]]      | Qwen3.5-9B、Llama-3.1-8B 工具调用         | 高概率质量是否等于覆盖关键行为决策                |
| [[opd/mopd/physics-multi-turn-planning | Physics of Planning]] | 可控多环境长程规划                        | 多教师何时共享模式、何时灾难性遗忘                |

## 横向综合：Results

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

| 方法                          | 论文报告的主要结果   | 稳妥解释                                                                                        |
| ----------------------------- | -------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [[opd/mopd/nemotron-cascade-2 | Nemotron-Cascade 2]] | ArenaHard Hard Prompt 71.5→85.5，MOPD 52 步；RLHF 160 步达到 80.7                               | 在该能力恢复设置中，密集教师信号收敛更快；不是通用 3× wall-clock 结论    |
| [[opd/mopd/copd               | CoPD]]               | 三类专家 Overall 58.12，静态 MOPD 56.99                                                         | 专家边强化边蒸馏可减轻后期分布距离；提升幅度依赖其多模态评测集合         |
| [[opd/mopd/promptsd           | PROMPTSD]]           | Qwen3-1.7B 四任务平均 56.2，最强单任务基线 53.9                                                 | soft-prompt 教师保持同骨干几何，适合低成本多任务合并                     |
| [[opd/mopd/regen              | REGEN]]              | 4×L40S 上训练吞吐 20.19×、单 token latency 5.28×；MATH 比 MOPD +1.1，MBPP/IFEval 分别 -2.1/-1.7 | 大幅降成本且总体接近 MOPD，但在线 token 监督在部分任务仍更强             |
| [[opd/mopd/ui-mopd            | UI-MOPD]]            | OSWorld 38.2%，MobileWorld 12.0%                                                                | 在论文自己的统一 GUI 设置中优于参数匹配的整合策略；移动端绝对成功率仍低  |
| [[opd/mopd/smopd              | SMOPD]]              | helpful/harmless 等多奖励设置高于 GDPO                                                          | 先专项优化 reward 再合并是可行方向，但目前证据集中于论文选定的多奖励设置 |

## Ablation 与失败机制

### 1. 最重要的变量不是教师更强，而是教师离学生多远

同源 RL 教师与学生的初始逐 token KL 约为 0.04；把数学教师替换为绝对能力更强、但异源的 Qwen3-235B-A22B 后，初始 KL 约为 0.19。结果如下：

| 数学教师             | Loss            | AIME25 | AIME26 | 汇总分数 |
| -------------------- | --------------- | -----: | -----: | -------: |
| 同源 RL Teacher      | Policy gradient |  51.46 |  65.31 |   0.9373 |
| 同源 RL Teacher      | Top-$k$         |  51.77 |  64.79 |   0.9093 |
| 异源 Qwen3-235B-A22B | Policy gradient |  45.63 |  51.56 |   0.6003 |
| 异源 Qwen3-235B-A22B | Top-$k$         |   0.94 |   0.42 |  -1.1898 |

异源 Top-$k$ 训练约在第 18 步灾难性崩溃。这个控制实验反驳了“教师越强越好”：**教师必须在学生能访问、能理解的行为流形附近提供增量能力。** [[opd/mopd/rethinking-opd|Rethinking OPD]] 把条件总结为兼容 thinking pattern 与真实 capability gap；[[opd/mopd/simple-opd|Simple-OPD]] 则用 teacher-compatible CoT + LoRA warm-up 先缩小距离。

### 2. Top-$k$ 保留概率质量，不等于保留决策 support

[[opd/mopd/top-k-misses-decision|When Top-K Misses the Decision]] 给出直接因果审计：在 Qwen3.5-9B 双教师工具场景中，response 教师 top-32 保留 99.99% 概率质量，却只在 0.4% 的 500 个 prompt 中包含行为切换 token `<tool_call>`；即使 $k=256$，覆盖率也只有 52.2%。

- Vanilla GKD：误调用 14.2%±2.1%，调用 recall 91.5%±1.7%。
- teacher/student top-32 support union：误调用降至 7.4%±0.6%，recall 降至 87.0%±2.0%。
- 把该 token 在所有位置强制补回可把误调用降至 3.7%±0.5%，但 recall 再下降 12.4 点。

因此 support 修复存在 restraint-capability trade-off，不能只看 retained probability mass。对 tool tag、JSON 入口、拒答/作答切换等离散行为，full-vocabulary 或 support-aware Top-$k$ 更安全。

### 3. 多教师梯度会互相抵消

[[opd/mopd/camopd|CaMOPD]] 观察到，当用于恢复通用能力的 proxy prompt 与领域保持 prompt 不完全匹配教师原始分布时，直接混合会出现：

- **recovery-preservation counteraction**：恢复与保持梯度方向冲突；
- **weak-signal flattening**：所有样本等权平均，使真正需要修正的样本被稀释。

其方案是交替执行 recovery/preservation 更新，并按平均 teacher-student log-probability gap 选择高需求样本。论文在 role-play 和医疗 QA 设置中取得最好的通用恢复并维持领域行为；但它没有证明该调度在任意领域和模型规模上都最优。

### 4. 专家训练到收敛后再合并，可能已经太晚

[[opd/mopd/copd|CoPD]] 让专家在 RLVR 过程中周期性互相蒸馏，使行为模式持续保持可吸收距离。它优于静态 MOPD 的结果支持“尽早交换能力”，但也增加了专家训练之间的通信和耦合，牺牲了原始 MOPD 完全并行开发的部分优势。

### 5. 共享行为模式决定能否真正合版

[[opd/mopd/physics-multi-turn-planning|Physics of Multi-Turn Long-Horizon Planning]] 在可控长程规划环境中观察到：

- 教师共享兼容 planning pattern 时，MOPD 能收敛到共享模式并跨环境泛化；
- 只有部分共享时，可以持续学习，但整合不完全；
- 行为完全冲突且没有共享模式时，会出现严重灾难性遗忘。

这说明 MOPD 能压缩“互补专家”，但不能凭空消解语义上不可兼容的策略目标。

### 6. Token agreement 本身也可能被骗

[[opd/mopd/tide-mismatch-matters|TIDE]] 指出学生可能通过重复循环获得局部 token agreement，却生成全局错误答案。它把 mismatch 分成：

- **student-excess**：学生生成、教师近零概率，log-ratio 可能无界；
- **student-deficit**：教师偏好、学生几乎不采样，普通 on-policy 更新看不到。

TIDE 用有界 Hellinger shaping 抑制 excess，再解析注入 teacher top-$K$ 补回 deficit；在强 mismatch 设置中 Avg@8 从 6.9% 提到 20.3%，平均响应长度缩短 3.6×。这是一般 OPD 结果，但直接解释了 MOPD 为什么不能只优化采样 token 上的表面一致性。

## 快速论文索引

### A. 直接提出、修改或诊断 MOPD

| 时间    | 论文                                   | 角色                                          |
| ------- | -------------------------------------- | --------------------------------------------- | ---------------------------------------------------- |
| 2026-01 | [[opd/mopd/mimo-v2-flash               | MiMo-V2-Flash]]                               | 工业公开起点；MOPD + ORM、迭代 co-evolution          |
| 2026-03 | [[opd/mopd/nemotron-cascade-2          | Nemotron-Cascade 2]]                          | 用跨阶段/多域教师恢复 Cascade RL 中退化能力          |
| 2026-04 | [[opd/mopd/copd                        | Co-Evolving Policy Distillation]]             | 专家边 RLVR 边互相 OPD，控制分布漂移                 |
| 2026-05 | [[opd/mopd/camopd                      | CaMOPD]]                                      | 解耦冲突更新，按 teacher-student gap 选样本          |
| 2026-06 | [[opd/mopd/mopd                        | MOPD]]                                        | 正式方法、公式、PG/Top-$k$ 实现与同源教师消融        |
| 2026-06 | [[opd/mopd/deepseek-v4                 | DeepSeek-V4]]                                 | 10+ 专家、full-vocabulary、缓存与动态调度            |
| 2026-07 | [[opd/mopd/h-opd                       | H-OPD]]                                       | 异构多模态教师的 token 级动态仲裁                    |
| 2026-07 | [[opd/mopd/ui-mopd                     | UI-MOPD]]                                     | 桌面/移动 GUI 专家合并                               |
| 2026-07 | [[opd/mopd/top-k-misses-decision       | When Top-K Misses the Decision]]              | 决策 token 被截断的因果诊断与 support union          |
| 2026-07 | [[opd/mopd/promptsd                    | PROMPTSD]]                                    | 用 task soft prompt 构造同骨干多教师                 |
| 2026-07 | [[opd/mopd/regen                       | REGEN]]                                       | 用专家 RL replay + offline RL 替代在线教师           |
| 2026-07 | [[opd/mopd/physics-multi-turn-planning | Physics of Multi-Turn Long-Horizon Planning]] | 研究共享、部分共享和冲突 planning pattern            |
| 2026-08 | [[opd/mopd/smopd                       | SMOPD]]                                       | 多 reward 先专项训练，再以教师 mixture + anchor 合并 |
| 2026-08 | [[opd/mopd/ls-mopd                     | LS-MOPD]]                                     | 多语言 ASR 的语言路由和 acoustic prefix 设计         |

### B. 明确采用多专家 OPD 的模型/技术报告

- [[opd/mopd/baichuan-m3|Baichuan-M3]]：Task RL → Offline Policy Distillation → MOPD 的医疗能力整合管线。
- [[opd/mopd/glm-5|GLM-5]]：用之前 SFT/RL checkpoint 做 cross-stage OPD，恢复早期阶段能力。
- [[opd/mopd/kat-coder-v2|KAT-Coder-V2]] 与 [[opd/mopd/kat-coder-v2-5|KAT-Coder-V2.5]]：把多个代码与 agent 专家统一到单模型。
- [[opd/mopd/kwai-keye-vl-2|Kwai Keye-VL-2.0]]：视觉语言专家整合。
- [[opd/mopd/nemotron-3-ultra|Nemotron 3 Ultra]]：大规模 agentic reasoning 后训练中的 OPD 组件。
- [[opd/mopd/nebulaexp-8b|NebulaExp-8B]]：在完整后训练消融管线中采用 OPD。
- [[opd/mopd/mach-mind-4-flash|Mach-Mind-4-Flash]]、[[opd/mopd/solar-open-2|Solar Open 2]]、[[opd/mopd/motif-3|Motif 3]]：在各自统一模型训练中使用同类多专家蒸馏。
- [[opd/mopd/orbit|ORBIT]]：按推理预算整合专家，是“多专家统一部署”的邻近变体。

这些报告主要证明 MOPD 已进入工业 post-training recipe；若没有独立对照或组件消融，不能把整套模型的最终 benchmark 成绩归因给 MOPD。

### C. 基础与邻近路线

- **On-policy distillation**：[[opd/mopd/gkd|GKD]]、[[opd/mopd/minillm|MiniLLM]]、[[opd/mopd/rethinking-opd|Rethinking OPD]]、[[opd/mopd/simple-opd|Simple-OPD]]、[[opd/mopd/tide-mismatch-matters|TIDE]]、[[opd/mopd/opd-survey|OPD Survey]]。
- **参数合并**：[[opd/mopd/model-soups|Model Soups]]、[[opd/mopd/task-arithmetic|Task Arithmetic]]、[[opd/mopd/ties-merging|TIES]]、[[opd/mopd/dare|DARE]]、[[opd/mopd/adamerging|AdaMerging]]。
- **行为/知识融合**：[[opd/mopd/fusellm|FuseLLM]]、[[opd/mopd/fusechat|FuseChat]]。
- **顺序专家前作**：[[opd/mopd/nemotron-cascade|Nemotron-Cascade]] 先展示 Cascade RL；Nemotron-Cascade 2 才加入 MOPD 做能力恢复。

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

1. [[opd/mopd/mopd|MOPD 主论文]]：先掌握三阶段流程、两种 loss 与同源教师消融。
2. [[opd/mopd/mimo-v2-flash|MiMo-V2-Flash]] 与 [[opd/mopd/deepseek-v4|DeepSeek-V4]]：理解工业规模下的 ORM 混合、full-vocabulary、缓存和调度。
3. [[opd/mopd/rethinking-opd|Rethinking OPD]] 与 [[opd/mopd/simple-opd|Simple-OPD]]：理解 teacher-student thinking pattern。
4. [[opd/mopd/top-k-misses-decision|When Top-K Misses the Decision]] 与 [[opd/mopd/tide-mismatch-matters|TIDE]]：理解 token support 和 mismatch。
5. 按问题选读 [[opd/mopd/copd|CoPD]]、[[opd/mopd/camopd|CaMOPD]]、[[opd/mopd/regen|REGEN]]、[[opd/mopd/h-opd|H-OPD]] 或 [[opd/mopd/smopd|SMOPD]]。

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

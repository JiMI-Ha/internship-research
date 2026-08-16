import { FullSlug, resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

export const recommendationCriteria = [
  {
    key: "rewardComposition",
    shortLabel: "Reward 组合",
    label: "Reward Resemble / 组合集成",
    description: "直接组合、拆分、条件化或集成多路 reward、RM、评分项或目标策略。",
  },
  {
    key: "positiveNegative",
    shortLabel: "加分 / 减分",
    label: "显式加分项 / 减分项",
    description: "显式使用正负规则、reward/cost、bonus/penalty 或反补偿项。",
  },
  {
    key: "scale",
    shortLabel: "量纲 / 尺度",
    label: "量纲、尺度与归一化",
    description: "直接处理 reward、loss 或 gradient 的尺度、归一化、校准或尺度不变性。",
  },
  {
    key: "gradientConflict",
    shortLabel: "梯度冲突",
    label: "梯度冲突",
    description: "显式分析或修改相冲突的目标梯度；只提目标冲突不计分。",
  },
] as const

export const experienceReplayCriteria = [
  {
    key: "supervisedData",
    shortLabel: "SFT / DPO 数据",
    label: "SFT / DPO / 专家示范混入 RL",
    description: "监督、偏好、蒸馏或专家示范数据进入 RL batch，或与 RL 更新交错执行。",
  },
  {
    key: "replayBuffer",
    shortLabel: "Replay Buffer",
    label: "Replay buffer / 历史轨迹缓存",
    description: "显式保存并再次使用历史 rollout、prefix、中间状态、解答或失败经验。",
  },
  {
    key: "offPolicyMitigation",
    shortLabel: "Off-policy 缓解",
    label: "显式缓解 Off-policy",
    description: "用校正、限龄、重写、动态权重或专用目标处理 policy gap / stale data。",
  },
] as const

export const gamingStoryCriteria = [
  {
    key: "dynamicNarrative",
    shortLabel: "动态叙事",
    label: "动态叙事 / Drama Management",
    description: "显式处理玩家行为导致的剧情分支、节奏控制、叙事目标或事件调度。",
  },
  {
    key: "privateAgents",
    shortLabel: "角色 / 私密状态",
    label: "角色 Agent 与私密状态",
    description: "角色拥有独立目标、记忆、计划、视角、受限信息或可控角色交互。",
  },
  {
    key: "consistencySolvability",
    shortLabel: "一致性 / 可解性",
    label: "一致性与可解性",
    description: "显式处理世界状态、因果、线索依赖、规划约束、角色意图或可验证性。",
  },
  {
    key: "orchestrationEvaluation",
    shortLabel: "编排 / 评测",
    label: "工程编排与评测",
    description: "提供可复用系统框架、数据 / benchmark、评测方法或工程化工作流。",
  },
] as const

export const gamingLanguageCriteria = [
  {
    key: "sharedSymbols",
    shortLabel: "共享符号",
    label: "共享符号 / 惯例形成",
    description: "直接解释陌生互动者如何共同创造、简化、学习或传递符号系统。",
  },
  {
    key: "memeIdentity",
    shortLabel: "梗 / 圈层",
    label: "梗、概念与圈层边界",
    description: "直接讨论模板复用、变体、迷因素养、身份建构、文化资本或 insider / outsider 边界。",
  },
  {
    key: "ritualCooperation",
    shortLabel: "仪式 / 合作",
    label: "仪式、同步与合作",
    description: "直接检验或综合重复、共同目标、同步活动、社会联结、信任或合作。",
  },
  {
    key: "gameDesignEvidence",
    shortLabel: "游戏设计证据",
    label: "可转化的游戏设计证据",
    description:
      "提供可复用的任务范式、可观测变量、设计框架或对照条件，可用于游戏原型和 A/B 测试。",
  },
] as const

export type RecommendationCriterionKey = string
export type RecommendationEvidence = Partial<Record<RecommendationCriterionKey, string>>

type RecommendationCriterion = {
  key: string
  shortLabel: string
  label: string
  description: string
}

type PaperRecommendationOptions = {
  topic?: "reward-resemble" | "experience-replay" | "gaming-story" | "gaming-language"
}

export type Recommendation = {
  evidence: RecommendationEvidence
  hits: Record<RecommendationCriterionKey, boolean>
  total: number
}

// 只记录论文方法直接命中的项目。目录标签或背景讨论本身不计分。
export const paperRecommendationEvidence: Record<string, RecommendationEvidence> = {
  ares: {
    rewardComposition: "把多条带权 rubric 的逐项判分聚合成训练 reward。",
  },
  "armorm-moe": {
    rewardComposition: "预测 19 个 reward 维度，再用 prompt-conditioned gate 动态标量化。",
  },
  beavertails: {
    rewardComposition:
      "分开训练 helpfulness reward model 与 safety cost model，并在约束 RL 中联合使用。",
    positiveNegative: "以任务 reward 为正向收益，以 safety cost 为受约束的负向信号。",
  },
  cagrad: {
    scale: "比较 unified 与 rescaled 版本，明确检验梯度尺度处理的影响。",
    gradientConflict: "在平均梯度邻域内寻找改善最差任务的 conflict-averse 更新方向。",
  },
  "checklist-feedback": {
    rewardComposition: "把原子 checklist 的多项 verifier / judge 分数合成为偏好信号。",
  },
  "constitutional-ai": {},
  "constrained-dpo": {
    rewardComposition: "用动态拉格朗日乘子把 helpfulness reward 与 safety cost 合成训练分数。",
    positiveNegative: "组合分数显式最大化 reward、惩罚超出阈值的 cost。",
  },
  "controllable-preference-optimization": {
    rewardComposition: "按条件权重汇总 helpfulness、honesty、harmlessness 等多维偏好。",
  },
  "cos-dpo": {
    rewardComposition: "用连续权重条件化多目标 DPO，一次训练覆盖不同目标组合。",
    scale: "Temperature-COS-DPO 把每目标温度作为条件，直接控制各目标尺度。",
  },
  "directional-preference-alignment": {
    rewardComposition: "在多目标 reward 空间按用户指定方向组合 helpfulness 与 verbosity。",
    scale: "用单位方向和归一化 reward 向量计算方向分数。",
  },
  "dynamic-reward-weighting": {
    rewardComposition: "用 hypervolume 进展或逐目标梯度影响量动态调整多目标训练信号。",
    scale: "Hypervolume 方案直接对下一步线性 reward 做自适应整体缩放。",
    gradientConflict: "梯度方案用目标梯度与总梯度的内积识别协同或冲突，并据此更新权重。",
  },
  encore: {
    rewardComposition: "按评分熵为多头 safety reward 动态加权。",
  },
  "g-eval": {},
  gdpo: {
    rewardComposition: "分别处理多个 reward 通道，再按目标权重聚合 advantage。",
    scale: "逐 reward 标准化，并用 batch 级归一化控制 reward 数量带来的尺度增长。",
  },
  healthbench: {
    rewardComposition: "把每个样本的多条医生 rubric 加权汇总为总体分。",
    positiveNegative: "每条 criterion 带正或负权重，分别形成加分项和减分项。",
    scale: "按可得权重归一化聚合，使不同 rubric 数量的样本分数可比较。",
  },
  helpsteer: {
    rewardComposition: "保留五个属性分，并以目标属性组合作为生成条件。",
  },
  helpsteer2: {
    rewardComposition: "利用多属性 reward 预测分布做条件化训练与推断，而非只取 overall 分数。",
  },
  lemur: {
    rewardComposition: "为不同教师学习独立 reward model，并用 reward 向量训练多目标策略。",
  },
  "llm-as-a-judge": {},
  "maxmin-rlhf": {
    rewardComposition: "学习多个群体 reward component，再按最弱群体效用做 max-min 聚合。",
  },
  mgda: {
    scale: "论文明确指出任务梯度尺度会改变最小范数组合与最终解。",
    gradientConflict: "用任务梯度的最小范数凸组合寻找共同下降方向。",
  },
  modpo: {
    rewardComposition: "把其余目标的 RM 分差作为 margin 加入主目标 DPO。",
  },
  "morl-practical-guide": {
    rewardComposition: "系统讨论 reward 向量经 utility function 聚合及 Pareto coverage。",
    scale: "把目标单位、范围与归一化视为效用建模前必须明确的设计选择。",
  },
  "nash-mtl": {
    scale: "Nash 解对 loss 的正比例缩放不变，并用尺度实验验证。",
    gradientConflict: "把多任务梯度组合建模为 Nash bargaining，求各任务同意的更新。",
  },
  "natural-language-constraints": {
    rewardComposition: "同时推断任务 reward 与 latent safety constraint，并在 CMDP 中联合优化。",
    positiveNegative: "从正负示范分离收益 reward 与受限制的 safety cost。",
  },
  odin: {
    rewardComposition: "用质量与长度两个 reward head 分解原始偏好分数。",
    positiveNegative: "识别会造成虚假加分的长度奖励，并在 RL 阶段丢弃该 nuisance signal。",
  },
  "optimal-dualization-can": {
    rewardComposition: "用最优对偶变量把 reward 与 safety 特征合成一次训练目标。",
    positiveNegative: "最大化任务 reward，同时用约束项惩罚 safety margin 违约。",
  },
  pcgrad: {
    scale: "把梯度量级差异列为 tragic triad，并实验分析其与冲突的联合作用。",
    gradientConflict: "检测负内积任务梯度，并投影掉相互伤害的分量。",
  },
  prism: {
    rewardComposition: "为每个 reward 学习专家策略，在 token logits 上组合多目标 policy。",
    positiveNegative: "显式组合目标专属 positive policies 与共享 negative policy。",
    scale: "方法动机直接针对 reward 尺度和稀疏性差异造成的支配。",
    gradientConflict: "通过分支训练避免单个 rollout 同时承受冲突的多 reward 梯度。",
  },
  "projection-optimization": {
    rewardComposition: "把非线性多目标 reward 聚合转成迭代的线性标量化子问题。",
  },
  prometheus: {},
  "prometheus-2": {},
  "r3-rubric-agnostic-rm": {},
  "reward-model-ensembles": {
    rewardComposition: "比较 ensemble mean、worst-case 与 uncertainty-weighted RM 聚合。",
    positiveNegative: "UWO 用 ensemble 均值减去成员分歧惩罚。",
  },
  "reward-overoptimization-scaling": {},
  rewardbench: {},
  "rewarded-soups": {
    rewardComposition: "分别训练单 reward 专家，再在参数空间插值生成 Pareto 策略。",
  },
  "rgr-grpo": {
    rewardComposition: "逐项评估 factual / process rubrics，并把多项结果用作密集 reward。",
  },
  "rubrics-as-rewards": {
    rewardComposition: "将每题 7–20 条带权 rubric 显式或隐式聚合成 GRPO reward。",
    positiveNegative: "Essential / Important / Optional 与 Pitfall 项共同表达奖励和扣分规则。",
  },
  "rule-based-rewards": {
    rewardComposition: "把基础 Reward Model 与多条可审计的规则特征线性组合。",
    positiveNegative: "规则权重可正可负，同时奖励合规行为并惩罚危险或过度拒答。",
  },
  rvpo: {
    rewardComposition: "对多 reward 通道独立标准化，再用风险敏感 SoftMin 聚合。",
    positiveNegative: "显式形式为平均奖励减去跨目标方差惩罚，防止目标间补偿。",
    scale: "直接解决原始 reward 尺度支配，并继承 GDPO 的尺度无关性。",
  },
  saw: {
    rewardComposition: "按各 reward 当前信息量动态重分配多目标聚合权重。",
    scale: "用对乘法尺度不变的变异系数跨 reward 比较，并保持 GDPO advantage 尺度。",
  },
  "safe-rlhf": {
    rewardComposition: "分离 helpfulness reward 与 harmlessness cost，并用拉格朗日乘子动态组合。",
    positiveNegative: "目标显式最大化 reward，同时惩罚超出安全阈值的 cost。",
  },
  salmon: {
    rewardComposition: "Instructable RM 接收一组带权自然语言原则并输出总体 reward。",
    positiveNegative: "训练和推断都显式使用正原则与负原则。",
  },
  steerlm: {
    rewardComposition: "把多属性评分组合作为条件，控制单个模型的生成行为。",
  },
  "synthetic-critiques": {},
  ultrafeedback: {},
  warm: {
    rewardComposition: "在参数空间平均多个 Reward Models，以单模型获得 ensemble 鲁棒性。",
  },
}

export const gamingStoryEvidence: Record<string, RecommendationEvidence> = {
  "generative-agents": {
    privateAgents:
      "每个 Agent 维护独立的记忆流、反思和分层计划，并由相关性、新近性、重要性检索驱动行动。",
    orchestrationEvaluation:
      "Smallville 沙盒和组件移除比较将角色记忆、反思与计划放入可观察的社会模拟。",
  },
  dramatron: {
    orchestrationEvaluation:
      "用 premise、角色、故事节拍、场景和对白的分层生成工作流支持人类作者逐层编辑。",
  },
  camel: {
    privateAgents:
      "用 inception prompting 向 user / assistant Agent 分配不同角色、目标和对话协议。",
    orchestrationEvaluation:
      "给出角色化多 Agent 协作和合成 instruction-following 数据的可复用框架。",
  },
  agentverse: {
    privateAgents: "将单 Agent 的 profile、memory、planning 与 Agent group、environment 分层建模。",
    orchestrationEvaluation: "提供群体协作、角色分工、动态环境和涌现行为实验的框架。",
  },
  autogen: {
    orchestrationEvaluation:
      "以 conversable agents、群聊、嵌套对话、工具执行和人类介入编排多 Agent 工作流。",
  },
  sotopia: {
    privateAgents: "为互动双方配置不同身份、关系、私有目标和社会情境，再让其自由对话。",
    orchestrationEvaluation: "提供多维社会交互评测、LLM judge 与人类评估的 benchmark 设置。",
  },
  "drama-management-survey": {
    dynamicNarrative: "系统比较基于规划、搜索、MDP / RL 和规则的剧情干预与节奏控制方法。",
    consistencySolvability:
      "以叙事目标、世界状态和玩家模型约束事件选择，避免纯自由模拟失去故事结构。",
  },
  "interactive-narrative-intelligent-systems": {
    dynamicNarrative:
      "将 Drama Management 作为根据玩家行动选择、延后、替换或引入事件的独立控制层。",
    consistencySolvability: "明确区分故事世界模型、叙事规划、角色 / 玩家建模与叙述呈现。",
    orchestrationEvaluation: "作为领域综述，给出互动叙事智能系统的组件划分和方法分类。",
  },
  "narrative-planning-survey": {
    dynamicNarrative: "讨论玩家行动造成状态偏离后的 replan、plan repair 与调度干预。",
    consistencySolvability: "以动作前置条件、因果链接和角色意图生成可解释的故事事件。",
  },
  "plans-and-planning-narrative-generation": {
    dynamicNarrative: "区分 interactive planning，并讨论玩家介入后维持叙事目标的规划问题。",
    consistencySolvability:
      "区分 story planning、discourse planning 和角色计划，保持事件因果与信息披露边界。",
  },
  "facade-interactive-drama": {
    dynamicNarrative:
      "Drama Manager 按当前状态与 tension 选择可执行的 beat，实现宏观结构与局部自由互动。",
    consistencySolvability:
      "每个 beat 定义前置条件、局部目标、角色行为和结束条件，限制非法剧情推进。",
    orchestrationEvaluation:
      "以可复用 beat 内容单元、Reactive behaviors 和自然语言行为映射构成完整互动戏剧架构。",
  },
}

export const gamingLanguageEvidence: Record<string, RecommendationEvidence> = {
  "galantucci-emergence-communication": {
    sharedSymbols: "受限沟通实验直接观察陌生参与者如何逐步协商出共享图形符号。",
    gameDesignEvidence: "提供可复用的受限通信任务和符号收敛观察指标。",
  },
  "garrod-foundations-representation": {
    sharedSymbols: "反复互动使具象图像逐渐简化为搭档专属、可快速识别的抽象符号。",
    gameDesignEvidence: "以沟通效率、符号复杂度和搭档间理解作为可观察变量。",
  },
  "kirby-cumulative-cultural-evolution": {
    sharedSymbols: "通过迭代学习说明随机信号可在文化传递中变得更可学习且具有组合结构。",
    gameDesignEvidence: "提供传递链实验范式，可用于测试玩家生成规则的稳定性与可学习性。",
  },
  "wiggins-bowers-memes-genre": {
    memeIdentity: "把互联网迷因定义为参与式数字文化中的体裁，强调模板、变体与社群实践。",
    gameDesignEvidence: "提供分析迷因复用、改写和参与规则的框架。",
  },
  "gal-shifman-kampf-it-gets-better": {
    memeIdentity: "检验迷因模板如何让参与者围绕共享文本建构集体身份。",
    gameDesignEvidence: "提供比较不同模板、变体和身份叙事的内容分析路径。",
  },
  "nissenbaum-shifman-contested-cultural-capital": {
    memeIdentity: "将迷因素养和使用资格解释为可争夺的文化资本与圈层边界。",
  },
  "miltner-lolcats-identity": {
    memeIdentity: "说明同一迷因可同时承担身份表达、归属和边界维护功能。",
  },
  "watson-jones-legare-social-functions-rituals": {
    ritualCooperation: "综合群体仪式如何服务社会联结、规范、身份和群体协调。",
    gameDesignEvidence: "为将重复活动设计为身份与共同目标反馈提供理论框架。",
  },
  "hobson-psychology-rituals": {
    ritualCooperation: "提出仪式的心理过程框架，连接重复、因果不透明、情绪和社会功能。",
    gameDesignEvidence: "提供可拆分测试的仪式设计变量与机制地图。",
  },
  "wiltermuth-heath-synchrony-cooperation": {
    ritualCooperation: "实验检验同步活动与后续合作行为之间的关系。",
    gameDesignEvidence: "提供同步条件与合作选择作为可复用对照和结果变量。",
  },
  "reddish-fischer-bulbulia-lets-dance": {
    ritualCooperation: "实验区分同步与共同目标，显示两者结合更能促进合作。",
    gameDesignEvidence: "提供同步 × 共同意图的因子设计和合作结果指标。",
  },
}

export const experienceReplayEvidence: Record<string, RecommendationEvidence> = {
  rlep: {
    replayBuffer: "先用一轮 RL 的成功轨迹建库，再从同一基座重训并混入历史正确答案。",
  },
  exgrpo: {
    replayBuffer: "保存历史成功轨迹，并按问题价值与轨迹熵选择回放样本。",
    offPolicyMitigation: "保留行为概率并使用 mixed-policy objective 处理历史策略轨迹。",
  },
  "bapo-buffer-matters": {
    replayBuffer: "同时缓存待重试难题与近期高质量 rollout。",
    offPolicyMitigation: "限制 buffer 新鲜度，并对历史样本做显式 off-policy correction。",
  },
  "replay-enhanced-repo": {
    replayBuffer: "训练中持续积累早期 rollout，并异步检索后混回更新。",
    offPolicyMitigation: "分别归一化 on-policy 与 replay advantage，并保留行为概率。",
  },
  "dots-rollout-replay": {
    replayBuffer: "FIFO buffer 保存近期 rollout group，并替换部分新生成样本。",
    offPolicyMitigation: "用 FIFO freshness 和难度重估限制陈旧数据的分布偏移。",
  },
  eframe: {
    replayBuffer: "对困难题扩大探索，过滤出的 gold trajectories 写入 buffer 后回放。",
  },
  remix: {
    replayBuffer: "训练前期按固定比例混入历史 rollout，提高 update-to-data ratio。",
    offPolicyMitigation: "阶段后切回纯 on-policy，并重置 reference policy 控制分布漂移。",
  },
  "efficient-rl-experience-replay": {
    replayBuffer: "系统研究 FIFO buffer、容量、replay ratio 与正样本偏置采样。",
    offPolicyMitigation: "显式扫描 staleness，并采用更耐陈旧样本的更新设计。",
  },
  "polaris-rollout-rescue": {
    replayBuffer: "当前 group 全失败时，从 earlier-epoch buffer 注入一条历史正确答案。",
  },
  arpo: {
    replayBuffer: "FIFO 经验池保存 GUI agent 的历史非零奖励轨迹。",
    offPolicyMitigation: "只在全零组按需注入，并以 FIFO 淘汰过旧交互降低 staleness。",
  },
  "kimi-k1-5": {
    replayBuffer: "大型 RL recipe 缓存完整与部分 rollout，降低时间相关性并复用生成。",
  },
  "retrospective-replay": {
    supervisedData: "从历史轨迹及 canonical solution 中抽取高价值 prefix，再纳入 RL 续写。",
    replayBuffer: "回放 critic 选出的中间推理状态，而不是只复用完整正确答案。",
  },
  poer: {
    replayBuffer: "保留失败轨迹中仍正确或有希望的早期 prefix，引导后续完成。",
  },
  "trajectory-balance-asynchrony": {
    replayBuffer: "异步 searcher 持续向共享 replay buffer 供给多样轨迹。",
    offPolicyMitigation: "使用适配异步历史数据的 trajectory-balance loss，而非直接套 PPO ratio。",
  },
  reval: {
    replayBuffer: "FIFO replay buffer 在 fresh 收集之间反复训练历史轨迹。",
    offPolicyMitigation: "用 Bellman residual 的 value-based 目标与 KL 正则控制策略漂移。",
  },
  deepsearch: {
    replayBuffer: "MCTS 配合 adaptive replay buffer 和 verified-solution cache 复用搜索经验。",
  },
  luffy: {
    supervisedData: "on-policy rollout 全失败时，把强模型正确轨迹混入 policy update。",
    offPolicyMitigation:
      "用 mixed-policy advantage 与 regularized importance sampling 缩小 policy gap。",
  },
  "rephrasing-repo": {
    supervisedData: "专家答案经当前模型改写和验证后，替换低奖励 rollout 进入 RL。",
    offPolicyMitigation: "把专家答案改写成当前 policy 的表达，从数据层缩小 policy gap。",
  },
  relift: {
    supervisedData: "在在线 RL 更新之间，对困难题高质量示范执行监督微调。",
    replayBuffer: "把当前最困难问题的高质量解存入专用 buffer。",
    offPolicyMitigation: "将外部示范隔离在交错 SFT 更新中，并动态刷新困难集合。",
  },
  chord: {
    supervisedData: "同时优化 on-policy GRPO loss 与 off-policy expert SFT loss。",
    offPolicyMitigation: "按模型对专家 token 的掌握程度动态加权并逐步退火监督。",
  },
  kdrl: {
    supervisedData: "把教师推理分布的知识蒸馏目标与 verifier RL 统一训练。",
    offPolicyMitigation: "用 KD/RL annealing 和 token masking 控制教师—学生分布差距。",
  },
  poets: {
    replayBuffer: "policy ensemble 在 replay 数据上更新并维持不同探索假设。",
    offPolicyMitigation: "以 ensemble uncertainty 和 Thompson sampling 缓解重复经验过拟合。",
  },
  inspo: {
    replayBuffer: "失败轨迹进入 replay buffer，供 instruction optimizer 反思。",
    offPolicyMitigation: "历史失败不直接更新 actor，而用于进化 instruction，绕开陈旧策略梯度。",
  },
  "soft-policy-optimization": {
    supervisedData: "half-online 设置以 50% offline trajectories 混合 50% online 数据。",
    offPolicyMitigation: "为序列模型推导 soft off-policy Q-regression，可直接训练行为策略数据。",
  },
  "tapered-off-policy-reinforce": {
    offPolicyMitigation: "用 tapered weighting 平滑降权远离当前 policy 的离线样本。",
  },
  "asymmetric-reinforce": {
    offPolicyMitigation: "以保守负 baseline 非对称处理正负 reward，避免普通 ratio clipping 崩溃。",
  },
  m2po: {
    offPolicyMitigation:
      "约束 importance weight 的 second moment，延长 stale rollout 安全使用区间。",
  },
  "revisiting-grpo-off-policy": {
    offPolicyMitigation: "推导 rollout 延迟与重复更新下的有效 loss 和 policy-improvement 边界。",
  },
}

export function createRecommendation(
  evidence: RecommendationEvidence = {},
  criteria: readonly RecommendationCriterion[] = recommendationCriteria,
): Recommendation {
  const hits = Object.fromEntries(
    criteria.map(({ key }) => [key, Boolean(evidence[key])]),
  ) as Record<RecommendationCriterionKey, boolean>

  return {
    evidence,
    hits,
    total: criteria.filter(({ key }) => hits[key]).length,
  }
}

export function compareRecommendations(left: Recommendation, right: Recommendation): number {
  return right.total - left.total
}

export default ((options: PaperRecommendationOptions = {}) => {
  const topic = options.topic ?? "reward-resemble"
  const isExperienceReplay = topic === "experience-replay"
  const isGamingStory = topic === "gaming-story"
  const isGamingLanguage = topic === "gaming-language"
  const criteria: readonly RecommendationCriterion[] = isExperienceReplay
    ? experienceReplayCriteria
    : isGamingStory
      ? gamingStoryCriteria
      : isGamingLanguage
        ? gamingLanguageCriteria
        : recommendationCriteria
  const evidenceByPaper = isExperienceReplay
    ? experienceReplayEvidence
    : isGamingStory
      ? gamingStoryEvidence
      : isGamingLanguage
        ? gamingLanguageEvidence
        : paperRecommendationEvidence
  const topicSlug = isGamingStory
    ? "gaming/剧情/"
    : isGamingLanguage
      ? "gaming/创造语言/"
      : `rl/${topic}/`
  const boardTitle = isExperienceReplay
    ? "三项机制覆盖榜"
    : isGamingStory || isGamingLanguage
      ? "四项专项推荐榜"
      : "四项专项推荐榜"
  const maxScore = criteria.length

  const PaperRecommendation: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
  }: QuartzComponentProps) => {
    const papers = allFiles
      .filter((page) => page.slug?.startsWith(topicSlug) && page.frontmatter?.type === "paper")
      .map((page) => {
        const key = page.slug?.split("/").at(-1) ?? ""
        return {
          page,
          recommendation: createRecommendation(evidenceByPaper[key], criteria),
        }
      })
      .sort((left, right) => {
        const scoreDifference = compareRecommendations(left.recommendation, right.recommendation)
        if (scoreDifference !== 0) return scoreDifference

        const businessDifference =
          Number(right.page.frontmatter?.business_fit ?? 0) -
          Number(left.page.frontmatter?.business_fit ?? 0)
        if (businessDifference !== 0) return businessDifference

        const solidityDifference =
          Number(right.page.frontmatter?.paper_solidity ?? 0) -
          Number(left.page.frontmatter?.paper_solidity ?? 0)
        if (solidityDifference !== 0) return solidityDifference

        return String(left.page.frontmatter?.title).localeCompare(
          String(right.page.frontmatter?.title),
          "zh-CN",
        )
      })

    let scoreRank = 0
    let previousScore: number | undefined

    return (
      <section
        class={classNames(displayClass, "paper-recommendation-board")}
        aria-labelledby="recommendation-board-title"
      >
        <div class="paper-recommendation-heading">
          <div>
            <p class="paper-recommendation-kicker">RULE-BASED RECOMMENDATION</p>
            <h2 id="recommendation-board-title">{boardTitle}</h2>
          </div>
          <p>每项命中加 1 分，满分 {maxScore} 分；同分依次看业务、solid 与标题</p>
        </div>

        <div class="paper-recommendation-rubric" aria-label="推荐榜评分口径">
          {criteria.map((criterion, index) => (
            <div class="paper-recommendation-rubric-item">
              <strong>
                {index + 1}. {criterion.label}
              </strong>
              <span>{criterion.description}</span>
            </div>
          ))}
        </div>

        <div class="paper-recommendation-list">
          {papers.map(({ page, recommendation }) => {
            if (recommendation.total !== previousScore) {
              scoreRank += 1
              previousScore = recommendation.total
            }

            const title = page.frontmatter?.title ?? "Untitled"
            const href = resolveRelative(fileData.slug!, page.slug as FullSlug)
            const evidenceSummary = criteria
              .filter(({ key }) => recommendation.hits[key])
              .map(({ key }) => recommendation.evidence[key])
              .join("；")

            return (
              <article
                class={`paper-recommendation-card score-${recommendation.total}`}
                data-recommendation-score={recommendation.total}
              >
                <div class="paper-recommendation-rank" aria-label={`第 ${scoreRank} 档`}>
                  #{scoreRank}
                </div>
                <div class="paper-recommendation-paper">
                  <h3>
                    <a class="internal" href={href}>
                      {title}
                    </a>
                  </h3>
                  <div class="paper-recommendation-criteria">
                    {criteria.map((criterion) => {
                      const hit = recommendation.hits[criterion.key]
                      const detail = recommendation.evidence[criterion.key]
                      return (
                        <span
                          class={`paper-recommendation-chip ${hit ? "is-hit" : "is-miss"}`}
                          aria-label={`${criterion.label}：${hit ? "命中" : "未命中"}`}
                          title={detail ?? `未直接命中“${criterion.label}”`}
                        >
                          <span aria-hidden="true">{hit ? "✓" : "—"}</span>
                          {criterion.shortLabel}
                        </span>
                      )
                    })}
                  </div>
                  <p class="paper-recommendation-evidence">
                    {evidenceSummary || "未直接命中上述四项；保留为背景阅读。"}
                  </p>
                </div>
                <div class="paper-recommendation-total" aria-label={`${recommendation.total} 分`}>
                  <strong>{recommendation.total}</strong>
                  <span>/ {maxScore}</span>
                </div>
              </article>
            )
          })}
        </div>

        <p class="paper-recommendation-footnote">
          {isExperienceReplay
            ? "这是机制覆盖分，不代表论文质量；仅使用历史数据但没有显式校正、限龄、重写或专用目标，不自动获得 Off-policy 缓解分。KD、offline trajectory 与 canonical prefix 归入广义监督 / 专家数据，并在卡片中明示证据。"
            : "这是按论文方法特征生成的固定推荐分，不代表论文质量，也不会读取或改动下方的业务契合度 / Paper solid 度星级。参数规模的 scaling law 不算量纲问题；只说目标冲突、不处理冲突梯度，也不计梯度冲突分。"}
        </p>
      </section>
    )
  }

  PaperRecommendation.css = `
.paper-recommendation-board {
  margin: 1.5rem 0 2.5rem;
}

.paper-recommendation-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.paper-recommendation-heading h2,
.paper-recommendation-heading p {
  margin: 0;
}

.paper-recommendation-heading > p,
.paper-recommendation-footnote {
  color: var(--gray);
  font-size: 0.9rem;
}

.paper-recommendation-kicker {
  color: var(--secondary);
  font-family: var(--codeFont);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
}

.paper-recommendation-rubric {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.paper-recommendation-rubric-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.7rem 0.8rem;
  border: 1px solid var(--lightgray);
  border-radius: 10px;
  background: color-mix(in srgb, var(--light) 94%, var(--highlight));
}

.paper-recommendation-rubric-item strong {
  color: var(--darkgray);
  font-size: 0.86rem;
}

.paper-recommendation-rubric-item span {
  color: var(--gray);
  font-size: 0.78rem;
  line-height: 1.45;
}

.paper-recommendation-list {
  display: grid;
  gap: 0.65rem;
}

.paper-recommendation-card {
  display: grid;
  grid-template-columns: 2.7rem minmax(0, 1fr) 3.5rem;
  align-items: center;
  gap: 0.85rem;
  padding: 0.8rem 0.9rem;
  border: 1px solid var(--lightgray);
  border-radius: 12px;
  background: var(--light);
}

.paper-recommendation-card.score-4,
.paper-recommendation-card.score-3 {
  border-color: color-mix(in srgb, var(--secondary) 55%, var(--lightgray));
  background: color-mix(in srgb, var(--light) 92%, var(--highlight));
}

.paper-recommendation-card.score-0 {
  opacity: 0.72;
}

.paper-recommendation-rank {
  color: var(--secondary);
  font-family: var(--codeFont);
  font-size: 0.86rem;
  font-weight: 700;
  text-align: center;
}

.paper-recommendation-paper h3 {
  margin: 0 0 0.45rem;
  font-size: 0.98rem;
}

.paper-recommendation-criteria {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.paper-recommendation-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.45rem;
  border: 1px solid var(--lightgray);
  border-radius: 999px;
  color: var(--gray);
  font-size: 0.73rem;
  line-height: 1.2;
  white-space: nowrap;
}

.paper-recommendation-chip.is-hit {
  border-color: color-mix(in srgb, var(--secondary) 38%, var(--lightgray));
  color: var(--secondary);
  background: color-mix(in srgb, var(--highlight) 72%, transparent);
}

.paper-recommendation-evidence {
  margin: 0.45rem 0 0;
  color: var(--gray);
  font-size: 0.76rem;
  line-height: 1.45;
}

.paper-recommendation-total {
  display: flex;
  flex-direction: column;
  align-items: end;
  color: var(--secondary);
}

.paper-recommendation-total strong {
  font-family: var(--codeFont);
  font-size: 1.35rem;
}

.paper-recommendation-total span {
  color: var(--gray);
  font-size: 0.72rem;
}

.paper-recommendation-footnote {
  margin: 0.8rem 0 0;
  line-height: 1.55;
}

@media all and (max-width: 800px) {
  .paper-recommendation-heading {
    align-items: start;
    flex-direction: column;
  }

  .paper-recommendation-rubric {
    grid-template-columns: 1fr;
  }

  .paper-recommendation-card {
    grid-template-columns: 2rem minmax(0, 1fr);
    align-items: start;
  }

  .paper-recommendation-rank {
    padding-top: 0.15rem;
  }

  .paper-recommendation-total {
    display: none;
  }
}
`

  return PaperRecommendation
}) satisfies QuartzComponentConstructor<PaperRecommendationOptions>

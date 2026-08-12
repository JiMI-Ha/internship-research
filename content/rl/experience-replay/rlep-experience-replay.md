---
title: "LLM Experience Replay 研究地图：从 RLEP 到稳定 Off-Policy RL"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: topic
aliases: [papers/rlep-experience-replay]
tags: [RL, RLVR, experience-replay, off-policy, reasoning]
source_url: https://arxiv.org/abs/2507.07451
---

> [!abstract] 页面定位
> 本页只负责导航和比较研究分支。清单中的 28 种方法均已拆成独立页面，每一页分别核对 Motivation、Method、Experimental Setup、Results、Ablation、Limitations 与 Takeaways。

## 最接近 RLEP 的方法

1. [[rl/experience-replay/rlep|RLEP]] — 两阶段建库与少量成功轨迹回放，是最小基准。
2. [[rl/experience-replay/exgrpo|ExGRPO]] — 加入经验价值、难度/熵选择和 mixed-policy objective。
3. [[rl/experience-replay/bapo-buffer-matters|Buffer Matters / BAPO]] — revisit 历史难题、限制新鲜度并做 off-policy correction。
4. [[rl/experience-replay/replay-enhanced-repo|Replay-Enhanced RePO]] — 单次训练内持续积累、异步检索和分离 on/off-policy advantage。
5. [[rl/experience-replay/dots-rollout-replay|DOTS + Rollout Replay]] — 难度定向 prompt 选择与近期 FIFO rollout 回放。
6. [[rl/experience-replay/eframe|EFRAME]] — Exploration–Filter–Replay，定向救援当前全失败问题。
7. [[rl/experience-replay/remix|ReMix]] — 前期混合历史数据提高 UTD，后期切回纯 on-policy。
8. [[rl/experience-replay/efficient-rl-experience-replay|Efficient RL Training with Experience Replay]] — 系统扫描 replay ratio、buffer size、staleness 与计算 Pareto。

## Prefix、状态、搜索与 Value Replay

- [[rl/experience-replay/retrospective-replay|Retrospective Replay / RRL]] — 用 critic 找出 promising intermediate states 并从 prefix 续写。
- [[rl/experience-replay/poer|POER]] — 保留失败轨迹中的有希望 prefix；当前只依据公开索引摘要。
- [[rl/experience-replay/trajectory-balance-asynchrony|Trajectory Balance with Asynchrony]] — 异步 searcher、共享 buffer 与 trajectory-balance loss。
- [[rl/experience-replay/reval|ReVal]] — 将 logits 解释为 Q-value，用 Bellman update 反复训练历史轨迹。
- [[rl/experience-replay/deepsearch|DeepSearch]] — 训练时 MCTS、节点价值、adaptive replay 与 verified-solution cache。

## 工程型 Rollout Rescue 与大型系统

- [[rl/experience-replay/polaris-rollout-rescue|Polaris Rollout-Rescue]] — 当前 group 全失败时只替换一条历史正确答案。
- [[rl/experience-replay/arpo|ARPO]] — GUI agent 全零奖励时注入同任务历史非零轨迹。
- [[rl/experience-replay/kimi-k1-5|Kimi k1.5]] — 大型训练系统中的完整/部分轨迹缓存；没有独立组件归因。

## 外部或历史专家轨迹

- [[rl/experience-replay/luffy|LUFFY]] — 全失败时引入强模型轨迹，并用 mixed-policy shaping 缩小 policy gap。
- [[rl/experience-replay/rephrasing-repo|Rephrasing RePO]] — 让学生先把专家答案改写成自己的语言。
- [[rl/experience-replay/relift|ReLIFT]] — 对 RL 长期学不会的问题交错执行在线 RL 与 SFT。
- [[rl/experience-replay/chord|CHORD]] — 动态协调专家 SFT 与 on-policy RL 权重。
- [[rl/experience-replay/kdrl|KDRL]] — 在统一目标中结合知识蒸馏与 RL。
- [[rl/experience-replay/poets|POETS]] — LoRA policy ensemble、Thompson sampling 与 replay。
- [[rl/experience-replay/inspo|INSPO]] — 用失败 buffer 反思并进化 instruction，而非直接训练 actor。

## Off-Policy 稳定性底座

- [[rl/experience-replay/soft-policy-optimization|Soft Policy Optimization]] — 为序列模型构造原生在线 off-policy 目标。
- [[rl/experience-replay/tapered-off-policy-reinforce|Tapered Off-Policy REINFORCE]] — 对远离当前 policy 的样本平滑降权。
- [[rl/experience-replay/asymmetric-reinforce|Asymmetric REINFORCE / AsymRE]] — 用保守 baseline 分别平衡正负经验。
- [[rl/experience-replay/m2po|M2PO]] — 用 importance weight 二阶矩控制 stale-data collapse。
- [[rl/experience-replay/revisiting-grpo-off-policy|Revisiting GRPO]] — 分析 rollout lag、多次更新与 policy-improvement 边界。

## 推荐阅读顺序

1. RLEP → Replay-Enhanced RePO → ExGRPO → BAPO：从最小 replay 机制看到完整 buffer 管理。
2. Efficient RL Training → ReMix → M2PO → Revisiting GRPO：理解效率、新鲜度与后期崩溃。
3. 按经验粒度分流：RRL/POER 看 prefix，DeepSearch 看树搜索，ReVal 看 value replay。
4. 按外部知识分流：LUFFY → Rephrasing RePO → ReLIFT → CHORD/KDRL。

## 比较时的证据规则

- 不跨模型、数据、采样预算直接按绝对分数排名。
- 区分准确率百分点、相对百分比、优化步数、rollout 数、GPU-hours 和完整 wall-clock。
- 技术报告或博客没有隔离 replay 消融时，不把整套系统成绩归因给 replay。
- POER 的正文尚未可靠取得，因此不记录无法复核的数字。

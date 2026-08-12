---
title: "Dynamic Reward Weighting：在线重分配多目标对齐预算"
created: 2026-08-12
published: 2026-08-12
modified: 2026-08-12
type: paper
business_fit: 0
paper_solidity: 0
authors: "Yining Lu, Zilong Wang, Shiyang Li, Xin Liu, Changlong Yu, Qingyu Yin, Zhan Shi, Zixuan Zhang, Meng Jiang"
aliases:
  - papers/dynamic-reward-weighting
tags:
  - paper
  - RL
  - reward-resemble
  - multi-objective
  - dynamic-weighting
  - Pareto
  - hypervolume
  - gradient-optimization
source_url: https://arxiv.org/abs/2509.11452
doi: 10.1162/tacl.a.696
---

> [!summary] 一句话结论
> 这篇工作用 hypervolume meta-reward 或逐目标梯度影响量替代固定奖励权重，在三目标推理任务上获得更好的经验 Pareto 前沿；其中梯度法确实动态改变各目标权重，但需要额外的逐目标梯度，并依赖关闭常规 clipping/KL 等较强条件。

## 基本信息

- **论文**：[Learning to Optimize Multi-Objective Alignment Through Dynamic Reward Weighting](https://arxiv.org/abs/2509.11452)
- **发表**：[Transactions of the Association for Computational Linguistics, Volume 14, pp. 1051–1073, 2026](https://doi.org/10.1162/tacl.a.696)
- **版本**：arXiv:2509.11452v2，2026-03-30；初稿提交于 2025-09-14
- **项目与代码**：[Dynamic Reward Weighting](https://yining610.github.io/dynamic-reward-weighting-webpage/) · [GitHub](https://github.com/yining610/dynamic-reward-weighting)
- **关键词**：多目标对齐、动态奖励权重、Pareto front、hypervolume、gradient influence

## Motivation

在线 RL 对齐不应只优化正确性，还要同时考虑推理长度、表达清晰度或安全性。固定线性标量化有三个问题：

1. **学习速度不同**：某些目标很快饱和，却在余下训练中继续获得相同预算。
2. **非凸 Pareto 前沿不可达**：固定线性权重只会找到 Pareto 前沿凸包上的支撑点，无法覆盖凹陷区域。
3. **人工规则难迁移**：为某一组目标手工设计的插值规则，换任务或增加目标后往往需要重做。

论文在单目标训练中观察到：简洁性约在第 165 步达到最短回答，清晰度约在第 240 步才达到最佳，说明“所有目标从头到尾等权”会浪费更新。作者因此提出两条动态路线：有人工偏好时用 Pareto hypervolume 引导探索；没有偏好先验时根据逐目标梯度自动改变权重。

## Method

### 1. Hypervolume-guided adaptation

给定人工设定的静态目标权重 $w$，先计算线性奖励 $r=w^\top\mathbf r$。训练过程中维护验证集上的非支配解集合 $B$，以新 checkpoint 的 hypervolume contribution 衡量它是否扩展了 Pareto 前沿：

$$
\Delta\mathrm{HV}(\mathbf r,B)
=\mathrm{HV}(B\cup\{\mathbf r\})-\mathrm{HV}(B\setminus\{\mathbf r\}).
$$

再把它映射为 meta-reward：

$$
r_{\mathrm{pareto}}=0.5+1.5\tanh\!\left(\Delta\mathrm{HV}(\mathbf r,B)\right),
$$

并缩放下一步样本的线性奖励：

$$
\tilde r=r_{\mathrm{pareto}}\,r.
$$

若 checkpoint 对 hypervolume 有正贡献，就加入 $B$。该方法不改变人工给定的各维权重比例，而是根据 Pareto 进展整体放大或缩小训练信号；因此它更准确地说是 **hypervolume-guided reward scaling**，不是逐维 weight reallocation。

### 2. Gradient-based weight optimization

没有人工偏好时，方法从等权 $w^{(0)}$ 出发。每一步分别计算第 $i$ 个目标的策略梯度，并定义影响量：

$$
I_i^{(t)}=left\langle \nabla J_i(\theta^{(t)}),
\sum_{k=1}^{K}\nabla J_k(\theta^{(t)})\right\rangle.
$$

$I_i$ 同时包含自身梯度大小，以及它与其他目标梯度的协同或冲突。随后用 exponentiated mirror descent 更新并归一化：

$$
\tilde w_i^{(t)}=w_i^{(t-1)}
\exp\!\left(\frac{\eta(t)I_i^{(t)}}{\mu}\right),
\qquad
w_i^{(t)}=\frac{\tilde w_i^{(t)}}{\sum_k\tilde w_k^{(t)}}.
$$

梯度大、且与总体优化方向一致的目标会升权；已经较充分学习或与其他目标冲突的维度相对降权。论文在 Lipschitz、奖励与梯度有界、学习率序列收敛等假设下证明任意两目标的权重比保持有界，但这不等于保证 LLM 训练收敛到全局 Pareto 最优。

为了维持“总梯度是逐目标梯度线性组合”的推导，实验不在每个 reward 中加入 token-level KL penalty，并把 clip range 与 dual clip 常数都设为 100，近似关闭 clipping。为降低成本，只在中间层计算逐目标梯度。

## Experimental Setup

- **主实验**：Qwen3-8B 在 Math500 上训练，比较 GRPO、REINFORCE、RLOO。
- **三个目标**：正确性；简洁性；包含显式分步词语的清晰度。正确性与清晰度是 0/1 规则奖励，简洁性依据当前回复长度相对历史 rollout 全局均值计算。
- **静态基线**：accuracy-focused $[0.5,0.25,0.25]$、balanced $[0.334,0.333,0.333]$、efficiency-focused $[0.25,0.375,0.375]$；另比较作者复现的 PAMA。
- **泛化实验**：MATH algebra、SafeSQL；DeepSeek-7B、Mistral-7B、Llama3-8B。SafeSQL 同时优化正确性与 SQL 注入安全性。
- **训练资源**：8 张 NVIDIA H200 143GB；hypervolume 法平均约 14 小时，梯度法约 24 小时。两组超参数并不完全相同，因此该时间差只能作为成本量级参考。
- **重复性口径**：REINFORCE 因相同超参数下收敛波动较大，作者对每种方法运行 3 次，但报告的是**最快收敛的一次**，不是均值或中位数。

## Results

### Hypervolume-guided 方法

论文按训练轨迹上经验 Pareto 前沿的平均表现汇总。它在多数设置中改善至少部分目标，但不是全面占优：

- GRPO 的 accuracy-focused 设置从 **0.832 / 701 / 0.962** 改善为 **0.850 / 619 / 0.970**（准确率 / 长度 / 清晰度），三项同时改善。
- REINFORCE 的 efficiency-focused 设置从 **0.778 / 676 / 0.985** 改善为 **0.790 / 618 / 1.000**，三项同时改善。
- 反例同样存在：GRPO 的 efficiency-focused 设置长度由 **650 增至 731**、清晰度由 **0.970 降至 0.967**；RLOO 的 accuracy-focused 设置长度由 **677 增至 813**、清晰度由 **0.965 降至 0.940**。

论文自己也提醒，“Pareto 前沿平均分更高”并不能证明真正的 Pareto optimality；可支持的结论是经验前沿在部分权重/算法配置下扩展得更好。

### Gradient-based 方法

| 在线 RL   | 代表性静态基线       | 梯度动态权重             | 结论                               |
| --------- | -------------------- | ------------------------ | ---------------------------------- |
| GRPO      | 0.836 / 831 / 0.948  | **0.836 / 650 / 0.980**  | 准确率持平，长度与清晰度改善       |
| REINFORCE | 0.764 / 1375 / 0.830 | **0.802 / 1202 / 0.868** | 三项目标均改善                     |
| RLOO      | 0.830 / 824 / 0.940  | 0.820 / **701 / 0.980**  | 长度、清晰度改善，准确率下降 0.010 |

表中静态列选择同算法中较强的一个固定权重配置：GRPO/REINFORCE 为 accuracy-focused，RLOO 为 efficiency-focused。若分别取每个指标的最佳静态结果，结论仍是 GRPO/REINFORCE 的整体前沿更优，而 RLOO 只改善简洁性和清晰度。

训练中，简洁性权重很快从约 1/3 降到 **0.2**，准确性权重持续升到约 **0.46**，清晰度约为 **0.34**。作者将其解释为简洁性更早饱和，而准确性需要持续学习；KL 轨迹还显示准确性与清晰度更新方向更接近，简洁性相对正交。

### 收敛速度与泛化

- 梯度法在 GRPO、REINFORCE、RLOO 下达到当前经验 Pareto 前沿所需步数分别减少 **8.9、1.3、8.2**，平均减少 **6.1 步**。
- Hypervolume 法仅在 GRPO 中减少 2.5 步；REINFORCE 与 RLOO 分别多用 1.7、1.4 步，因此不能笼统称为更快收敛。
- MATH algebra、SafeSQL 以及 DeepSeek/Mistral/Llama3 的图形结果总体显示更好的经验 trade-off，但部分 clarity 投影因性能饱和坍缩为单点，无法提供额外区分度。

## Ablation 与机制证据

- **不同饱和速度**：单目标曲线显示简洁性约第 165 步达到最短回复，清晰度约第 240 步才达到最佳，为动态预算分配提供直接动机证据。
- **梯度关系**：accuracy-only 与 clarity-only 模型之间 KL divergence 较低，conciseness-only 与两者持续分离，支持“前两者协同、简洁性较正交”的解释。
- **Meta-reward 激进程度**：balanced 配置产生更高 meta-reward，却在 REINFORCE 中可能更差，说明 hypervolume 放大需要校准，越强并不一定越好。
- **不完整的组件消融**：附录列出多种 meta-reward 激活函数、学习率、正则和 clipping 搜索范围，但没有逐项报告完整结果；正文只说明标准 clipping 比近似关闭 clipping 更差，未给具体数值。

## Limitations

- **Hypervolume 路线并未逐维调权**：人工权重 $w$ 始终固定，动态部分只是统一缩放标量 reward；它不能直接把预算从饱和目标转移到未饱和目标。
- **验证开销与信息要求高**：每步需要在验证集估计多维表现并维护 Pareto set；实际业务若没有可靠、低延迟的逐维验证指标，方法难以照搬。
- **梯度法计算昂贵**：每个目标需要独立梯度，且只算中间层是一种近似；目标数增加后成本近似线性增长。
- **训练目标被改写**：为了理论线性关系，实验关闭常规 clipping 并移除逐奖励 token-level KL；这与标准生产 RLHF 配置存在差距。
- **奖励容易被规则化代理**：用“first/second/third”等显式词判断 clarity，可能奖励表面格式而非真正可解释推理；长度相对历史均值也会随策略分布漂移。
- **统计报告偏乐观**：REINFORCE 只报告 3 次运行中最快收敛的一次，缺少均值、方差与显著性检验；PAMA 因无公开代码而由作者自行复现。
- **理论保证有限**：权重比有界依赖强假设，只保证更新不会瞬间坍缩/爆炸，不保证非凸 LLM 优化达到全局 Pareto 前沿。
- **模型能力上限**：作者在 Ministral-8B-Instruct 与 Llama-3.1-8B-Instruct 上观察到缩短回复会降低准确率；当目标存在不可约冲突时，动态权重收益有限。

## Takeaways

- 这篇论文最有价值的判断不是“某个公式一定最好”，而是把固定权重拆成两个问题：**业务偏好先验**与**当前训练可学习性**。前者可静态设定，后者再动态分配。
- 若没有可靠验证前沿，优先尝试 [[rl/reward-resemble/saw|SAW]] 这类统计量方法；若目标数少、算力充足且允许修改 clipping/KL，再把梯度法作为上界对照。
- 评估时必须报告完整 Pareto front、每维时间曲线和多随机种子分布，不能只展示某组权重或“最快的一次”。
- 对业务硬约束，动态权重不能替代阈值或拉格朗日约束；否则目标一旦被判断为“低学习潜力”，仍可能被过早降权。

## Citation

```bibtex
@article{lu2026dynamic,
  title={Learning to Optimize Multi-Objective Alignment Through Dynamic Reward Weighting},
  author={Lu, Yining and Wang, Zilong and Li, Shiyang and Liu, Xin and Yu, Changlong and Yin, Qingyu and Shi, Zhan and Zhang, Zixuan and Jiang, Meng},
  journal={Transactions of the Association for Computational Linguistics},
  volume={14},
  pages={1051--1073},
  year={2026},
  doi={10.1162/tacl.a.696}
}
```

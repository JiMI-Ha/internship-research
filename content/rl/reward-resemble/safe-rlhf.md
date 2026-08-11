---
title: "Safe RLHF：用动态安全约束平衡有用与无害"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Josef Dai, Xuehai Pan, Ruiyang Sun, Jiaming Ji, Xinbo Xu, Mickel Liu, Yizhou Wang, Yaodong Yang"
aliases:
  - papers/safe-rlhf
tags:
  - paper
  - RL
  - reward-resemble
  - RLHF
  - safe-RL
  - alignment
  - reward-modeling
source_url: https://arxiv.org/abs/2310.12773
---

> [!summary] 一句话结论
> Safe RLHF 不再把“有用”和“无害”压成一个静态总分，而是分别学习 reward 与 cost，并用拉格朗日乘子根据安全约束是否满足动态调节优化压力；三轮训练后，Beaver-v3 的人工标注有害响应率由 53.08% 降至 2.45%，但该结果同时包含新增偏好数据和红队数据的贡献，不能只归因于算法。

## 基本信息

- **论文**：[Safe RLHF: Safe Reinforcement Learning from Human Feedback](https://arxiv.org/abs/2310.12773)
- **作者**：Josef Dai、Xuehai Pan、Ruiyang Sun、Jiaming Ji、Xinbo Xu、Mickel Liu、Yizhou Wang、Yaodong Yang（北京大学）
- **版本**：arXiv:2310.12773v1，2023-10-19
- **代码与数据**：[PKU-Alignment/safe-rlhf](https://github.com/PKU-Alignment/safe-rlhf)
- **关键词**：安全对齐、RLHF、Constrained MDP、拉格朗日方法、Reward Model、Cost Model

## Motivation

传统 RLHF 往往让标注者用一个总体偏好同时判断回答是否有帮助、是否安全，再训练单一 Reward Model。问题是这两个目标天然可能冲突：拒答通常更安全，却可能不够有用；完整执行危险指令虽然“遵循指令”，却不应被鼓励。

论文认为，冲突不应留给标注者在一个标签里隐式折中，也不应在训练时用固定权重永久绑定。否则会出现两类问题：

1. **标注含义混杂**：不同标注者可能用不同方式权衡帮助性和无害性，降低一致性。
2. **静态权重失配**：固定的 reward shaping 权重无法随模型当前的安全水平变化；过小会牺牲安全，过大则会把模型推向过度拒答。

Safe RLHF 因而将目标改写为：**在满足安全成本约束的前提下，最大化帮助性奖励**。

## Method

### 1. 将两种偏好显式解耦

对同一 prompt 的多个回答，标注分两步进行：

- 先依据 14 类风险为每个问答对标注 safe / unsafe；
- 再分别比较两条回答的 helpfulness 与 harmlessness，不把两者合成一个总体偏好。

由此得到帮助性数据集 $D_R$ 与无害性数据集 $D_C$。在 $D_C$ 中，较有害的回答记为 $y_w$，并为每条回答附加符号标签：

$$
s(y)=
\begin{cases}
+1, & y\text{ 有害},\\
-1, & y\text{ 无害}.
\end{cases}
$$

### 2. 分别训练 Reward Model 与 Cost Model

Reward Model $R_\phi(y,x)$ 用标准 Bradley-Terry 成对偏好损失学习帮助性：

$$
\mathcal{L}_R
=-\mathbb{E}_{(x,y_w,y_l)\sim D_R}
\left[\log\sigma\left(R_\phi(y_w,x)-R_\phi(y_l,x)\right)\right].
$$

Cost Model $C_\psi(y,x)$ 同时学习“哪个回答更有害”和“回答是否越过安全边界”：

$$
\begin{aligned}
\mathcal{L}_C
=&-\mathbb{E}_{D_C}\left[\log\sigma\left(C_\psi(y_w,x)-C_\psi(y_l,x)\right)\right]\\
&-\mathbb{E}_{D_C}\left[\log\sigma\left(s_w C_\psi(y_w,x)\right)
+\log\sigma\left(s_l C_\psi(y_l,x)\right)\right].
\end{aligned}
$$

第二项把 $C_\psi(y,x)=0$ 作为 safe / unsafe 的隐式边界。这样，Cost Model 不只提供偏好方向，也能判断当前策略是否满足安全约束。

### 3. 把安全写成约束优化

策略 $\pi_\theta$ 的目标是：

$$
\max_\theta J_R(\theta)
\quad \text{s.t.}\quad
J_C(\theta)\le 0,
$$

其中

$$
J_R(\theta)=\mathbb{E}[R_\phi(y,x)],
\qquad
J_C(\theta)=\mathbb{E}[C_\psi(y,x)]+d.
$$

$d$ 控制允许的期望成本阈值。论文用拉格朗日方法求解：

$$
\min_\theta\max_{\lambda\ge0}
\left[-J_R(\theta)+\lambda J_C(\theta)\right].
$$

当平均 cost 超过阈值时，$\lambda$ 增大，训练更重视安全；满足约束后，$\lambda$ 回落，优化重新偏向帮助性。实现上，Reward 与 Cost 分别通过 PPO / GAE 估计 advantage，再组合为：

$$
\mathcal{L}_{\text{SafeRL}}
=\frac{1}{1+\lambda}
\left(\mathcal{L}_R^{\text{SafeRL}}-\lambda\mathcal{L}_C^{\text{SafeRL}}\right).
$$

论文还把 KL 惩罚平均分配到 reward 与 cost 两侧，并保留 PTX loss，避免策略偏离参考模型过远。

### 4. 三轮数据—训练闭环

每轮依次进行 prompt 更新、回答采样与人工标注、Reward / Cost Model 训练、Safe RLHF。第二、三轮加入针对上一轮模型的人工红队 prompt，因此数据分布会随模型弱点变化。

## Experimental Setup

| 项目         | 设置                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| 初始模型     | 复现的 Alpaca-7B：LLaMA-7B 在 52K Stanford Alpaca 指令上 SFT                                           |
| 偏好模型     | Reward Model 与 Cost Model 均由 LLaMA-7B 初始化                                                        |
| 训练轮次     | 3 轮，得到 Beaver-v1、Beaver-v2、Beaver-v3；Safe RLHF epoch 分别为 3 / 3 / 4                           |
| Prompt       | 开源安全数据；第 2、3 轮加入人工红队 prompt                                                            |
| 回答与配对   | 每个 prompt 生成 3–6 个不同回答，组成 $k(k-1)/2$ 个偏好对                                              |
| 标注         | 从约 200 名候选者中保留 70 名标注者；入选测试要求至少 90% 准确率；每批至少抽检 10%，验收一致率至少 90% |
| 评测集       | 14 类安全风险 prompt、未进入训练的开源 prompt、每轮红队 prompt 的 10%                                  |
| 评测方式     | 统一 Reward / Cost Model；GPT-4 成对比较 Elo；人工成对比较 Elo；人工 safe / unsafe 标签                |
| 关键训练设置 | 最大长度 512；actor learning rate $9.65\times10^{-6}$；KL 系数 0.1；PPO clip 0.1                       |

统一偏好模型本身并不完美：其 Reward Model 排序准确率为 73.95%，Cost Model 排序准确率为 70.44%，Cost Model 安全分类准确率为 85.83%。因此模型打分只应视为辅助证据，主结论更应看独立的 GPT-4 与人工评测。

## Results

### 三轮训练同时提高帮助性与无害性 Elo

以 Alpaca-7B 的 Elo 人工归一化为 1000，论文报告 Beaver-v3 相对基线的变化为：

| 评测者 | Helpfulness Elo | Harmlessness Elo |
| ------ | --------------: | ---------------: |
| GPT-4  |         +244.91 |          +268.31 |
| 人工   |         +363.86 |          +237.98 |

两个评测来源给出相同的方向性结论：三轮模型沿帮助性与无害性两个维度共同上升。不过论文没有报告 Elo 的置信区间、显著性检验或评测 prompt 数量，因此这些精确差值不应被解读为稳定的总体效应量。

### 人工标注有害响应率大幅下降

在论文自建评测集上，人工标注的有害响应占比由 Alpaca-7B 的 **53.08%** 降至 Beaver-v3 的 **2.45%**。这是一项幅度很大的安全改善，也是论文最直接的结果证据。

但三轮流程同时增加了偏好数据、改变了 prompt 组成，并在后两轮加入红队数据；因此该结果证明的是“完整 Safe RLHF 迭代流水线有效”，并不能隔离为拉格朗日优化器单独带来的提升。

### 解耦标注提高一致性

- 分别标注时，标注者间一致率为 Helpfulness **69.00%**、Safety **66.53%**；单一总体偏好标注为 **61.65%**。
- 论文称，在 10% 质量抽检中，解耦标注与研究者的一致率至少为 90%，单一总体标注则降至 80% 以下。
- 用总体偏好训练的传统 PPO 虽提升帮助性，但无害性改善明显弱于 Safe RLHF。

这些结果支持“把冲突目标留在优化阶段处理，而不是让标注者隐式权衡”的设计动机。

## Ablation

论文提供三组关键对照，但图中没有给出完整数值表：

1. **静态 Reward Shaping**：测试固定 cost 权重 $\nu\in\{0.01,0.5,1,2,5,10,100\}$。过低权重偏向帮助性，过高权重偏向无害性；中间权重仍未达到 Safe RLHF 的二维 win rate。
2. **Cost Model 改为安全分类器**：只用分类器 logit 作为 cost，提升无害性的效率低于同时学习排序和分类的 Cost Model。
3. **移除分类能力与动态乘子**：如果 Cost Model 不能判断绝对安全边界，也不更新 $\lambda$，方法退化为固定权重的 reward shaping。

这些对照支持动态约束与 Cost Model 分类项的作用，但论文没有多随机种子、误差条或数值化消融表，证据强度仍有限。

## Limitations

### 论文明确承认

1. 无法访问原始预训练数据，只能用 Stanford Alpaca 数据计算 PTX loss。
2. 缺少更大规模、高质量的 SFT 数据；单靠微调不能替代生成前后的安全检查。
3. RLHF 与人工标注成本高。
4. 当前只处理单轮对话，尚未验证多轮场景。
5. 实验基于较早的 LLaMA-1 / Alpaca-7B，模型与数据结论未必能直接外推到更新、更强的基座模型。

### 从实验设计看还需保留的判断

1. **归因混杂**：算法、更多数据、三轮迭代与红队 prompt 同时变化。
2. **统计信息不足**：未报告随机种子、误差条、置信区间或显著性检验，也未清楚给出评测集总规模。
3. **评测独立性有限**：自建评测集、统一偏好模型和训练数据共享任务定义；虽然人工评测能缓解这一问题，仍缺少标准外部 benchmark。
4. **阈值依赖**：安全约束由 Cost Model 与手工设定的 $d$ 决定；Cost Model 的误判会直接改变 $\lambda$ 和策略更新方向。
5. **安全定义覆盖有限**：14 类风险及其标注规范并不等同于覆盖所有文化、语言和真实部署风险。

## Takeaways

- 当两个目标存在硬约束关系时，“最大化加权总分”未必是正确问题；把安全写成约束，更贴近“先达标、再优化性能”的产品需求。
- 解耦标注的价值不仅是能训练两个模型，也在于减少标注者被迫解决价值冲突时产生的标签歧义。
- Cost Model 需要同时提供相对偏好与绝对边界信息，否则动态拉格朗日乘子没有可靠的约束反馈。
- 这篇论文最有说服力的是完整三轮流水线的人工安全结果；对“拉格朗日优化本身优于所有替代方案”的判断则应更谨慎。

## Citation

```bibtex
@article{dai2023saferlhf,
  title={Safe RLHF: Safe Reinforcement Learning from Human Feedback},
  author={Dai, Josef and Pan, Xuehai and Sun, Ruiyang and Ji, Jiaming and Xu, Xinbo and Liu, Mickel and Wang, Yizhou and Yang, Yaodong},
  journal={arXiv preprint arXiv:2310.12773},
  year={2023}
}
```

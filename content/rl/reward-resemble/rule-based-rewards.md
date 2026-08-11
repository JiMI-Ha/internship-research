---
title: "Rule Based Rewards：把安全规范编译成可训练奖励"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Tong Mu, Alec Helyar, Johannes Heidecke, Joshua Achiam, Andrea Vallone, Ian Kivlichan, Molly Lin, Alex Beutel, John Schulman, Lilian Weng"
aliases:
  - papers/rule-based-rewards
tags:
  - paper
  - RL
  - reward-resemble
  - RLHF
  - safety-alignment
  - rule-based-reward
  - over-refusal
source_url: https://arxiv.org/abs/2411.01111
---

> [!summary] 一句话结论
> Rule Based Rewards（RBR）把自然语言安全政策拆成可判定规则，用 LLM grader 生成规则满足概率，再拟合一组线性奖励权重；在论文的安全分布上，RBR-PPO 同时达到 97.27% Not-Unsafe 与 97.01% Not-Overrefuse，优于只强调帮助性或人工安全偏好的 PPO，但结论仍受 grader 偏差和有限政策覆盖约束。

## 基本信息

- **论文**：[Rule Based Rewards for Language Model Safety](https://arxiv.org/abs/2411.01111)
- **作者**：Tong Mu、Alec Helyar、Johannes Heidecke、Joshua Achiam、Andrea Vallone、Ian Kivlichan、Molly Lin、Alex Beutel、John Schulman、Lilian Weng（OpenAI）
- **版本**：arXiv:2411.01111v1，2024-11-02；NeurIPS 2024
- **关键词**：安全对齐、可组合规则、LLM grader、合成偏好、过度拒答

## Motivation

安全对齐通常依赖人工偏好数据，但“什么时候应拒答、什么时候应合规回答、拒答中应该说什么”是一套会持续演化的细粒度政策。每次政策变化都重新采集大量偏好数据，速度慢、成本高，而且人类标注者未必能稳定执行复杂规范。

另一方面，简单的安全分类奖励只回答“是否安全”，容易把模型推向一律拒答；通用帮助性 Reward Model 又可能偏好完整执行危险请求。作者希望得到一种介于硬编码过滤器与大规模人工偏好之间的机制：

1. 直接从自然语言政策构造训练信号；
2. 能把安全、拒答风格与合规回答等不同规则组合起来；
3. 政策修改时主要改规则和合成数据，而不是重做整套人工标注。

## Method

### 1. 把行为政策拆成 propositions

作者先把期望行为拆成多个可二元判断的 proposition，例如“回答是否包含不允许的内容”“是否进行了硬拒绝”“是否提供了安全替代方案”。每个规则都包含自然语言定义与示例，使 LLM grader 能针对 prompt–completion 对输出满足该 proposition 的概率。

设 grader 产生的特征为 $\phi_i(p,c)$，其中 $p$ 是 prompt、$c$ 是 completion。RBR 与已有帮助性 Reward Model 相加：

$$
R_{\text{tot}}(p,c)=R_{\text{RM}}(p,c)+\sum_i w_i\phi_i(p,c).
$$

这种线性结构让每条政策的作用可以检查，也允许按内容类别配置不同规则。

### 2. 用合成排序数据学习规则权重

研究者为每个安全 prompt 合成四种具有不同合规程度的回答，并依据政策给出目标排序。权重 $w_i$ 不是手工逐项调整，而是用 hinge ranking loss 拟合，使总奖励满足这些排序关系。

训练权重只需要 grader 特征、基础 RM 分数和合成排序，不需要为每次规则更新重新收集真人成对偏好。学到 RBR 后，将它作为 PPO 的额外奖励训练策略。

### 3. 分离“内容安全”与“过度拒答”

规则同时覆盖两侧错误：对危险请求应拒答并遵循规定风格；对安全请求则不应无故拒绝。作者因此分别报告 **Not-Unsafe** 与 **Not-Overrefuse**，并用二者的调和平均 F1 衡量折中，而不是只看拒答率。

## Experimental Setup

| 项目             | 设置                                                             |
| ---------------- | ---------------------------------------------------------------- |
| Safety prompts   | 6.7K，覆盖论文定义的有限内容政策类别                             |
| Gold completions | 518 条人工撰写/标注回答，用于高质量校验                          |
| 合成排序数据     | 每个 6.7K prompt 生成 4 条不同策略回答，形成约 26.8K completions |
| 策略训练         | 在帮助性 RM 基础上比较 Helpful-PPO、Human-PPO 与 RBR-PPO         |
| 核心指标         | 人工评测 Not-Unsafe、Not-Overrefuse 及二者 F1                    |
| 其他分析         | grader 尺度、合成 prompt 数、拒答/合规样本比例和训练组件消融     |

“Not-Unsafe”与“Not-Overrefuse”分别测量危险内容控制和对安全请求的正常服务能力。两项都高才代表模型没有用全面拒答换取表面安全。

## Results

### 人工评测中的安全—过拒折中

| 方法        |         Not-Unsafe |    Not-Overrefuse |               F1 |
| ----------- | -----------------: | ----------------: | ---------------: |
| Helpful-PPO |      $93.64\pm1.3$ | **$98.13\pm0.8$** |     $95.8\pm0.8$ |
| Human-PPO   | **$100.00\pm0.0$** |     $84.70\pm2.2$ |     $91.7\pm1.3$ |
| RBR-PPO     |      $97.27\pm0.9$ |     $97.01\pm1.0$ | **$97.1\pm0.7$** |

- Helpful-PPO 最少过拒，但安全率不如另外两种方法。
- Human-PPO 在该评测上完全避免 unsafe 回答，却把 Not-Overrefuse 降至 84.70%，表现出明显的安全过优化。
- RBR-PPO 没有在任一单项取极值，但取得最高 F1，说明它在该测试分布上更好地平衡了两类错误。

结果支持“规则奖励可替代一部分安全行为偏好采集”的主张，但不能推出 RBR 已覆盖开放世界安全：评测政策类别与用于构造规则的数据定义高度一致。

## Ablation

1. **Grader 尺度**：更强的 grader 产生更低的 proposition 判断错误，说明 RBR 上限受规则判定模型能力约束。
2. **合成数据量**：每个类别约 300 个 prompts 后，权重拟合已进入较低错误区间；继续增加数据的边际收益下降。
3. **响应类型比例**：改变 hard-refusal 与 compliance 合成样本比例，会让模型沿安全—过度拒答轴移动，表明数据构成实际编码了政策折中。
4. **训练组件**：移除 SFT、基础 RM 或 RBR 会把模型推到不同的 Pareto 区域；RBR 不是独立完成全部对齐，而是与帮助性 RM 和初始化共同工作。

## Limitations

1. RBR 最适合能拆成清晰、可判定规则的行为；主观写作质量、真实性和复杂情境判断较难用二元 proposition 表达。
2. LLM grader 可能继承或放大模型偏差，错误的高置信判断会直接变成策略优化信号。
3. 实验只覆盖论文选定的内容政策，并不代表完整的现实部署风险。
4. 合成回答的模板、比例和排序隐式决定安全—帮助性权衡，政策作者仍需做价值判断。
5. 规则奖励可能被策略利用；论文结果证明的是所测分布上的表现，尚不足以排除更强的 reward hacking。

## Takeaways

- RBR 的核心不是“让 LLM 自己决定安全”，而是把人写的政策编译成一组可组合、可检查的训练特征。
- 同时测量 unsafe 与 over-refusal 很重要；只看安全率会错误地奖励全面拒答。
- 线性规则奖励便于政策快速更新，但可靠性上限由规则可判定性、grader 校准和测试覆盖共同决定。
- 最强证据是 RBR-PPO 在同一人工评测上取得更好的双指标平衡，而不是它能全面替代真人安全监督。

## Citation

```bibtex
@inproceedings{mu2024rulebasedrewards,
  title={Rule Based Rewards for Language Model Safety},
  author={Mu, Tong and Helyar, Alec and Heidecke, Johannes and Achiam, Joshua and Vallone, Andrea and Kivlichan, Ian and Lin, Molly and Beutel, Alex and Schulman, John and Weng, Lilian},
  booktitle={Advances in Neural Information Processing Systems},
  year={2024}
}
```

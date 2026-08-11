---
title: "C-DPO：用动态拉格朗日乘子约束直接偏好优化"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
authors: "Zixuan Liu, Xiaolin Sun, Zizhan Zheng"
aliases:
  - papers/constrained-dpo
tags:
  - paper
  - RL
  - reward-resemble
  - DPO
  - safety-alignment
  - constrained-optimization
  - Lagrangian
source_url: https://arxiv.org/abs/2403.02475
---

> [!summary] 一句话结论
> C-DPO 用动态拉格朗日乘子把安全 cost 约束加入 DPO，并按当前的 reward–cost 分数重标偏好对；在 BeaverTails / Llama-2-7B 上，$\lambda=0.4$ 的设置以平均 reward 4.26、cost -0.58 达到最高的可行 reward，但结果方差很大、只有一个 seed，而且训练与评测复用了同一组代理模型。

## 基本信息

- **论文**：[Enhancing LLM Safety via Constrained Direct Preference Optimization](https://arxiv.org/abs/2403.02475)
- **作者**：Zixuan Liu、Xiaolin Sun、Zizhan Zheng
- **版本**：arXiv:2403.02475v1，2024-03-04；workshop submission
- **关键词**：DPO、安全约束、拉格朗日对偶、BeaverTails、偏好重标

## Motivation

DPO 用离线偏好直接训练策略，避免完整 PPO 流水线，但标准 DPO 只优化单一偏好。若把帮助性和安全性先压成固定加权分数，权重太小会违反安全边界，权重太大又会牺牲帮助性；不同模型训练阶段需要的权重也未必相同。

作者希望保留 DPO 的离线训练形式，同时把安全表达为明确约束：**在期望 cost 不超过阈值的策略中，最大化 reward**。乘子应依据当前违反约束的程度动态更新，而不是预先固定。

## Method

### 1. 拉格朗日化 reward 与 cost

给定帮助性 reward $r(x,y)$ 与安全 cost $c(x,y)$，当前乘子 $\lambda$ 下的组合分数为：

$$
r_\lambda(x,y)=r(x,y)-\lambda c(x,y).
$$

对每个候选回答对，C-DPO 按 $r_\lambda$ 重新决定 chosen 与 rejected，再运行标准 DPO 更新。这使“偏好方向”会随着安全压力变化：违反约束时，高 cost 回答即使 reward 较高也可能被重标为 rejected。

### 2. 动态更新乘子

对偶函数关于 $\lambda$ 的梯度为：

$$
\frac{\mathrm{d}g}{\mathrm{d}\lambda}
=\mathbb{E}\left[C_{\text{limit}}-c(x,y)\right].
$$

当策略平均 cost 超过 $C_{\text{limit}}$ 时，更新会增大 $\lambda$，强化安全惩罚；满足约束后则减小安全压力。论文同时测试不同初始 / 固定乘子，观察 reward–cost 权衡。

## Experimental Setup

| 项目     | 设置                                            |
| -------- | ----------------------------------------------- |
| 模型     | Llama-2-7B                                      |
| 训练数据 | BeaverTails 15K 子集                            |
| 测试     | 2,000 prompts，每个 prompt 采样 5 个 responses  |
| 评分     | Beaver reward model 与 cost model               |
| 安全阈值 | 期望 cost $\le 0$                               |
| 对照     | SFT、标准 DPO、Beaver-v1 与多组 C-DPO $\lambda$ |
| 计算     | 单张 A100 40GB；seed 42                         |

## Results

| 方法                 | Reward（均值 ± 标准差） | Cost（均值 ± 标准差） | 是否满足平均 cost $\le0$ |
| -------------------- | ----------------------: | --------------------: | :----------------------: |
| SFT                  |           $1.78\pm7.07$ |       $10.63\pm19.72$ |            否            |
| DPO                  |       **$6.16\pm6.15$** |       $12.45\pm18.63$ |            否            |
| Beaver-v1            |           $0.39\pm6.01$ |  **$-11.64\pm10.14$** |            是            |
| C-DPO，$\lambda=1$   |           $2.90\pm5.79$ |       $-9.47\pm12.41$ |            是            |
| C-DPO，$\lambda=0.4$ |       **$4.26\pm5.59$** |       $-0.58\pm16.70$ |            是            |

标准 DPO 得到最高 reward，却比 SFT 更不安全。C-DPO $\lambda=0.4$ 的平均 cost 略低于阈值 0，并在满足平均约束的方法中获得最高 reward；$\lambda=1$ 与 Beaver-v1 更安全，但帮助性更低。

这一表格支持动态/可调安全约束能在平均指标上选择可行策略，但不确定性很大：C-DPO $\lambda=0.4$ 的 cost 标准差为 16.70，远大于均值距阈值的 0.58。论文未给均值置信区间或显著性检验，因此不能声称该配置可靠地对每类 prompt 都安全，也不能确认它与其他方法的差异具有统计显著性。

## Ablation

论文主要通过不同 $\lambda$ 设置展示权衡：

- 较小 $\lambda$ 更接近标准 DPO，reward 上升但 cost 容易越界；
- 较大 $\lambda$ 明显降低 cost，同时牺牲 reward；
- $\lambda=0.4$ 在报告均值上接近安全边界，体现约束优化寻找“最高可行 reward”的目标。

论文没有提供多随机种子、移除重标步骤或固定乘子与动态乘子的完整数值消融，因此各组件的独立贡献尚未被充分隔离。

## Limitations

1. 所有主结果只有 seed 42；标准差是样本响应差异，不是训练重复的不确定性。
2. reward / cost 方差很大，且没有置信区间与显著性检验。
3. 训练目标和最终评测都使用 Beaver reward / cost models，可能奖励针对代理模型的过拟合。
4. 只验证 Llama-2-7B 与 BeaverTails 一个数据设置，外推性有限。
5. 方法仍需显式 reward model 与 cost model，并未完全保留 DPO“不单独训练 RM”的简洁优势。
6. 约束只控制总体期望 cost；平均可行不代表每个风险类别、每条 prompt 或尾部风险都达标。

## Takeaways

- C-DPO 把安全从固定惩罚改成约束反馈，并让偏好标签随乘子重新排序。
- 论文最直接的结果是 $\lambda=0.4$ 在代理模型均值上落到 cost 阈值内，同时保留较高 reward。
- 大方差、单 seed 和评测复用代理模型显著削弱证据；这更像一个有前景的 workshop 级验证，而非已经稳健确立的结论。
- 实际使用还需要独立安全评测、多次训练和风险分层指标，不能只看期望 cost。

## Citation

```bibtex
@article{liu2024constraineddpo,
  title={Enhancing LLM Safety via Constrained Direct Preference Optimization},
  author={Liu, Zixuan and Sun, Xiaolin and Zheng, Zizhan},
  journal={arXiv preprint arXiv:2403.02475},
  year={2024}
}
```

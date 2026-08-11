---
title: "Rewarded Soups：插值目标专家权重生成 Pareto 策略"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Alexandre Ramé, Guillaume Couairon, Mustafa Shukor, Corentin Dancette, Jean-Baptiste Gaya, Laure Soulier, Matthieu Cord"
aliases: [papers/rewarded-soups]
tags: [paper, RL, reward-resemble, multi-objective, model-merging, Pareto]
source_url: https://arxiv.org/abs/2306.04488
---

> [!summary] 一句话结论
> 每个 reward 只训练一个专家，然后在线性权重空间插值；共享初始化使这些专家常保持线性 mode connectivity，从 $N$ 次训练近似出连续 Pareto front。

## 基本信息

- **论文**：[Rewarded Soups: Towards Pareto-Optimal Alignment by Interpolating Weights Fine-Tuned on Diverse Rewards](https://arxiv.org/abs/2306.04488)
- **版本**：arXiv:2306.04488v2，2023-10-16
- **关键词**：weight interpolation、multi-policy、model soup、Pareto

## Motivation

对 $N$ 个目标的每个权重组合单独训练 MORL policy 不可扩展；只训练一个加权模型又提前固化偏好。论文利用同一预训练初始化下微调解的线性连通性，尝试训练后再选择 trade-off。

## Method

分别最大化每个代理 reward 得到参数 $\theta_i$，部署时计算：

$$
\theta(\lambda)=\sum_i\lambda_i\theta_i,
\qquad \lambda\in\Delta^N.
$$

如果插值模型的实际 reward 不低于端点 reward 的线性插值，并形成与多次 MORL 训练接近的 front，则可用 $N$ 个专家代替大量权重点模型。

## Experimental Setup

覆盖 LLaMA-7B 的摘要、问答、助手与评论生成，也测试图文生成、视觉定位/VQA 和 locomotion。LLM 用 PPO+LoRA，每个目标独立训练；比较直接多目标 RL 的经验 front。

## Results

在新闻与 Reddit 摘要等任务中，两端专家的权重插值形成接近或外于多次 MORL 训练的 front；相同现象跨文本、视觉和控制任务出现。证据以 front 图为主，没有统一显著性检验，因此更适合解读为广泛经验规律而非保证。

## Ablation

从共享初始化训练是关键；论文通过插值路径检查线性连通性。不同任务中插值优势大小不一，且目标越多，simplex 覆盖仍会变稀。

## Limitations

- 权重插值没有理论保证，跨不同初始化、训练 recipe 或强分叉专家可能失效。
- 仍需为每个目标训练并保存一个专家。
- 插值系数与实际 reward trade-off 通常非线性，需要部署前扫描校准。
- 代理 reward front 不能证明真实人类效用 Pareto-optimal。

## Takeaways

- 已有目标专家时，权重插值是成本极低的 Pareto baseline。
- 合并前应画插值路径并检查所有关键约束，不能只验证端点。
- 该方法组合参数；PRISM 等方法组合 token-level policy，二者机制不同。

## Citation

```bibtex
@article{rame2023rewarded,
  title={Rewarded Soups: Towards Pareto-Optimal Alignment by Interpolating Weights Fine-Tuned on Diverse Rewards},
  author={Ram\'e, Alexandre and Couairon, Guillaume and Shukor, Mustafa and others},
  journal={arXiv preprint arXiv:2306.04488},
  year={2023}
}
```

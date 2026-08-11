---
title: "COS-DPO：一次条件训练覆盖多目标 Pareto Front"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Yinuo Ren, Tesi Xiao, Michael Shavlovsky, Lexing Ying, Holakou Rahmanian"
aliases: [papers/cos-dpo]
tags: [paper, RL, reward-resemble, multi-objective, DPO, conditioned-policy]
source_url: https://arxiv.org/abs/2410.08316
---

> [!summary] 一句话结论
> COS-DPO 把目标权重直接作为模型条件，一次训练即可在推理时选择 Pareto trade-off；权重条件控制 front 位置，温度条件进一步控制主目标与辅助目标的尺度。

## 基本信息

- **论文**：[COS-DPO: Conditioned One-Shot Multi-Objective Fine-Tuning Framework](https://arxiv.org/abs/2410.08316)
- **版本**：arXiv:2410.08316v3，2025-06-20
- **勘误**：清单中的 `2410.06513` 实际是 MotionRL；本文正确 ID 为 `2410.08316`。
- **关键词**：conditioned DPO、one-shot Pareto、hyper prompt、temperature control

## Motivation

MODPO/线性标量化通常为每个权重训练一份模型，目标数增加后训练与存储迅速增长。模型 soup 虽可插值，也要维护多个完整 checkpoint。COS-DPO 试图训练一个以连续权重为输入的模型。

## Method

Weight-COS-DPO 从 simplex 采样权重 $w$，把 $w$ 通过 conditioned network 或 hyper prompt 注入模型，并最小化 $w^TL_{\text{DPO}}$。Temperature-COS-DPO 进一步把每目标温度 $\beta$ 作为输入；论文利用 DPO loss 的线性变换性质，使训练后也能缩放 front。

## Experimental Setup

- Learning-to-rank：MSLR-WEB10K，最多五个辅助目标。
- LLM 对齐：PKU-SafeRLHF，helpfulness–safety 等目标，LoRA + hyper prompt。
- 基线：DPO linear scalarization、DPO Soup、MODPO；指标为 hypervolume、主目标 NDCG 和训练时间。

## Results

五辅助目标 LTR 上，W-COS-DPO hypervolume 为 **2.039e-3**，高于 DPO-LS 1.648e-3、Soup 1.468e-3、MODPO 1.263e-3；训练时间 **4043s**，也低于三种基线。LLM 实验的 Pareto front 总体覆盖更完整，但主要以图形证据呈现。

## Ablation

论文检查了 Dirichlet 采样浓度、模型深度与两种条件参数化。Temperature-COS-DPO 只做初步 LTR 验证；高维 LLM 上的温度控制证据仍有限。

## Limitations

- 线性 scalarization 对非凸 front 仍有限制。
- LLM 实验规模和人工评价有限，部分关键结论来自 LTR。
- 连续条件是否在训练权重之外可靠插值，依赖模型容量和采样覆盖。
- Hyper prompt 引入新接口，可能被错误或恶意权重调用。

## Takeaways

- 需要一个模型覆盖连续偏好时，COS-DPO 比“每权重一模型”更接近可部署方案。
- 权重采样分布本身是训练设计的一部分，应覆盖真实业务常用区间。
- Hypervolume 必须与主目标不退化一起报告。

## Citation

```bibtex
@article{ren2024cosdpo,
  title={COS-DPO: Conditioned One-Shot Multi-Objective Fine-Tuning Framework},
  author={Ren, Yinuo and Xiao, Tesi and Shavlovsky, Michael and Ying, Lexing and Rahmanian, Holakou},
  journal={arXiv preprint arXiv:2410.08316},
  year={2024}
}
```

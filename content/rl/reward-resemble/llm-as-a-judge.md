---
title: "MT-Bench 与 Chatbot Arena：系统检验 LLM-as-a-Judge"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Lianmin Zheng, Wei-Lin Chiang, Ying Sheng, Siyuan Zhuang, Zhanghao Wu, Yonghao Zhuang, Zi Lin, Zhuohan Li, Dacheng Li, Eric P. Xing, Hao Zhang, Joseph E. Gonzalez, Ion Stoica"
aliases:
  - papers/llm-as-a-judge
tags:
  - paper
  - RL
  - reward-resemble
  - LLM-judge
  - benchmark
source_url: https://arxiv.org/abs/2306.05685
---

> [!summary] 一句话结论
> 强 LLM judge 与人类偏好可达到 80% 以上一致，但存在位置、冗长、自增强和推理偏差；论文给出的关键启示不是“可以取消人评”，而是必须用交换顺序、参考答案和 Arena 人票校准自动 judge。

## 基本信息

- **论文**：[Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685)
- **版本**：arXiv:2306.05685v4，2023-12-24
- **关键词**：MT-Bench、Chatbot Arena、position bias、human agreement

## Motivation

开放式聊天没有唯一答案，传统 benchmark 难以覆盖多轮指令和人类偏好。纯人评昂贵且慢。作者一方面建立自动多轮评测与公开人类竞技场，另一方面系统测量 LLM judge 何时可信、何时偏置。

## Method

MT-Bench 用 80 道多轮问题和固定 judge prompt 评分；Chatbot Arena 让真实用户盲选两模型回答。LLM judge 支持 pairwise、single-answer 与 reference-guided 评测。为缓解位置偏差，保守协议交换 A/B 顺序，只有两次判断一致才记胜，否则记平。

## Experimental Setup

- MT-Bench 收集约 3K 专家投票；Arena 早期数据含约 30K 人类偏好对话。
- 对比 GPT-4、GPT-3.5、Claude 等 judge 与 58 名专家及众包用户。
- 单独构造位置、冗长度、自增强、数学/推理测试。
- 比较 zero-shot、few-shot、CoT 和 reference-guided judge。

## Results

GPT-4 等强 judge 与人类偏好一致率超过 **80%**，接近人类之间的一致水平。与此同时，默认 pairwise prompt 中 GPT-4 交换顺序一致率仅 **65.0%**，GPT-3.5 为 **46.2%**，Claude-v1 为 **23.8%**；说明总体一致率不能掩盖位置敏感性。

## Ablation

few-shot 可把 GPT-4 的顺序一致率从 65.0% 提高到 **77.5%**，但 API 成本约增 4 倍且可能引入新偏差。CoT 对数学推理帮助有限，因为 judge 可能与候选答案犯同样的错；提供 reference answer 更可靠。交换顺序是最直接的防护。

## Limitations

- 强 judge 对自己的回答或同类风格有自增强偏差。
- 偏爱更长答案，除非 prompt 明确控制。
- judge 与候选共享知识盲点时，CoT 不能提供独立验证。
- Arena 人群与题目分布并不代表所有业务用户。

## Takeaways

- 任何 pairwise judge 都应做 A/B swap，并报告不一致率。
- 可验证任务优先提供 reference 或工具结果，不要只让 judge 自行推理。
- 自动分数适合高频迭代，人票适合校准与发现新偏差。

## Citation

```bibtex
@article{zheng2023judging,
  title={Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena},
  author={Zheng, Lianmin and Chiang, Wei-Lin and Sheng, Ying and others},
  journal={arXiv preprint arXiv:2306.05685},
  year={2023}
}
```

---
title: "RLCF：用指令级 Checklist 代替固定 Reward Model"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: paper
business_fit: 0
paper_solidity: 0
authors: "Vijay Viswanathan, Yanchao Sun, Shuang Ma, Xiang Kong, Meng Cao, Graham Neubig, Tongshuang Wu"
aliases:
  - papers/checklist-feedback
tags:
  - paper
  - RL
  - reward-resemble
  - checklist
  - instruction-following
  - DPO
source_url: https://arxiv.org/abs/2507.18624
---

> [!summary] 一句话结论
> RLCF 不用固定的“helpful/harmless”总分，而是从每条指令抽取 checklist，逐项核验后训练；它是论文中唯一在五个指令遵循 benchmark 上都改善的方法，但判分成本很高。

## 基本信息

- **论文**：[Checklists Are Better Than Reward Models For Aligning Language Models](https://arxiv.org/abs/2507.18624)
- **版本**：arXiv:2507.18624v2，2025-12-01
- **关键词**：checklist feedback、instruction following、DPO、AI judge

## Motivation

固定 Reward Model 把所有用户需求压成少数通用属性，容易漏掉“必须包含三项、使用指定格式、避免某种内容”等实例级约束。RLCF 直接把指令转成可检查要求，使 reward 解释为“具体漏了什么”。

## Method

系统先从自然指令抽取原子 checklist；能程序验证的项目交给专门 verifier，其余由 Qwen2.5-72B-Instruct judge 逐项判定。各项分数合成为成对偏好，形成 WildChecklists 数据并用 DPO 更新策略。论文同时比较蒸馏 SFT、现成 Reward Model、UltraFeedback 与直接 AI-judge 偏好。

## Experimental Setup

- 主要基座：Qwen2.5-7B-Instruct，也测试 7B Base。
- 指令遵循：IFEval、FollowBench、InFoBench；开放偏好：AlpacaEval 与 Arena-Hard。
- 对 130K 指令的回答对逐项评分，主要 judge 为 Qwen2.5-72B-Instruct。

## Results

- RLCF 是唯一在全部评测上都提升的方案。
- FollowBench 的 constraint satisfaction level 相对提高 **8.2%**，hard satisfaction 平均相对提高 **5.5%**。
- InFoBench overall 从 **78.1** 提升到 **84.1**；IFEval loose prompt 从 **75.0** 提升到 **77.3**。
- Arena-Hard win rate 约提高 3 个点。现成 RM 在 InFoBench 有帮助，却常损害 IFEval，说明通用偏好分数不能稳定代表精确约束满足。

## Ablation

论文显示减少一半 checklist 判分可明显降本，但会有小幅性能损失；程序 verifier 与 AI judge 的混合优于完全依赖单一通用判分器。收益在开放语义约束上大于简单格式约束。

## Limitations

- 属于 strong-to-weak 设置：72B judge 监督 7B policy，不能证明弱 judge 自举也成立。
- 只研究偏好式 RL/DPO，没有验证 policy-gradient 训练。
- 完整评分约需 **8×80GB H100 运行 4 天**，对多数团队成本过高。
- Checklist 抽取错误会系统性改变 reward，尚缺少人类逐项审计规模实验。

## Takeaways

- 对复杂业务指令，实例级 checklist 比通用 RM 分数更容易调试和追责。
- 应优先用程序规则处理确定性约束，把 LLM judge 留给真正语义化的项目。
- 部署前要单独预算 rubric 生成与判分成本，不能只看 policy 训练成本。

## Citation

```bibtex
@article{viswanathan2025checklists,
  title={Checklists Are Better Than Reward Models For Aligning Language Models},
  author={Viswanathan, Vijay and Sun, Yanchao and Ma, Shuang and others},
  journal={arXiv preprint arXiv:2507.18624},
  year={2025}
}
```

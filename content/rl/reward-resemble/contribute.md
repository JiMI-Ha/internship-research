---
title: "Reward Resemble 协作维护指南"
created: 2026-08-11
published: 2026-08-11
modified: 2026-08-11
type: guide
tags:
  - RL
  - reward-resemble
  - contribution-guide
---

> [!summary] 两种参与方式
> 只想推荐论文：提交一个 Paper Issue 即可。愿意完成阅读笔记：先在 Issue 认领，再按统一模板提交 Pull Request，避免多人重复工作。

## 不写代码也能参与

打开 **[推荐 / 认领论文](https://github.com/JiMI-Ha/internship-research/issues/new?template=paper-review.yml)**，填写：

- 公开论文链接或 arXiv 地址；
- 它与 reward design、Reward Model、多目标或约束优化的关系；
- 最值得核对的主张或实验；
- 你是仅推荐，还是准备认领撰写。

维护者可以基于这些信息排重、分类并邀请其他成员完成全文阅读。

## 提交一篇完整笔记

### 1. 认领与命名

先查看 [现有 Issues](https://github.com/JiMI-Ha/internship-research/issues)，确认没有重复条目。认领后使用稳定、简洁的英文 slug，例如：

```text
content/rl/reward-resemble/rule-based-rewards.md
```

### 2. Frontmatter

每篇页面至少提供：

```yaml
---
title: "中文页面标题"
created: YYYY-MM-DD
published: YYYY-MM-DD
modified: YYYY-MM-DD
type: paper
authors: "Author One, Author Two"
tags:
  - paper
  - RL
  - reward-resemble
source_url: https://arxiv.org/abs/xxxx.xxxxx
---
```

### 3. 正文结构

```markdown
> [!summary] 一句话结论
> 用一句话说明方法、最强证据和最重要的限制。

## 基本信息

## Motivation

## Method

## Experimental Setup

## Results

## Ablation

## Limitations

## Takeaways

## Citation
```

如果论文没有消融实验，请直接说明“论文未提供组件消融”，不要为了补齐结构而编造对照。

### 4. 证据要求

- 阅读方法、实验、附录和局限章节，不只依赖摘要。
- 表格数字应与原论文一致，并保留单位、误差条和评测条件。
- 区分作者解释与实验事实；相关性结果不得改写成因果结论。
- 对单 seed、小样本、无显著性检验、同源 judge 或代理模型评测明确降级表述。
- 引用能够可靠核对时再加入；不要猜作者、会议或 BibTeX 信息。

### 5. 更新入口

新增 Reward Resemble 论文时，同时更新：

1. `content/papers/index.md`
2. `content/rl/index.md`
3. `content/rl/reward-resemble/index.md`
4. `content/index.md` 的“最新调研”

保留已有论文入口，不覆盖其他成员的历史内容。

### 6. 本地验证

```bash
npm ci
npm run build
npx tsc --noEmit
npx prettier <本次修改的文件> --check
```

依赖已经安装时可跳过 `npm ci`。提交前还要打开本地页面，检查标题、公式、表格、链接与浏览器控制台。

### 7. Pull Request

从独立分支提交 PR；建议分支名为 `paper/<slug>`。PR 中说明：

- 新增了哪篇论文；
- 核对了哪些主结果与消融；
- 哪些结论证据有限；
- 本地执行过哪些验证。

仓库会通过 PR 模板再次提示必要检查。PDF、截图、临时渲染文件、密钥和个人信息不得提交。

## Review 建议

Review 时优先检查以下问题，而不是只改措辞：

1. Motivation 是否由论文证据支持，还是作者自行推测？
2. 方法公式中的符号、优化方向和约束是否写反？
3. 主结果是否选取了公平对照，并说明统计不确定性？
4. Ablation 是否真的支持对应组件的作用？
5. Limitations 是否包含论文明确承认和实验设计暴露的边界？

回到 [[rl/reward-resemble/|Reward Resemble 系列首页]]。

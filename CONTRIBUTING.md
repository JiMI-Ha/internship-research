# 参与维护实习调研

谢谢你一起维护论文笔记。最简单的参与方式，是通过 [Paper Issue](https://github.com/JiMI-Ha/internship-research/issues/new?template=paper-review.yml) 推荐或认领论文；完成全文阅读后，也可以直接提交 Pull Request。

Reward Resemble 系列的详细写作规范见站内 [协作维护指南](https://jimi-ha.github.io/internship-research/rl/reward-resemble/contribute)。

## 提交流程

1. 搜索现有页面与 Issues，避免重复。
2. 在 Issue 中认领论文并确认分类。
3. 从独立分支新增 Markdown 页面，建议分支名 `paper/<slug>`。
4. 按 Motivation、Method、Experimental Setup、Results、Ablation、Limitations、Takeaways、Citation 组织正文。
5. 更新论文总索引、主题索引和首页“最新调研”。
6. 完成本地验证后提交 Pull Request。

## 内容标准

- 阅读完整相关章节，不只依赖摘要。
- 方法公式、实验设置和主结果必须能回溯到原文。
- 不编造论文没有提供的数字、结论、因果解释或引用信息。
- 对单 seed、小样本、不显著、同源 judge 和代理评测明确降低结论强度。
- 没有消融实验时如实说明，不为满足模板而补造内容。
- 不提交论文 PDF、密钥、个人信息或临时渲染文件。

## 本地检查

```bash
npm ci
npm run build
npx tsc --noEmit
npx prettier <本次修改的文件> --check
```

依赖已安装时可以跳过 `npm ci`。同时在浏览器中检查新页面的标题、公式、表格、链接和控制台。

## Reward Resemble 新论文需要更新的入口

- `content/papers/index.md`
- `content/rl/index.md`
- `content/rl/reward-resemble/index.md`
- `content/index.md` 的“最新调研”

如果暂时不准备写完整笔记，只提交论文链接和推荐理由也非常有价值。

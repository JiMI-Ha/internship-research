# Contributing

感谢你帮助维护这个以证据为中心的研究工作台。贡献可以是论文解读、Topic 地图、Lens 配置、校验工具、文档或站点改进。

开始前请阅读：

- [研究工作台模型](docs/research-workspace-model.md)
- [工作流](docs/workflow.md)
- [评分与排序](docs/scoring.md)
- [隐私、版权与来源政策](docs/privacy-and-copyright.md)

## 贡献论文或专题

1. Fork 仓库并创建分支。
2. 从 `content/templates/paper.md` 或 `content/templates/topic.md` 复制模板。
3. 论文页面必须提供公开来源链接，并尽量阅读全文与补充材料。
4. 用原文支持 Results、消融、敏感性与限制；无法核验时写清楚“未报告”或证据限制。
5. 为当前 Topic 补充机制证据；不要把“论文没有提到”写作“论文没有这个能力”。
6. 如需排序，建立或更新明确的 Lens；不要把当前业务筛选分伪装成论文总分。
7. 如提供个人判断，独立填写 Interesting、Solid、Priority 与理由。

## 本地检查

```bash
npm ci
npm run check:workspace
npm run build
```

`validate:content` 的目标是发现破损的 frontmatter、无效来源链接字段和明显缺失的结构。它会对历史内容输出警告，但不会把探索性笔记、综述或尚未读完的论文机械地挡在工作流之外。

## Pull Request 说明

请在 PR 描述中说明：

- 新增或修改了哪些页面；
- 论文的公开来源与版本；
- 是否核对过关键数字、实验设置与消融；
- Lens 或评分口径发生了什么变化；
- 已运行哪些本地检查；
- 是否存在版权、隐私或证据边界需要维护者注意。

维护者可以要求补充来源、下调没有充分证据的表述、将未知改为 `unknown`，或拒绝包含版权 / 隐私风险的提交。

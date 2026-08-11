# 实习调研自动发布规则

## 触发条件

当用户提供一篇论文（PDF、本地文件、arXiv 或论文链接），并要求以下任一内容时，自动执行完整发布流程：

- `motivation method 和 results`
- `motivation、method、results`
- “整理/总结论文的动机、方法和结果”或语义等价的请求

用户无需再次说“上传网站”“发布”或“推送”。该触发语本身即代表用户授权：在完成论文分析后，将笔记发布到“实习调研”网站。

如果用户明确说“不要发布”“只在聊天里回答”或“先别上传”，则只提供分析，不改动网站。

## 论文分析要求

1. 阅读完整相关章节，不得只依赖摘要。
2. 核对方法公式、实验设置、主结果、消融实验和局限。
3. 不得编造论文中没有的数字、结论或因果解释。
4. 对不显著、样本量较小或证据有限的结论明确降级表述。
5. 页面至少包含：
   - 基本信息与原文链接
   - Motivation
   - Method
   - Experimental Setup
   - Results
   - Ablation（论文提供时）
   - Limitations
   - Takeaways
   - Citation（能够可靠获得时）

## 网站发布流程

网站仓库为当前仓库，线上地址为 <https://jimi-ha.github.io/internship-research/>。

每次触发后：

1. 按主题分类创建独立 Markdown 页面，文件名使用稳定、简洁的英文 slug。RL 奖励设计与聚合类论文归入 `content/rl/reward-resemble/`；其他主题优先复用已有分类，不存在时再创建清晰的分类目录。
2. 使用完整 frontmatter，至少包含 `title`、`created`、`published`、`modified`、`type`、`tags` 和 `source_url`。
3. 将新论文加入 `content/papers/index.md`。
4. 将新论文加入对应分类及系列的 `index.md`。RL 奖励设计与聚合类论文同时加入 `content/rl/index.md` 和 `content/rl/reward-resemble/index.md`。
5. 更新 `content/index.md` 的“最新调研”，使最新论文位于首位；保留已有论文入口，不要覆盖历史内容。
6. 运行：
   - `npm ci`（仅在依赖缺失时）
   - `npm run build`
   - `npx tsc --noEmit`
   - 对本次修改文件运行 Prettier 检查
7. 在浏览器中检查首页与新论文页，确认标题、正文、公式、表格、链接和控制台均正常。
8. 创建清晰的 Git commit，并推送到 `origin/main`。
9. 等待 GitHub Pages 工作流成功，再验证线上首页与论文页面返回 HTTP 200。
10. 最终回复同时给出线上论文链接和 GitHub commit 信息。

## 发布安全与失败处理

- 推送前确认远程仓库仍是 `https://github.com/JiMI-Ha/internship-research.git`。
- 保留用户已有的未提交修改，不覆盖或回滚无关内容。
- 构建、测试、推送或部署失败时，不宣称发布成功；继续排查安全、可恢复的问题。
- 如果缺少 GitHub 登录、推送权限或需要用户改变外部权限，说明阻塞点并保留已经生成的本地论文页。
- 不把原始本地 PDF、密钥、个人信息或临时渲染文件提交到仓库；网站只发布整理后的论文笔记和公开来源链接。

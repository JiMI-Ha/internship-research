# 实习调研

一个参考 [AI Library](https://github.com/process-cxr/ai-library) 搭建的中文研究知识库，使用 Quartz 将 Markdown 论文笔记发布为可搜索、可双链、可浏览的静态网站。

在线访问：[实习调研](https://jimi-ha.github.io/internship-research/)

## 本地运行

```bash
npm ci
npm run dev
```

构建生产版本：

```bash
npm run build
```

站点内容位于 `content/`。首篇笔记为 RVPO 论文的 Motivation、Method 与 Results 梳理。

## 自动发布

仓库根目录的 `AGENTS.md` 定义了 Codex 自动发布规则。以后在此项目中提供论文并询问 “motivation method 和 results”，Codex 会在分析后自动创建论文页、更新索引、验证构建并发布到 GitHub Pages；如只需聊天回答，请明确说“不要发布”。

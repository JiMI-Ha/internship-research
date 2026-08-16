import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({ links: {} }),
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
    Component.ConditionalRender({
      component: Component.PaperRating({ variant: "badge" }),
      condition: (page) =>
        page.fileData.frontmatter?.type === "paper" &&
        ((page.fileData.frontmatter?.tags ?? []).includes("reward-resemble") ||
          page.fileData.slug?.startsWith("rl/experience-replay/") === true ||
          page.fileData.slug?.startsWith("gaming/") === true),
    }),
    Component.ReaderMode(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Search(), grow: true },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.ConditionalRender({
      component: Component.PaperRecommendation({ topic: "reward-resemble" }),
      condition: (page) => page.fileData.slug === "rl/reward-resemble/index",
    }),
    Component.ConditionalRender({
      component: Component.PaperRating({
        variant: "board",
        topicSlug: "rl/reward-resemble",
      }),
      condition: (page) => page.fileData.slug === "rl/reward-resemble/index",
    }),
    Component.ConditionalRender({
      component: Component.PaperRecommendation({ topic: "experience-replay" }),
      condition: (page) => page.fileData.slug === "rl/experience-replay/index",
    }),
    Component.ConditionalRender({
      component: Component.PaperRating({
        variant: "board",
        topicSlug: "rl/experience-replay",
        boardTitle: "Experience Replay 论文评分榜",
      }),
      condition: (page) => page.fileData.slug === "rl/experience-replay/index",
    }),
    Component.ConditionalRender({
      component: Component.PaperRecommendation({ topic: "gaming-story" }),
      condition: (page) => page.fileData.slug === "gaming/剧情/index",
    }),
    Component.ConditionalRender({
      component: Component.PaperRating({
        variant: "board",
        topicSlug: "gaming/剧情",
        boardTitle: "AI 剧情与剧本杀论文评分榜",
      }),
      condition: (page) => page.fileData.slug === "gaming/剧情/index",
    }),
    Component.ConditionalRender({
      component: Component.PaperRecommendation({ topic: "gaming-language" }),
      condition: (page) => page.fileData.slug === "gaming/创造语言/index",
    }),
    Component.ConditionalRender({
      component: Component.PaperRating({
        variant: "board",
        topicSlug: "gaming/创造语言",
        boardTitle: "创造语言与群体仪式论文评分榜",
      }),
      condition: (page) => page.fileData.slug === "gaming/创造语言/index",
    }),
    Component.ReaderMode(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Search(), grow: true },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}

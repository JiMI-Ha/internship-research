import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "实习调研",
    pageTitleSuffix: " · 研究笔记",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "zh-CN",
    baseUrl: "jimi-ha.github.io/internship-research",
    ignorePatterns: ["private", "templates", ".obsidian", "**/README.md"],
    defaultDateType: "published",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Noto Sans SC",
        body: "Noto Sans SC",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#fbfaf7",
          lightgray: "#e8e4dc",
          gray: "#aaa49a",
          darkgray: "#514d47",
          dark: "#23211f",
          secondary: "#315f78",
          tertiary: "#d1824b",
          highlight: "rgba(49, 95, 120, 0.12)",
          textHighlight: "#ffd96a80",
        },
        darkMode: {
          light: "#17191b",
          lightgray: "#35393d",
          gray: "#737980",
          darkgray: "#d5d4d0",
          dark: "#f1efe9",
          secondary: "#85b7cf",
          tertiary: "#e5a06e",
          highlight: "rgba(133, 183, 207, 0.14)",
          textHighlight: "#b28b2480",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({ priority: ["frontmatter", "git", "filesystem"] }),
      Plugin.SyntaxHighlighting({
        theme: { light: "github-light", dark: "github-dark" },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: true }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({ enableSiteMap: true, enableRSS: true }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config

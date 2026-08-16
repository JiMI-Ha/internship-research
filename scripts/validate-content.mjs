#!/usr/bin/env node

import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import matter from "gray-matter"

const ROOT = process.cwd()
const CONTENT_DIR = path.join(ROOT, "content")
const TEMPLATE_DIR = path.join(CONTENT_DIR, "templates")
const REQUIRED_FRONTMATTER = ["title", "created", "published", "modified", "type", "tags"]
const PAPER_SECTIONS = [
  "Motivation",
  "Method",
  "Experimental Setup",
  "Results",
  "Ablation / Robustness",
  "Sensitivity / Boundary Conditions",
  "Limitations",
  "Takeaways",
  "Citation",
]

const errors = []
const warnings = []

async function collectMarkdown(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name)
      if (entry.isDirectory()) return collectMarkdown(entryPath)
      return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : []
    }),
  )
  return files.flat()
}

function relative(filePath) {
  return path.relative(ROOT, filePath).replaceAll(path.sep, "/")
}

function hasSection(content, section) {
  const escaped = section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return new RegExp(`^##\\s+${escaped}\\s*$`, "m").test(content)
}

function warn(filePath, message) {
  warnings.push(`${relative(filePath)}: ${message}`)
}

function fail(filePath, message) {
  errors.push(`${relative(filePath)}: ${message}`)
}

function toDateKey(value) {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10)
  }
  return String(value)
}

function validateDate(filePath, data, field) {
  if (!data[field]) return
  const value = data[field]
  const dateKey = toDateKey(value)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    warn(filePath, `${field} should use YYYY-MM-DD; found ${String(value)}`)
  }
}

function validatePaper(filePath, content, data) {
  if (!data.source_url) {
    fail(filePath, "type: paper requires source_url")
  } else {
    try {
      const url = new URL(String(data.source_url))
      if (!["http:", "https:"].includes(url.protocol)) {
        fail(filePath, `source_url must use HTTP(S); found ${data.source_url}`)
      }
    } catch {
      fail(filePath, `source_url is not a valid URL: ${data.source_url}`)
    }
  }

  for (const score of ["business_fit", "paper_solidity"]) {
    if (data[score] === undefined) continue
    if (!Number.isInteger(data[score]) || data[score] < 0 || data[score] > 5) {
      fail(filePath, `${score} must be an integer from 0 to 5 when present`)
    }
  }

  for (const section of PAPER_SECTIONS) {
    if (!hasSection(content, section)) {
      warn(filePath, `missing recommended paper section: ${section}`)
    }
  }
}

async function main() {
  const files = (await collectMarkdown(CONTENT_DIR)).filter(
    (filePath) => !filePath.startsWith(TEMPLATE_DIR + path.sep),
  )
  const seenTitles = new Map()

  for (const filePath of files) {
    const source = await readFile(filePath, "utf8")
    const { data, content } = matter(source)

    const requiredFields = filePath.endsWith(`${path.sep}index.md`)
      ? ["title", "created", "published", "modified"]
      : REQUIRED_FRONTMATTER
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === "") {
        fail(filePath, `missing required frontmatter field: ${field}`)
      }
    }

    if (data.tags !== undefined && !Array.isArray(data.tags)) {
      fail(filePath, "tags must be a YAML list")
    }

    for (const field of ["created", "published", "modified"]) {
      validateDate(filePath, data, field)
    }

    if (data.created && data.modified && toDateKey(data.modified) < toDateKey(data.created)) {
      warn(filePath, "modified date is earlier than created date")
    }

    if (data.title) {
      const title = String(data.title)
      const existing = seenTitles.get(title)
      if (existing) warn(filePath, `duplicate title also appears in ${relative(existing)}`)
      else seenTitles.set(title, filePath)
    }

    if (data.type === "paper") validatePaper(filePath, content, data)
  }

  const warningLimit = 20
  for (const warning of warnings.slice(0, warningLimit)) console.warn(`warning: ${warning}`)
  if (warnings.length > warningLimit) {
    console.warn(
      `warning: ${warnings.length - warningLimit} additional warning(s) omitted; run npm run validate:content > validation.log 2>&1 to inspect all.`,
    )
  }
  if (errors.length) {
    for (const error of errors) console.error(`error: ${error}`)
    console.error(
      `\nContent validation failed with ${errors.length} error(s) and ${warnings.length} warning(s).`,
    )
    process.exitCode = 1
    return
  }

  console.log(
    `Content validation passed for ${files.length} Markdown files with ${warnings.length} warning(s).`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

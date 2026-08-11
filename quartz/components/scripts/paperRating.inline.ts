type RatingDraft = {
  businessFit: number
  paperSolidity: number
}

type RatingStatus = "complete" | "business-only" | "unrated"

const ratingStoragePrefix = "internship-research:paper-rating:"

function normalizeRatingScore(value: unknown): number {
  const score = Number(value)
  if (!Number.isFinite(score)) return 0
  return Math.max(0, Math.min(5, Math.round(score)))
}

function ratingStatus(rating: RatingDraft): RatingStatus {
  if (rating.businessFit > 0 && rating.paperSolidity > 0) return "complete"
  if (rating.businessFit > 0) return "business-only"
  return "unrated"
}

function readRatingDraft(root: HTMLElement): RatingDraft {
  const fallback: RatingDraft = {
    businessFit: normalizeRatingScore(root.dataset.defaultBusinessFit),
    paperSolidity: normalizeRatingScore(root.dataset.defaultPaperSolidity),
  }
  const slug = root.dataset.ratingSlug
  if (!slug) return fallback

  try {
    const stored = localStorage.getItem(`${ratingStoragePrefix}${slug}`)
    if (!stored) return fallback
    const value = JSON.parse(stored) as Partial<RatingDraft>
    return {
      businessFit: normalizeRatingScore(value.businessFit),
      paperSolidity: normalizeRatingScore(value.paperSolidity),
    }
  } catch {
    return fallback
  }
}

function saveRatingDraft(root: HTMLElement, rating: RatingDraft) {
  const slug = root.dataset.ratingSlug
  if (!slug) return
  localStorage.setItem(`${ratingStoragePrefix}${slug}`, JSON.stringify(rating))
}

function updateMetric(
  root: HTMLElement,
  metric: keyof RatingDraft,
  score: number,
  status: RatingStatus,
) {
  const metricElement = root.querySelector<HTMLElement>(`[data-rating-metric="${metric}"]`)
  if (!metricElement) return

  const label = metric === "businessFit" ? "业务契合度" : "Paper solid 度"
  metricElement.querySelectorAll<HTMLButtonElement>("[data-rating-star]").forEach((star) => {
    const value = normalizeRatingScore(star.dataset.ratingScore)
    const selected = value <= score
    star.textContent = selected ? "★" : "☆"
    star.classList.toggle("star-filled", selected)
    star.classList.toggle("star-empty", !selected)
    star.setAttribute("aria-pressed", String(selected))
  })

  metricElement
    .querySelector<HTMLElement>(".paper-rating-stars")
    ?.setAttribute("aria-label", `${label}：${score > 0 ? `${score}/5` : "待评"}`)

  const valueLabel = metricElement.querySelector<HTMLElement>("[data-rating-value]")
  if (valueLabel) {
    valueLabel.textContent =
      score > 0
        ? `${score}/5`
        : metric === "paperSolidity" && status === "business-only"
          ? "未评（未读）"
          : "待评价"
  }

  const clearButton = metricElement.querySelector<HTMLButtonElement>("[data-rating-clear]")
  if (clearButton) clearButton.hidden = score === 0
}

function updateRatingRoot(root: HTMLElement, rating: RatingDraft) {
  const status = ratingStatus(rating)
  updateMetric(root, "businessFit", rating.businessFit, status)
  updateMetric(root, "paperSolidity", rating.paperSolidity, status)

  root.classList.toggle("is-rated", status === "complete")
  root.classList.toggle("is-business-only", status === "business-only")
  root.classList.toggle("is-pending", status === "unrated")
  root.dataset.ratingStatus = status
  root.dataset.businessFit = String(rating.businessFit)
  root.dataset.paperSolidity = String(rating.paperSolidity)

  const total = status === "complete" ? rating.businessFit + rating.paperSolidity : 0
  const totalElement = root.querySelector<HTMLElement>("[data-rating-total]")
  const suffixElement = root.querySelector<HTMLElement>("[data-rating-total-suffix]")
  if (totalElement) {
    totalElement.textContent =
      status === "complete" ? String(total) : status === "business-only" ? "仅业务" : "待评"
  }
  if (suffixElement) suffixElement.textContent = status === "complete" ? "/ 10" : ""

  const statusElement = root.querySelector<HTMLElement>("[data-rating-status]")
  if (statusElement) {
    statusElement.textContent =
      status === "complete"
        ? `综合 ${total}/10`
        : status === "business-only"
          ? "仅评业务 · solid 未评"
          : "待评价"
  }
}

function compareRatingCards(left: HTMLElement, right: HTMLElement): number {
  const statusOrder: Record<RatingStatus, number> = {
    complete: 0,
    "business-only": 1,
    unrated: 2,
  }
  const leftStatus = (left.dataset.ratingStatus ?? "unrated") as RatingStatus
  const rightStatus = (right.dataset.ratingStatus ?? "unrated") as RatingStatus
  const statusDifference = statusOrder[leftStatus] - statusOrder[rightStatus]
  if (statusDifference !== 0) return statusDifference

  const leftBusiness = normalizeRatingScore(left.dataset.businessFit)
  const rightBusiness = normalizeRatingScore(right.dataset.businessFit)
  const leftSolidity = normalizeRatingScore(left.dataset.paperSolidity)
  const rightSolidity = normalizeRatingScore(right.dataset.paperSolidity)

  if (leftStatus === "complete") {
    const totalDifference = rightBusiness + rightSolidity - (leftBusiness + leftSolidity)
    if (totalDifference !== 0) return totalDifference
    if (leftBusiness !== rightBusiness) return rightBusiness - leftBusiness
    if (leftSolidity !== rightSolidity) return rightSolidity - leftSolidity
  }

  if (leftStatus === "business-only" && leftBusiness !== rightBusiness) {
    return rightBusiness - leftBusiness
  }

  return (left.dataset.ratingTitle ?? "").localeCompare(right.dataset.ratingTitle ?? "", "zh-CN")
}

function sortRatingBoard(board: HTMLElement) {
  const list = board.querySelector<HTMLElement>(".paper-rating-list")
  if (!list) return
  const cards = Array.from(list.querySelectorAll<HTMLElement>(".paper-rating-card"))
  cards.sort(compareRatingCards).forEach((card) => list.appendChild(card))

  let rank = 0
  cards.forEach((card) => {
    const status = (card.dataset.ratingStatus ?? "unrated") as RatingStatus
    const rankElement = card.querySelector<HTMLElement>("[data-rating-rank]")
    if (!rankElement) return
    if (status === "complete") {
      rank += 1
      rankElement.textContent = String(rank)
      rankElement.setAttribute("aria-label", `第 ${rank} 名`)
    } else if (status === "business-only") {
      rankElement.textContent = "业务"
      rankElement.setAttribute("aria-label", "仅评价业务契合度")
    } else {
      rankElement.textContent = "—"
      rankElement.setAttribute("aria-label", "待评价")
    }
  })
}

function refreshRatingSlug(slug: string) {
  Array.from(document.querySelectorAll<HTMLElement>("[data-paper-rating]"))
    .filter((root) => root.dataset.ratingSlug === slug)
    .forEach((root) => updateRatingRoot(root, readRatingDraft(root)))
  document.querySelectorAll<HTMLElement>("[data-paper-rating-board]").forEach(sortRatingBoard)
}

document.addEventListener("nav", () => {
  const roots = Array.from(document.querySelectorAll<HTMLElement>("[data-paper-rating]"))
  roots.forEach((root) => updateRatingRoot(root, readRatingDraft(root)))
  document.querySelectorAll<HTMLElement>("[data-paper-rating-board]").forEach(sortRatingBoard)

  roots.forEach((root) => {
    const slug = root.dataset.ratingSlug
    if (!slug) return

    root.querySelectorAll<HTMLButtonElement>("[data-rating-star]").forEach((button) => {
      const onClick = () => {
        const metric = button.dataset.ratingStar as keyof RatingDraft
        const rating = readRatingDraft(root)
        rating[metric] = normalizeRatingScore(button.dataset.ratingScore)
        saveRatingDraft(root, rating)
        refreshRatingSlug(slug)
      }
      button.addEventListener("click", onClick)
      window.addCleanup(() => button.removeEventListener("click", onClick))
    })

    root.querySelectorAll<HTMLButtonElement>("[data-rating-clear]").forEach((button) => {
      const onClick = () => {
        const metric = button.dataset.ratingClear as keyof RatingDraft
        const rating = readRatingDraft(root)
        rating[metric] = 0
        saveRatingDraft(root, rating)
        refreshRatingSlug(slug)
      }
      button.addEventListener("click", onClick)
      window.addCleanup(() => button.removeEventListener("click", onClick))
    })
  })

  document.querySelectorAll<HTMLButtonElement>("[data-copy-paper-ratings]").forEach((button) => {
    const onClick = async () => {
      const board = button.closest<HTMLElement>("[data-paper-rating-board]")
      if (!board) return
      const lines = Array.from(board.querySelectorAll<HTMLElement>(".paper-rating-card")).map(
        (card) => {
          const rating = readRatingDraft(card)
          const business = rating.businessFit > 0 ? `${rating.businessFit}/5` : "未评"
          const solidity = rating.paperSolidity > 0 ? `${rating.paperSolidity}/5` : "未评"
          return `${card.dataset.ratingTitle}：业务 ${business}；solid ${solidity}`
        },
      )
      await navigator.clipboard.writeText(lines.join("\n"))
      const original = button.textContent
      button.textContent = "已复制，可粘贴给维护者"
      setTimeout(() => (button.textContent = original), 2000)
    }
    button.addEventListener("click", onClick)
    window.addCleanup(() => button.removeEventListener("click", onClick))
  })

  document.querySelectorAll<HTMLButtonElement>("[data-clear-paper-ratings]").forEach((button) => {
    const onClick = () => {
      if (!window.confirm("清除当前浏览器中保存的全部论文评分？")) return
      Object.keys(localStorage)
        .filter((key) => key.startsWith(ratingStoragePrefix))
        .forEach((key) => localStorage.removeItem(key))
      window.location.reload()
    }
    button.addEventListener("click", onClick)
    window.addCleanup(() => button.removeEventListener("click", onClick))
  })
})

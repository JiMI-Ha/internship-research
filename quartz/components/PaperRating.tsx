import { FullSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

type PaperRatingOptions = {
  variant: "board" | "badge"
}

type Rating = {
  businessFit: number
  paperSolidity: number
  rated: boolean
  total: number
}

function normalizeScore(value: unknown): number {
  const score = Number(value)
  if (!Number.isFinite(score)) return 0
  return Math.max(0, Math.min(5, Math.round(score)))
}

function getRating(page: QuartzPluginData): Rating {
  const businessFit = normalizeScore(page.frontmatter?.business_fit)
  const paperSolidity = normalizeScore(page.frontmatter?.paper_solidity)
  const rated = businessFit > 0 && paperSolidity > 0

  return {
    businessFit,
    paperSolidity,
    rated,
    total: rated ? businessFit + paperSolidity : 0,
  }
}

function Stars({ score, label }: { score: number; label: string }) {
  const text = score > 0 ? `${score}/5` : "待评"

  return (
    <span class="paper-rating-stars" role="img" aria-label={`${label}：${text}`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span class={index < score ? "star-filled" : "star-empty"}>
          {index < score ? "★" : "☆"}
        </span>
      ))}
    </span>
  )
}

function RatingMetric({ label, score }: { label: string; score: number }) {
  return (
    <div class="paper-rating-metric">
      <span class="paper-rating-label">{label}</span>
      <Stars score={score} label={label} />
      <span class="paper-rating-value">{score > 0 ? `${score}/5` : "待评价"}</span>
    </div>
  )
}

export default ((options: PaperRatingOptions) => {
  const PaperRating: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
  }: QuartzComponentProps) => {
    if (options.variant === "badge") {
      const rating = getRating(fileData)
      return (
        <aside class={classNames(displayClass, "paper-rating-badge")} aria-label="主编评分">
          <div class="paper-rating-badge-title">
            <strong>主编评分</strong>
            <span>{rating.rated ? `综合 ${rating.total}/10` : "待评价"}</span>
          </div>
          <RatingMetric label="业务契合度" score={rating.businessFit} />
          <RatingMetric label="Paper solid 度" score={rating.paperSolidity} />
        </aside>
      )
    }

    const papers = allFiles
      .filter(
        (page) =>
          page.slug?.startsWith("rl/reward-resemble/") && page.frontmatter?.type === "paper",
      )
      .map((page) => ({ page, rating: getRating(page) }))
      .sort((left, right) => {
        if (left.rating.rated !== right.rating.rated) return left.rating.rated ? -1 : 1
        if (left.rating.total !== right.rating.total) return right.rating.total - left.rating.total
        if (left.rating.businessFit !== right.rating.businessFit)
          return right.rating.businessFit - left.rating.businessFit
        if (left.rating.paperSolidity !== right.rating.paperSolidity)
          return right.rating.paperSolidity - left.rating.paperSolidity
        return String(left.page.frontmatter?.title).localeCompare(
          String(right.page.frontmatter?.title),
          "zh-CN",
        )
      })

    let ratedRank = 0

    return (
      <section
        class={classNames(displayClass, "paper-rating-board")}
        aria-labelledby="rating-board-title"
      >
        <div class="paper-rating-board-heading">
          <div>
            <p class="paper-rating-kicker">EDITOR'S RATING</p>
            <h2 id="rating-board-title">论文评分榜</h2>
          </div>
          <p>业务契合度 + Paper solid 度，满分 10 分</p>
        </div>

        <div class="paper-rating-list">
          {papers.map(({ page, rating }) => {
            if (rating.rated) ratedRank += 1
            const rank = rating.rated ? ratedRank : "—"
            const title = page.frontmatter?.title ?? "Untitled"
            const href = resolveRelative(fileData.slug!, page.slug as FullSlug)

            return (
              <article class={`paper-rating-card ${rating.rated ? "is-rated" : "is-pending"}`}>
                <div
                  class="paper-rating-rank"
                  aria-label={rating.rated ? `第 ${rank} 名` : "待评价"}
                >
                  {rank}
                </div>
                <div class="paper-rating-paper">
                  <h3>
                    <a class="internal" href={href}>
                      {title}
                    </a>
                  </h3>
                  <div class="paper-rating-metrics">
                    <RatingMetric label="业务契合度" score={rating.businessFit} />
                    <RatingMetric label="Paper solid 度" score={rating.paperSolidity} />
                  </div>
                </div>
                <div class="paper-rating-total">
                  <strong>{rating.rated ? rating.total : "待评"}</strong>
                  <span>{rating.rated ? "/ 10" : ""}</span>
                </div>
              </article>
            )
          })}
        </div>

        <p class="paper-rating-footnote">
          排序按总分降序；同分时优先业务契合度。任一维度未评分的论文统一放在已评分论文之后。
        </p>
      </section>
    )
  }

  PaperRating.css = `
.paper-rating-board {
  margin: 1.5rem 0 2rem;
}

.center:has(.paper-rating-board) .page-listing {
  display: none;
}

.paper-rating-board-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.paper-rating-board-heading h2,
.paper-rating-board-heading p {
  margin: 0;
}

.paper-rating-board-heading > p,
.paper-rating-footnote {
  color: var(--gray);
  font-size: 0.9rem;
}

.paper-rating-kicker {
  color: var(--secondary);
  font-family: var(--codeFont);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
}

.paper-rating-list {
  display: grid;
  gap: 0.75rem;
}

.paper-rating-card {
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr) 4rem;
  align-items: center;
  gap: 0.9rem;
  padding: 0.9rem 1rem;
  border: 1px solid var(--lightgray);
  border-radius: 12px;
  background: color-mix(in srgb, var(--light) 92%, var(--highlight));
}

.paper-rating-card.is-pending {
  opacity: 0.82;
}

.paper-rating-rank {
  display: grid;
  place-items: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 999px;
  color: var(--secondary);
  background: var(--highlight);
  font-family: var(--codeFont);
  font-weight: 700;
}

.paper-rating-paper h3 {
  margin: 0 0 0.55rem;
  font-size: 1rem;
}

.paper-rating-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem 1rem;
}

.paper-rating-metric {
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.82rem;
}

.paper-rating-label {
  color: var(--darkgray);
  white-space: nowrap;
}

.paper-rating-stars {
  color: var(--tertiary);
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.paper-rating-stars .star-empty {
  color: var(--gray);
}

.paper-rating-value {
  color: var(--gray);
  white-space: nowrap;
}

.paper-rating-total {
  display: flex;
  flex-direction: column;
  align-items: end;
  color: var(--secondary);
}

.paper-rating-total strong {
  font-family: var(--codeFont);
  font-size: 1.2rem;
}

.paper-rating-total span {
  color: var(--gray);
  font-size: 0.75rem;
}

.paper-rating-footnote {
  margin: 0.75rem 0 0;
}

.paper-rating-badge {
  display: grid;
  grid-template-columns: minmax(8rem, 1fr) repeat(2, minmax(12rem, auto));
  gap: 0.75rem 1.25rem;
  align-items: center;
  margin: 1rem 0 1.5rem;
  padding: 0.85rem 1rem;
  border-left: 3px solid var(--tertiary);
  border-radius: 0 10px 10px 0;
  background: var(--highlight);
}

.paper-rating-badge-title {
  display: flex;
  flex-direction: column;
}

.paper-rating-badge-title span {
  color: var(--gray);
  font-size: 0.82rem;
}

@media all and (max-width: 800px) {
  .paper-rating-board-heading {
    align-items: start;
    flex-direction: column;
  }

  .paper-rating-card {
    grid-template-columns: 2.2rem minmax(0, 1fr);
  }

  .paper-rating-metrics,
  .paper-rating-badge {
    grid-template-columns: 1fr;
  }

  .paper-rating-total {
    display: none;
  }

  .paper-rating-metric {
    grid-template-columns: 7rem auto 1fr;
  }
}
`

  return PaperRating
}) satisfies QuartzComponentConstructor<PaperRatingOptions>

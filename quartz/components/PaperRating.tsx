import { FullSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

type PaperRatingOptions = {
  variant: "board" | "badge"
}

export type Rating = {
  businessFit: number
  paperSolidity: number
  status: "complete" | "business-only" | "unrated"
  total: number
}

function normalizeScore(value: unknown): number {
  const score = Number(value)
  if (!Number.isFinite(score)) return 0
  return Math.max(0, Math.min(5, Math.round(score)))
}

export function createRating(businessValue: unknown, solidityValue: unknown): Rating {
  const businessFit = normalizeScore(businessValue)
  const paperSolidity = normalizeScore(solidityValue)
  const status =
    businessFit > 0 && paperSolidity > 0
      ? "complete"
      : businessFit > 0
        ? "business-only"
        : "unrated"

  return {
    businessFit,
    paperSolidity,
    status,
    total: status === "complete" ? businessFit + paperSolidity : 0,
  }
}

function getRating(page: QuartzPluginData): Rating {
  return createRating(page.frontmatter?.business_fit, page.frontmatter?.paper_solidity)
}

export function compareRatings(left: Rating, right: Rating): number {
  const statusOrder = { complete: 0, "business-only": 1, unrated: 2 }
  const statusDifference = statusOrder[left.status] - statusOrder[right.status]
  if (statusDifference !== 0) return statusDifference

  if (left.status === "complete" && right.status === "complete") {
    if (left.total !== right.total) return right.total - left.total
    if (left.businessFit !== right.businessFit) return right.businessFit - left.businessFit
    if (left.paperSolidity !== right.paperSolidity) return right.paperSolidity - left.paperSolidity
  }

  if (left.status === "business-only" && right.status === "business-only") {
    if (left.businessFit !== right.businessFit) return right.businessFit - left.businessFit
  }

  return 0
}

function Stars({
  score,
  label,
  metric,
}: {
  score: number
  label: string
  metric: "businessFit" | "paperSolidity"
}) {
  const text = score > 0 ? `${score}/5` : "待评"

  return (
    <span class="paper-rating-stars" aria-label={`${label}：${text}`}>
      {Array.from({ length: 5 }, (_, index) => (
        <button
          type="button"
          class={`paper-rating-star ${index < score ? "star-filled" : "star-empty"}`}
          data-rating-star={metric}
          data-rating-score={index + 1}
          aria-label={`${label} ${index + 1} 星`}
          aria-pressed={index < score}
        >
          {index < score ? "★" : "☆"}
        </button>
      ))}
    </span>
  )
}

function RatingMetric({
  label,
  score,
  metric,
  emptyLabel = "待评价",
}: {
  label: string
  score: number
  metric: "businessFit" | "paperSolidity"
  emptyLabel?: string
}) {
  return (
    <div class="paper-rating-metric" data-rating-metric={metric}>
      <span class="paper-rating-label">{label}</span>
      <Stars score={score} label={label} metric={metric} />
      <span class="paper-rating-value" data-rating-value>
        {score > 0 ? `${score}/5` : emptyLabel}
      </span>
      <button
        type="button"
        class="paper-rating-clear"
        data-rating-clear={metric}
        aria-label={`清除${label}评分`}
        hidden={score === 0}
      >
        清除
      </button>
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
      const statusText =
        rating.status === "complete"
          ? `综合 ${rating.total}/10`
          : rating.status === "business-only"
            ? "仅评业务 · solid 未评"
            : "待评价"
      return (
        <aside
          class={classNames(displayClass, "paper-rating-badge")}
          aria-label="主编评分"
          data-paper-rating
          data-rating-slug={fileData.slug}
          data-rating-title={fileData.frontmatter?.title}
          data-default-business-fit={rating.businessFit}
          data-default-paper-solidity={rating.paperSolidity}
        >
          <div class="paper-rating-badge-title">
            <strong>主编评分</strong>
            <span data-rating-status>{statusText}</span>
          </div>
          <RatingMetric label="业务契合度" score={rating.businessFit} metric="businessFit" />
          <RatingMetric
            label="Paper solid 度"
            score={rating.paperSolidity}
            metric="paperSolidity"
            emptyLabel={rating.status === "business-only" ? "未评（未读）" : "待评价"}
          />
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
        const ratingDifference = compareRatings(left.rating, right.rating)
        if (ratingDifference !== 0) return ratingDifference

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
        data-paper-rating-board
      >
        <div class="paper-rating-board-heading">
          <div>
            <p class="paper-rating-kicker">EDITOR'S RATING</p>
            <h2 id="rating-board-title">论文评分榜</h2>
          </div>
          <p>先看业务契合度；读过后再评 Paper solid 度</p>
        </div>

        <div class="paper-rating-list">
          {papers.map(({ page, rating }) => {
            if (rating.status === "complete") ratedRank += 1
            const rank =
              rating.status === "complete"
                ? ratedRank
                : rating.status === "business-only"
                  ? "业务"
                  : "—"
            const title = page.frontmatter?.title ?? "Untitled"
            const href = resolveRelative(fileData.slug!, page.slug as FullSlug)
            const cardClass =
              rating.status === "complete"
                ? "is-rated"
                : rating.status === "business-only"
                  ? "is-business-only"
                  : "is-pending"
            const rankLabel =
              rating.status === "complete"
                ? `第 ${rank} 名`
                : rating.status === "business-only"
                  ? "仅评价业务契合度"
                  : "待评价"
            const totalLabel =
              rating.status === "complete"
                ? rating.total
                : rating.status === "business-only"
                  ? "仅业务"
                  : "待评"

            return (
              <article
                class={`paper-rating-card ${cardClass}`}
                data-paper-rating
                data-rating-slug={page.slug}
                data-rating-title={title}
                data-default-business-fit={rating.businessFit}
                data-default-paper-solidity={rating.paperSolidity}
              >
                <div class="paper-rating-rank" data-rating-rank aria-label={rankLabel}>
                  {rank}
                </div>
                <div class="paper-rating-paper">
                  <h3>
                    <a class="internal" href={href}>
                      {title}
                    </a>
                  </h3>
                  <div class="paper-rating-metrics">
                    <RatingMetric
                      label="业务契合度"
                      score={rating.businessFit}
                      metric="businessFit"
                    />
                    <RatingMetric
                      label="Paper solid 度"
                      score={rating.paperSolidity}
                      metric="paperSolidity"
                      emptyLabel={rating.status === "business-only" ? "未评（未读）" : "待评价"}
                    />
                  </div>
                </div>
                <div class="paper-rating-total">
                  <strong data-rating-total>{totalLabel}</strong>
                  <span data-rating-total-suffix>{rating.status === "complete" ? "/ 10" : ""}</span>
                </div>
              </article>
            )
          })}
        </div>

        <div class="paper-rating-actions">
          <button type="button" data-copy-paper-ratings>
            复制本机评分
          </button>
          <button type="button" class="secondary" data-clear-paper-ratings>
            清除本机评分
          </button>
        </div>

        <p class="paper-rating-footnote">
          两项齐全才进入综合排名。只给业务契合度时归入“仅业务”，不把缺失的 solid
          当成零分；完全未评的论文放在最后。点击星星只保存为当前浏览器的草稿，复制后发给维护者才能公开发布。
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

.paper-rating-card.is-business-only {
  border-left: 3px solid var(--tertiary);
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
  grid-template-columns: auto auto auto auto;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.82rem;
}

.paper-rating-label {
  color: var(--darkgray);
  white-space: nowrap;
}

.paper-rating-stars {
  display: inline-flex;
  white-space: nowrap;
}

.paper-rating-star {
  appearance: none;
  padding: 0 0.04em;
  border: 0;
  color: var(--tertiary);
  background: transparent;
  cursor: pointer;
  font: inherit;
  font-size: 1rem;
  line-height: 1;
}

.paper-rating-star.star-empty {
  color: var(--gray);
}

.paper-rating-star:hover,
.paper-rating-star:focus-visible {
  color: var(--tertiary);
  transform: translateY(-1px);
}

.paper-rating-clear {
  appearance: none;
  padding: 0;
  border: 0;
  color: var(--gray);
  background: transparent;
  cursor: pointer;
  font-size: 0.75rem;
  text-decoration: underline;
  white-space: nowrap;
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

.paper-rating-actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 1rem;
}

.paper-rating-actions button {
  appearance: none;
  padding: 0.45rem 0.75rem;
  border: 1px solid var(--secondary);
  border-radius: 8px;
  color: var(--light);
  background: var(--secondary);
  cursor: pointer;
  font: inherit;
  font-size: 0.85rem;
}

.paper-rating-actions button.secondary {
  color: var(--secondary);
  background: transparent;
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
    grid-template-columns: 7rem auto auto auto;
  }
}
`

  return PaperRating
}) satisfies QuartzComponentConstructor<PaperRatingOptions>

import test, { describe } from "node:test"
import assert from "node:assert"
import { readdirSync } from "node:fs"
import {
  compareRecommendations,
  createRecommendation,
  paperRecommendationEvidence,
} from "./PaperRecommendation"

describe("PaperRecommendation", () => {
  test("scores each of the four criteria independently", () => {
    const recommendation = createRecommendation({
      rewardComposition: "evidence",
      scale: "evidence",
    })

    assert.equal(recommendation.total, 2)
    assert.equal(recommendation.hits.rewardComposition, true)
    assert.equal(recommendation.hits.positiveNegative, false)
    assert.equal(recommendation.hits.scale, true)
    assert.equal(recommendation.hits.gradientConflict, false)
  })

  test("keeps zero-score background papers in the data set", () => {
    assert.equal(createRecommendation(paperRecommendationEvidence["g-eval"]).total, 0)
  })

  test("gives PRISM all four method-feature points", () => {
    assert.equal(createRecommendation(paperRecommendationEvidence.prism).total, 4)
  })

  test("orders higher recommendation scores first", () => {
    const high = createRecommendation(paperRecommendationEvidence.rvpo)
    const low = createRecommendation(paperRecommendationEvidence.warm)

    assert(compareRecommendations(high, low) < 0)
  })

  test("contains an explicit classification for all 46 current papers", () => {
    const paperSlugs = readdirSync("content/rl/reward-resemble")
      .filter((filename) => filename.endsWith(".md") && filename !== "index.md")
      .map((filename) => filename.slice(0, -3))
      .sort()

    assert.equal(paperSlugs.length, 46)
    assert.deepEqual(Object.keys(paperRecommendationEvidence).sort(), paperSlugs)
  })
})

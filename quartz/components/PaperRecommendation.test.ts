import test, { describe } from "node:test"
import assert from "node:assert"
import { readdirSync } from "node:fs"
import {
  compareRecommendations,
  createRecommendation,
  experienceReplayCriteria,
  experienceReplayEvidence,
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

  test("contains an explicit classification for all 48 current reward papers", () => {
    const paperSlugs = readdirSync("content/rl/reward-resemble")
      .filter((filename) => filename.endsWith(".md") && filename !== "index.md")
      .map((filename) => filename.slice(0, -3))
      .sort()

    assert.equal(paperSlugs.length, 48)
    assert.deepEqual(Object.keys(paperRecommendationEvidence).sort(), paperSlugs)
  })

  test("scores all three experience-replay mechanisms independently", () => {
    const recommendation = createRecommendation(
      experienceReplayEvidence.relift,
      experienceReplayCriteria,
    )

    assert.equal(recommendation.total, 3)
    assert.equal(recommendation.hits.supervisedData, true)
    assert.equal(recommendation.hits.replayBuffer, true)
    assert.equal(recommendation.hits.offPolicyMitigation, true)
  })

  test("classifies all 28 experience-replay papers with the expected score distribution", () => {
    const scores = Object.values(experienceReplayEvidence).map(
      (evidence) => createRecommendation(evidence, experienceReplayCriteria).total,
    )

    assert.equal(scores.length, 28)
    assert.equal(scores.filter((score) => score === 3).length, 1)
    assert.equal(scores.filter((score) => score === 2).length, 17)
    assert.equal(scores.filter((score) => score === 1).length, 10)
  })
})

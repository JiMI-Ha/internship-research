import test, { describe } from "node:test"
import assert from "node:assert"
import { compareRatings, createRating } from "./PaperRating"

describe("PaperRating", () => {
  test("does not treat a missing solidity rating as zero", () => {
    const rating = createRating(2, 0)

    assert.equal(rating.status, "business-only")
    assert.equal(rating.businessFit, 2)
    assert.equal(rating.paperSolidity, 0)
    assert.equal(rating.total, 0)
  })

  test("orders complete ratings before business-only and unrated papers", () => {
    const complete = createRating(3, 3)
    const businessOnly = createRating(5, 0)
    const unrated = createRating(0, 0)

    assert(compareRatings(complete, businessOnly) < 0)
    assert(compareRatings(businessOnly, unrated) < 0)
  })

  test("orders business-only papers by business fit", () => {
    assert(compareRatings(createRating(5, 0), createRating(1, 0)) < 0)
  })

  test("orders complete ratings by total then business fit", () => {
    assert(compareRatings(createRating(5, 4), createRating(4, 4)) < 0)
    assert(compareRatings(createRating(5, 3), createRating(4, 4)) < 0)
  })
})

import { expect } from "chai";
// import * as scale from "scale-color-perceptual";

import { getRectangle } from "./annotation-util";

describe("annotation-util", function () {
  describe("getRectangle", function () {
    it("should return the correct points for a margin of 1", function () {
      // when
      const result = getRectangle({
        coordinates: { x: 2, y: 3 },
        width: 6,
        height: 5,
        margin: 1,
      });

      // then
      // console.log(result);
      expect(result).to.deep.equal([
        { x: 1, y: 2 },
        { x: 1, y: 3 },
        { x: 1, y: 4 },
        { x: 2, y: 2 },
        { x: 2, y: 3 },
        { x: 2, y: 4 },
        { x: 3, y: 2 },
        { x: 3, y: 3 },
        { x: 3, y: 4 },
      ]);
    });

    it("should return the correct points for a margin of 2", function () {
      // when
      const result = getRectangle({
        coordinates: { x: 2, y: 3 },
        width: 6,
        height: 5,
        margin: 2,
      });

      // then
      // console.log(result);
      expect(result).to.deep.equal([
        { x: 0, y: 1 },
        { x: 0, y: 2 },
        { x: 0, y: 3 },
        { x: 0, y: 4 },
        { x: 0, y: 5 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
        { x: 1, y: 4 },
        { x: 1, y: 5 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
        { x: 2, y: 3 },
        { x: 2, y: 4 },
        { x: 2, y: 5 },
        { x: 3, y: 1 },
        { x: 3, y: 2 },
        { x: 3, y: 3 },
        { x: 3, y: 4 },
        { x: 3, y: 5 },
        { x: 4, y: 1 },
        { x: 4, y: 2 },
        { x: 4, y: 3 },
        { x: 4, y: 4 },
        { x: 4, y: 5 },
      ]);
    });

    it("should return the correct points when coordinates are close to the left edge", function () {
      // when
      const result = getRectangle({
        coordinates: { x: 2, y: 0 },
        width: 6,
        height: 5,
        margin: 1,
      });

      // then
      // console.log(result);
      expect(result).to.deep.equal([
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 0 },
        { x: 2, y: 1 },
        { x: 3, y: 0 },
        { x: 3, y: 1 },
      ]);
    });

    it("should return the correct points when coordinates are close to the top edge", function () {
      // when
      const result = getRectangle({
        coordinates: { x: 0, y: 2 },
        width: 6,
        height: 5,
        margin: 1,
      });

      // then
      // console.log(result);
      expect(result).to.deep.equal([
        { x: 0, y: 1 },
        { x: 0, y: 2 },
        { x: 0, y: 3 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
      ]);
    });

    it("should return the correct points when coordinates are close to the right edge", function () {
      // when
      const result = getRectangle({
        coordinates: { x: 2, y: 5 },
        width: 6,
        height: 5,
        margin: 1,
      });

      // then
      // console.log(result);
      expect(result).to.deep.equal([
        { x: 1, y: 4 },
        { x: 1, y: 5 },
        { x: 2, y: 4 },
        { x: 2, y: 5 },
        { x: 3, y: 4 },
        { x: 3, y: 5 },
      ]);
    });

    it("should return the correct points when coordinates are close to the bottom edge", function () {
      // when
      const result = getRectangle({
        coordinates: { x: 4, y: 2 },
        width: 6,
        height: 5,
        margin: 1,
      });

      // then
      // console.log(result);
      expect(result).to.deep.equal([
        { x: 3, y: 1 },
        { x: 3, y: 2 },
        { x: 3, y: 3 },
        { x: 4, y: 1 },
        { x: 4, y: 2 },
        { x: 4, y: 3 },
      ]);
    });

    it("should return the correct points when coordinates are close to the top-left edge", function () {
      // when
      const result = getRectangle({
        coordinates: { x: 0, y: 0 },
        width: 6,
        height: 5,
        margin: 1,
      });

      // then
      // console.log(result);
      expect(result).to.deep.equal([
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
      ]);
    });

    it("should return the correct points when coordinates are close to the top-right edge", function () {
      // when
      const result = getRectangle({
        coordinates: { x: 0, y: 5 },
        width: 6,
        height: 5,
        margin: 1,
      });

      // then
      // console.log(result);
      expect(result).to.deep.equal([
        { x: 0, y: 4 },
        { x: 0, y: 5 },
        { x: 1, y: 4 },
        { x: 1, y: 5 },
      ]);
    });

    it("should return the correct points when coordinates are close to the bottom-left edge", function () {
      // when
      const result = getRectangle({
        coordinates: { x: 4, y: 0 },
        width: 6,
        height: 5,
        margin: 1,
      });

      // then
      // console.log(result);
      expect(result).to.deep.equal([
        { x: 3, y: 0 },
        { x: 3, y: 1 },
        { x: 4, y: 0 },
        { x: 4, y: 1 },
      ]);
    });

    it("should return the correct points when coordinates are close to the bottom-right edge", function () {
      // when
      const result = getRectangle({
        coordinates: { x: 4, y: 5 },
        width: 6,
        height: 5,
        margin: 1,
      });

      // then
      // console.log(result);
      expect(result).to.deep.equal([
        { x: 3, y: 4 },
        { x: 3, y: 5 },
        { x: 4, y: 4 },
        { x: 4, y: 5 },
      ]);
    });

    it("should return the correct points when coordinates are close to the bottom-right edge", function () {
      // when
      const result = getRectangle({
        coordinates: { x: 37, y: 2479 },
        width: 2765,
        height: 2455,
        margin: 1,
      });

      // then
      // console.log(result);
      expect(result).to.deep.equal([
        { x: 36, y: 2478 },
        { x: 36, y: 2479 },
        { x: 36, y: 2480 },
        { x: 37, y: 2478 },
        { x: 37, y: 2479 },
        { x: 37, y: 2480 },
        { x: 38, y: 2478 },
        { x: 38, y: 2479 },
        { x: 38, y: 2480 },
      ]);
    });
  });
});

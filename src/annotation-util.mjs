/**
 * Note that the image co-ordinates are dealt with in terms of height, width
 * i.e. startX (or x) is the height and startY (or y) is the width
 */

export const getRectangleBoundingPoints = function ({
  coordinates,
  width,
  height,
  margin,
}) {
  const { x, y } = coordinates;

  const topLeft = {
    x: x - margin < 0 ? 0 : x - margin,
    y: y - margin < 0 ? 0 : y - margin,
  };

  const bottomRight = {
    x: x + margin >= height ? height - 1 : x + margin,
    y: y + margin >= width ? width - 1 : y + margin,
  };

  // console.log(topLeft, bottomRight);

  return { topLeft, bottomRight };
};

export const getRectangle = function ({ coordinates, width, height, margin }) {
  const result = [];

  const { topLeft, bottomRight } = getRectangleBoundingPoints({
    coordinates,
    width,
    height,
    margin,
  });

  for (let i = topLeft.x; i <= bottomRight.x; ++i) {
    for (let j = topLeft.y; j <= bottomRight.y; ++j) {
      result.push({ x: i, y: j });
    }
  }

  return result;
};

export const areCoordinatesWithinImage = function ({
  coordinates,
  width,
  height,
}) {
  const topLeft = {
    x: 0,
    y: 0,
  };

  const bottomRight = {
    x: height,
    y: width,
  };

  if (
    coordinates.x >= topLeft.x &&
    coordinates.x <= bottomRight.x &&
    coordinates.y >= topLeft.y &&
    coordinates.y <= bottomRight.y
  ) {
    return true;
  }

  return false;
};

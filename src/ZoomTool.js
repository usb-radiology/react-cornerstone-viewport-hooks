import cornerstoneTools from "cornerstone-tools";

// import BaseTool from './base/BaseTool.js';
const BaseTool = cornerstoneTools.importInternal(
  "base/BaseTool",
);
const {clipToBox} = cornerstoneTools.importInternal(
  'util/clip'
)

const external = cornerstoneTools.external


let defaultViewportScale = 0
/**
 * @public
 * @class ZoomTool
 * @memberof Tools
 *
 * @classdesc Tool for changing magnification.
 * @extends Tools.Base.BaseTool
 */
export default class ZoomTool extends BaseTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'Zoom',
      strategies: {
        default: defaultStrategy,
        translate: translateStrategy,
        zoomToCenter: zoomToCenterStrategy,
      },
      defaultStrategy: 'default',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      configuration: {
        invert: false,
        preventZoomOutsideImage: false,
        minScale: 0.25,
        maxScale: 5.0,
      },
      svgCursor: 'zoomCursor',
    };

    super(props, defaultProps);
  }

  touchDragCallback(evt) {
    dragCallback.call(this, evt);
  }

  mouseDragCallback(evt) {
    dragCallback.call(this, evt);
  }
}

const dragCallback = function(evt) {
  const deltaY = evt.detail.deltaPoints.page.y;

  if (!deltaY) {
    return false;
  }

  this.applyActiveStrategy(evt, this.configuration);

  external.cornerstone.setViewport(evt.detail.element, evt.detail.viewport);
};

/**
 * The default strategy keeps the target location fixed on the page
 * as we zoom in/out.
 *
 * @param {*} evt
 * @param {*} { invert, maxScale, minScale }
 * @returns {void}
 */
function defaultStrategy(evt) {
  const { invert, maxScale, minScale } = this.configuration;
  const deltaY = evt.detail.deltaPoints.page.y;
  const ticks = invert ? -deltaY / 100 : deltaY / 100;
  const { element, viewport } = evt.detail;
  const [startX, startY, imageX, imageY] = [
    evt.detail.startPoints.page.x,
    evt.detail.startPoints.page.y,
    evt.detail.startPoints.image.x,
    evt.detail.startPoints.image.y,
  ];

  if (!defaultViewportScale) {
    defaultViewportScale = viewport.scale
  }

  // console.log('defaultViewportScale', defaultViewportScale)

  // Calculate the new scale factor based on how far the mouse has changed
  const updatedViewport = changeViewportScale(viewport, ticks, {
    maxScale,
    minScale,
  });

  external.cornerstone.setViewport(element, updatedViewport);

  // Now that the scale has been updated, determine the offset we need to apply to the center so we can
  // Keep the original start location in the same position
  const newCoords = external.cornerstone.pageToPixel(element, startX, startY);

  // The shift we will use is the difference between the original image coordinates of the point we've selected
  // And the image coordinates of the same point on the page after the viewport scaling above has been performed
  // This shift is in image coordinates, and is designed to keep the target location fixed on the page.
  let shift = {
    x: imageX - newCoords.x,
    y: imageY - newCoords.y,
  };

  // Correct the required shift using the viewport rotation and flip parameters
  shift = correctShift(shift, updatedViewport);

  // Apply the shift to the Viewport's translation setting
  viewport.translation.x -= shift.x;
  viewport.translation.y -= shift.y;
}

function translateStrategy(evt) {
  const {
    invert,
    preventZoomOutsideImage,
    maxScale,
    minScale,
  } = this.configuration;
  const deltaY = evt.detail.deltaPoints.page.y;
  const ticks = invert ? -deltaY / 100 : deltaY / 100;
  const image = evt.detail.image;
  const viewport = evt.detail.viewport;
  const [startX, startY] = [
    evt.detail.startPoints.image.x,
    evt.detail.startPoints.image.y,
  ];

  // Calculate the new scale factor based on how far the mouse has changed
  // Note that in this case we don't need to update the viewport after the initial
  // Zoom step since we aren't don't intend to keep the target position static on
  // The page
  const updatedViewport = changeViewportScale(viewport, ticks, {
    maxScale,
    minScale,
  });

  // Define the default shift to take place during this zoom step
  const shift = {
    x: 0,
    y: 0,
  };

  // Define the parameters for the translate strategy
  const translateSpeed = 8;
  const outwardsMinScaleToTranslate = 3;
  const minTranslation = 0.01;

  if (ticks < 0) {
    // Zoom outwards from the image center
    if (updatedViewport.scale < outwardsMinScaleToTranslate) {
      // If the current translation is smaller than the minimum desired translation,
      // Set the translation to zero
      if (Math.abs(updatedViewport.translation.x) < minTranslation) {
        updatedViewport.translation.x = 0;
      } else {
        shift.x = updatedViewport.translation.x / translateSpeed;
      }

      // If the current translation is smaller than the minimum desired translation,
      // Set the translation to zero
      if (Math.abs(updatedViewport.translation.y) < minTranslation) {
        updatedViewport.translation.y = 0;
      } else {
        shift.y = updatedViewport.translation.y / translateSpeed;
      }
    }
  } else {
    // Zoom inwards to the current image point

    // Identify the coordinates of the point the user is trying to zoom into
    // If we are not allowed to zoom outside the image, bound the user-selected position to
    // A point inside the image
    if (preventZoomOutsideImage) {
      clipToBox(evt.detail.startPoints.image, image);
    }

    // Calculate the translation value that would place the desired image point in the center
    // Of the viewport
    let desiredTranslation = {
      x: image.width / 2 - startX,
      y: image.height / 2 - startY,
    };

    // Correct the target location using the viewport rotation and flip parameters
    desiredTranslation = correctShift(desiredTranslation, updatedViewport);

    // Calculate the difference between the current viewport translation value and the
    // Final desired translation values
    const distanceToDesired = {
      x: updatedViewport.translation.x - desiredTranslation.x,
      y: updatedViewport.translation.y - desiredTranslation.y,
    };

    // If the current translation is smaller than the minimum desired translation,
    // Stop translating in the x-direction
    if (Math.abs(distanceToDesired.x) < minTranslation) {
      updatedViewport.translation.x = desiredTranslation.x;
    } else {
      // Otherwise, shift the viewport by one step
      shift.x = distanceToDesired.x / translateSpeed;
    }

    // If the current translation is smaller than the minimum desired translation,
    // Stop translating in the y-direction
    if (Math.abs(distanceToDesired.y) < minTranslation) {
      updatedViewport.translation.y = desiredTranslation.y;
    } else {
      // Otherwise, shift the viewport by one step
      shift.y = distanceToDesired.y / translateSpeed;
    }
  }

  // Apply the shift to the Viewport's translation setting
  updatedViewport.translation.x -= shift.x;
  updatedViewport.translation.y -= shift.y;
}

function zoomToCenterStrategy(evt) {
  const { invert, maxScale, minScale } = this.configuration;
  const deltaY = evt.detail.deltaPoints.page.y;
  const ticks = invert ? -deltaY / 100 : deltaY / 100;
  const viewport = evt.detail.viewport;

  // Calculate the new scale factor based on how far the mouse has changed
  changeViewportScale(viewport, ticks, {
    maxScale,
    minScale,
  });
}

function correctShift(shift, viewportOrientation) {
  const { hflip, vflip, rotation } = viewportOrientation;

  // Apply Flips
  shift.x *= hflip ? -1 : 1;
  shift.y *= vflip ? -1 : 1;

  // Apply rotations
  if (rotation !== 0) {
    const angle = (rotation * Math.PI) / 180;

    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const newX = shift.x * cosA - shift.y * sinA;
    const newY = shift.x * sinA + shift.y * cosA;

    shift.x = newX;
    shift.y = newY;
  }

  return shift;
}

function changeViewportScale(viewport, ticks, scaleLimits) {
  const { maxScale/*,/minScale */ } = scaleLimits;
  const minScale = defaultViewportScale || scaleLimits;
  const pow = 1.7;
  const oldFactor = Math.log(viewport.scale) / Math.log(pow);
  const factor = oldFactor + ticks;
  const scale = Math.pow(pow, factor);


  if (maxScale && scale > maxScale) {
    viewport.scale = maxScale;
  } else if (minScale && scale < minScale) {
    viewport.scale = minScale;
  } else {
    viewport.scale = scale;
  }

  return viewport;
}

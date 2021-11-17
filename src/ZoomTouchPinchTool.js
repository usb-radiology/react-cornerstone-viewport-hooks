import cornerstoneTools from "cornerstone-tools";

const BaseTool = cornerstoneTools.importInternal("base/BaseTool");

const external = cornerstoneTools.external;

let defaultViewportScale = 0;
/**
 *
 *
 * @public
 * @class ZoomTouchPinchTool
 * @memberof Tools
 *
 * @extends {BaseTool}
 */
export default class ZoomTouchPinchTool extends BaseTool {
  constructor(props = {}) {
    const defaultProps = {
      name: "ZoomTouchPinch",
      supportedInteractionTypes: ["TouchPinch"],
      configuration: {
        invert: false,
        preventZoomOutsideImage: false,
        minScale: 0.17,
        maxScale: 3, // overwrite by tool setup {props: {configuration: {maxScale: X}}
      },
    };

    super(props, defaultProps);
  }

  touchPinchCallback(evt) {
    const { element, viewport, scaleChange } = evt.detail;
    const [pageStartX, pageStartY, imageStartX, imageStartY] = [
      evt.detail.startPoints.page.x,
      evt.detail.startPoints.page.y,
      evt.detail.startPoints.image.x,
      evt.detail.startPoints.image.y,
    ];
    if (!defaultViewportScale) {
      defaultViewportScale = viewport.scale;
    }
    const { maxScale /*, minScale */ } = this.configuration;
    const minScale = defaultViewportScale || this.configuration.minScale;

    // Change the scale based on the pinch gesture's scale change
    viewport.scale += scaleChange * viewport.scale;
    if (maxScale && viewport.scale > maxScale) {
      viewport.scale = maxScale;
    } else if (minScale && viewport.scale < minScale) {
      viewport.scale = minScale;
    }

    external.cornerstone.setViewport(element, viewport);

    // Now that the scale has been updated, determine the offset we need to apply to the center so we can
    // Keep the original start location in the same position
    const newCoords = external.cornerstone.pageToPixel(
      element,
      pageStartX,
      pageStartY,
    );
    let shift = {
      x: imageStartX - newCoords.x,
      y: imageStartY - newCoords.y,
    };

    shift = correctShift(shift, viewport);
    viewport.translation.x -= shift.x;
    viewport.translation.y -= shift.y;

    external.cornerstone.setViewport(element, viewport);
    // console.warn('touchPinchCallback2')
    external.cornerstone.wasPinching = true;
  }
}

/**
 * Corrects the shift by accountoing for viewport rotation and flips.
 * @export @public @method
 * @name correctShift
 *
 * @param  {Object} shift      The shift to correct.
 * @param  {Object} viewportOrientation  Object containing information on the viewport orientation.
 * @returns {Object}            The corrected shift.
 */
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

import cornerstoneTools from "cornerstone-tools";
import getZoomMinScale from "./helpers/zoomUtil";

const BaseTool = cornerstoneTools.importInternal("base/BaseTool");
const { correctShift } = cornerstoneTools.importInternal("util/zoomUtils");

const external = cornerstoneTools.external;

let defaultViewportScale = 0;

/**
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
        useMinDefaultCornerstoneViewportScaleIfAvailable: true,
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

    // set it once on load
    if (!defaultViewportScale) {
      this.defaultViewportScale = viewport.scale;
    }

    const { maxScale } =
      this.configuration;
    const minScale = getZoomMinScale(this.configuration, this.defaultViewportScale);

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
    // external.cornerstone.wasPinching = true;
  }
}

import cornerstone from "cornerstone-core";
import cornerstoneTools from "cornerstone-tools";
import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import PropTypes from "prop-types";
// import debounce from "lodash.debounce";

import ImageScrollbar from "./ImageScrollbar";
import ViewportOverlay from "./ViewportOverlay";
import "./ReactCornerstoneViewportHooks.css";
import {
  addInitialTools,
  cleanupStackPrefetch,
  setActiveTool,
  loadImage,
} from "./ReactCornerstoneViewportHooksHelpers";

const scrollToIndex = cornerstoneTools.importInternal("util/scrollToIndex");

/**
 * `initialDisplayImage` tracks whether this is the first time
 * `cornerstone.displayImage` is called. We need this because we have a
 * scrolling component which is used to actually scroll the images and this
 * requires setting the correct image index. Moreover, if we are provided a
 * `StackScrollMouseWheelTool` which __automagically__ updates the image
 * displayed, the only interaction is via a `cornerstone.EVENTS.NEW_IMAGE`
 * event. Thus, to keep the scrollbar and the mousewheel scrolling aligned,
 * the initial display of the image is kept separate from data manipulation.
 */
function ReactCornerstoneViewportHooks({
  imageIds = [],
  imageIndex = 0,
  tools = [],
  activeToolName = "Wwwc",
  isStackPrefetchEnabled = false,
  eventListeners = [],
  handleNewImage = () => {},
  setIsImageLoading = () => {},
  onElementEnabled = () => {},
  handleImageProgress = (e) => {},
  errorHandler,
  containerCssClass = "annotation-container",
  elementCssClass = "annotation-element",
  style = {},
  isOverlayVisible = true,
}) {
  const cornerstoneViewportEl = useRef(null);

  const [isElementEnabled, setIsElementEnabled] = useState(false);
  const [initialDisplayImage, setInitialDisplayImage] = useState(true);
  const [imageIdIndex, setImageIdIndex] = useState(0);

  const [viewportInfo, setViewportInfo] = useState({
    scale: 1,
    windowCenter: 0,
    windowWidth: 1,
    rotationDegrees: 0,
    isFlippedVertically: false,
    isFlippedHorizontally: false,
  });

  const scrollbarMax = imageIds.length ? imageIds.length - 1 : 0;
  // TODO: the height should ideally be a prop
  const scrollbarHeight = cornerstoneViewportEl.current
    ? `${cornerstoneViewportEl.current.clientHeight - 20}px`
    : "630px";

  /*
  useEffect(() => {
    // Unique list of event names
    const cornerstoneEvents = Object.values(cornerstone.EVENTS);
    const cornerstoneToolsEvents = Object.values(cornerstoneTools.EVENTS);
    const csEventNames = cornerstoneEvents.concat(cornerstoneToolsEvents);
    console.log(csEventNames);
  }, []);
  */

  //
  // window resize
  //
  useLayoutEffect(() => {
    function handleWindowResize() {
      // console.log(window.innerWidth, window.innerHeight);
      const element = cornerstoneViewportEl.current;
      cornerstone.resize(element);
    }

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  //
  // initialize element
  //
  useEffect(() => {
    const element = cornerstoneViewportEl.current;
    cornerstone.enable(element);

    cornerstoneTools.addStackStateManager(element, ["stack"]);
    setIsElementEnabled(true);

    return () => {
      cornerstone.disable(element);
    };
  }, []);

  //
  // stack
  //
  useEffect(() => {
    const element = cornerstoneViewportEl.current;
    cornerstoneTools.clearToolState(element, "stack");
    cornerstoneTools.addToolState(element, "stack", {
      imageIds: [...imageIds],
      currentImageIdIndex: 0, // just start at 0
    });
  }, [imageIds]);

  //
  // tools
  //
  useEffect(() => {
    const element = cornerstoneViewportEl.current;

    if (isElementEnabled) {
      addInitialTools(element, tools, isStackPrefetchEnabled);
    }

    return () => {
      if (isElementEnabled) {
        cleanupStackPrefetch(element, isStackPrefetchEnabled);
      }
    };
  }, [isElementEnabled, isStackPrefetchEnabled, tools]);

  //
  // activeTool
  //
  useEffect(() => {
    if (isElementEnabled) {
      const element = cornerstoneViewportEl.current;
      setActiveTool(element, activeToolName);
    }
  }, [isElementEnabled, activeToolName]);

  //
  // initial image load
  //
  useEffect(() => {
    const element = cornerstoneViewportEl.current;

    if (isElementEnabled && imageIds.length && initialDisplayImage) {
      loadImage({
        element,
        imageIds,
        imageIdIndex,
        setIsImageLoading,
        setInitialDisplayImage,
        errorHandler,
      });
    }
  }, [
    isElementEnabled,
    imageIds,
    imageIdIndex,
    initialDisplayImage,
    setInitialDisplayImage,
    setIsImageLoading,
    errorHandler,
  ]);

  //
  // cornerstone events
  //
  useEffect(() => {
    const element = cornerstoneViewportEl.current;

    const onNewImage = (event) => {
      const { imageId } = event.detail.image;
      const currentImageIdIndex = imageIds.indexOf(imageId);
      setImageIdIndex(currentImageIdIndex);

      handleNewImage(element, imageId);
    };

    const onImageRendered = (event) => {
      const viewport = event.detail.viewport;
      setViewportInfo({
        scale: viewport.scale,
        windowCenter: viewport.voi.windowCenter,
        windowWidth: viewport.voi.windowWidth,
        rotationDegrees: viewport.rotation,
        isFlippedVertically: viewport.vflip,
        isFlippedHorizontally: viewport.hflip,
      });
    };

    const onImageProgress = (event) => {
      handleImageProgress(event);
    }

    if (isElementEnabled) {
      element["addEventListener"](cornerstone.EVENTS.NEW_IMAGE, onNewImage);
      element["addEventListener"](
        cornerstone.EVENTS.IMAGE_RENDERED,
        onImageRendered,
      );
      cornerstone.events["addEventListener"](
        "cornerstoneimageloadprogress",
        onImageProgress,
      );
    }

    return () => {
      element["removeEventListener"](cornerstone.EVENTS.NEW_IMAGE, onNewImage);
      element["removeEventListener"](
        cornerstone.EVENTS.IMAGE_RENDERED,
        onImageRendered,
      );
      cornerstone.events["removeEventListener"](
        "cornerstoneimageloadprogress",
        onImageProgress,
      );
    };
  }, [
    isElementEnabled,
    imageIds,
    setImageIdIndex,
    setViewportInfo,
    handleNewImage,
    handleImageProgress,
  ]);

  //
  // external event listeners
  //
  useEffect(() => {
    const element = cornerstoneViewportEl.current;

    if (isElementEnabled) {
      for (const eventListener of eventListeners) {
        element.addEventListener(
          eventListener.eventName,
          eventListener.handler,
        );
      }
    }

    return () => {
      if (isElementEnabled) {
        for (const eventListener of eventListeners) {
          element.removeEventListener(
            eventListener.eventName,
            eventListener.handler,
          );
        }
      }
    };
  }, [isElementEnabled, eventListeners]);

  useEffect(() => {
    const element = cornerstoneViewportEl.current;

    if (isElementEnabled) {
      onElementEnabled(element);
    }
  }, [isElementEnabled, onElementEnabled]);

  //
  // handlers
  //

  const imageSliderOnInputCallback = (value) => {
    const element = cornerstoneViewportEl.current;
    setImageIdIndex(value);
    scrollToIndex(element, value);
  };

  const preventMouseInteraction = function (e) {
    e.preventDefault();
  };

  return (
    <React.Fragment>
      <div style={style} className={containerCssClass}>
        <div
          className={elementCssClass}
          ref={cornerstoneViewportEl}
          onContextMenu={preventMouseInteraction}
          onMouseDown={preventMouseInteraction}
        >
          {/* This classname is important in that it tells `cornerstone` to not
           * create a new canvas element when we "enable" the `viewport-element`
           */}
          <canvas className="cornerstone-canvas" />
          {isOverlayVisible && (
            <ViewportOverlay
              imageIndex={imageIdIndex + 1}
              stackSize={imageIds.length}
              scale={viewportInfo.scale}
              windowWidth={viewportInfo.windowWidth}
              windowCenter={viewportInfo.windowCenter}
              imageId={imageIds.length ? imageIds[imageIdIndex] : ""}
            />
          )}
        </div>

        <ImageScrollbar
          onInputCallback={imageSliderOnInputCallback}
          max={scrollbarMax}
          height={scrollbarHeight}
          value={imageIdIndex}
        />
      </div>
    </React.Fragment>
  );
}

ReactCornerstoneViewportHooks.propTypes = {
  imageIds: PropTypes.arrayOf(PropTypes.string).isRequired, // list of strings with `wadouri:` prefix
  imageIndex: PropTypes.number,
  // Controlled
  activeToolName: PropTypes.string,
  tools: PropTypes.arrayOf(
    PropTypes.oneOfType([
      // String
      PropTypes.string,
      // Object
      PropTypes.shape({
        name: PropTypes.string, // Tool Name
        toolClass: PropTypes.func, // Custom (ToolClass)
        props: PropTypes.Object, // Props to Pass to `addTool`
        mode: PropTypes.string, // Initial mode, if one other than default
        modeOptions: PropTypes.Object, // { mouseButtonMask: [int] }
      }),
    ]),
  ),
  // Optional
  // isActive ?? classname -> active
  children: PropTypes.node,
  cornerstoneOptions: PropTypes.object, // cornerstone.enable options
  isStackPrefetchEnabled: PropTypes.bool, // should prefetch?
  // CINE
  isPlaying: PropTypes.bool,
  frameRate: PropTypes.number, // Between 1 and ?
  //
  setViewportActive: PropTypes.func, // Called when viewport should be set to active?
  onNewImage: PropTypes.func,
  handleImageProgress: PropTypes.func,
  onNewImageDebounceTime: PropTypes.number,
  viewportOverlayComponent: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  // Cornerstone Events
  onElementEnabled: PropTypes.func, // Escape hatch
  eventListeners: PropTypes.arrayOf(
    PropTypes.shape({
      // target: PropTypes.oneOf(["element", "cornerstone"]).isRequired,
      eventName: PropTypes.string.isRequired,
      handler: PropTypes.func.isRequired,
    }),
  ),
  startLoadHandler: PropTypes.func,
  endLoadHandler: PropTypes.func,
  loadIndicatorDelay: PropTypes.number,
  loadingIndicatorComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
  resizeThrottleMs: PropTypes.number, // 0 to disable
  //
  style: PropTypes.object,
  // className: PropTypes.string,
  containerCssClass: PropTypes.string,
  elementCssClass: PropTypes.string,
  isOverlayVisible: PropTypes.bool,
};

export default ReactCornerstoneViewportHooks;

import cornerstoneTools from "cornerstone-tools";

const BaseTool = cornerstoneTools.importInternal("base/BaseAnnotationTool");
// const BaseAnnotationTool = cornerstoneTools.importInternal(
//   "base/BaseAnnotationTool",
// );
const { rectangleRoiCursor } = cornerstoneTools.importInternal("tools/cursors");
const triggerEvent = cornerstoneTools.importInternal("util/triggerEvent");

// State
const toolColors = cornerstoneTools.toolColors;
const getToolState = cornerstoneTools.getToolState;

// Drawing
const getNewContext = cornerstoneTools.importInternal("drawing/getNewContext");
const draw = cornerstoneTools.importInternal("drawing/draw");
const drawRect = cornerstoneTools.importInternal("drawing/drawRect");

const external = cornerstoneTools.external;
const EVENTS = cornerstoneTools.EVENTS;

export default class RectangleRoiMobileTool extends BaseTool {
  /** @inheritdoc */
  constructor(props = {}) {
    const defaultProps = {
      name: "RectangleRoiMobile",
      supportedInteractionTypes: ["Mouse", "Touch"],
      configuration: {
        // minWindowWidth: 2,
        drawHandles: false,
      },
      svgCursor: rectangleRoiCursor,
    };

    super(props, defaultProps);
    this._resetHandles();
    this.isAnnotating = false;

    this.postTouchStartCallback = (e) => {
      // this._startOutliningRegion.bind(this)(e);
    };

    this.touchDragCallback = (e) => {
      if (!this.isAnnotating) {
        this._startOutliningRegion.bind(this)(e); // start drawing
      }
      this.isAnnotating = true;
      this._setHandlesAndUpdate.bind(this)(e);
    };

    this.touchEndCallback = (e, ...args) => {
      if (this.isAnnotating) {
        this._applyStrategy.bind(this)(e);
        this._createNewMeasurement(e);
        this.isAnnotating = false;
        return;
      }
      this.deletePreviousMeasurements(e);

      // remove green box
      this._applyStrategy(e);
      external.cornerstone.updateImage(e.detail.element);
    };

    this.postMouseDownCallback = (e) => {
      this._startOutliningRegion(e);
    };

    this.mouseClickCallback = (e) => {
      // this._startOutliningRegion.bind(this)(e)
      if (this.isAnnotating) {
        this._applyStrategy(e);
        return;
      }
      this.deletePreviousMeasurements(e);

      // remove green box
      this._applyStrategy(e);
      external.cornerstone.updateImage(e.detail.element);
    };

    this.mouseDragCallback = (e) => {
      this.isAnnotating = true;
      this._setHandlesAndUpdate(e);
      // console.warn("drag");
    };
    this.mouseMoveCallback = (e) => {
      // this._setHandlesAndUpdate(e);
    };

    this.mouseUpCallback = (e) => {
      // console.warn("Up", this.isAnnotating);
      this._createNewMeasurement(this._toMobile(e));
      this.isAnnotating = false;
    };
  }

  /**
   * Render hook: draws the Region's "box" when selecting
   *
   * @param {Cornerstone.event#cornerstoneimagerendered} evt cornerstoneimagerendered event
   * @returns {void}
   */
  renderToolData(evt) {
    const eventData = evt.detail;
    const { element } = eventData;
    const color = toolColors.getColorIfActive({ active: true });
    const context = getNewContext(eventData.canvasContext.canvas);
    const toolData = getToolState(evt.currentTarget, this.name);

    draw(context, (context) => {
      !_isEmptyObject(this.handles.start) &&
        drawRect(context, element, this.handles.start, this.handles.end, {
          color,
        });
      _isEmptyObject(this.handles.start) && toolData &&
        drawRect(
          context,
          element,
          toolData.data[0].start,
          toolData.data[0].end,
          {
            color,
          },
        );
    });
  }

  _toMobile(e) {
    return {
      ...e,
      currentTarget: e.currentTarget,
      detail: {
        element: e.detail.element,
        handles: {
          start: e.detail.startPoints.image,
          end: e.detail.lastPoints.image,
        },
      },
    };
  }

  _createNewMeasurement(e) {
    if (
      !(
        e &&
        e.detail &&
        e.detail.element &&
        e.detail.handles &&
        e.detail.handles.start
      )
    ) {
      return console.warn("Invalid evt.detail.handles.start", e);
    }

    // topLeft
    const start = {
      x: Math.min(e.detail.handles.start.x, e.detail.handles.end.x),
      y: Math.min(e.detail.handles.start.y, e.detail.handles.end.y),
      highlight: true,
      active: false,
    };

    // bottomRight
    const end = {
      x: Math.max(e.detail.handles.start.x, e.detail.handles.end.x),
      y: Math.max(e.detail.handles.start.y, e.detail.handles.end.y),
      highlight: true,
      active: true,
    };

    const measurement = {
      visible: true,
      active: true,
      invalidated: false,
      start,
      end,
    };

    // @see ensureUniqueMeasurement() in ReactCornerstoneViewportHooksHelpers
    this.deletePreviousMeasurements(e);

    cornerstoneTools.addToolState(e.detail.element, this.name, measurement);
    triggerEvent(e.detail.element, EVENTS.MEASUREMENT_COMPLETED, measurement);
  }

  createNewMeasurement(eventData) {
    // do nothing
  }

  updateCachedStats(image, element, data) {
    // do nothing
  }

  // we do not want people to fool around with the annotation
  pointNearTool(element, data, coords, interactionType) {
    return false;
  }

  /**
   * Sets the start handle point and claims the eventDispatcher event
   *
   * @param {*} evt // mousedown, touchstart, click
   * @returns {Boolean} True
   */
  _startOutliningRegion(evt) {
    const consumeEvent = true;
    const element = evt.detail.element;
    const image = evt.detail.currentPoints.image;

    // console.warn('_startOutliningRegion', this.isAnnotating)
    // console.log(this.handles.start, 'start');
    // console.log(this.handles.end, 'end');

    if (_isEmptyObject(this.handles.start)) {
      this.handles.start = image;
    } else {
      this.handles.end = image;
      this._applyStrategy(evt);
    }

    // console.log(this.handles.start, 'start2');
    // console.log(this.handles.end, 'end2');
    external.cornerstone.updateImage(element);

    return consumeEvent;
  }

  /**
   * This function will update the handles and updateImage to force re-draw
   *
   * @param {(CornerstoneTools.event#TOUCH_DRAG|CornerstoneTools.event#MOUSE_DRAG|CornerstoneTools.event#MOUSE_MOVE)} evt  Interaction event emitted by an enabledElement
   */
  _setHandlesAndUpdate(evt) {
    const element = evt.detail.element;
    const image = evt.detail.currentPoints.image;

    this.handles.end = image;
    external.cornerstone.updateImage(element);
  }

  /**
   * Event handler for MOUSE_UP/TOUCH_END during handle drag event loop.
   *
   * @param {(CornerstoneTools.event#MOUSE_UP|CornerstoneTools.event#TOUCH_END)} evt Interaction event emitted by an enabledElement
   */
  _applyStrategy(evt) {
    if (
      _isEmptyObject(this.handles.start) ||
      _isEmptyObject(this.handles.end)
    ) {
      return;
    }

    evt.detail.handles = this.handles;
    this._resetHandles();
  }

  /**
   * Sets the start and end handle points to empty objects
   */
  _resetHandles() {
    this.handles = {
      start: {},
      end: {},
    };
  }

  /**
   * Unsafe method copy-pasted from cornerstoneTools
   */
  deletePreviousMeasurements(eventData) {
    const toolData = cornerstoneTools.getToolState(
      eventData.currentTarget,
      this.name,
    );
    if (toolData && toolData.data && toolData.data.length) {
      toolData.data.splice(0, toolData.data.length);
    }
  }
}

const _isEmptyObject = (obj) =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

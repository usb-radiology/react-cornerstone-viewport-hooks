import cornerstoneTools from "cornerstone-tools";

const BaseTool = cornerstoneTools.importInternal("base/BaseTool");

const { rectangleRoiCursor } = cornerstoneTools.importInternal("tools/cursors");

// State
const toolColors = cornerstoneTools.toolColors;

// Drawing
const getNewContext = cornerstoneTools.importInternal("drawing/getNewContext");
const draw = cornerstoneTools.importInternal("drawing/draw");
const drawRect = cornerstoneTools.importInternal("drawing/drawRect");

const external = cornerstoneTools.external;

export default class RectangleRoiMobileTool extends BaseTool {
  /** @inheritdoc */
  constructor(props = {}) {
    const defaultProps = {
      name: "RectangleRoiMobile",
      supportedInteractionTypes: ["Mouse", "Touch"],
      configuration: {
        minWindowWidth: 10,
        drawHandles: true,
      },
      svgCursor: rectangleRoiCursor,
    };

    super(props, defaultProps);
    this._resetHandles();

    this.postTouchStartCallback = this._startOutliningRegion.bind(this);
    this.touchDragCallback = this._setHandlesAndUpdate.bind(this);
    this.touchEndCallback = this._applyStrategy.bind(this);
    this.postMouseDownCallback = this._startOutliningRegion.bind(this);
    this.mouseClickCallback = this._startOutliningRegion.bind(this);
    this.mouseDragCallback = this._setHandlesAndUpdate.bind(this);
    this.mouseMoveCallback = this._setHandlesAndUpdate.bind(this);
    this.mouseUpCallback = this._applyStrategy.bind(this);
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

    draw(context, (context) => {
      drawRect(context, element, this.handles.start, this.handles.end, {
        color,
      });
    });
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

    if (_isEmptyObject(this.handles.start)) {
      this.handles.start = image;
    } else {
      this.handles.end = image;
      this._applyStrategy(evt);
    }

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
}

const _isEmptyObject = (obj) =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

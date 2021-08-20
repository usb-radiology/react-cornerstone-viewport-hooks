import cornerstoneTools from "cornerstone-tools";

const BaseAnnotationTool = cornerstoneTools.importInternal(
  "base/BaseAnnotationTool",
);
const { rectangleRoiCursor } = cornerstoneTools.importInternal("tools/cursors");

// State
const getToolState = cornerstoneTools.getToolState;
const addToolState = cornerstoneTools.addToolState;
const toolStyle = cornerstoneTools.toolStyle;
const toolColors = cornerstoneTools.toolColors;
const EVENTS = cornerstoneTools.EVENTS;

// Drawing
const getNewContext = cornerstoneTools.importInternal("drawing/getNewContext");
const draw = cornerstoneTools.importInternal("drawing/draw");
const drawHandles = cornerstoneTools.importInternal("drawing/drawHandles");
const setShadow = cornerstoneTools.importInternal("drawing/setShadow");
const drawRect = cornerstoneTools.importInternal("drawing/drawRect");

// Util
const triggerEvent = cornerstoneTools.importInternal("util/triggerEvent");
const getLogger = cornerstoneTools.importInternal("util/getLogger");
const logger = getLogger("tools:annotation:SingleClickSquareUniqueTool");

const external = cornerstoneTools.external;

export default class SingleClickSquareUniqueTool extends BaseAnnotationTool {
  constructor(props = {}) {
    const defaultProps = {
      name: "SingleClickSquareUnique",
      supportedInteractionTypes: ["Mouse", "Touch"],
      configuration: {
        drawHandles: false,
        // showMinMax: false,
        // showHounsfieldUnits: true
        margin: 50,
        ...props,
      },
      svgCursor: rectangleRoiCursor,
    };

    super(props, defaultProps);
  }

  addNewMeasurement(evt, interactionType) {
    evt.preventDefault();
    evt.stopPropagation();

    const eventData = evt.detail;
    const element = evt.detail.element;
    const measurementData = this.createNewMeasurement(eventData);

    // Associate this data with this imageId so we can render it and manipulate it
    addToolState(element, this.name, measurementData);
    external.cornerstone.updateImage(element);

    measurementData.active = false;
    external.cornerstone.updateImage(element);

    const modifiedEventData = {
      toolName: this.name,
      toolType: this.name, // Deprecation notice: toolType will be replaced by toolName
      element,
      measurementData,
    };

    triggerEvent(element, EVENTS.MEASUREMENT_COMPLETED, modifiedEventData);
  }

  createNewMeasurement(eventData) {
    console.log(eventData);
    console.log(this.configuration.margin);

    // currentPoints.image returns the x,y of the current point on the image
    // i.e. for an image of size 512x512, clicking on the bottom edge will
    // return (464, 471), etc.
    const goodEventData =
      eventData && eventData.currentPoints && eventData.currentPoints.image;

    if (!goodEventData) {
      logger.error(
        `required eventData not supplied to tool ${this.name}'s createNewMeasurement`,
      );

      return;
    }

    const result = {
      visible: true,
      active: true,
      color: undefined,
      invalidated: true,
      handles: {
        end: {
          x: eventData.currentPoints.image.x,
          y: eventData.currentPoints.image.y,
          highlight: true,
          active: true,
        },
        initialRotation: eventData.viewport.rotation,
      },
    };

    return result;
  }

  renderToolData(evt) {
    const toolData = getToolState(evt.currentTarget, this.name);

    if (!toolData) {
      return;
    }

    const eventData = evt.detail;
    const { image, element } = eventData;
    const { handleRadius, drawHandlesOnHover } = this.configuration;
    const context = getNewContext(eventData.canvasContext.canvas);

    draw(context, (context) => {
      // ensure uniqueness ...
      if (toolData.data.length > 1) {
        toolData.data.splice(0, toolData.data.length - 1);
      }

      // If we have tool data for this element - iterate over each set and draw it
      for (let i = 0; i < toolData.data.length; i++) {
        const data = toolData.data[i];

        if (data.visible === false) {
          continue;
        }

        // Configure
        const color = toolColors.getColorIfActive(data);
        const handleOptions = {
          color,
          handleRadius,
          drawHandlesIfActive: drawHandlesOnHover,
        };

        setShadow(context, this.configuration);

        data.handles.start = {
          x: 0,
          y: 0,
          highlight: true,
          active: true,
        };

        // Draw
        drawRect(
          context,
          element,
          data.handles.start,
          data.handles.end,
          {
            color,
          },
          "pixel",
          data.handles.initialRotation,
        );

        if (this.configuration.drawHandles) {
          drawHandles(context, eventData, data.handles, handleOptions);
        }
      }
    });
  }

  // we do not want people to fool around with the annotation
  pointNearTool(element, data, coords, interactionType) {
    return false;

    /*
    const hasStartAndEndHandles =
      data && data.handles && data.handles.start && data.handles.end;
    const validParameters = hasStartAndEndHandles;

    if (!validParameters) {
      logger.warn(
        `invalid parameters supplied to tool ${this.name}'s pointNearTool`,
      );
    }

    if (!validParameters || data.visible === false) {
      return false;
    }

    const distance = interactionType === "mouse" ? 15 : 25;
    const startCanvas = external.cornerstone.pixelToCanvas(
      element,
      data.handles.start,
    );
    const endCanvas = external.cornerstone.pixelToCanvas(
      element,
      data.handles.end,
    );

    const rect = {
      left: Math.min(startCanvas.x, endCanvas.x),
      top: Math.min(startCanvas.y, endCanvas.y),
      width: Math.abs(startCanvas.x - endCanvas.x),
      height: Math.abs(startCanvas.y - endCanvas.y),
    };

    const distanceToPoint = external.cornerstoneMath.rect.distanceToPoint(
      rect,
      coords,
    );

    return distanceToPoint < distance;
    */
  }

  updateCachedStats(image, element, data) {
    // do nothing
  }
}

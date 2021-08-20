import cornerstone from "cornerstone-core";
import cornerstoneTools from "cornerstone-tools";

const AVAILABLE_TOOL_MODES = ["active", "passive", "enabled", "disabled"];

const TOOL_MODE_FUNCTIONS = {
  active: cornerstoneTools.setToolActiveForElement,
  passive: cornerstoneTools.setToolPassiveForElement,
  enabled: cornerstoneTools.setToolEnabledForElement,
  disabled: cornerstoneTools.setToolDisabledForElement,
};

export const TOOL_NAMES = {
  RectangleRoiUnique: "RectangleRoiUnique",
  RectangleRoi: "RectangleRoi",
  Wwwc: "Wwwc",
  Zoom: "Zoom",
  Pan: "Pan",
  SingleClickSquareUnique: "SingleClickSquareUnique",
};

export const getValidToolNames = function (enabledElement) {
  const validTools = cornerstoneTools.store.state.tools.filter(
    (tool) => tool.element === enabledElement,
  );
  const validToolNames = validTools.map((tool) => tool.name);
  return validToolNames;
};

export const addInitialTools = function (
  enabledElement,
  tools,
  isStackPrefetchEnabled,
) {
  const validToolNames = getValidToolNames(enabledElement);

  for (const tool of tools) {
    if (validToolNames.includes(tool.name)) {
      continue;
    }

    const toolName = `${tool.name}Tool`;
    tool.toolClass = tool.toolClass || cornerstoneTools[toolName];

    if (!tool.toolClass) {
      console.warn(`Unable to add tool with name '${tool.name}'.`);
      continue;
    }

    cornerstoneTools.addToolForElement(
      enabledElement,
      tool.toolClass,
      tool.props || {},
    );

    const hasInitialMode =
      tool.mode && AVAILABLE_TOOL_MODES.includes(tool.mode);

    if (hasInitialMode) {
      // TODO: We may need to check `tool.props` and the tool class's prototype
      // to determine the name it registered with cornerstone. `tool.name` is not
      // reliable.
      const setToolModeFn = TOOL_MODE_FUNCTIONS[tool.mode];
      setToolModeFn(enabledElement, tool.name, tool.modeOptions || {});
    }
  }

  if (isStackPrefetchEnabled) {
    // TODO: check why this does not automagically work?
    cornerstoneTools.stackPrefetch.setConfiguration({
      maxImagesToPrefetch: Infinity,
      preserveExistingPool: false,
      maxSimultaneousRequests: 6,
    });

    cornerstoneTools.stackPrefetch.enable(enabledElement);
  }
};

export const cleanupStackPrefetch = function (
  enabledElement,
  isStackPrefetchEnabled,
) {
  if (isStackPrefetchEnabled) {
    cornerstoneTools.clearToolState(enabledElement, "stackPrefetch");
    cornerstoneTools.stackPrefetch.disable(enabledElement);
  }
};

export const setActiveTool = function (
  enabledElement,
  activeToolName,
  configuration = {},
) {
  const validToolNames = getValidToolNames(enabledElement);

  if (!validToolNames.includes(activeToolName)) {
    console.warn(
      `Trying to set a tool active that is not "added". Available tools include: ${validToolNames.join(
        ", ",
      )}`,
    );
  }

  cornerstoneTools.setToolActiveForElement(enabledElement, activeToolName, {
    mouseButtonMask: 1,
    ...configuration,
  });
};

export const loadImage = function ({
  element,
  imageIds,
  imageIdIndex,
  setIsImageLoading,
  setInitialDisplayImage,
  errorHandler,
}) {
  setIsImageLoading(true);

  // load images and set the stack
  cornerstone
    .loadAndCacheImage(imageIds[imageIdIndex])
    .then((image) => {
      console.log("display image " + imageIdIndex);
      cornerstone.displayImage(element, image);

      const stack = {
        currentImageIdIndex: imageIdIndex,
        imageIds,
      };

      cornerstoneTools.addToolState(element, "stack", stack);
    })
    .then(() => {
      setIsImageLoading(false);
      setInitialDisplayImage(false);
    })
    .catch((err) => {
      errorHandler(err);
    });
};

export const ensureUniqueMeasurement = function ({ e, toolName }) {
  // console.log(e.detail);
  const element = e.detail.element;
  // console.log(cornerstoneTools.globalImageIdSpecificToolStateManager.get(element, "RectangleRoi"));

  if (e.detail.toolName === toolName) {
    const uuid = e.detail.measurementData.uuid;
    const toolState = cornerstoneTools.getToolState(element, toolName);
    for (const annotation of toolState.data) {
      if (annotation.uuid !== uuid) {
        cornerstoneTools.removeToolState(element, toolName, annotation);
      }
    }
  }
};

/*
export const addInitialToolState = function ({ enabledElement, imageId, toolName, data }) {
  // console.log(imageId);
  // wadouri:http://localhost:8080/api/v1/dicom-images/6e673d3f-9fd2-4929-9312-6dd1894f9148
  // const toolState = cornerstoneTools.globalImageIdSpecificToolStateManager.get(enabledElement, "RectangleRoi");

  cornerstoneTools.clearToolState(enabledElement, toolName);
  cornerstoneTools.addToolState(enabledElement, toolName, data);
};
*/

export const setInitialToolState = function (toolState) {
  cornerstoneTools.globalImageIdSpecificToolStateManager.restoreToolState(
    toolState,
  );
};

export const getToolState = function () {
  // return cornerstoneTools.getToolState(enabledElement, toolName);
  const toolState =
    cornerstoneTools.globalImageIdSpecificToolStateManager.saveToolState();
  return toolState;
};

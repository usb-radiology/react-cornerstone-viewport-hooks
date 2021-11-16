import { Link } from "react-router-dom";

import {
  ReactCornerstoneViewportHooks,
  RectangleRoiMobileTool,
  ZoomTouchPinchTool,
  ZoomTool,
  ReactCornerstoneViewportHooksHelpers,
} from "react-cornerstone-viewport-hooks";
import { useDebugToolState } from "./util";
import { useState } from "react";

const rectangleRoiMobileToolState = {
  tools: [
    { name: "StackScrollMouseWheel", mode: "active" },
    {
      name: "Zoom",
      mode: "active",
      toolClass: ZoomTool,
      modeOptions: { mouseButtonMask: 2 },
      props: {
        configuration: {
          invert: false,
          preventZoomOutsideImage: false,
          maxScale: 3, // overwrite by tool setup {props: {configuration: {maxScale: X}}
        },
      },
    },
    { name: "Wwwc", mode: "disabled", mouseButtonMask: 1 },
    {
      name: "Pan",
      mode: "active",
      modeOptions: { mouseButtonMask: 4 },
    },
    {
      name: ReactCornerstoneViewportHooksHelpers.TOOL_NAMES.RectangleRoiMobile,
      toolClass: RectangleRoiMobileTool,
      mode: "active",
      modeOptions: { mouseButtonMask: 1 },
    },
    { name: "ZoomTouchPinch", mode: "active", toolClass: ZoomTouchPinchTool, mouseButtonMask: 2 },
  ],
  imageIds: [
    // large image to test zooming
    "dicomweb://storage.googleapis.com/data.rapmed.net/production/bfeb22d8-083e-425f-a2ba-2624178213b6/8693aafb-fd86-4be5-ad48-bbc92c87ebb5/6b3f3396-7985-46da-959f-b1be8bb5a967.dcm",
    // "dicomweb://storage.googleapis.com/data.rapmed.net/production/bfeb22d8-083e-425f-a2ba-2624178213b6/1695451c-52a2-47f7-9bdf-a34d580c8154/cc8010b9-0ba8-4b23-9182-1e3dc7d96b4a.dcm",
    // "dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.11.dcm",
    // "dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.12.dcm",
  ],
};

const PageRectangleRoiMobileDemo = function() {
  useDebugToolState();

  const [activeToolName, setActiveToolName] = useState(ReactCornerstoneViewportHooksHelpers.TOOL_NAMES.RectangleRoiMobile);

  const onClick = toolName => () => setActiveToolName(toolName);

  return (
    <div className="container">
      <h5>
        <Link to="/">Back to Examples</Link>
      </h5>

      <h2>Rectangle Roi Mobile Demo</h2>
      <h4>On mobile pinch zoom is enabled</h4>
      <button
        style={{
          backgroundColor:
            activeToolName === "Zoom"
              ? "tomato" : "",
          padding: 5
        }}
        onClick={onClick("Zoom")}>🔍
      </button>
      <button
        style={{
          backgroundColor:
            activeToolName === "Pan"
              ? "tomato" : "",
          margin: 10,
          padding: 5
        }}
        onClick={onClick("Pan")}>↔
      </button>
      <button
        style={{
          backgroundColor:
            activeToolName === ReactCornerstoneViewportHooksHelpers.TOOL_NAMES.RectangleRoiMobile
              ? "tomato" : "",
          padding: 5
        }}
        onClick={onClick(ReactCornerstoneViewportHooksHelpers.TOOL_NAMES.RectangleRoiMobile)}>▢
      </button>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <ReactCornerstoneViewportHooks
          activeToolName={activeToolName}
          tools={rectangleRoiMobileToolState.tools}
          imageIds={rectangleRoiMobileToolState.imageIds}
          style={{ minWidth: "100%", height: "512px", flex: "1" }}
        />
      </div>
    </div>
  );
};

export default PageRectangleRoiMobileDemo;

import { Link } from "react-router-dom";

import {
  ReactCornerstoneViewportHooks,
  RectangleRoiMobileTool,
  ReactCornerstoneViewportHooksHelpers,
} from "react-cornerstone-viewport-hooks";
import { useDebugToolState } from "./util";

const rectangleRoiMobileToolState = {
  tools: [
    { name: "StackScrollMouseWheel", mode: "active" },
    {
      name: "Zoom",
      mode: "active",
      modeOptions: { mouseButtonMask: 2 },
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
  ],
  imageIds: [
    "dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.11.dcm",
    "dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.12.dcm",
  ],
};

const PageRectangleRoiMobileDemo = function () {
  useDebugToolState()

  return (
    <div className="container">
      <h5>
        <Link to="/">Back to Examples</Link>
      </h5>

      <h2>Rectangle Roi Mobile Demo</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <ReactCornerstoneViewportHooks
          activeToolName={ReactCornerstoneViewportHooksHelpers.TOOL_NAMES.RectangleRoiMobile}
          tools={rectangleRoiMobileToolState.tools}
          imageIds={rectangleRoiMobileToolState.imageIds}
          style={{ minWidth: "100%", height: "512px", flex: "1" }}
        />
      </div>
    </div>
  );
};

export default PageRectangleRoiMobileDemo;

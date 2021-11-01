import { Link } from "react-router-dom";

// https://github.com/conorhastings/react-syntax-highlighter

import {
  ReactCornerstoneViewportHooks,
  RectangleRoiUniqueTool,
  ReactCornerstoneViewportHooksHelpers,
} from "react-cornerstone-viewport-hooks";

const rectangleRoiUniqueToolState = {
  tools: [
    { name: "StackScrollMouseWheel", mode: "active" },
    {
      name: "Zoom",
      mode: "active",
      modeOptions: { mouseButtonMask: 2 },
    },
    {
      name: "Pan",
      mode: "active",
      modeOptions: { mouseButtonMask: 4 },
    },
    {
      name: ReactCornerstoneViewportHooksHelpers.TOOL_NAMES.RectangleRoiUnique,
      toolClass: RectangleRoiUniqueTool,
      mode: "active",
      modeOptions: { mouseButtonMask: 1 },
    },
  ],
  imageIds: [
    "dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.11.dcm",
    "dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.12.dcm",
  ],
};

const PageRectangleRoiUniqueDemo = function () {
  return (
    <div className="container">
      <h5>
        <Link to="/">Back to Examples</Link>
      </h5>

      <h2>RectangleRoiUniqueTool Demo</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <ReactCornerstoneViewportHooks
          activeToolName={ReactCornerstoneViewportHooksHelpers.TOOL_NAMES.RectangleRoiUnique}
          tools={rectangleRoiUniqueToolState.tools}
          imageIds={rectangleRoiUniqueToolState.imageIds}
          style={{ minWidth: "100%", height: "512px", flex: "1" }}
        />
      </div>
    </div>
  );
};

export default PageRectangleRoiUniqueDemo;

import { Link } from "react-router-dom";

// https://github.com/conorhastings/react-syntax-highlighter
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  ReactCornerstoneViewportHooks,
  SingleClickSquareUniqueTool,
  ReactCornerstoneViewportHooksHelpers,
} from "react-cornerstone-viewport-hooks";

const singleClickSquareUniqueToolState = {
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
      name: ReactCornerstoneViewportHooksHelpers.TOOL_NAMES
        .SingleClickSquareUnique,
      toolClass: SingleClickSquareUniqueTool,
      mode: "active",
      modeOptions: { mouseButtonMask: 1 },
      props: { margin: 20 },
    },
  ],
  imageIds: [
    "dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.11.dcm",
    "dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.12.dcm",
  ],
};

const PageSingleClickSquareUniqueDemo = function () {
  return (
    <div className="container">
      <h5>
        <Link to="/">Back to Examples</Link>
      </h5>

      <h2>SingleClickSquareUniqueTool Demo</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <ReactCornerstoneViewportHooks
          tools={singleClickSquareUniqueToolState.tools}
          imageIds={singleClickSquareUniqueToolState.imageIds}
          style={{ minWidth: "100%", height: "512px", flex: "1" }}
        />
      </div>
    </div>
  );
};

export default PageSingleClickSquareUniqueDemo;

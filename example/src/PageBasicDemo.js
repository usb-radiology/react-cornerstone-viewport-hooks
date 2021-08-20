import { Link } from "react-router-dom";

// https://github.com/conorhastings/react-syntax-highlighter
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { ReactCornerstoneViewportHooks } from "react-cornerstone-viewport-hooks";

const basicDemoState = {
  tools: [
    // Mouse
    {
      name: "Wwwc",
      mode: "active",
      modeOptions: { mouseButtonMask: 1 },
    },
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
    // Scroll
    { name: "StackScrollMouseWheel", mode: "active" },
    // Touch
    { name: "PanMultiTouch", mode: "active" },
    { name: "ZoomTouchPinch", mode: "active" },
    { name: "StackScrollMultiTouch", mode: "active" },
  ],
  imageIds: [
    "dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.11.dcm",
    "dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.12.dcm",
  ],
};

const PageBasicDemo = function () {
  return (
    <div className="container">
      <h5>
        <Link to="/">Back to Examples</Link>
      </h5>

      <h2>Basic Demo</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <ReactCornerstoneViewportHooks
          tools={basicDemoState.tools}
          imageIds={basicDemoState.imageIds}
          style={{ minWidth: "100%", height: "512px", flex: "1" }}
        />
      </div>

      <h2>Source / Usage</h2>
      <div style={{ marginTop: "35px" }}>
        <SyntaxHighlighter
          language="jsx"
          showLineNumbers={true}
          style={atomDark}
        >
          {`const state = {
  tools: [
    // Mouse
    {
      name: 'Wwwc',
      mode: 'active',
      modeOptions: { mouseButtonMask: 1 },
    },
    {
      name: 'Zoom',
      mode: 'active',
      modeOptions: { mouseButtonMask: 2 },
    },
    {
      name: 'Pan',
      mode: 'active',
      modeOptions: { mouseButtonMask: 4 },
    },
    // Scroll
    { name: 'StackScrollMouseWheel', mode: 'active' },
    // Touch
    { name: 'PanMultiTouch', mode: 'active' },
    { name: 'ZoomTouchPinch', mode: 'active' },
    { name: 'StackScrollMultiTouch', mode: 'active' },
  ],
  imageIds: [
    'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.11.dcm',
    'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.12.dcm',
  ],
};
<ReactCornerstoneViewportHooks
  tools={state.tools}
  imageIds={state.imageIds}
  style={{ minWidth: '100%', height: '512px', flex: '1' }}
/>`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default PageBasicDemo;

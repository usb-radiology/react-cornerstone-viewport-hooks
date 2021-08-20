import React from "react";
import { Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import LinkOut from "./LinkOut";

const PageIndex = function () {
  const examples = [
    {
      title: "Basic Usage",
      url: "/basic",
      text: "How to render an array of DICOM images and setup common built-in tools.",
    },
    {
      title: "RectangleRoiUnique",
      url: "/rectangle-roi-unique",
      text: "Create a unique rectangle ROI.",
    },
    {
      title: "SingleClickSquareUnique",
      url: "/single-click-square-unique",
      text: "Create a unique square ROI with a single click.",
    },
  ];

  const exampleComponents = examples.map((e) => {
    return <ExampleEntry key={e.title} {...e} />;
  });

  return (
    <div className="container">
      <div className="row">
        <h1>Cornerstone Viewport</h1>
      </div>
      <div className="row">
        <div className="col-xs-12 col-lg-6">
          <p>
            This is a set of re-usable components for displaying data with{" "}
            <LinkOut
              href={"https://github.com/cornerstonejs/cornerstone"}
              text={"cornerstone.js"}
            />
            .
          </p>
        </div>

        <div className="col-xs-12 col-lg-12">
          <h3>Examples</h3>
          {exampleComponents}
        </div>

        <div className="col-xs-12 col-lg-12">
          <h3>Configuring Cornerstone</h3>
          <p>
            All of these examples assume that the cornerstone family of
            libraries have been imported and configured prior to use. Here is
            brief example of what that may look like in ES6:
          </p>
          <SyntaxHighlighter
            language="jsx"
            showLineNumbers={true}
            style={atomDark}
          >
            {`import dicomParser from 'dicom-parser';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import cornerstoneMath from 'cornerstone-math';
import cornerstoneTools from 'cornerstone-tools';
import Hammer from 'hammerjs';
export default function initCornerstone() {
  // Cornerstone Tools
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.Hammer = Hammer;
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
  cornerstoneTools.init();
  // Image Loader
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  cornerstoneWADOImageLoader.webWorkerManager.initialize({
    maxWebWorkers: navigator.hardwareConcurrency || 1,
    startWebWorkersOnDemand: true,
    taskConfiguration: {
      decodeTask: {
        initializeCodecsOnStartup: false,
        usePDFJS: false,
        strict: false,
      },
    },
  });
}`}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

function ExampleEntry({ title, url, text, screenshotUrl }) {
  return (
    <div>
      <h5>
        <Link to={url}>{title}</Link>
      </h5>
      <p>{text}</p>
      <hr />
    </div>
  );
}

export default PageIndex;

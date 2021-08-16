import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import initCornerstone from "./initCornerstone.js";

//
initCornerstone();
ReactDOM.render(<App />, document.getElementById("root"));

import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "react-cornerstone-viewport-hooks/dist/index.css";
import PageIndex from "./PageIndex";
import PageBasicDemo from "./PageBasicDemo";
import PageRectangleRoiUniqueDemo from "./PageRectangleRoiUniqueDemo";
import PageSingleClickSquareUniqueDemo from "./PageSingleClickSquareUniqueDemo";
import RectangleRoiMobileDemo from "./PageRectangleRoiMobileDemo"

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={PageIndex} />
        <Route exact path="/basic" component={PageBasicDemo} />
        <Route
          exact
          path="/rectangle-roi-unique"
          component={PageRectangleRoiUniqueDemo}
        />
        <Route
          exact
          path="/single-click-square-unique"
          component={PageSingleClickSquareUniqueDemo}
        />
        <Route
          exact
          path="/rectangle-roi-mobile"
          component={RectangleRoiMobileDemo}
        />
        <Route exact component={PageIndex} />
      </Switch>
    </Router>
  );
};

export default App;

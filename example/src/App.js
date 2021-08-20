import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import "react-cornerstone-viewport-hooks/dist/index.css";
import PageIndex from "./PageIndex";
import PageBasicDemo from "./PageBasicDemo";
import PageRectangleRoiUniqueDemo from "./PageRectangleRoiUniqueDemo";

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
        <Route exact component={PageIndex} />
      </Switch>
    </Router>
  );
};

export default App;

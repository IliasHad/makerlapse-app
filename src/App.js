import React from "react";
import "./App.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { IndexPage } from "./pages/index";
import { PreferencesPage } from "./pages/preferences";
import { MusicPage } from "./pages/music";
import { VideoPage } from "./pages/video";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" component={IndexPage} exact />
          <Route path="/preferences" component={PreferencesPage} exact />
          <Route path="/music" component={MusicPage} exact />
          <Route path="/video" component={VideoPage} exact />
        </Switch>
      </div>
    </Router>
  );
};

export default App;

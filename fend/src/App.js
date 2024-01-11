import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import "./assets/App.css";

import Students from "./pages/Student";
import Navbar from "./layouts/Navbar";
import AddStudent from "./pages/AddStudent";

function App() {
  return (
    <div>
          <Navbar/>

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/students"]} component={Students} />
          <Route exact path="/add" component={AddStudent} />
          <Route path="/students/:id" component={AddStudent} />

        </Switch>
      </div>
    </div>
  );
}

export default App;

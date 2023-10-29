import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Homepage from "./Homepage";
import {HOME_ROUTE, LOGIN_ROUTE } from "../Utils/UrlConstants";
import AuthenticationPage from "./AuthenticationPage";

const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route path={LOGIN_ROUTE} element={<AuthenticationPage />} />
        <Route
          path={HOME_ROUTE}
          element={<ProtectedRoute children={<Homepage />} />}
        />
      </Routes>
    </Router>
  );
};

export default Routing;
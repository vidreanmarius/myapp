import React from "react";
import { Navigate } from "react-router-dom";
import { LOCAL_STORAGE_USER_KEY } from "../Utils/UrlConstants";

const ProtectedRoute = ({ children }) => {
  if (!localStorage.getItem(LOCAL_STORAGE_USER_KEY)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
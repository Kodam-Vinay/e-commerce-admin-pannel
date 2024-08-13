import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ROUTING_PATHS } from "../utils/constants";

const AuthProtectedRoute = ({ children }) => {
  const userDetails = useSelector(
    (store) => store?.persistSliceReducer?.user?.userInfo
  );
  return Object.keys(userDetails)?.length > 0 && userDetails?.jwtToken ? (
    <Navigate to={ROUTING_PATHS.home} />
  ) : (
    children
  );
};

export default AuthProtectedRoute;

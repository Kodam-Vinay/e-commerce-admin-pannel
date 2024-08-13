import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ROUTING_PATHS } from "../utils/constants";

const HomeProtectedRoute = ({ children }) => {
  const userDetails = useSelector(
    (store) => store?.persistSliceReducer?.user?.userInfo
  );

  const prevPath = useSelector(
    (store) => store?.persistSliceReducer?.path?.prevPath
  );

  return Object.keys(userDetails)?.length > 0 && userDetails?.jwtToken ? (
    children
  ) : (
    <Navigate
      to={
        prevPath === ROUTING_PATHS.signin || prevPath === ROUTING_PATHS.signup
          ? prevPath
          : ROUTING_PATHS.signin
      }
    />
  );
};

export default HomeProtectedRoute;

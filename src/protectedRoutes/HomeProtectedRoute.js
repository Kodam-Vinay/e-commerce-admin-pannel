import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

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
        prevPath === "/sign-in" || prevPath === "/sign-up"
          ? prevPath
          : "/sign-in"
      }
    />
  );
};

export default HomeProtectedRoute;

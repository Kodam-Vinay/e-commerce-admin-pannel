import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const userDetails = useSelector(
    (store) => store?.persistSliceReducer?.user?.userInfo
  );

  const prevPath = useSelector(
    (store) => store?.persistSliceReducer?.path?.prevPath
  );

  return Object.keys(userDetails)?.length > 0 &&
    userDetails?.role === "admin" ? (
    children
  ) : (
    <Navigate to={prevPath} />
  );
};

export default AdminProtectedRoute;

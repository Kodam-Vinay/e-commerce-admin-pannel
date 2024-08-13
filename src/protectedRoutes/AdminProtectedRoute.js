import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { USER_ROLES } from "../utils/constants";

const AdminProtectedRoute = ({ children }) => {
  const userDetails = useSelector(
    (store) => store?.persistSliceReducer?.user?.userInfo
  );

  const prevPath = useSelector(
    (store) => store?.persistSliceReducer?.path?.prevPath
  );

  return Object.keys(userDetails)?.length > 0 &&
    userDetails?.role === USER_ROLES[0].role ? (
    children
  ) : (
    <Navigate to={prevPath} />
  );
};

export default AdminProtectedRoute;

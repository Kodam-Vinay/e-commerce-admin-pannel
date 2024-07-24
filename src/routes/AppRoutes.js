import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Home from "../pages/Home";
import Customers from "../pages/Customers";
import Products from "../pages/Products";
import Body from "../components/Body";
import Profile from "../pages/Profile";
import SignIn from "../auth/SignIn";
import SignUp from "../auth/SignUp";
import OtpVerification from "../auth/OtpVerification";
import VerificationProtectedRoute from "../protectedRoutes/VerificationProtectedRoute";
import { storeActivePath } from "../redux/slices/pathSlice";
import AuthProtectedRoute from "../protectedRoutes/AuthProtectedRoute";
import HomeProtectedRoute from "../protectedRoutes/HomeProtectedRoute";
import ErrorPage from "../pages/ErrorPage";
import Sellers from "../pages/Sellers";
import GlobalModal from "../utils/modal/GlobalModal";
import { ROUTING_PATHS } from "../utils/constants";

const RenderLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(storeActivePath(location.pathname));
  }, [location.pathname]);

  return (
    <>
      <GlobalModal />
      <Outlet />
    </>
  );
};

const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "",
      element: <RenderLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <Body />,
          children: [
            {
              path: ROUTING_PATHS.home,
              element: (
                <HomeProtectedRoute>
                  <Home />
                </HomeProtectedRoute>
              ),
            },
            {
              path: ROUTING_PATHS.users,
              element: (
                <HomeProtectedRoute>
                  <Customers />
                </HomeProtectedRoute>
              ),
            },
            {
              path: ROUTING_PATHS.sellers,
              element: (
                <HomeProtectedRoute>
                  <Sellers />
                </HomeProtectedRoute>
              ),
            },
            {
              path: ROUTING_PATHS.products,
              element: (
                <HomeProtectedRoute>
                  <Products />
                </HomeProtectedRoute>
              ),
            },
            {
              path: ROUTING_PATHS.profile,
              element: (
                <HomeProtectedRoute>
                  <Profile />
                </HomeProtectedRoute>
              ),
            },
          ],
        },
        {
          path: ROUTING_PATHS.signin,
          element: (
            <AuthProtectedRoute>
              <SignIn />
            </AuthProtectedRoute>
          ),
        },
        {
          path: ROUTING_PATHS.signup,
          element: (
            <AuthProtectedRoute>
              <SignUp />
            </AuthProtectedRoute>
          ),
        },
        {
          path: ROUTING_PATHS.verifyotp,
          element: (
            <VerificationProtectedRoute>
              <OtpVerification />
            </VerificationProtectedRoute>
          ),
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default AppRoutes;

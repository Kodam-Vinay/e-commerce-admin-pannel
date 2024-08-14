import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Outlet, useNavigate } from "react-router-dom";
import {
  customTheme,
  DrawerHeader,
  MODAL_CONTENT_TYPES,
  NAVBAR_SETTINGS,
} from "../utils/constants";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  storeModalContent,
  storeModalContentType,
  toggleModalConfirmState,
  toggleModalState,
} from "../redux/slices/modalSlice";
import { storeUserInfo } from "../redux/slices/userSlice";
import { ThemeProvider } from "@mui/material";
import useCategoryBrandForm from "../hooks/useCategoryBrandForm";
import useUserForm from "../hooks/useUserForm";
import useProductForm from "../hooks/useProductForm";

export default function Body() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const confirmState = useSelector((store) => store?.modal?.isConfirmed);
  const contentType = useSelector((store) => store?.modal?.contentType);

  useCategoryBrandForm();
  useUserForm();
  useProductForm();

  useEffect(() => {
    if (confirmState && contentType === MODAL_CONTENT_TYPES.logout) {
      navigate("/");
      dispatch(storeUserInfo({}));
      dispatch(toggleModalConfirmState(false));
    }
  }, [confirmState]);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (setting) => {
    setAnchorElUser(null);
    if (setting === NAVBAR_SETTINGS[0]) {
      navigate("/profile");
    } else if (setting === NAVBAR_SETTINGS[1]) {
      dispatch(storeModalContentType(MODAL_CONTENT_TYPES.logout));
      dispatch(toggleModalState(true));
      dispatch(
        storeModalContent({
          message: "Are You Sure You want to Logout ?",
          buttonName: "Logout",
        })
      );
    }
    return;
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: "flex", marginLeft: 0 }} className="h-full">
        <CssBaseline />

        {/* header */}
        <Header
          anchorElUser={anchorElUser}
          handleCloseUserMenu={handleCloseUserMenu}
          handleDrawerOpen={handleDrawerOpen}
          handleOpenUserMenu={handleOpenUserMenu}
          isDrawerOpen={isDrawerOpen}
        />
        {/* sidebar */}
        <Sidebar
          handleDrawerClose={handleDrawerClose}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />

        {/* main content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

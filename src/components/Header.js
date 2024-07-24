import MenuIcon from "@mui/icons-material/Menu";

import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import LogoDevIcon from "@mui/icons-material/LogoDev";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CustomButton from "../utils/CustomButton";
import {
  AppBar,
  CLOUDINARY_IMAGE_ACCESS_URL,
  MODAL_CONTENT_TYPES,
  NAVBAR_SETTINGS,
  ROUTING_PATHS,
  SIDEBAR_LINKS,
  storeToastError,
  storeToastSuccess,
  USER_ROLES,
} from "../utils/constants";
import {
  storeModalContent,
  storeModalContentType,
  toggleModalConfirmState,
  toggleModalState,
} from "../redux/slices/modalSlice";
import AuthForm from "./AuthForm";
import { useEffect, useState } from "react";
import { postRequest } from "../api/apiCalls";

const Header = ({
  isDrawerOpen,
  handleDrawerOpen,
  anchorElUser,
  handleCloseUserMenu,
  handleOpenUserMenu,
}) => {
  const activePath = useSelector(
    (store) => store?.persistSliceReducer?.path?.activePath
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const role =
    activePath === ROUTING_PATHS.sellers
      ? USER_ROLES[1].role
      : USER_ROLES[2].role;
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const userDetails = useSelector(
    (store) => store?.persistSliceReducer?.user?.userInfo
  );

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!email || !password || !name || !confirmPassword || !userId || !role) {
      setIsError(true);
      setError("All fields are required");
      return;
    }
    const sendDetails = {
      name,
      email,
      user_id: userId,
      role,
      password,
      confirm_password: confirmPassword,
      address,
    };
    dispatch(toggleModalConfirmState(true));
    setLoading(true);
    const res = await postRequest({
      setIsError,
      setError,
      details: sendDetails,
      apiUrl: "admin/add-user",
      path:
        activePath === ROUTING_PATHS.sellers
          ? ROUTING_PATHS.sellers
          : ROUTING_PATHS.users,
      token: userDetails?.jwtToken,
    });

    if (res?.status) {
      storeToastSuccess({ successMessage: res?.message });
      setEmail("");
      setName("");
      setUserId("");
      setAddress("");
      setPassword("");
      setConfirmPassword("");
      dispatch(toggleModalState(false));
    } else {
      storeToastError({ errorMessage: res?.message ? res?.message : error });
    }
    dispatch(toggleModalConfirmState(false));
    setLoading(false);
  };

  useEffect(() => {
    dispatch(
      storeModalContent({
        form: (
          <AuthForm
            confirmPassword={confirmPassword}
            email={email}
            isError={isError}
            loading={loading}
            name={name}
            password={password}
            role={role}
            userId={userId}
            address={address}
            error={error}
            setConfirmPassword={setConfirmPassword}
            setEmail={setEmail}
            setName={setName}
            setPassword={setPassword}
            setIsError={setIsError}
            setAddress={setAddress}
            setUserId={setUserId}
            setShowConfirmPassword={setShowConfirmPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            showPassword={showPassword}
            handleForm={handleAddUser}
          />
        ),
      })
    );
  }, [
    name,
    email,
    userId,
    role,
    address,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    error,
    isError,
    loading,
  ]);

  useEffect(() => {
    setEmail("");
    setName("");
    setUserId("");
    setAddress("");
    setPassword("");
    setConfirmPassword("");
  }, [activePath]);

  useEffect(() => {
    if (
      (email &&
        password &&
        name &&
        confirmPassword &&
        userId &&
        role &&
        address) ||
      activePath
    ) {
      setIsError(false);
      return;
    }
  }, [email, password, name, confirmPassword, userId, role, activePath]);

  const handleAddDetails = () => {
    dispatch(toggleModalState(true));
    dispatch(
      storeModalContentType(
        activePath === ROUTING_PATHS.sellers
          ? MODAL_CONTENT_TYPES.addSeller
          : activePath === ROUTING_PATHS.users
          ? MODAL_CONTENT_TYPES.addBuyer
          : MODAL_CONTENT_TYPES.addProduct
      )
    );
    dispatch(
      storeModalContent({
        form: (
          <AuthForm
            confirmPassword={confirmPassword}
            email={email}
            isError={isError}
            loading={loading}
            name={name}
            password={password}
            role={role}
            userId={userId}
            address={address}
            error={error}
            setConfirmPassword={setConfirmPassword}
            setEmail={setEmail}
            setName={setName}
            setPassword={setPassword}
            setIsError={setIsError}
            setAddress={setAddress}
            setUserId={setUserId}
            setShowConfirmPassword={setShowConfirmPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            showPassword={showPassword}
            handleForm={handleAddUser}
          />
        ),
      })
    );
  };

  return (
    <AppBar
      position="fixed"
      open={isDrawerOpen}
      sx={{
        backgroundColor: "#5046e5",
      }}
      className="sm:px-1"
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            ...(isDrawerOpen && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        {!isDrawerOpen && (
          <Tooltip title="Home">
            <IconButton onClick={() => navigate("/")} color="inherit">
              <LogoDevIcon />
            </IconButton>
          </Tooltip>
        )}
        <Box sx={{ flexGrow: 1 }} />

        {(activePath === SIDEBAR_LINKS[1].path ||
          activePath === SIDEBAR_LINKS[2].path ||
          activePath === SIDEBAR_LINKS[3].path) && (
          <CustomButton
            label="Add +"
            className="hidden mxs:block border hover:border-0 max-w-20 w-20 h-fit"
            onClick={handleAddDetails}
          />
        )}

        <Tooltip
          title="Notifications"
          sx={{
            marginLeft: {
              vxs: isDrawerOpen ? -3 : 2,
              xs: 2,
            },
            marginRight: 2,
          }}
        >
          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
          >
            <Badge badgeContent={2} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                alt="profile_logo"
                src={CLOUDINARY_IMAGE_ACCESS_URL + userDetails?.image}
              />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {NAVBAR_SETTINGS.map((setting) => (
              <MenuItem
                key={setting}
                onClick={() => handleCloseUserMenu(setting)}
              >
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

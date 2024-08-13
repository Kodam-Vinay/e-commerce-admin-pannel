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
  MobileAppBar,
  MODAL_CONTENT_TYPES,
  NAVBAR_SETTINGS,
  ROUTING_PATHS,
  SIDEBAR_LINKS,
} from "../utils/constants";
import useDeviceResize from "../hooks/useDeviceResize";
import {
  storeModalContentType,
  toggleModalState,
} from "../redux/slices/modalSlice";

const Header = ({
  isDrawerOpen,
  handleDrawerOpen,
  anchorElUser,
  handleCloseUserMenu,
  handleOpenUserMenu,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activePath = useSelector(
    (store) => store?.persistSliceReducer?.path?.activePath
  );
  const userDetails = useSelector(
    (store) => store?.persistSliceReducer?.user?.userInfo
  );

  const handleAddDetails = () => {
    dispatch(
      storeModalContentType(
        activePath === ROUTING_PATHS.products
          ? MODAL_CONTENT_TYPES.addProduct
          : activePath === ROUTING_PATHS.brands
          ? MODAL_CONTENT_TYPES.addBrand
          : activePath === ROUTING_PATHS.categories
          ? MODAL_CONTENT_TYPES.addCategory
          : activePath === ROUTING_PATHS.subcategories
          ? MODAL_CONTENT_TYPES.addSubCategory
          : activePath === ROUTING_PATHS.users
          ? MODAL_CONTENT_TYPES.addBuyer
          : MODAL_CONTENT_TYPES.addSeller
      )
    );
    dispatch(toggleModalState(true));
  };

  const size = useDeviceResize();

  return (
    <>
      {size?.width < 300 ? (
        <MobileAppBar
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

            {(activePath === SIDEBAR_LINKS.products.path ||
              activePath === SIDEBAR_LINKS.sellers.path ||
              activePath === SIDEBAR_LINKS.users.path ||
              activePath === SIDEBAR_LINKS.categories.path ||
              activePath === SIDEBAR_LINKS.subcategories.path ||
              activePath === SIDEBAR_LINKS.brands.path) && (
              <CustomButton
                label="Add +"
                className={"hidden mxs:block border hover:border-0 w-28"}
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
        </MobileAppBar>
      ) : (
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

            {(activePath === SIDEBAR_LINKS.products.path ||
              activePath === SIDEBAR_LINKS.sellers.path ||
              activePath === SIDEBAR_LINKS.users.path ||
              activePath === SIDEBAR_LINKS.categories.path ||
              activePath === SIDEBAR_LINKS.subcategories.path ||
              activePath === SIDEBAR_LINKS.brands.path) && (
              <CustomButton
                label="Add +"
                className={"hidden mxs:block border hover:border-0 w-28"}
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
      )}
    </>
  );
};

export default Header;

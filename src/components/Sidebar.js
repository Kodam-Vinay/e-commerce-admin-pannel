import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer as MobileDrawer,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoDevIcon from "@mui/icons-material/LogoDev";
import { useTheme } from "@emotion/react";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Drawer, DrawerHeader, SIDEBAR_LINKS } from "../utils/constants";
import { useSelector } from "react-redux";

const Sidebar = ({ isDrawerOpen, setIsDrawerOpen, handleDrawerClose }) => {
  const navigate = useNavigate();
  const userDetails = useSelector(
    (store) => store?.persistSliceReducer?.user?.userInfo
  );
  const theme = useTheme();
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {SIDEBAR_LINKS.map(
          (eachItem, index) =>
            SIDEBAR_LINKS[index].roles.includes(userDetails?.role) && (
              <ListItem key={eachItem.name} disablePadding>
                <Tooltip title={eachItem.name} className="flex py-1 my-1">
                  <ListItemButton
                    onClick={() => {
                      navigate(eachItem.path);
                      setIsDrawerOpen(false);
                    }}
                  >
                    <ListItemIcon>{eachItem.element}</ListItemIcon>
                    <ListItemText primary={eachItem.name} />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            )
        )}
      </List>
    </Box>
  );

  return (
    <>
      <MobileDrawer open={isDrawerOpen} className="mxs:hidden">
        <DrawerHeader
          sx={{
            display: "flex",
            flexDirection: "row",
            paddingRight: "10px",
            justifyContent: "space-between",
            maxWidth: "160px",
            backgroundColor: "#5046e5",
          }}
        >
          <IconButton
            onClick={() => {
              navigate("/");
              setIsDrawerOpen(false);
            }}
            className="!text-white"
          >
            <LogoDevIcon />
          </IconButton>
          <IconButton onClick={handleDrawerClose} className="!text-white">
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {DrawerList}
      </MobileDrawer>

      <Drawer
        variant="permanent"
        className="hidden mxs:block"
        open={isDrawerOpen}
      >
        <DrawerHeader
          sx={{
            display: "flex",
            flexDirection: "row",
            paddingRight: "10px",
            justifyContent: "space-between",
            maxWidth: "160px",
            backgroundColor: "#5046e5",
          }}
        >
          <IconButton
            onClick={() => {
              navigate("/");
              setIsDrawerOpen(false);
            }}
            className="!text-white"
            sx={{
              marginLeft: "5px",
            }}
          >
            <LogoDevIcon />
          </IconButton>
          <IconButton onClick={handleDrawerClose} className="!text-white">
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {DrawerList}
      </Drawer>
    </>
  );
};

export default Sidebar;

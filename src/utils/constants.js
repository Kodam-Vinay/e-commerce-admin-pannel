import { Home } from "@mui/icons-material";
import { createTheme, styled } from "@mui/material";
import { AiFillProduct } from "react-icons/ai";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { GiShop } from "react-icons/gi";
import { Bounce, toast } from "react-toastify";

// dashboard

export const DESKTOP_WIDTH = 160;

export const openedMixin = (theme) => ({
  width: DESKTOP_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: DESKTOP_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme?.zIndex?.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: DESKTOP_WIDTH,
    width: `calc(100% - ${DESKTOP_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const NAVBAR_SETTINGS = ["Profile", "Logout"];
export const SIDEBAR_LINKS = [
  {
    path: "/",
    name: "Home",
    element: <Home />,
    roles: ["admin", "seller"],
  },
  {
    path: "/products",
    name: "Products",
    element: <AiFillProduct size={20} />,
    roles: ["seller"],
  },
  {
    path: "/users",
    name: "Users",
    element: <PeopleAltIcon />,
    roles: ["admin"],
  },
  {
    path: "/sellers",
    name: "Sellers",
    element: <GiShop size={20} />,
    roles: ["admin"],
  },
];

export const API_URL = "http://localhost:8000/api/";
export const USER_ROLES = [
  {
    role: "admin",
    name: "Admin",
  },
  {
    role: "seller",
    name: "Seller",
  },
  {
    role: "buyer",
    name: "Buyer",
  },
];

export const storeToastError = ({ errorMessage }) => {
  toast.error(errorMessage, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
};
export const storeToastSuccess = ({ successMessage }) => {
  toast.success(successMessage, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
};

export const CLOUDINARY_IMAGE_ACCESS_URL = `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/v1717994027/${process.env.REACT_APP_CLOUDINARY_PRESET}/`;
export const filterUsersFunc = (list, role) => {
  if (list?.length === 0 || !role) {
    return [];
  }
  const filterList = list?.filter((eachUser) => eachUser?.role === role);
  return filterList?.length > 0 ? filterList : [];
};

export const columns = [
  { id: "s_no", label: "S.NO", minWidth: 5 },
  { id: "name", label: "Name", minWidth: 50 },
  { id: "email", label: "Email", minWidth: 170 },
  {
    id: "role",
    label: "Role",
    minWidth: 10,
  },
  {
    id: "image",
    label: "Image",
    minWidth: 80,
  },
  {
    id: "address",
    label: "Address",
    minWidth: 80,
  },
  {
    id: "is_premium_user",
    label: "Is Premium User",
    minWidth: 30,
  },
  {
    id: "verified",
    label: "Verified",
    minWidth: 30,
  },
  {
    id: "delete",
    label: "",
    minWidth: 20,
  },
];

export const MODAL_CONTENT_TYPES = {
  deleteUser: "delete_user",
  addBuyer: "add_buyer",
  addSeller: "add_seller",
  addProduct: "add_product",
  logout: "logout",
};

export const customTheme = createTheme({
  breakpoints: {
    values: {
      vxs: 0,
      xs: 300,
      mxs: 475,
      sm: 640,
      md: 768,
      mdl: 850,
      lg: 1024,
      xl: 1280,
      "2xl": 1536,
    },
  },
  zIndex: {
    drawer: 1200, // Ensure zIndex is defined correctly
  },
  // Define other theme properties as needed
});

export const ROUTING_PATHS = {
  home: "/",
  signin: "/sign-in",
  signup: "/sign-up",
  users: "/users",
  sellers: "/sellers",
  products: "/products",
  profile: "/profile",
  verifyotp: "/verify-otp",
};

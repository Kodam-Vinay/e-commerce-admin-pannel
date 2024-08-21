import { Home } from "@mui/icons-material";
import { createTheme, styled } from "@mui/material";
import { AiFillProduct } from "react-icons/ai";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { GiShop } from "react-icons/gi";
import { Bounce, toast } from "react-toastify";
import CategoryIcon from "@mui/icons-material/Category";
import { TbCategoryPlus, TbBrandAdobe } from "react-icons/tb";

// dashboard

export const MOBILE_WIDTH = 160;

export const DESKTOP_WIDTH = 190;

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

export const MobileAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme?.zIndex?.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: MOBILE_WIDTH,
    width: `calc(100% - ${MOBILE_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const NAVBAR_SETTINGS = ["Profile", "Logout"];
export const USER_ROLES = [
  {
    role: process.env.REACT_APP_USERS_ROLE_1,
    name: process.env.REACT_APP_USERS_ROLE_1?.replace(/(^|\s)\S/g, (l) =>
      l.toUpperCase()
    ),
  },
  {
    role: process.env.REACT_APP_USERS_ROLE_2,
    name: process.env.REACT_APP_USERS_ROLE_2?.replace(/(^|\s)\S/g, (l) =>
      l.toUpperCase()
    ),
  },
  {
    role: process.env.REACT_APP_USERS_ROLE_3,
    name: process.env.REACT_APP_USERS_ROLE_3?.replace(/(^|\s)\S/g, (l) =>
      l.toUpperCase()
    ),
  },
];
export const SIDEBAR_LINKS = {
  home: {
    path: "/",
    name: "Home",
    element: <Home />,
    roles: [
      process.env.REACT_APP_USERS_ROLE_1,
      process.env.REACT_APP_USERS_ROLE_2,
    ],
  },
  products: {
    path: "/products",
    name: "Products",
    element: <AiFillProduct size={20} />,
    roles: [process.env.REACT_APP_USERS_ROLE_2],
  },
  users: {
    path: "/users",
    name: "Users",
    element: <PeopleAltIcon />,
    roles: [process.env.REACT_APP_USERS_ROLE_1],
  },
  sellers: {
    path: "/sellers",
    name: "Sellers",
    element: <GiShop size={20} />,
    roles: [process.env.REACT_APP_USERS_ROLE_1],
  },
  categories: {
    path: "/categories",
    name: "Categories",
    element: <CategoryIcon size={20} />,
    roles: [process.env.REACT_APP_USERS_ROLE_1],
  },
  subcategories: {
    path: "/sub-categories",
    name: "Sub categories",
    element: <TbCategoryPlus size={20} />,
    roles: [process.env.REACT_APP_USERS_ROLE_1],
  },
  brands: {
    path: "/brands",
    name: "Brands",
    element: <TbBrandAdobe size={20} />,
    roles: [process.env.REACT_APP_USERS_ROLE_1],
  },
};

export const API_URL = process.env.REACT_APP_LOCAL_URL;
// export const API_URL = process.env.REACT_APP_E_COMMERCE_BACKEND_URL;

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
export const CLOUDINARY_IMAGE_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`;

export const filterUsersFunc = (list, role) => {
  if (list?.length === 0 || !role) {
    return [];
  }
  const filterList = list?.filter((eachUser) => eachUser?.role === role);
  return filterList?.length > 0 ? filterList : [];
};

// table
export const columns = [
  { id: "s_no", label: "S.NO", minWidth: 30 },
  { id: "name", label: "Name", minWidth: 100 },
  { id: "email", label: "Email", minWidth: 170 },
  {
    id: "role",
    label: "Role",
    minWidth: 70,
  },
  {
    id: "image",
    label: "Image",
    minWidth: 80,
  },
  {
    id: "address",
    label: "Address",
    minWidth: 140,
  },
  {
    id: "is_premium_user",
    label: "Is Premium User",
    minWidth: 140,
  },
  {
    id: "verified",
    label: "Verified",
    minWidth: 70,
  },
  {
    id: "delete",
    label: "",
    minWidth: 10,
  },
];

export const categoriesBrandColumns = [
  { id: "s_no", label: "S.NO", minWidth: 30 },
  { id: "name", label: "Name", minWidth: 200 },
  { id: "status", label: "Status", minWidth: 70 },
  { id: "image", label: "Image", minWidth: 80 },
  { id: "update", label: "", minWidth: 5 },
  { id: "delete", label: "", minWidth: 5 },
];

export const subCategoriesColumns = [
  { id: "s_no", label: "S.NO", minWidth: 30 },
  { id: "name", label: "Name", minWidth: 150 },
  { id: "status", label: "Status", minWidth: 70 },
  { id: "category", label: "Category", minWidth: 200 },
  { id: "brands", label: "Brands", minWidth: 180 },
  { id: "image", label: "Image", minWidth: 80 },
  { id: "update", label: "", minWidth: 10 },
  { id: "delete", label: "", minWidth: 10 },
];

export const productColumns = [
  { id: "s_no", label: "S.NO", minWidth: 30 },
  { id: "name", label: "Name", minWidth: 150 },
  { id: "category", label: "Category", minWidth: 180 },
  { id: "sub_category", label: "Sub Category", minWidth: 180 },
  { id: "brand", label: "Brand", minWidth: 150 },
  { id: "features", label: "Features", minWidth: 180 },
  { id: "price", label: "Price", minWidth: 150 },
  { id: "description", label: "Description", minWidth: 200 },
  { id: "stock", label: "Stock", minWidth: 150 },
  { id: "specifications", label: "Specifications", minWidth: 150 },
  { id: "images", label: "Images", minWidth: 200 },
  { id: "is_premium", label: "Is Premium", minWidth: 50 },
  { id: "update", label: "", minWidth: 10 },
  { id: "delete", label: "", minWidth: 10 },
];

//modal content types
export const MODAL_CONTENT_TYPES = {
  deleteUser: "delete_user",
  addBuyer: "add_buyer",
  addSeller: "add_seller",
  addProduct: "add_product",
  addCategory: "add_category",
  addSubCategory: "add_sub_category",
  addBrand: "add_brand",
  logout: "logout",
  updateCategory: "update_category",
  updateSubCategory: "update_sub_category",
  updateBrand: "update_brand",
  updateProduct: "update_product",
  deleteCategory: "delete_category",
  deleteSubCategory: "delete_sub_category",
  deleteBrand: "delete_brand",
  deleteProduct: "delete_product",
};

// theme mui
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
  categories: "/categories",
  subcategories: "/sub-categories",
  brands: "/brands",
  products: "/products",
  profile: "/profile",
  verifyotp: "/verify-otp",
  forgetpassword: "/forget-password",
};

export const FORGET_FORM_CONSTANTS = {
  initial: "INITIAL",
  otpSend: "otpSend",
  otpVerified: "otpVerified",
  success: "SUCCESS",
};

export const CATEGORY_BRAND_FORM_PATHS = [
  MODAL_CONTENT_TYPES.addBrand,
  MODAL_CONTENT_TYPES.addCategory,
  MODAL_CONTENT_TYPES.addSubCategory,
  MODAL_CONTENT_TYPES.updateBrand,
  MODAL_CONTENT_TYPES.updateCategory,
  MODAL_CONTENT_TYPES.updateSubCategory,
];

export const USER_FORM_PATHS = [
  MODAL_CONTENT_TYPES.addBuyer,
  MODAL_CONTENT_TYPES.addSeller,
];

export const PRODUCT_FORM_PATHS = [
  MODAL_CONTENT_TYPES.addProduct,
  MODAL_CONTENT_TYPES.updateProduct,
];

export const filterCloudinaryImagesList = (list) => {
  return list?.map((eachImage) => {
    return {
      image_id: eachImage?.asset_id,
      url: eachImage?.public_id?.slice(28),
      alt: eachImage?.original_filename,
    };
  });
};

export const checkAnyChangesMadeCategoriesBrands = (
  type,
  text,
  status,
  enteredText,
  enteredStatus,
  uploadedImageDetails,
  imageUrl
) => {
  const checkImageIsChanged =
    uploadedImageDetails?.imageId?.slice(37).toString().trim() !==
      imageUrl?.toString().trim() &&
    uploadedImageDetails?.imageId !== undefined;

  if (type === ROUTING_PATHS.categories) {
    const checkText =
      text?.toString().trim() !== enteredText?.toString().trim();
    const checkStatus = status !== enteredStatus;
    if (checkText || checkStatus || checkImageIsChanged) {
      return true;
    }
    return false;
  } else if (type === ROUTING_PATHS.brands) {
    const checkText =
      text?.toString().trim() !== enteredText?.toString().trim();
    const checkStatus = status !== enteredStatus;
    if (checkText || checkStatus || checkImageIsChanged) {
      return true;
    }
    return false;
  }
};

export const checkAnyChangesMadeSubCategories = (
  subCategory,
  enteredSubCategory,
  status,
  enteredStatus,
  category,
  enteredCategory,
  brandsList,
  enteredBrandsList,
  uploadedImageDetails,
  imageUrl
) => {
  const checkImageIsChanged =
    uploadedImageDetails?.imageId?.slice(19).toString().trim() !==
      imageUrl?.toString().trim() &&
    uploadedImageDetails?.imageId !== undefined;
  const checkSubCategory =
    subCategory?.toString().trim() !== enteredSubCategory?.toString().trim();
  const checkStatus = status !== enteredStatus;
  const checkCategory =
    category?.toString().trim() !== enteredCategory?.toString().trim();
  const checkBrandsList = brandsList?.length !== enteredBrandsList?.length;
  if (
    checkSubCategory ||
    checkStatus ||
    checkCategory ||
    checkBrandsList ||
    checkImageIsChanged
  ) {
    return true;
  }
  return false;
};

export const checkImagesListChanges = (cloudinaryImagesList, dbImages) => {
  return JSON.stringify(cloudinaryImagesList) !== JSON.stringify(dbImages);
};

export const checkAnyChangesMadeProduct = (
  name,
  enteredName,
  price,
  enteredPrice,
  description,
  enteredDescription,
  features,
  enteredFeatures,
  brand,
  enteredBrand,
  isPremium,
  storedIsPremium,
  category,
  enteredCategory,
  subCategory,
  enteredSubCategory,
  stock,
  enteredStock,
  specifications,
  enteredSpecifications,
  cloudinaryImagesList,
  dbImages
) => {
  const checkName = name?.toString().trim() !== enteredName?.toString().trim();

  const checkPrice =
    price?.toString().trim() !== enteredPrice?.toString().trim();

  const checkDescription =
    description?.toString().trim() !== enteredDescription?.toString().trim();

  const checkFeatures =
    features?.toString()?.trim()?.replace(/,+/g, ",").replace(/^,|,$/g, "") !==
    enteredFeatures
      ?.toString()
      ?.trim()
      ?.replace(/,+/g, ",")
      .replace(/^,|,$/g, "");

  const checkBrand =
    brand?.toString().trim() !== enteredBrand?.toString().trim();

  const checkPremiumChanges = isPremium !== storedIsPremium;

  const checkCategory =
    category?.toString().trim() !== enteredCategory?.toString().trim();

  const checkSubCategory =
    subCategory?.toString().trim() !== enteredSubCategory?.toString().trim();

  const checkStock = JSON.stringify(stock) !== JSON.stringify(enteredStock);

  const checkSpecifications =
    JSON.stringify(specifications) !== JSON.stringify(enteredSpecifications);

  const imagesChanged = checkImagesListChanges(cloudinaryImagesList, dbImages);

  if (
    checkName ||
    checkPrice ||
    checkDescription ||
    checkFeatures ||
    checkBrand ||
    checkPremiumChanges ||
    checkCategory ||
    checkSubCategory ||
    checkStock ||
    checkSpecifications ||
    imagesChanged
  ) {
    return true;
  }
  return false;
};

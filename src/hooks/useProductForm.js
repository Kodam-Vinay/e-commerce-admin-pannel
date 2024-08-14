import React, { useEffect, useState } from "react";
import ProductForm from "../components/forms/ProductForm";
import { useDispatch, useSelector } from "react-redux";
import {
  checkAnyChangesMadeProduct,
  CLOUDINARY_IMAGE_UPLOAD_URL,
  filterCloudinaryImagesList,
  MODAL_CONTENT_TYPES,
  PRODUCT_FORM_PATHS,
  ROUTING_PATHS,
  storeToastError,
  storeToastSuccess,
} from "../utils/constants";
import {
  storeModalContent,
  toggleModalConfirmState,
  toggleModalState,
} from "../redux/slices/modalSlice";
import {
  storeBrandsList,
  storeSubCategoriesList,
} from "../redux/slices/categoryBrandSlice";
import { getRequest, postRequest, updateRequest } from "../api/apiCalls";
import {
  resetCloudinaryImagesList,
  resetImagesDb,
  resetImagesList,
  storeImageToCloudinaryList,
  toggleSaveImagesClicked,
} from "../redux/slices/productSlice";
import { v4 as uniqueId } from "uuid";

export default function useProductForm() {
  const dispatch = useDispatch();
  const activePath = useSelector(
    (store) => store?.persistSliceReducer?.path?.activePath
  );
  const productInfo = useSelector((store) => store?.product?.info);

  const {
    stored_id,
    stored_is_premium,
    stored_category,
    stored_features,
    stored_brand,
    stored_name,
    stored_sub_category,
    stored_description,
    stored_price,
    stored_specifications,
    stored_stock,
  } = productInfo;

  const contentType = useSelector((store) => store?.modal?.contentType);
  const userDetails = useSelector(
    (store) => store?.persistSliceReducer?.user?.userInfo
  );
  const imagesList = useSelector((store) => store?.product?.imagesList);
  const cloudinaryImagesList = useSelector(
    (store) => store?.product?.cloudinaryImagesList
  );
  const confirmState = useSelector((store) => store?.modal?.isConfirmed);
  const dbImages = useSelector((store) => store?.product?.dbImages);
  const compareImagesLength = cloudinaryImagesList?.length > dbImages?.length;
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [brand, setBrand] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [stock, setStock] = useState({ available: "", warehouse_location: "" });
  const [specifications, setSpecifications] = useState({
    weight: "",
    dimensions: "",
    color: "",
    battery_life: "",
  });
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contentType === MODAL_CONTENT_TYPES.updateProduct) {
      setCategory(stored_category);
      setBrand(stored_brand);
      setIsPremium(stored_is_premium);
      setSubCategory(stored_sub_category);
      setName(stored_name);
      setFeatures(stored_features?.join(", "));
      setDescription(stored_description);
      setPrice(stored_price);
      setSpecifications({
        weight: stored_specifications?.weight,
        dimensions: stored_specifications?.dimensions,
        color: stored_specifications?.color,
        battery_life: stored_specifications?.battery_life
          ? stored_specifications?.battery_life
          : "",
      });
      setStock({
        available: stored_stock?.available,
        warehouse_location: stored_stock?.warehouse_location,
      });
    } else {
      setCategory("");
      setBrand("");
      setSubCategory("");
      setName("");
      setFeatures("");
      setDescription("");
      setPrice("");
      setSpecifications({
        weight: "",
        dimensions: "",
        color: "",
        battery_life: "",
      });
      setStock({
        available: "",
        warehouse_location: "",
      });
    }
  }, [
    stored_category,
    stored_brand,
    stored_specifications,
    stored_sub_category,
    stored_name,
    stored_features,
    stored_description,
    stored_price,
    stored_stock,
    contentType,
  ]);

  useEffect(() => {
    const getSubCategoriesData = async () => {
      setLoading(true);
      const encodedCategory = encodeURIComponent(category);
      const res = await getRequest({
        apiUrl: `sub-categories/all?category=${encodedCategory}`,
        setIsError,
        setError,
        token: userDetails?.jwtToken,
      });
      if (res?.status) {
        dispatch(storeSubCategoriesList(res?.data?.subCategories));
      } else {
        if (res?.message) {
          storeToastError({
            errorMessage: res?.message ? res?.message : error,
          });
        }
      }
      setLoading(false);
    };
    const getBrandsListData = async () => {
      const encodedCategory = encodeURIComponent(category);
      const encodedSubCategory = encodeURIComponent(subCategory);
      setLoading(true);
      const res = await getRequest({
        apiUrl: `brands/all?category=${encodedCategory}&sub_catergory=${encodedSubCategory}`,
        setIsError,
        setError,
        token: userDetails?.jwtToken,
      });
      if (res?.status) {
        dispatch(storeBrandsList(res?.data?.brands));
      } else {
        if (res?.message) {
          storeToastError({
            errorMessage: res?.message ? res?.message : error,
          });
        }
      }
      setLoading(false);
    };

    const timer = setTimeout(() => {
      if (
        activePath === ROUTING_PATHS.products &&
        subCategory?.toString().length > 0
      ) {
        getBrandsListData();
      }

      if (
        activePath === ROUTING_PATHS.products &&
        category?.toString().length > 0
      ) {
        getSubCategoriesData();
      }
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [category, subCategory, activePath]);

  useEffect(() => {
    setName("");
    setPrice("");
    setBrand("");
    setDescription("");
    setFeatures("");
    setCategory("");
    setIsError(false);
    setIsPremium(false);
    setStock({
      available: "",
      warehouse_location: "",
    });
    setSpecifications({
      weight: "",
      battery_life: "",
      color: "",
      dimensions: "",
    });
    dispatch(resetCloudinaryImagesList());
    dispatch(resetImagesList());
    dispatch(resetImagesDb());
  }, [activePath]);

  useEffect(() => {
    if (contentType === MODAL_CONTENT_TYPES.addProduct || confirmState) {
      dispatch(resetCloudinaryImagesList());
      dispatch(resetImagesList());
      dispatch(resetImagesDb());
    }
  }, [contentType, confirmState]);

  useEffect(() => {
    if (
      name &&
      price &&
      brand &&
      category &&
      description &&
      features &&
      cloudinaryImagesList?.length === 0 &&
      specifications &&
      stock &&
      subCategory
    ) {
      setIsError(false);
      return;
    }
  }, [
    name,
    price,
    brand,
    category,
    description,
    features,
    cloudinaryImagesList?.length === 0,
    specifications,
    stock,
    subCategory,
  ]);

  useEffect(() => {
    dispatch(storeImageToCloudinaryList(dbImages));
  }, [dbImages]);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !category ||
      !subCategory ||
      !description ||
      !features ||
      !brand ||
      cloudinaryImagesList?.length === 0
    ) {
      setIsError(true);
      storeToastError({ errorMessage: "Fields Must Not Be Empty" });
      return;
    }
    const sendDetails = {
      product_id: name + uniqueId(),
      name,
      category,
      sub_category: subCategory,
      is_premium: isPremium,
      price,
      brand,
      description,
      features: features ? features?.split(",") : [],
      specifications,
      images: cloudinaryImagesList,
      stock,
    };
    dispatch(toggleModalConfirmState(true));
    setLoading(true);
    const res = await postRequest({
      setError,
      setIsError,
      path: ROUTING_PATHS.products,
      details: sendDetails,
      token: userDetails?.jwtToken,
      apiUrl: "products/add",
    });

    if (res?.status) {
      storeToastSuccess({ successMessage: res?.message });
      setName("");
      setPrice("");
      setDescription("");
      setFeatures("");
      setStock({
        available: "",
        warehouse_location: "",
      });
      setSpecifications({
        weight: "",
        battery_life: "",
        color: "",
        dimensions: "",
      });
      setCategory("");
      setSubCategory("");
      setBrand("");
      dispatch(toggleModalState(false));
      dispatch(toggleModalConfirmState(false));
      dispatch(resetCloudinaryImagesList());
    } else {
      storeToastError({ errorMessage: res?.message });
    }
    setLoading(false);
    dispatch(toggleSaveImagesClicked(false));
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (
      !name ||
      !category ||
      !subCategory ||
      !description ||
      !features ||
      !brand ||
      (cloudinaryImagesList?.length === 0 && dbImages?.length === 0)
    ) {
      setIsError(true);
      storeToastError({ errorMessage: "Fields Must Not Be Empty" });
      return;
    }
    const uploadImagesList = compareImagesLength
      ? cloudinaryImagesList
      : dbImages;
    const sendDetails = {
      product_id: stored_id,
      name,
      category,
      sub_category: subCategory,
      price,
      is_premium: isPremium,
      brand,
      description,
      features: features ? features?.split(",") : [],
      specifications,
      images: uploadImagesList,
      stock,
    };
    dispatch(toggleModalConfirmState(true));
    setLoading(true);
    const res = await updateRequest({
      setError,
      setIsError,
      path: ROUTING_PATHS.products,
      details: sendDetails,
      token: userDetails?.jwtToken,
      apiUrl: "products/update",
    });

    if (res?.status) {
      storeToastSuccess({ successMessage: res?.message });
      setName("");
      setPrice("");
      setDescription("");
      setFeatures("");
      setStock({
        available: "",
        warehouse_location: "",
      });
      setSpecifications({
        weight: "",
        battery_life: "",
        color: "",
        dimensions: "",
      });
      setCategory("");
      setSubCategory("");
      setBrand("");
      dispatch(toggleModalState(false));
      dispatch(toggleModalConfirmState(false));
      dispatch(storeImageToCloudinaryList([]));
    } else {
      storeToastError({ errorMessage: res?.message });
    }
    setLoading(false);
    dispatch(toggleSaveImagesClicked(false));
  };

  const handleSaveImages = async () => {
    if (imagesList?.length === 0) {
      setIsError(true);
      return storeToastError({
        errorMessage: "Please select at least one image",
      });
    }
    const uploadedImagesList = imagesList?.map(async (eachImage) => {
      const formData = new FormData();
      formData.append("file", eachImage?.image);

      formData.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_PRODUCTS_PRESET
      );
      formData.append(
        "cloud_name",
        process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
      );

      return await postRequest({
        setError,
        setIsError,
        apiUrl: CLOUDINARY_IMAGE_UPLOAD_URL,
        formData,
        path: ROUTING_PATHS.signup,
      });
    });
    const responseImagesList = await Promise.all(uploadedImagesList);
    if (responseImagesList?.length > 0) {
      setIsError(false);
    }
    dispatch(resetImagesList());
    const filterImagesList = filterCloudinaryImagesList(responseImagesList);
    dispatch(storeImageToCloudinaryList(filterImagesList));
    dispatch(toggleSaveImagesClicked(true));
  };

  const stored_stock_new_obj = {
    available: stored_stock?.available?.toString()?.trim(),
    warehouse_location: stored_stock?.warehouse_location?.toString()?.trim(),
  };

  const entered_stock = {
    available: stock?.available?.toString()?.trim(),
    warehouse_location: stock?.warehouse_location?.toString()?.trim(),
  };

  const stored_specifications_new_obj = {
    weight: stored_specifications?.weight?.toString()?.trim(),
    dimensions: stored_specifications?.dimensions
      ?.trim()
      ?.replace(/,+/g, ",")
      .replace(/^,|,$/g, ""),
    color: stored_specifications?.color?.toString()?.trim(),
    battery_life: stored_specifications?.battery_life
      ? stored_specifications?.battery_life?.toString()?.trim()
      : "",
  };

  const entered_specifications = {
    weight: specifications?.weight?.toString()?.trim(),
    dimensions: specifications?.dimensions
      ?.trim()
      ?.replace(/,+/g, ",")
      .replace(/^,|,$/g, ""),
    color: specifications?.color?.toString()?.trim(),
    battery_life: specifications?.battery_life?.toString()?.trim(),
  };

  const checkAnyChangesMade = checkAnyChangesMadeProduct(
    stored_name,
    name,
    stored_price,
    price,
    stored_description,
    description,
    stored_features?.join(", "),
    features,
    stored_brand,
    brand,
    isPremium,
    stored_is_premium,
    stored_category,
    category,
    stored_sub_category,
    subCategory,
    stored_stock_new_obj,
    entered_stock,
    stored_specifications_new_obj,
    entered_specifications,
    cloudinaryImagesList,
    dbImages
  );

  const form = (
    <ProductForm
      isError={isError}
      setIsError={setIsError}
      loading={loading}
      name={name}
      setName={setName}
      price={price}
      setPrice={setPrice}
      brand={brand}
      setBrand={setBrand}
      isPremium={isPremium}
      setIsPremium={setIsPremium}
      category={category}
      setCategory={setCategory}
      subCategory={subCategory}
      setSubCategory={setSubCategory}
      setDescription={setDescription}
      description={description}
      setFeatures={setFeatures}
      features={features}
      handleSaveImages={handleSaveImages}
      stock={stock}
      setStock={setStock}
      specifications={specifications}
      setSpecifications={setSpecifications}
      handleAddUpdateProduct={
        contentType === MODAL_CONTENT_TYPES.addProduct
          ? handleAddProduct
          : handleUpdateProduct
      }
      checkAnyChangesMade={checkAnyChangesMade}
      compareImagesLength={compareImagesLength}
    />
  );

  const formTitle =
    contentType === MODAL_CONTENT_TYPES.addProduct
      ? "Add Product"
      : contentType === MODAL_CONTENT_TYPES.updateProduct
      ? "Update Product"
      : "";

  useEffect(() => {
    if (PRODUCT_FORM_PATHS.includes(contentType)) {
      dispatch(
        storeModalContent({
          form: form,
          title: formTitle,
        })
      );
    }
  }, [
    name,
    error,
    isError,
    loading,
    price,
    brand,
    isPremium,
    category,
    description,
    features,
    handleSaveImages,
    subCategory,
    contentType,
    stock,
    specifications,
    handleAddProduct,
    handleUpdateProduct,
  ]);
}

import React, { useEffect, useState } from "react";
import ProductForm from "../components/forms/ProductForm";
import { useDispatch, useSelector } from "react-redux";
import {
  checkAnyChangesMadeProduct,
  filterImagesAfterUpload,
  filterNotUploadedImages,
  IMAGE_UPLOAD_PATHS,
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
import {
  deleteRequest,
  getRequest,
  postRequest,
  updateRequest,
} from "../api/apiCalls";
import {
  resetCloudinaryImagesList,
  resetImagesDb,
  resetImagesList,
  storeImageToCloudinaryList,
  toggleSaveImagesClicked,
} from "../redux/slices/productSlice";
import { v4 as uniqueId } from "uuid";
import { ImageList } from "@mui/material";

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
    stored_discount,
    stored_images,
  } = productInfo;
  const contentType = useSelector((store) => store?.modal?.contentType);
  const userDetails = useSelector(
    (store) => store?.persistSliceReducer?.user?.userInfo
  );
  const cloudinaryImagesList = useSelector(
    (store) => store?.product?.cloudinaryImagesList
  );
  const confirmState = useSelector((store) => store?.modal?.isConfirmed);
  const dbImages = useSelector((store) => store?.product?.dbImages);
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
  const [imagesList, setImagesList] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitClicked, setSubmitClicked] = useState(false);
  const [isImageUploadClicked, setImageUploadClicked] = useState(false);

  useEffect(() => {
    if (isError) {
      storeToastError({ errorMessage: error });
      //check useCategoryBrand, useUserForm: add,update setIsError(true), and storeToastError is present immediately then remove storeToastError
    }
  }, [isError, error]);
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
      setDiscount(stored_discount);
      setSpecifications({
        weight: stored_specifications?.weight,
        dimensions: stored_specifications?.dimensions,
        color: stored_specifications?.color,
        battery_life: stored_specifications?.battery_life
          ? stored_specifications?.battery_life
          : "",
      });
      setImagesList(stored_images);
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
      setDiscount("");
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
      setImagesList([]);
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
    setImagesList([]);
    setDiscount("");
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
      subCategory &&
      discount
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
    setSubmitClicked(true);
    setImageUploadClicked(false);
    const uploadedImagesList = filterImagesAfterUpload({ imagesList });
    const checkNotUploadedImagesList = filterNotUploadedImages({ imagesList });

    if (
      !name ||
      !category ||
      !subCategory ||
      !description ||
      !features ||
      !brand ||
      !discount ||
      !stock ||
      imagesList.length === 0
    ) {
      setIsError(true);
      setError("Fields Must Not Be Empty");
      return;
    }
    if (uploadedImagesList?.length === 0) {
      setIsError(true);
      setError("Images Not Uploaded Yet");
      return;
    }
    if (checkNotUploadedImagesList?.length > 0) {
      setIsError(true);
      setError("Please upload all images");
      return;
    }

    const trimFeatures = features
      ? features?.split(",")?.map((each) => each?.toString()?.trim())
      : [];
    const sendDetails = {
      product_id: name + uniqueId(),
      name,
      category,
      sub_category: subCategory,
      is_premium: isPremium,
      price,
      brand,
      description,
      features: trimFeatures,
      specifications,
      images: uploadedImagesList,
      stock,
      discount,
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
    setSubmitClicked(false);
    setImageUploadClicked(false);
    setLoading(false);
    dispatch(toggleSaveImagesClicked(false));
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setSubmitClicked(true);
    setImageUploadClicked(false);
    const uploadedImagesList = filterImagesAfterUpload({ imagesList });
    const checkNotUploadedImagesList = filterNotUploadedImages({ imagesList });

    if (
      !name ||
      !category ||
      !subCategory ||
      !description ||
      !features ||
      !brand ||
      !price ||
      !stock ||
      !discount ||
      imagesList?.length === 0
    ) {
      setIsError(true);
      setError("Fields Must Not Be Empty");
      return;
    }
    if (uploadedImagesList?.length === 0) {
      setIsError(true);
      setError("At least one image must be uploaded");
      return;
    }
    if (checkNotUploadedImagesList?.length > 0) {
      setIsError(true);
      setError("Please upload all images");
      return;
    }

    const trimFeatures = features
      ? features?.split(",")?.map((each) => each?.toString()?.trim())
      : [];
    const trimDimensions = specifications?.dimensions
      ? specifications?.dimensions
          ?.split(",")
          ?.map((each) => each?.toString()?.trim())
          ?.join(", ")
      : "";

    const sendDetails = {
      product_id: stored_id,
      name,
      category,
      sub_category: subCategory,
      price,
      is_premium: isPremium,
      brand,
      description,
      features: trimFeatures,
      specifications: {
        ...specifications,
        dimensions: trimDimensions,
      },
      images: imagesList,
      stock,
      discount,
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
    setSubmitClicked(false);
    setImageUploadClicked(false);
    setLoading(false);
    dispatch(toggleSaveImagesClicked(false));
  };

  const handleSaveImages = async () => {
    setImageUploadClicked(true);
    setSubmitClicked(false);
    if (imagesList?.length === 0) {
      setIsError(true);
      return storeToastError({
        errorMessage: "Please select at least one image",
      });
    }
    setLoading(true);
    const filterImages = filterNotUploadedImages({
      imagesList,
    });
    const formData = new FormData();

    filterImages.forEach((image) => {
      formData.append("images", image?.image);
      formData.append("image_ids", image?.image_id);
    });
    const res = await postRequest({
      apiUrl: IMAGE_UPLOAD_PATHS[0],
      details: formData,
      setError,
      setIsError,
      token: userDetails?.jwtToken,
    });
    if (res?.status) {
      const images = res?.data?.images;
      const filterImages = filterImagesAfterUpload({
        imagesList,
      });
      setImagesList([...images, ...filterImages]);
      storeToastSuccess({ successMessage: res?.message });
    } else {
      storeToastError({ errorMessage: res?.message });
    }
    setLoading(false);
    setImageUploadClicked(false);
    setSubmitClicked(false);
  };

  const handleDeleteImages = async (list, type) => {
    setLoading(true);
    const res = deleteRequest({
      apiUrl: "products/delete_product_images",
      setError,
      setIsError,
      token: userDetails?.jwtToken,
      details: [...list],
    });
    setLoading(false);
    return res;
  };

  const handleClear = async () => {
    const list = imagesList?.filter((eachImage) => eachImage?.uploaded);
    if (list?.length > 0) {
      const res = await handleDeleteImages(imagesList, "all");
      if (res?.status) {
        setImagesList([]);
        storeToastSuccess({ successMessage: res?.message });
      } else {
        storeToastError({ errorMessage: res?.message });
      }
    } else {
      setImagesList([]);
    }
  };

  const handleImageRemoveFromList = async (image_id) => {
    const findImage = imagesList?.find(
      (eachImage) => eachImage?.image_id === image_id
    );
    if (findImage?.uploaded) {
      const res = await handleDeleteImages([findImage], "all");
      const filteredImagesList = imagesList?.filter(
        (eachImage) => eachImage?.image_id !== image_id
      );
      if (res?.status) {
        setImagesList(filteredImagesList);
        storeToastSuccess({ successMessage: res?.message });
      } else {
        storeToastError({ errorMessage: res?.message });
      }
    } else {
      const filteredImagesList = imagesList?.filter(
        (eachImage) => eachImage?.image_id !== image_id
      );
      setImagesList(filteredImagesList);
    }
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
    stored_images,
    imagesList,
    stored_discount,
    discount
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
      discount={discount}
      setDiscount={setDiscount}
      imagesList={imagesList}
      setImagesList={setImagesList}
      isSubmitClicked={isSubmitClicked}
      isImageUploadClicked={isImageUploadClicked}
      handleClear={handleClear}
      handleImageRemoveFromList={handleImageRemoveFromList}
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
    discount,
    ImageList,
    isSubmitClicked,
    isImageUploadClicked,
    loading,
    handleClear,
    handleImageRemoveFromList,
  ]);
}

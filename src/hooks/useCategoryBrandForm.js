import React, { useEffect, useState } from "react";

import CategoryBrandForm from "../components/forms/CategoryBrandForm";
import { useDispatch, useSelector } from "react-redux";
import {
  checkAnyChangesMadeCategoriesBrands,
  checkAnyChangesMadeSubCategories,
  CATEGORY_BRAND_FORM_PATHS,
  MODAL_CONTENT_TYPES,
  ROUTING_PATHS,
  storeToastError,
  storeToastSuccess,
  USER_ROLES,
  CLOUDINARY_IMAGE_UPLOAD_URL,
} from "../utils/constants";
import {
  storeModalContent,
  toggleModalConfirmState,
  toggleModalState,
} from "../redux/slices/modalSlice";
import {
  storeBrandsList,
  storeCategoriesList,
} from "../redux/slices/categoryBrandSlice";
import { getRequest, postRequest, updateRequest } from "../api/apiCalls";
import { storeImageId } from "../redux/slices/imageSlice";

export default function useCategoryBrandForm() {
  const dispatch = useDispatch();
  const activePath = useSelector(
    (store) => store?.persistSliceReducer?.path?.activePath
  );
  const categoryText = useSelector(
    (store) => store?.categoryBrand?.info?.category_text
  );
  const brandText = useSelector(
    (store) => store?.categoryBrand?.info?.brand_text
  );
  const subCategoryText = useSelector(
    (store) => store?.categoryBrand?.info?.subcategory_text
  );
  const brandList = useSelector(
    (store) => store?.categoryBrand?.info?.brands_list
  );
  const activeStatus = useSelector(
    (store) => store?.categoryBrand?.info?.isActive
  );
  const imageUrl = useSelector((store) => store?.categoryBrand?.info?.image);

  const categoryOrBrandId = useSelector((store) => store?.categoryBrand?.info);
  const contentType = useSelector((store) => store?.modal?.contentType);
  const userDetails = useSelector(
    (store) => store?.persistSliceReducer?.user?.userInfo
  );

  const categoriesList = useSelector(
    (store) => store?.categoryBrand?.categoriesList
  );

  const uploadedImageDetails = useSelector(
    (store) => store?.persistSliceReducer?.image?.imageDetails
  );

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [selectedBrandsList, setSelectedBrandsList] = useState([]);
  const [categoryObject, setCategoryObject] = useState({});
  const [isSubmitClicked, setSubmitClicked] = useState(false);
  const [isImageUploadClicked, setImageUploadClicked] = useState(false);

  const result =
    activePath === ROUTING_PATHS.categories
      ? checkAnyChangesMadeCategoriesBrands(
          ROUTING_PATHS.categories,
          categoryText,
          activeStatus,
          category,
          isActive,
          uploadedImageDetails,
          imageUrl
        )
      : activePath === ROUTING_PATHS.brands
      ? checkAnyChangesMadeCategoriesBrands(
          ROUTING_PATHS.brands,
          brandText,
          activeStatus,
          brand,
          isActive,
          uploadedImageDetails,
          imageUrl
        )
      : checkAnyChangesMadeSubCategories(
          subCategory,
          subCategoryText,
          activeStatus,
          isActive,
          category,
          categoryText,
          selectedBrandsList,
          brandList,
          uploadedImageDetails,
          imageUrl
        );

  useEffect(() => {
    if (
      contentType === MODAL_CONTENT_TYPES.updateCategory ||
      contentType === MODAL_CONTENT_TYPES.updateSubCategory ||
      contentType === MODAL_CONTENT_TYPES.updateBrand
    ) {
      const categoryObj = categoriesList?.find(
        (eachCategory) => eachCategory?.name === categoryText
      );
      setCategory(categoryText);
      setCategoryObject(categoryObj);
      setBrand(brandText);
      setSubCategory(subCategoryText);
      setIsActive(activeStatus);
      setSelectedBrandsList(brandList);
    } else {
      setCategory("");
      setCategoryObject({});
      setBrand("");
      setSubCategory("");
      setIsActive(false);
      setSelectedBrandsList([]);
    }
  }, [
    categoryText,
    subCategoryText,
    activeStatus,
    brandText,
    contentType,
    brandList,
  ]);

  useEffect(() => {
    const getCatgoriesData = async () => {
      setLoading(true);
      const res = await getRequest({
        apiUrl: `categories/all`,
        setIsError,
        setError,
        token: userDetails?.jwtToken,
      });
      if (res?.status) {
        dispatch(storeCategoriesList(res?.data?.categories));
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
      if (activePath === ROUTING_PATHS.subcategories) {
        setLoading(true);
        const res = await getRequest({
          apiUrl: `brands/all`,
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
      }
    };

    if (
      activePath === ROUTING_PATHS.subcategories ||
      (userDetails?.role === USER_ROLES[1].role &&
        activePath !== ROUTING_PATHS.sellers &&
        activePath !== ROUTING_PATHS.users)
    ) {
      getCatgoriesData();
      getBrandsListData();
    }
  }, [activePath]);

  useEffect(() => {
    setName("");
    setBrand("");
    setCategory("");
    setIsError(false);
    setIsActive(false);
    setSelectedBrandsList([]);
  }, [activePath]);

  useEffect(() => {
    dispatch(storeImageId({}));
  }, [activePath, contentType]);

  useEffect(() => {
    if (brand && category && subCategory) {
      setIsError(false);
      return;
    }
  }, [activePath, brand, category, subCategory]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!category) {
      setIsError(true);
      setError("All fields are required");
      return;
    }
    const sendDetails = {
      name: category,
      user_id: userDetails?.user_id,
      status: isActive,
      image: uploadedImageDetails?.imageId
        ? uploadedImageDetails?.imageId?.slice(37)
        : "",
    };
    dispatch(toggleModalConfirmState(true));
    setLoading(true);
    setSubmitClicked(true);
    setImageUploadClicked(false);

    const res = await postRequest({
      setIsError,
      setError,
      details: sendDetails,
      apiUrl: "categories/add",
      path: ROUTING_PATHS.categories,
      token: userDetails?.jwtToken,
    });

    if (res?.status) {
      storeToastSuccess({ successMessage: res?.message });
      setCategory("");
      dispatch(toggleModalState(false));
      dispatch(toggleModalConfirmState(false));
    } else {
      storeToastError({ errorMessage: res?.message ? res?.message : error });
    }
    setLoading(false);
    setSubmitClicked(false);
    setImageUploadClicked(false);
  };

  const handleAddSubCategory = async (e) => {
    e.preventDefault();

    if (
      !subCategory ||
      Object.keys(categoryObject).length === 0 ||
      !selectedBrandsList
    ) {
      setIsError(true);
      setError("All fields are required");
      return;
    }
    const sendDetails = {
      name: subCategory,
      status: isActive,
      category: categoryObject,
      brands: selectedBrandsList,
      image: uploadedImageDetails?.imageId
        ? uploadedImageDetails?.imageId?.slice(37)
        : "",
    };
    dispatch(toggleModalConfirmState(true));
    setLoading(true);
    setSubmitClicked(true);
    setImageUploadClicked(false);

    const res = await postRequest({
      setIsError,
      setError,
      details: sendDetails,
      apiUrl: "sub-categories/add",
      path: ROUTING_PATHS.subcategories,
      token: userDetails?.jwtToken,
    });
    if (res?.status) {
      storeToastSuccess({ successMessage: res?.message });
      setBrand("");
      dispatch(toggleModalState(false));
      dispatch(toggleModalConfirmState(false));
    } else {
      storeToastError({ errorMessage: res?.message ? res?.message : error });
    }
    setLoading(false);
    setSubmitClicked(false);
    setImageUploadClicked(false);
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();

    if (!brand) {
      setIsError(true);
      setError("All fields are required");
      return;
    }
    const sendDetails = {
      name: brand,
      user_id: userDetails?.user_id,
      status: isActive,
      image: uploadedImageDetails?.imageId
        ? uploadedImageDetails?.imageId?.slice(37)
        : "",
    };
    dispatch(toggleModalConfirmState(true));
    setLoading(true);
    setSubmitClicked(true);
    setImageUploadClicked(false);

    const res = await postRequest({
      setIsError,
      setError,
      details: sendDetails,
      apiUrl: "brands/add",
      path: ROUTING_PATHS.brands,
      token: userDetails?.jwtToken,
    });
    if (res?.status) {
      storeToastSuccess({ successMessage: res?.message });
      setBrand("");
      dispatch(toggleModalState(false));
      dispatch(toggleModalConfirmState(false));
    } else {
      storeToastError({ errorMessage: res?.message ? res?.message : error });
    }
    setLoading(false);
    setSubmitClicked(false);
    setImageUploadClicked(false);
  };

  const handleUpdateBrand = async (e) => {
    e.preventDefault();
    if (!categoryOrBrandId || !category) {
      setIsError(true);
      setError("All fields are required");
    }
    const sendDetails = {
      brand_id: categoryOrBrandId?.id,
      name: brand,
      status: isActive,
      image: uploadedImageDetails?.imageId
        ? uploadedImageDetails?.imageId?.slice(37)
        : imageUrl,
    };
    dispatch(toggleModalConfirmState(true));
    setLoading(true);
    setSubmitClicked(true);
    setImageUploadClicked(false);

    const res = await updateRequest({
      setIsError,
      setError,
      details: sendDetails,
      apiUrl: "brands/update",
      path: ROUTING_PATHS.brands,
      token: userDetails?.jwtToken,
    });
    if (res?.status) {
      storeToastSuccess({ successMessage: res?.message });
      dispatch(toggleModalState(false));
      dispatch(toggleModalConfirmState(false));
    } else {
      storeToastError({ errorMessage: res?.message });
    }
    setLoading(false);
    setSubmitClicked(false);
    setImageUploadClicked(false);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!categoryOrBrandId || !category) {
      setIsError(true);
      setError("All fields are required");
    }
    const sendDetails = {
      category_id: categoryOrBrandId?.id,
      name: category,
      status: isActive,
      image: uploadedImageDetails?.imageId
        ? uploadedImageDetails?.imageId?.slice(37)
        : imageUrl,
    };
    dispatch(toggleModalConfirmState(true));
    setLoading(true);
    setSubmitClicked(true);
    setImageUploadClicked(false);

    const res = await updateRequest({
      setIsError,
      setError,
      details: sendDetails,
      apiUrl: "categories/update",
      path: ROUTING_PATHS.categories,
      token: userDetails?.jwtToken,
    });
    if (res?.status) {
      storeToastSuccess({ successMessage: res?.message });
      dispatch(toggleModalState(false));
      dispatch(toggleModalConfirmState(false));
    } else {
      storeToastError({ errorMessage: res?.message });
    }
    setLoading(false);
    setSubmitClicked(false);
    setImageUploadClicked(false);
  };

  const handleUpdateSubCategory = async (e) => {
    e.preventDefault();
    if (
      !subCategory ||
      Object.keys(categoryObject)?.length === 0 ||
      selectedBrandsList.length === 0
    ) {
      setIsError(true);
      setError("All fields are required");
      return;
    }
    const sendDetails = {
      sub_category_id: categoryOrBrandId?.id,
      name: subCategory,
      status: isActive,
      category: categoryObject,
      brands: selectedBrandsList,
      image: uploadedImageDetails?.imageId
        ? uploadedImageDetails?.imageId?.slice(37)
        : imageUrl,
    };

    dispatch(toggleModalConfirmState(true));
    setLoading(true);
    setSubmitClicked(true);
    setImageUploadClicked(false);

    const res = await updateRequest({
      setIsError,
      setError,
      details: sendDetails,
      apiUrl: "sub-categories/update",
      path: ROUTING_PATHS.subcategories,
      token: userDetails?.jwtToken,
    });
    if (res?.status) {
      storeToastSuccess({ successMessage: res?.message });
      setBrand("");
      dispatch(toggleModalState(false));
      dispatch(toggleModalConfirmState(false));
    } else {
      storeToastError({ errorMessage: res?.message ? res?.message : error });
    }
    setLoading(false);
    setSubmitClicked(false);
    setImageUploadClicked(false);
  };

  const handleImageUpload = async (imageFile) => {
    setLoading(true);
    setSubmitClicked(false);
    setImageUploadClicked(true);
    if (!imageFile) {
      storeToastError({ errorMessage: "Please Select A Image!" });
      return;
    }
    if (imageFile?.type === "image/png" || imageFile?.type === "image/jpeg") {
      const formData = new FormData();
      formData.append("file", imageFile);

      formData.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_CATEGORIES_BRANDS
      );
      formData.append(
        "cloud_name",
        process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
      );
      const res = await postRequest({
        setError,
        setIsError,
        apiUrl: CLOUDINARY_IMAGE_UPLOAD_URL,
        formData,
      });

      if (res?.error) {
        storeToastError({ errorMessage: res?.error?.message });
      } else {
        const imageDetails = {
          height: res?.height,
          width: res?.width,
          imageId: res?.public_id,
        };
        dispatch(
          storeImageId(res?.public_id ? imageDetails : "DUMMY_PROFILE_LOGO")
        );
      }
    } else {
      storeToastError({
        errorMessage: "Please Select A Image! png/jpeg format only.",
      });
    }
    setLoading(false);
    setSubmitClicked(false);
    setImageUploadClicked(false);
  };

  const form = (
    <CategoryBrandForm
      selectedBrandsList={selectedBrandsList}
      setSelectedBrandsList={setSelectedBrandsList}
      error={error}
      brand={brand}
      category={category}
      isActive={isActive}
      isError={isError}
      loading={loading}
      name={name}
      subCategory={subCategory}
      setBrand={setBrand}
      setCategory={setCategory}
      setIsActive={setIsActive}
      setIsError={setIsError}
      setName={setName}
      setSubCategory={setSubCategory}
      setError={setError}
      setLoading={setLoading}
      setCategoryObject={setCategoryObject}
      handleAddCategoryOrBrand={
        activePath === ROUTING_PATHS.categories
          ? handleAddCategory
          : activePath === ROUTING_PATHS.brands
          ? handleAddBrand
          : handleAddSubCategory
      }
      handleUpdateCategoryOrBrand={
        activePath === ROUTING_PATHS.categories
          ? handleUpdateCategory
          : activePath === ROUTING_PATHS.brands
          ? handleUpdateBrand
          : handleUpdateSubCategory
      }
      imageUrl={imageUrl}
      buttonActiveStatus={result}
      handleImageUpload={handleImageUpload}
      uploadedImageDetails={uploadedImageDetails}
      isSubmitClicked={isSubmitClicked}
      isImageUploadClicked={isImageUploadClicked}
    />
  );

  const formTitle =
    contentType === MODAL_CONTENT_TYPES.addCategory
      ? "Add Category"
      : contentType === MODAL_CONTENT_TYPES.addSubCategory
      ? "Add Sub Category"
      : contentType === MODAL_CONTENT_TYPES.updateBrand
      ? "Update Brand"
      : contentType === MODAL_CONTENT_TYPES.updateCategory
      ? "Update Category"
      : contentType === MODAL_CONTENT_TYPES.updateSubCategory
      ? "Update Sub Category"
      : "";

  useEffect(() => {
    if (CATEGORY_BRAND_FORM_PATHS.includes(contentType)) {
      dispatch(
        storeModalContent({
          form: form,
          title: formTitle,
        })
      );
    }
  }, [
    error,
    isError,
    loading,
    brand,
    category,
    isActive,
    subCategory,
    contentType,
    categoryObject,
    imageUrl,
    isSubmitClicked,
    isImageUploadClicked,
    selectedBrandsList,
  ]);
}

import { useEffect, useState } from "react";
import { deleteRequest, getRequest } from "../api/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import {
  MODAL_CONTENT_TYPES,
  SIDEBAR_LINKS,
  storeToastError,
  storeToastSuccess,
} from "../utils/constants";
import {
  storeModalContent,
  storeModalContentType,
  toggleModalConfirmState,
  toggleModalState,
} from "../redux/slices/modalSlice";
import CatergoryBrandTable from "../components/table/CatergoryBrandTable";
import { storeCategoryBrandInfo } from "../redux/slices/categoryBrandSlice";

const SubCategories = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [brandDetails, setBrandDetails] = useState(null);
  const userDetails = useSelector(
    (store) => store?.persistSliceReducer?.user?.userInfo
  );
  const confirmState = useSelector((store) => store?.modal?.isConfirmed);
  const dispatch = useDispatch();
  const contentType = useSelector((store) => store?.modal?.contentType);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const res = await getRequest({
        apiUrl: `sub-categories/filterAll?page=${
          page + 1
        }&limit=${rowsPerPage}`,
        setIsError,
        setError,
        token: userDetails?.jwtToken,
      });
      if (res?.status) {
        setSubCategories(res?.data?.subCategories);
      } else {
        if (res?.message) {
          storeToastError({
            errorMessage: res?.message ? res?.message : error,
          });
        }
      }
      setLoading(false);
    };
    getData();
  }, [page, rowsPerPage, confirmState]);

  useEffect(() => {
    const deleteCategory = async () => {
      const sendSubCategoryId = {
        sub_category_id: brandDetails?.category_brand_id,
      };
      const res = await deleteRequest({
        setError: setError,
        setIsError: setIsError,
        details: sendSubCategoryId,
        token: userDetails?.jwtToken,
        apiUrl: "sub-categories/delete",
      });
      if (res?.status) {
        storeToastSuccess({ successMessage: res?.message });
      } else {
        if (res?.message) {
          storeToastError({
            errorMessage: res?.message ? res?.message : error,
          });
        }
      }
    };
    if (confirmState && contentType === MODAL_CONTENT_TYPES.deleteSubCategory) {
      deleteCategory();
      dispatch(toggleModalConfirmState(false));
    }
  }, [confirmState]);

  const handleDeleteCategoryBrand = (details) => {
    setBrandDetails(details);
    dispatch(toggleModalState(true));
    dispatch(storeModalContentType(MODAL_CONTENT_TYPES.deleteSubCategory));
    dispatch(
      storeModalContent({
        message: "Are You Sure You want to Delete ?",
        buttonName: "Delete",
      })
    );
  };

  const handleUpdateCategoryBrand = (details) => {
    dispatch(storeModalContentType(MODAL_CONTENT_TYPES.updateSubCategory));
    dispatch(
      storeCategoryBrandInfo({
        id: details?.category_brand_id,
        subcategory_text: details?.name,
        category_text: details?.category,
        brands_list: details?.brands_list,
        isActive: details?.status,
      })
    );
    dispatch(toggleModalState(true));
  };

  return (
    <div className="h-full w-full m-0">
      <h1 className="mb-4 text-lg font-bold">
        {SIDEBAR_LINKS.subcategories.name}
      </h1>
      <CatergoryBrandTable
        data={subCategories}
        handleDeleteCategoryBrand={handleDeleteCategoryBrand}
        handleUpdateCategoryBrand={handleUpdateCategoryBrand}
        rowsPerPage={rowsPerPage}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
        page={page}
        loading={loading}
        notFoundText={SIDEBAR_LINKS.subcategories.name}
        isError={isError}
      />
    </div>
  );
};

export default SubCategories;

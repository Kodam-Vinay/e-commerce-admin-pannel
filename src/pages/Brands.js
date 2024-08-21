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
import {
  storeBrandsList,
  storeCategoryBrandInfo,
} from "../redux/slices/categoryBrandSlice";

const Brands = () => {
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
  const brandsList = useSelector((store) => store?.categoryBrand?.brandsList);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const res = await getRequest({
        apiUrl: `brands/filterAll?page=${page + 1}&limit=${rowsPerPage}`,
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
    getData();
  }, [page, rowsPerPage, confirmState]);

  useEffect(() => {
    const deleteCategory = async () => {
      const sendBrandId = {
        brand_id: brandDetails?.category_brand_id,
      };
      const res = await deleteRequest({
        setError: setError,
        setIsError: setIsError,
        details: sendBrandId,
        token: userDetails?.jwtToken,
        apiUrl: "brands/delete",
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
    if (confirmState && contentType === MODAL_CONTENT_TYPES.deleteBrand) {
      deleteCategory();
      dispatch(toggleModalConfirmState(false));
    }
  }, [confirmState]);

  const handleDeleteCategoryBrand = (details) => {
    setBrandDetails(details);
    dispatch(toggleModalState(true));
    dispatch(storeModalContentType(MODAL_CONTENT_TYPES.deleteBrand));
    dispatch(
      storeModalContent({
        message: "Are You Sure You want to Delete ?",
        buttonName: "Delete",
      })
    );
  };

  const handleUpdateCategoryBrand = (details) => {
    dispatch(storeModalContentType(MODAL_CONTENT_TYPES.updateBrand));
    dispatch(
      storeCategoryBrandInfo({
        id: details?.category_brand_id,
        brand_text: details?.name,
        isActive: details?.status,
        image: details?.image,
      })
    );
    dispatch(toggleModalState(true));
  };

  return (
    <div className="h-full w-full m-0">
      <h1 className="mb-4 text-lg font-bold">{SIDEBAR_LINKS.brands.name}</h1>
      <CatergoryBrandTable
        data={brandsList}
        handleDeleteCategoryBrand={handleDeleteCategoryBrand}
        handleUpdateCategoryBrand={handleUpdateCategoryBrand}
        rowsPerPage={rowsPerPage}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
        page={page}
        loading={loading}
        notFoundText={SIDEBAR_LINKS.brands.name}
        isError={isError}
      />
    </div>
  );
};

export default Brands;

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
import ProductsTable from "../components/table/ProductsTable";
import {
  storeProductImagesDb,
  storeProductInfo,
} from "../redux/slices/productSlice";

const Products = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(0);
  const [deleteProductDetails, setDeleteProductDetails] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
        apiUrl: `products/filterAll?page=${page + 1}&limit=${rowsPerPage}`,
        setIsError,
        setError,
        token: userDetails?.jwtToken,
      });

      if (res?.status) {
        setData(res?.data?.products);
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
    const deleteProduct = async () => {
      const sendProductId = {
        product_id: deleteProductDetails?.product_id,
      };
      const res = await deleteRequest({
        setError: setError,
        setIsError: setIsError,
        details: sendProductId,
        token: userDetails?.jwtToken,
        apiUrl: "products/delete",
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
    if (confirmState && contentType === MODAL_CONTENT_TYPES.deleteProduct) {
      deleteProduct();
      dispatch(toggleModalConfirmState(false));
    }
  }, [confirmState]);

  const handleDeleteProduct = (details) => {
    setDeleteProductDetails(details);
    dispatch(toggleModalState(true));
    dispatch(storeModalContentType(MODAL_CONTENT_TYPES.deleteProduct));
    dispatch(
      storeModalContent({
        message: "Are You Sure You want to Delete ?",
        buttonName: "Delete",
      })
    );
  };

  const handleUpdateProduct = (details) => {
    const filterStoredImages = details?.images?.map((eachImage) => {
      return {
        image_id: eachImage?.image_id,
        url: eachImage?.url,
        alt: eachImage?.alt,
        uploaded: true,
      };
    });
    dispatch(storeModalContentType(MODAL_CONTENT_TYPES.updateProduct));
    dispatch(
      storeProductInfo({
        stored_id: details?.product_id,
        stored_category: details?.category,
        stored_features: details?.features,
        stored_brand: details?.brand,
        stored_name: details?.name,
        stored_sub_category: details?.sub_category,
        stored_stock: details?.stock,
        stored_price: details?.price,
        stored_specifications: details?.specifications,
        stored_description: details?.description,
        stored_is_premium: details?.is_premium,
        stored_discount: details?.discount,
        stored_images: filterStoredImages,
      })
    );
    dispatch(storeProductImagesDb(details?.images));
    dispatch(toggleModalState(true));
  };

  return (
    <div className="h-full w-full m-0">
      <h1 className="mb-4 text-lg font-bold">{SIDEBAR_LINKS.products.name}</h1>
      <ProductsTable
        data={data}
        handleDeleteProduct={handleDeleteProduct}
        handleUpdateProduct={handleUpdateProduct}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        loading={loading}
        isError={isError}
        notFoundText={SIDEBAR_LINKS.products.name}
      />
    </div>
  );
};

export default Products;

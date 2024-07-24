import { useEffect, useState } from "react";
import { deleteRequest, getRequest } from "../api/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import {
  filterUsersFunc,
  MODAL_CONTENT_TYPES,
  storeToastError,
  storeToastSuccess,
} from "../utils/constants";
import Loader from "../components/Loader";
import UsersTable from "../components/table/UsersTable";
import {
  storeModalContent,
  storeModalContentType,
  toggleModalConfirmState,
  toggleModalState,
} from "../redux/slices/modalSlice";

const Sellers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteUserDetails, setDeleteUserDetails] = useState(null);
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
        apiUrl: `admin/all-users?page=${page + 1}?limit=${rowsPerPage}`,
        setIsError,
        setError,
        token: userDetails?.jwtToken,
      });
      if (res?.status) {
        setData(res?.data?.users);
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
    if (confirmState && contentType === MODAL_CONTENT_TYPES.deleteUser) {
      const deleteUser = async () => {
        const sendUserId = {
          _id: deleteUserDetails?.user_id,
        };
        const res = await deleteRequest({
          setError: setError,
          setIsError: setIsError,
          details: sendUserId,
          token: userDetails?.jwtToken,
          apiUrl: "admin/delete-user",
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
      deleteUser();
      dispatch(toggleModalConfirmState(false));
    }
  }, [confirmState]);

  const handleDeleteUser = async (details) => {
    setDeleteUserDetails(details);
    dispatch(toggleModalState(true));
    dispatch(storeModalContentType(MODAL_CONTENT_TYPES.deleteUser));
    dispatch(
      storeModalContent({
        message: "Are You Sure You want to Delete ?",
        buttonName: "Delete",
      })
    );
  };

  const filterUsers = filterUsersFunc(data, "seller");
  const renderUi =
    filterUsers?.length > 0 && !loading && !isError ? (
      <UsersTable
        data={filterUsers}
        handleDeleteUser={handleDeleteUser}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
      />
    ) : !filterUsers?.length > 0 && !loading && !isError ? (
      <div>No Sellers found</div>
    ) : loading ? (
      <Loader />
    ) : (
      ""
    );
  return <div className="h-full w-full m-0">{renderUi}</div>;
};

export default Sellers;

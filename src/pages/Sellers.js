import { useEffect, useState } from "react";
import { deleteRequest } from "../api/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import {
  filterUsersFunc,
  MODAL_CONTENT_TYPES,
  SIDEBAR_LINKS,
  storeToastError,
  storeToastSuccess,
  USER_ROLES,
} from "../utils/constants";
import UsersTable from "../components/table/UsersTable";
import {
  storeModalContent,
  storeModalContentType,
  toggleModalConfirmState,
  toggleModalState,
} from "../redux/slices/modalSlice";
import useGetData from "../hooks/useGetData";

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

  useGetData({
    apiUrl: `admin/all-users?page=${page + 1}&limit=${rowsPerPage}`,
    error,
    setError,
    setIsError,
    setData,
    setLoading,
    page,
    rowsPerPage,
  });

  useEffect(() => {
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
    if (confirmState && contentType === MODAL_CONTENT_TYPES.deleteUser) {
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

  const filterUsers = filterUsersFunc(data, USER_ROLES[1].role);

  return (
    <div className="h-full w-full m-0">
      <h1 className="mb-4 text-lg font-bold">{SIDEBAR_LINKS.sellers.name}</h1>
      <UsersTable
        data={filterUsers}
        handleDeleteUser={handleDeleteUser}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        loading={loading}
        isError={isError}
        notFoundText={SIDEBAR_LINKS.sellers.name}
      />
    </div>
  );
};

export default Sellers;

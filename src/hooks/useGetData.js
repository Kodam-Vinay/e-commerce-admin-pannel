import { useEffect } from "react";
import { getRequest } from "../api/apiCalls";
import { useSelector } from "react-redux";
import { storeToastError } from "../utils/constants";

const useGetData = ({
  setLoading,
  setIsError,
  setError,
  page,
  apiUrl,
  setData,
  rowsPerPage,
  error,
}) => {
  const userDetails = useSelector(
    (store) => store?.persistSliceReducer?.user?.userInfo
  );
  const confirmState = useSelector((store) => store?.modal?.isConfirmed);
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const res = await getRequest({
        apiUrl,
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
};

export default useGetData;

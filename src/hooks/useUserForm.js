import { useEffect, useState } from "react";
import {
  ROUTING_PATHS,
  storeToastError,
  storeToastSuccess,
  USER_FORM_PATHS,
  USER_ROLES,
} from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import AuthForm from "../components/forms/AuthForm";
import {
  storeModalContent,
  toggleModalConfirmState,
  toggleModalState,
} from "../redux/slices/modalSlice";
import { postRequest } from "../api/apiCalls";

const useUserForm = () => {
  const dispatch = useDispatch();
  const activePath = useSelector(
    (store) => store?.persistSliceReducer?.path?.activePath
  );
  const userDetails = useSelector(
    (store) => store?.persistSliceReducer?.user?.userInfo
  );
  const contentType = useSelector((store) => store?.modal?.contentType);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const role =
    activePath === ROUTING_PATHS.sellers
      ? USER_ROLES[1].role
      : USER_ROLES[2].role;

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!email || !password || !name || !confirmPassword || !userId || !role) {
      setIsError(true);
      setError("All fields are required");
      return;
    }
    const sendDetails = {
      name,
      email,
      user_id: userId,
      role,
      password,
      confirm_password: confirmPassword,
      address,
    };
    dispatch(toggleModalConfirmState(true));
    setLoading(true);
    const res = await postRequest({
      setIsError,
      setError,
      details: sendDetails,
      apiUrl: "admin/add-user",
      path:
        activePath === ROUTING_PATHS.sellers
          ? ROUTING_PATHS.sellers
          : ROUTING_PATHS.users,
      token: userDetails?.jwtToken,
    });

    if (res?.status) {
      storeToastSuccess({ successMessage: res?.message });
      setEmail("");
      setName("");
      setUserId("");
      setAddress("");
      setPassword("");
      setConfirmPassword("");
      dispatch(toggleModalState(false));
      dispatch(toggleModalConfirmState(false));
    } else {
      storeToastError({ errorMessage: res?.message ? res?.message : error });
    }
    setLoading(false);
  };

  const form = (
    <AuthForm
      confirmPassword={confirmPassword}
      email={email}
      isError={isError}
      setIsError={setIsError}
      loading={loading}
      name={name}
      password={password}
      role={role}
      userId={userId}
      address={address}
      error={error}
      setConfirmPassword={setConfirmPassword}
      setEmail={setEmail}
      setName={setName}
      setPassword={setPassword}
      setAddress={setAddress}
      setUserId={setUserId}
      showConfirmPassword={showConfirmPassword}
      setShowConfirmPassword={setShowConfirmPassword}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      handleForm={handleAddUser}
    />
  );

  useEffect(() => {
    setEmail("");
    setName("");
    setUserId("");
    setAddress("");
    setPassword("");
    setConfirmPassword("");
  }, [activePath]);

  useEffect(() => {
    if (
      email &&
      password &&
      name &&
      confirmPassword &&
      userId &&
      role &&
      address
    ) {
      setIsError(false);
      return;
    }
  }, [email, password, name, confirmPassword, userId, role, activePath]);

  useEffect(() => {
    if (USER_FORM_PATHS.includes(contentType)) {
      dispatch(
        storeModalContent({
          form: form,
          title: "Add User",
        })
      );
    }
  }, [
    email,
    password,
    name,
    confirmPassword,
    userId,
    role,
    activePath,
    contentType,
    showPassword,
    showConfirmPassword,
    address,
  ]);
};

export default useUserForm;

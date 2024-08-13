import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthForm from "../components/forms/AuthForm";
import { postRequest, updateRequest } from "../api/apiCalls";
import { storeUserInfo } from "../redux/slices/userSlice";
import {
  CLOUDINARY_IMAGE_UPLOAD_URL,
  ROUTING_PATHS,
  storeToastError,
  storeToastSuccess,
} from "../utils/constants";
import { storeImageId } from "../redux/slices/imageSlice";

const Profile = () => {
  const userDetails = useSelector(
    (store) => store?.persistSliceReducer?.user?.userInfo
  );
  const [name, setName] = useState(userDetails?.name);
  const [userId, setUserId] = useState(userDetails?.user_id);
  const [address, setAddress] = useState(userDetails?.address);
  const [mobileNo, setMobileNo] = useState(userDetails?.contact?.mobile_number);
  const [contactEmail, setContactEmail] = useState(userDetails?.contact?.email);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isDetailsUpdateSuccess, setIsDetailsUpdateSuccess] = useState(false);
  const [error, setError] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const handleClick = () => {
    fileInputRef.current.click();
  };
  const uploadedImageDetails = useSelector(
    (store) => store?.persistSliceReducer?.image?.imageDetails
  );

  useEffect(() => {
    if (uploadedImageDetails) {
      dispatch(storeImageId({}));
    }
  }, [isDetailsUpdateSuccess]);

  const checkUserEnteredOldAndNewPassword =
    oldPassword?.toString().trim().length > 7 &&
    newPassword?.toString().trim().length > 7;

  const checkUserIdChanged = userId?.toString().trim() !== userDetails?.user_id;

  const checkNameIsChanged = name?.toString().trim() !== userDetails?.name;

  const checkImageIsChanged =
    uploadedImageDetails?.imageId?.slice(19).toString().trim() !==
      userDetails?.image?.toString().trim() &&
    uploadedImageDetails?.imageId !== undefined;

  const checkAddressChanged =
    address?.toString().trim() !== userDetails?.address?.toString().trim();
  const checkContactEmailChanged =
    contactEmail?.toString().trim() !==
    userDetails?.contact?.email?.toString().trim();
  const checkMobileNumberChanged =
    mobileNo?.toString().trim() !==
    userDetails?.contact?.mobile_number?.toString().trim();

  const checkAnyChangesMade =
    checkNameIsChanged ||
    checkUserIdChanged ||
    checkImageIsChanged ||
    checkUserEnteredOldAndNewPassword ||
    checkAddressChanged ||
    checkContactEmailChanged ||
    checkMobileNumberChanged;

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    if (!name || !address || !userId) {
      setIsError(true);
      setError("All fields are required");
      return;
    }
    if ((oldPassword && !newPassword) || (newPassword && !oldPassword)) {
      setIsError(true);
      return;
    }
    let details = {};
    if (checkUserEnteredOldAndNewPassword) {
      details = {
        name,
        user_id: userId,
        old_password: oldPassword,
        new_password: newPassword,
        address,
        image: uploadedImageDetails?.imageId
          ? uploadedImageDetails?.imageId?.slice(19)
          : userDetails?.image,
        contact: {
          mobile_number: mobileNo,
          email: contactEmail,
        },
      };
    } else {
      details = {
        name,
        user_id: userId,
        address,
        image: uploadedImageDetails?.imageId
          ? uploadedImageDetails?.imageId?.slice(19)
          : userDetails?.image,
        contact: {
          mobile_number: mobileNo,
          email: contactEmail,
        },
      };
    }
    setLoading(true);
    const res = await updateRequest({
      setError,
      setIsError,
      token: userDetails?.jwtToken,
      details,
      apiUrl: "shop-admin/update",
    });
    if (res?.status) {
      dispatch(storeUserInfo(res?.data?.userDetails));
      storeToastSuccess({ successMessage: res?.message });
      setOldPassword("");
      setNewPassword("");
      setIsDetailsUpdateSuccess(true);
    } else {
      storeToastError({ errorMessage: res?.message ? res?.message : error });
    }
    setLoading(false);
  };

  const handleImageUpload = async (imageFile) => {
    setLoading(true);
    if (!imageFile) {
      storeToastError({ errorMessage: "Please Select A Image!" });
      return;
    }
    if (imageFile?.type === "image/png" || imageFile?.type === "image/jpeg") {
      const formData = new FormData();
      formData.append("file", imageFile);

      formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
      formData.append(
        "cloud_name",
        process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
      );
      const res = await postRequest({
        setError,
        setIsError,
        apiUrl: CLOUDINARY_IMAGE_UPLOAD_URL,
        formData,
        path: ROUTING_PATHS.signup,
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
  };

  return (
    <div className="overflow-y-auto h-full">
      <AuthForm
        name={name}
        setName={setName}
        password={oldPassword}
        setPassword={setOldPassword}
        showPassword={showOldPassword}
        setShowPassword={setShowOldPassword}
        confirmPassword={newPassword}
        setConfirmPassword={setNewPassword}
        showConfirmPassword={showNewPassword}
        setShowConfirmPassword={setShowNewPassword}
        address={address}
        setAddress={setAddress}
        loading={loading}
        error={error}
        isError={isError}
        handleForm={handleUpdateDetails}
        userId={userId}
        setUserId={setUserId}
        handleImageUpload={handleImageUpload}
        handleClick={handleClick}
        mobileNo={mobileNo}
        setMobileNo={setMobileNo}
        contactEmail={contactEmail}
        setContactEmail={setContactEmail}
        fileInputRef={fileInputRef}
        setIsError={setIsError}
        checkAnyChangesMade={checkAnyChangesMade}
      />
    </div>
  );
};

export default Profile;

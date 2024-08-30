import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthForm from "../components/forms/AuthForm";
import { postRequest, updateRequest } from "../api/apiCalls";
import { storeUserInfo } from "../redux/slices/userSlice";
import {
  IMAGE_UPLOAD_PATHS,
  storeToastError,
  storeToastSuccess,
} from "../utils/constants";
import { storeImageId } from "../redux/slices/imageSlice";

const Profile = () => {
  const dispatch = useDispatch();
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
  const [isImageUploadClicked, setImageUploadClicked] = useState(false);
  const [isSubmitClicked, setSubmitClicked] = useState(false);
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
    setSubmitClicked(true);
    setImageUploadClicked(false);
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
          ? uploadedImageDetails?.imageId
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
          ? uploadedImageDetails?.imageId
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
    setSubmitClicked(false);
    setImageUploadClicked(false);
  };

  const handleImageUpload = async (imageFile) => {
    setSubmitClicked(false);
    setImageUploadClicked(true);
    if (!imageFile) {
      storeToastError({ errorMessage: "Please Select A Image!" });
      return;
    }
    if (imageFile?.type === "image/png" || imageFile?.type === "image/jpeg") {
      const formData = new FormData();
      formData.append("image", imageFile);
      setLoading(true);
      setSubmitClicked(false);
      setImageUploadClicked(true);

      //code
      const res = await postRequest({
        apiUrl: IMAGE_UPLOAD_PATHS[2],
        details: formData,
        setError,
        setIsError,
        token: userDetails?.jwtToken,
      });
      if (res?.status) {
        storeToastSuccess({ successMessage: res?.message });
        dispatch(
          storeImageId(
            res?.data?.image
              ? {
                  imageId: res?.data?.image,
                }
              : {
                  imageId: "DUMMY_PROFILE_LOGO",
                }
          )
        );
      } else {
        storeToastError({ errorMessage: res?.message });
      }
      setLoading(false);
    } else {
      storeToastError({
        errorMessage: "Please Select A Image! png/jpeg format only.",
      });
    }
    setSubmitClicked(false);
    setImageUploadClicked(false);
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
        isImageUploadClicked={isImageUploadClicked}
        isSubmitClicked={isSubmitClicked}
      />
    </div>
  );
};

export default Profile;

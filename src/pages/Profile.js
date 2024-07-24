import { useState } from "react";
import { useSelector } from "react-redux";
import AuthForm from "../components/AuthForm";

const Profile = () => {
  const userDetails = useSelector(
    (store) => store?.persistSliceReducer?.user?.userInfo
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const [name, setName] = useState(userDetails?.name);
  const [userId, setUserId] = useState(userDetails?.user_id);
  const [oldPassword, setOldPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [address, setAddress] = useState(userDetails?.address);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const handleUpdateDetails = (e) => {
    e.preventDefault();
    if (!name || !oldPassword || !newPassword || !address) {
      setIsError(true);
      setError("All fields are required");
      return;
    }
  };

  const handleImageUpload = () => {};
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
      />
    </div>
  );
};

export default Profile;

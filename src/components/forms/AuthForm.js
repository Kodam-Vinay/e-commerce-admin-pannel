import { FaEye, FaEyeSlash } from "react-icons/fa";
import CustomButton from "../../utils/CustomButton";
import CustomInput from "../../utils/CustomInput";
import { useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  CLOUDINARY_IMAGE_ACCESS_URL,
  ROUTING_PATHS,
  USER_ROLES,
} from "../../utils/constants";
import { ThreeCircles } from "react-loader-spinner";
import { useEffect } from "react";

const AuthForm = ({
  isError,
  name,
  setName,
  userId,
  setUserId,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  confirmPassword,
  setConfirmPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  role,
  setRole,
  loading,
  handleForm,
  error,
  address,
  setAddress,
  mobileNo,
  setMobileNo,
  contactEmail,
  setContactEmail,
  handleImageUpload,
  handleClick,
  fileInputRef,
  checkAnyChangesMade,
  setIsError,
}) => {
  useEffect(() => {
    setIsError(false);
  }, []);

  const activePath = useSelector(
    (store) => store?.persistSliceReducer?.path?.activePath
  );
  const userDetails = useSelector(
    (store) => store?.persistSliceReducer?.user?.userInfo
  );
  const isModalOpen = useSelector((store) => store?.modal?.isModalOpen);

  const uploadedImageDetails = useSelector(
    (store) => store?.persistSliceReducer?.image?.imageDetails
  );

  return (
    <form
      onSubmit={handleForm}
      className={`w-full self-center ${
        activePath === ROUTING_PATHS.profile ? "pb-4" : "max-w-96 mx-auto"
      }`}
    >
      {/* profile logo */}
      {activePath === ROUTING_PATHS.profile && (
        <div className="flex flex-col items-center my-2 mt-4 relative">
          <div className="relative">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full w-full">
                <ThreeCircles
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="three-circles-loading"
                  color="#5046e5"
                />
              </div>
            ) : (
              <Avatar
                alt="profile_logo"
                src={
                  uploadedImageDetails?.imageId
                    ? CLOUDINARY_IMAGE_ACCESS_URL +
                      uploadedImageDetails?.imageId.slice(19)
                    : userDetails?.image
                    ? CLOUDINARY_IMAGE_ACCESS_URL + userDetails?.image
                    : CLOUDINARY_IMAGE_ACCESS_URL + "DUMMY_PROFILE_LOGO"
                }
                sx={{
                  height: "80px",
                  width: "80px",
                }}
              />
            )}

            <input
              ref={fileInputRef}
              onChange={(e) => handleImageUpload(e.target.files[0])}
              type="file"
              accept="image/*"
              className={"w-full hidden"}
            />
            <CustomButton
              label={
                <AddIcon
                  sx={{
                    height: 25,
                    width: 25,
                    marginLeft: 1,
                  }}
                />
              }
              className="h-7 w-7 max-w-6 max-h-6 rounded-[100%] absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 z-20"
              onClick={handleClick}
            />
          </div>
        </div>
      )}

      {/* name, user_id */}
      {activePath !== ROUTING_PATHS.signin && (
        <div
          className={`flex ${
            activePath === ROUTING_PATHS.profile
              ? "flex-col items-center sm:items-start sm:flex-row my-2 space-y-2 sm:space-y-0 sm:space-x-2 sm:justify-center"
              : "flex-row space-x-2 justify-between"
          }`}
        >
          <CustomInput
            containerClassName={`${
              activePath === ROUTING_PATHS.profile ? "mx-0 w-full" : "mx-auto"
            }`}
            label="Name"
            className={`${
              activePath === ROUTING_PATHS.profile || isModalOpen
                ? "w-full"
                : "w-full md:-ml-2"
            }`}
            type="text"
            error={isError && !name && "Name is Required"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Name"
          />

          <CustomInput
            containerClassName={`${
              activePath === ROUTING_PATHS.profile ? "mx-0 w-full" : "mx-auto"
            }`}
            label="User Id"
            className={`w-full`}
            type="text"
            error={isError && !userId && "User Id is required"}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
      )}

      {/* email */}
      {activePath !== ROUTING_PATHS.profile && (
        <CustomInput
          containerClassName="mx-auto"
          label={
            activePath === ROUTING_PATHS.signin
              ? "Email / User Id"
              : "Email address"
          }
          className="w-full"
          type={activePath === ROUTING_PATHS.signup ? "email" : "text"}
          error={
            isError && !email && activePath === ROUTING_PATHS.signin
              ? "Email/User ID is required"
              : isError && !email
              ? "Email is required"
              : null
          }
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder={
            activePath === ROUTING_PATHS.signin
              ? "Email / User Id"
              : "Email address"
          }
        />
      )}

      {/* role */}
      {activePath === ROUTING_PATHS.signup && (
        <div className="w-full max-w-96 mx-auto">
          <label
            htmlFor="role"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Role
          </label>
          <select
            value={role}
            id="role"
            className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
              isError && !role ? "border-red-500" : "border-gray-300"
            } `}
            onChange={(e) => setRole(e.target.value)}
          >
            {USER_ROLES.map((eachRole, index) => {
              return (
                activePath === ROUTING_PATHS.signup &&
                index !== 2 && (
                  <option key={eachRole?.name} value={eachRole.role}>
                    {eachRole?.name}
                  </option>
                )
              );
            })}
          </select>
        </div>
      )}

      {/* password */}
      <div
        className={`flex ${
          activePath === ROUTING_PATHS.profile
            ? "flex flex-col items-center sm:items-start sm:flex-row my-2 space-y-2 sm:space-y-0 sm:space-x-2 sm:justify-center"
            : "flex-col max-w-96"
        }`}
      >
        <CustomInput
          containerClassName={`w-full ${
            activePath === ROUTING_PATHS.profile ? "mx-0" : "mx-auto"
          }`}
          label={
            activePath === ROUTING_PATHS.profile ? "Old Password" : "Password"
          }
          className="w-full"
          type={showPassword ? "text" : "password"}
          icon={showPassword ? <FaEyeSlash /> : <FaEye />}
          error={
            activePath === ROUTING_PATHS.profile &&
            confirmPassword?.length > 0 &&
            !password &&
            isError
              ? "Old Password is required"
              : activePath !== ROUTING_PATHS.profile && isError && !password
              ? "Pasword is required"
              : null
          }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          togglerIcon={() => setShowPassword(!showPassword)}
          required
          placeholder={
            activePath === ROUTING_PATHS.profile ? "Old Password" : "Password"
          }
        />

        {activePath !== ROUTING_PATHS.signin && (
          <CustomInput
            containerClassName={`w-full ${
              activePath === ROUTING_PATHS.profile ? "mx-0" : "mx-auto"
            }`}
            label={
              activePath === ROUTING_PATHS.profile
                ? "New Password"
                : "Confirm Password"
            }
            className="w-full"
            type={showConfirmPassword ? "text" : "password"}
            icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            error={
              activePath === ROUTING_PATHS.profile &&
              password?.length > 0 &&
              !confirmPassword &&
              isError
                ? "New Password is required"
                : activePath !== ROUTING_PATHS.profile &&
                  isError &&
                  !confirmPassword
                ? "Confirm Pasword is required"
                : null
            }
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            togglerIcon={() => setShowConfirmPassword(!showConfirmPassword)}
            required
            placeholder={
              activePath === ROUTING_PATHS.profile
                ? "New Password"
                : "Confirm Password"
            }
          />
        )}
      </div>

      {/* contact email, mobileNumber */}
      {activePath === ROUTING_PATHS.profile && (
        <div
          className={`flex ${
            activePath === ROUTING_PATHS.profile
              ? "flex-col items-center sm:items-start sm:flex-row my-2 space-y-2 sm:space-y-0 sm:space-x-2 sm:justify-center"
              : "flex-row space-x-2 justify-between"
          }`}
        >
          <CustomInput
            containerClassName={`${
              activePath === ROUTING_PATHS.profile ? "mx-0 w-full" : "mx-auto"
            }`}
            label="Mobile Number"
            className={`${
              activePath === ROUTING_PATHS.profile || isModalOpen
                ? "w-full"
                : "w-full md:-ml-2"
            }`}
            type="tel"
            pattern="[0-9]*"
            error={isError && !mobileNo && "Mobile Number Required"}
            value={mobileNo ? mobileNo : ""}
            onChange={(event) => {
              setMobileNo((v) =>
                event.target.validity.valid ? event.target.value : ""
              );
            }}
            required
            placeholder="Mobile Number"
          />

          <CustomInput
            containerClassName={`${
              activePath === ROUTING_PATHS.profile ? "mx-0 w-full" : "mx-auto"
            }`}
            label="Contact Email"
            className={`w-full`}
            type="text"
            error={isError && !contactEmail && "User Id is required"}
            value={contactEmail ? contactEmail : ""}
            onChange={(e) => setContactEmail(e.target.value)}
            required
            placeholder="Contact Email"
          />
        </div>
      )}

      {/* address, role */}
      {(activePath === ROUTING_PATHS.profile ||
        activePath === ROUTING_PATHS.sellers ||
        activePath === ROUTING_PATHS.users) && (
        <div
          className={`flex flex-col items-center sm:items-start sm:flex-row my-2 space-y-2 sm:space-y-0 sm:space-x-2 sm:justify-center mt-2"
              `}
        >
          <CustomInput
            containerClassName="w-full mx-0"
            disabled={true}
            label="Role"
            className="w-1/2 bg-gray-200"
            value={
              activePath === ROUTING_PATHS.profile ? userDetails?.role : role
            }
            required
            placeholder="Role"
          />
          <>
            <div className="w-full mx-0 flex flex-col max-w-96">
              <label htmlFor="role">Address</label>
              <textarea
                className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
                  isError && !address ? "border-red-500" : "border-gray-300"
                }`}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
              />
              {isError && !address && (
                <p className="text-[10px] xs:text-xs text-red-500">
                  {"Address Is Required"}
                </p>
              )}
            </div>
          </>
        </div>
      )}

      <div className="mt-5">
        <CustomButton
          loading={loading}
          disabled={
            activePath === ROUTING_PATHS.profile && !checkAnyChangesMade
          }
          className={
            activePath === ROUTING_PATHS.profile &&
            !checkAnyChangesMade &&
            !checkAnyChangesMade
              ? "bg-opacity-70 hover:bg-opacity-70 cursor-not-allowed w-full max-w-96 h-10"
              : "w-full max-w-96 h-10"
          }
          label={
            activePath === ROUTING_PATHS.profile
              ? "Update Details"
              : activePath === ROUTING_PATHS.signin
              ? "Sign In"
              : activePath === ROUTING_PATHS.signup
              ? "Sign Up"
              : activePath === ROUTING_PATHS.products
              ? "Add Product"
              : "Add User"
          }
          type={"submit"}
        />
      </div>

      {(activePath === ROUTING_PATHS.signin ||
        activePath === ROUTING_PATHS.signup) && (
        <p className="text-red-400 text-xs xs:text-base">
          {isError && "*" + error}
        </p>
      )}
    </form>
  );
};

export default AuthForm;

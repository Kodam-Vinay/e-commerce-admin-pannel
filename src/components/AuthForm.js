import { FaEye, FaEyeSlash } from "react-icons/fa";
import CustomButton from "../utils/CustomButton";
import CustomInput from "../utils/CustomInput";
import { useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  CLOUDINARY_IMAGE_ACCESS_URL,
  ROUTING_PATHS,
  USER_ROLES,
} from "../utils/constants";

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
  handleImageUpload,
}) => {
  const activePath = useSelector(
    (store) => store?.persistSliceReducer?.path?.activePath
  );
  const userDetails = useSelector(
    (store) => store?.persistSliceReducer?.user?.userInfo
  );
  const isModalOpen = useSelector((store) => store?.modal?.isModalOpen);
  return (
    <form
      onSubmit={handleForm}
      className={`w-full ${
        activePath === ROUTING_PATHS.profile ? "pb-4" : "max-w-96 mx-auto"
      }`}
    >
      {/* profile logo */}
      {activePath === ROUTING_PATHS.profile && (
        <div className="flex flex-col items-center my-2 mt-4 relative">
          <div className="relative">
            <Avatar
              alt="profile_logo"
              src={CLOUDINARY_IMAGE_ACCESS_URL + userDetails?.image}
              sx={{
                height: "80px",
                width: "80px",
              }}
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
              className=" h-6 w-6 max-w-6 max-h-6 rounded-[100%] absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 z-20"
              onClick={handleImageUpload}
            />
          </div>
        </div>
      )}

      {/* name, user_id */}
      {activePath !== ROUTING_PATHS.signin && (
        <div
          className={`flex ${
            activePath === ROUTING_PATHS.profile
              ? "flex-col sm:flex-row my-2 space-y-2 sm:space-y-0 sm:space-x-2 sm:justify-center"
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
          />

          <CustomInput
            containerClassName={`${
              activePath === ROUTING_PATHS.profile ? "mx-0 w-full" : "mx-auto"
            }`}
            label="User Id"
            className={`"w-full" ${
              activePath === ROUTING_PATHS.profile ? "bg-gray-200" : ""
            }`}
            type="text"
            error={isError && !userId && "User Id is required"}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            disabled={activePath === ROUTING_PATHS.profile ? true : false}
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
        />
      )}

      {/* role */}
      {activePath === ROUTING_PATHS.signup && (
        <div className="w-full max-w-96 mx-auto">
          <label htmlFor="role">Role</label>
          <select
            value={role}
            id="role"
            className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
              isError && !role ? "border-red-500" : "border-gray-300"
            } `}
            onChange={(e) => setRole(e.target.value)}
          >
            {USER_ROLES.map((eachRole, index) => {
              if (activePath === ROUTING_PATHS.signup && index !== 2) {
                return (
                  <option key={eachRole?.name} value={eachRole.role}>
                    {eachRole?.name}
                  </option>
                );
              }
              return <option key={index}></option>;
            })}
          </select>
        </div>
      )}

      {/* password */}
      <div
        className={`flex ${
          activePath === ROUTING_PATHS.profile
            ? "flex flex-col sm:flex-row my-2 space-y-2 sm:space-y-0 sm:space-x-2 sm:justify-center"
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
            isError && !password && activePath === ROUTING_PATHS.profile
              ? "Old Password is required"
              : isError && !password
              ? "Pasword is required"
              : null
          }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          togglerIcon={() => setShowPassword(!showPassword)}
          required
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
              isError &&
              !confirmPassword &&
              activePath === ROUTING_PATHS.profile
                ? "New Password is required"
                : isError && !confirmPassword
                ? "Confirm Pasword is required"
                : null
            }
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            togglerIcon={() => setShowConfirmPassword(!showConfirmPassword)}
            required
          />
        )}
      </div>

      {/* address, role */}
      {(activePath === ROUTING_PATHS.profile ||
        activePath === ROUTING_PATHS.sellers ||
        activePath === ROUTING_PATHS.users) && (
        <div
          className={`flex flex-col sm:flex-row my-2 space-y-2 sm:space-y-0 sm:space-x-2 sm:justify-center mt-2"
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

      {(activePath === ROUTING_PATHS.signin ||
        activePath === ROUTING_PATHS.signup) && (
        <p className="text-red-400 text-xs xs:text-base">
          {isError && "*" + error}
        </p>
      )}

      <div className="mt-5">
        <CustomButton
          loading={loading}
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
    </form>
  );
};

export default AuthForm;

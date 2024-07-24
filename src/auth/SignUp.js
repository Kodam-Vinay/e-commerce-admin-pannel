import { useEffect, useState } from "react";
import bgImage from "../assets/bgImage.png";
import CustomInput from "../utils/CustomInput";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CustomButton from "../utils/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import { postRequest } from "../api/apiCalls";
import { ROUTING_PATHS, USER_ROLES } from "../utils/constants";
import { useDispatch } from "react-redux";
import { storeUserInfo } from "../redux/slices/userSlice";
import AuthForm from "../components/AuthForm";

const SignUp = () => {
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState(USER_ROLES[1].role);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (email && password && name && confirmPassword && userId && role) {
      setIsError(false);
      return;
    }
  }, [email, password, name, confirmPassword, userId, role]);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!email || !password || !name || !confirmPassword || !userId || !role) {
      setIsError(true);
      setError("All fields are required");
      return;
    }
    const userDetails = {
      name,
      email,
      user_id: userId,
      role,
      password,
      confirm_password: confirmPassword,
    };
    setLoading(true);
    const data = await postRequest({
      setIsError,
      setError,
      details: userDetails,
      apiUrl: "shop-admin/register",
      path: ROUTING_PATHS.signup,
    });
    if (data?.status) {
      dispatch(storeUserInfo(data?.data?.userDetails));
      navigate("/verify-otp");
    }
    setLoading(false);
  };
  return (
    <div className="flex flex-col md:flex-row h-full">
      <div
        className={`w-full md:w-1/2 h-1/2 md:h-full bg-cover bg-center absolute top-0 bottom-0 md:relative flex flex-col justify-center z-0 left-0 right-0`}
      >
        <img
          src={bgImage}
          alt="bg_image"
          className="lg:h-screen animate-pulse"
        />
      </div>
      <div className="flex flex-col justify-center px-6 py-12 lg:px-8 w-full lg:w-1/2 z-20">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="md:mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign Up to your account
          </h2>
          <div
            className={` sm:mx-auto sm:w-full sm:max-w-sm ${
              isError ? "mt-2 sm:mt-10" : "mt-10"
            }`}
          >
            <AuthForm
              confirmPassword={confirmPassword}
              email={email}
              isError={isError}
              loading={loading}
              name={name}
              password={password}
              role={role}
              setConfirmPassword={setConfirmPassword}
              setEmail={setEmail}
              setName={setName}
              setPassword={setPassword}
              setRole={setRole}
              setIsError={setIsError}
              handleForm={handleSignUp}
              error={error}
              setUserId={setUserId}
              setShowConfirmPassword={setShowConfirmPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              showPassword={showPassword}
              userId={userId}
            />

            <p
              className={` text-center text-sm text-gray-500 ${
                isError ? "mt-0" : "mt-10"
              }`}
            >
              Not a member?
              <Link
                to="/sign-in"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-1"
              >
                Login Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

import bgImage from "../assets/bgImage.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { postRequest } from "../api/apiCalls";
import { storeUserInfo } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import AuthForm from "../components/forms/AuthForm";
import { ROUTING_PATHS } from "../utils/constants";

const SignIn = () => {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (email && password) {
      setIsError(false);
      return;
    }
  }, [email, password]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setIsError(true);
      setError("All fields are required");
      return;
    }
    const userDetails = {
      email,
      password,
    };
    setLoading(true);
    const res = await postRequest({
      setIsError,
      setError,
      details: userDetails,
      apiUrl: "shop-admin/login",
    });
    if (res?.status) {
      if (res?.data?.userDetails?.verified) {
        dispatch(storeUserInfo(res?.data?.userDetails));
        navigate("/");
      } else {
        dispatch(storeUserInfo(res?.data?.userDetails));
        navigate("/verify-otp");
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div
        className={`w-full md:w-1/2 h-1/2 md:h-full bg-cover bg-center absolute top-0 bottom-0 md:relative flex flex-col justify-center z-0 left-0 right-0`}
      >
        <img src={bgImage} alt="bg_image" className="animate-pulse" />
      </div>
      <div className="flex flex-col justify-center px-6 py-12 lg:px-8 w-full lg:w-1/2 z-20">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="md:mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign In to your account
          </h2>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <AuthForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              error={error}
              isError={isError}
              loading={loading}
              handleForm={handleSignIn}
              setIsError={setIsError}
            />
            <p className="mt-10 text-center text-sm text-gray-500">
              Aleready have an account?
              <Link
                to={ROUTING_PATHS.signup}
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-1"
              >
                Register Here
              </Link>
            </p>
            <p className="mt-2 text-center text-sm text-gray-500">
              Didn't Remember Your Password?
              <Link
                to={ROUTING_PATHS.forgetpassword}
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-1"
              >
                Forget Password
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

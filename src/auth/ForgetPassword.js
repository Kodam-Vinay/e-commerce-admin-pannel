import bgImage from "../assets/bgImage.png";
import { useEffect, useRef, useState } from "react";
import CustomButton from "../utils/CustomButton";
import { postRequest } from "../api/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { storeUserInfo } from "../redux/slices/userSlice";
import {
  FORGET_FORM_CONSTANTS,
  ROUTING_PATHS,
  storeToastError,
  storeToastSuccess,
} from "../utils/constants";
import CustomInput from "../utils/CustomInput";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { togglePasswordState } from "../redux/slices/forgetPasswordSlice";

const ForgetPassword = () => {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([null, null, null, null]);
  const joinOtp = otp.join("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetails = useSelector(
    (store) => store?.persistSliceReducer?.user?.userInfo
  );
  const passwordState = useSelector(
    (store) => store?.forgetPassword?.passwordState
  );

  useEffect(() => {
    if (joinOtp.length === 4) {
      setIsError(false);
    }
  }, [joinOtp]);

  useEffect(() => {
    dispatch(togglePasswordState(FORGET_FORM_CONSTANTS.initial));
  }, []);

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    if (joinOtp?.length < 4) {
      setIsError(true);
      setError("Please enter 4 digit OTP");
    }
    setLoading(true);
    const details = {
      user_id: userDetails?.id,
      otp: joinOtp,
    };
    const res = await postRequest({
      setIsError,
      setError,
      details,
      apiUrl: "shop-admin/verify-forget-password-otp",
    });
    if (res?.status) {
      storeToastSuccess({ successMessage: res?.message });
      dispatch(storeUserInfo(res?.data?.userDetails));
      dispatch(togglePasswordState(FORGET_FORM_CONSTANTS.otpVerified));
    } else {
      storeToastError({ errorMessage: res?.message ? res?.message : error });
    }
    setLoading(false);
  };

  const handleBackspace = (event, index) => {
    if (event.key === "Backspace" && index > 0 && otp[index] === "") {
      const newOTP = [...otp];
      newOTP[index - 1] = "";
      setOtp(newOTP);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtp = (event, index) => {
    const { value } = event.target;

    if (value.length === 1 && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);
  };

  const handleonSubmitEmail = async (e) => {
    if (!email) {
      setIsError(true);
      setError("Email is Required");
    }
    e.preventDefault();
    setLoading(true);
    const res = await postRequest({
      setIsError,
      setError,
      details: { email },
      apiUrl: "shop-admin/forget-password",
    });
    if (res?.status) {
      dispatch(storeUserInfo(res?.data?.userDetails));
      dispatch(togglePasswordState(FORGET_FORM_CONSTANTS.otpSend));
      storeToastSuccess({ successMessage: res?.message });
    } else {
      storeToastError({ errorMessage: res?.message ? res?.message : error });
    }
    setLoading(false);
  };

  const handleOnUpdatePassword = async (e) => {
    e.preventDefault();
    const res = await postRequest({
      setIsError,
      setError,
      details: {
        user_id: userDetails?.id,
        password,
        confirm_password: confirmPassword,
      },
      apiUrl: "shop-admin/update-password",
    });
    if (res?.status) {
      storeToastSuccess({ successMessage: res?.message });
      dispatch(togglePasswordState(FORGET_FORM_CONSTANTS.success));
      dispatch(storeUserInfo({}));
    } else {
      storeToastError({ errorMessage: res?.message ? res?.message : error });
    }
  };

  const renderEmailForm = () => {
    return (
      <form className="w-full self-center" onSubmit={handleonSubmitEmail}>
        <CustomInput
          containerClassName="mx-auto"
          label={"Email address"}
          className="w-full"
          type={"email"}
          error={isError && !email && "Email is required"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <CustomButton
          loading={loading}
          label="Submit"
          type={"submit"}
          className={"text-xs mt-4 w-full max-w-96 h-10"}
        />
        <CustomButton
          onClick={() => navigate(ROUTING_PATHS.signin)}
          label="Back"
          type={"button"}
          className={"text-xs mt-4 w-full max-w-96 h-10"}
        />
      </form>
    );
  };

  const renderOtpForm = () => {
    return (
      <form onSubmit={handleSubmitOtp}>
        <div className="flex w-full items-center justify-center mt-auto space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="tel"
              maxLength={1}
              value={digit}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleOtp(e, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              className={`w-8 h-8 text-center text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
                isError ? "border-red-500" : "border-gray-300"
              } `}
            />
          ))}
        </div>

        <CustomButton
          loading={loading}
          label="Submit"
          type={"submit"}
          className={"text-xs mt-10 w-full max-w-96 h-10"}
        />
        <CustomButton
          onClick={() => navigate(ROUTING_PATHS.signin)}
          label="Back"
          type={"button"}
          className={"text-xs mt-4 w-full max-w-96 h-10"}
        />
      </form>
    );
  };

  const renderUpdatePasswordForm = () => {
    return (
      <form className="w-full self-center" onSubmit={handleOnUpdatePassword}>
        <div className={`flex flex-col max-w-96`}>
          <CustomInput
            containerClassName={`w-full mx-auto`}
            label={"Password"}
            className="w-full"
            type={showPassword ? "text" : "password"}
            icon={showPassword ? <FaEyeSlash /> : <FaEye />}
            error={isError && !password && "Pasword is required"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            togglerIcon={() => setShowPassword(!showPassword)}
            required
          />

          <CustomInput
            containerClassName={`w-full mx-auto`}
            label={"Confirm Password"}
            className="w-full"
            type={showConfirmPassword ? "text" : "password"}
            icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            error={isError && !confirmPassword && "Confirm Pasword is required"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            togglerIcon={() => setShowConfirmPassword(!showConfirmPassword)}
            required
          />
          <CustomButton
            loading={loading}
            label="Submit"
            type={"submit"}
            className={"text-xs mt-4 w-full max-w-96 h-10"}
          />
        </div>
      </form>
    );
  };

  const renderSuccessForm = () => {
    return (
      <div className="w-full">
        <p className="text-lg text-center">
          Password updated successfully, Now You Can Login
        </p>
        <CustomButton
          onClick={() => navigate(ROUTING_PATHS.signin)}
          label="Back"
          type={"button"}
          className={"text-xs mt-4 w-full max-w-96 h-10"}
        />
      </div>
    );
  };

  const renderUi = () => {
    switch (passwordState) {
      case FORGET_FORM_CONSTANTS.otpSend:
        return renderOtpForm();
      case FORGET_FORM_CONSTANTS.otpVerified:
        return renderUpdatePasswordForm();
      case FORGET_FORM_CONSTANTS.success:
        return renderSuccessForm();
      default:
        return renderEmailForm();
    }
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
            Forget Password
          </h2>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            {renderUi()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;

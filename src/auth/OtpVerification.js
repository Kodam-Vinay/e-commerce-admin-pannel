import bgImage from "../assets/bgImage.png";
import { useEffect, useRef, useState } from "react";
import CustomButton from "../utils/CustomButton";
import { postRequest } from "../api/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { storeUserInfo } from "../redux/slices/userSlice";
import { storeToastError, storeToastSuccess } from "../utils/constants";

const OtpVerification = () => {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([null, null, null, null]);
  const joinOtp = otp.join("");
  const userDetails = useSelector(
    (store) => store?.persistSliceReducer?.user?.userInfo
  );
  const [isSendOtpClicked, setIsSendOtpClicked] = useState(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (joinOtp.length === 4) {
      setIsError(false);
    }
  }, [joinOtp]);

  useEffect(() => {}, [isSendOtpClicked, isSubmitClicked]);

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    setIsSubmitClicked(true);
    setIsSendOtpClicked(false);
    if (joinOtp?.length < 4) {
      setIsError(true);
      setError("Please enter 4 digit OTP");
    }
    setLoading(true);
    const details = {
      user_id: userDetails?.id,
      otp: joinOtp,
    };
    const data = await postRequest({
      setIsError,
      setError,
      details,
      apiUrl: "shop-admin/verify-otp",
    });
    if (data?.status) {
      dispatch(storeUserInfo(data?.data?.userDetails));
      navigate("/");
    }
    setLoading(false);
  };

  const handleSendOtp = async () => {
    setLoading(true);
    setOtp(["", "", "", ""]);
    const details = {
      user_id: userDetails?.id,
    };
    const data = await postRequest({
      setIsError,
      setError,
      details,
      apiUrl: "shop-admin/send-otp",
    });
    if (data?.status) {
      // dispatch(storeUserInfo(data?.data?.userDetails));
      storeToastSuccess({ successMessage: data?.message });
    } else {
      storeToastError({ errorMessage: data?.message });
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

  return (
    <div className="flex flex-col md:flex-row h-full items-center">
      <div
        className={`w-full md:w-1/2 h-1/2 md:h-full bg-cover bg-center absolute top-0 bottom-0 md:relative flex flex-col justify-center z-0`}
      >
        <img
          src={bgImage}
          alt="bg_image"
          className="lg:h-screen animate-pulse"
        />
      </div>
      <div className="flex max-w-96 flex-1 flex-col justify-center px-6 py-12 lg:px-8 lg:w-1/2 z-20">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="md:mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Verify Your Account
          </h2>
          <h2 className="text-center text-xs sm:text-sm md:text-md font-bold leading-9 tracking-tight text-gray-900">
            Please Enter Otp
          </h2>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
              <div className="mt-14 flex items-center space-x-3">
                <CustomButton
                  loading={isSubmitClicked && loading}
                  onClick={() => {
                    setIsSubmitClicked(true);
                    setIsSendOtpClicked(false);
                  }}
                  label="Submit"
                  type={"submit"}
                  className={"text-xs w-full max-w-96 h-10"}
                />
                <CustomButton
                  loading={isSendOtpClicked && loading}
                  label="Send Otp"
                  type={"button"}
                  className={"text-xs w-full max-w-96 h-10"}
                  onClick={() => {
                    handleSendOtp();
                    setIsSubmitClicked(false);
                    setIsSendOtpClicked(true);
                  }}
                />
              </div>
              <p className="text-red-400 mt-1">{isError && error}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;

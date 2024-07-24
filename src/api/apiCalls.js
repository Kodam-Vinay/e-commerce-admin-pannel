import { API_URL, ROUTING_PATHS } from "../utils/constants";

export const postRequest = async ({
  setIsError,
  setError,
  details,
  apiUrl,
  token,
  path,
}) => {
  try {
    const options = {
      method: "POST",
      headers:
        path === ROUTING_PATHS.signup
          ? {
              "Content-Type": "application/json",
            }
          : {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
      body: JSON.stringify(details),
    };

    const response = await fetch(API_URL + apiUrl, options);
    const data = await response.json();
    if (response.ok && data?.status) {
      setIsError(false);
    } else {
      setIsError(true);
      setError(data?.message);
    }
    return data;
  } catch (error) {
    setIsError(true);
    setError(error.message);
  }
};

export const getRequest = async ({ setIsError, setError, apiUrl, token }) => {
  try {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(API_URL + apiUrl, options);
    const data = await response.json();
    if (response.ok && data?.status) {
      setIsError(false);
    } else {
      setIsError(true);
      setError(data?.message);
    }
    return data;
  } catch (error) {
    setIsError(true);
    setError(error.message);
  }
};

export const deleteRequest = async ({
  setIsError,
  setError,
  apiUrl,
  token,
  details,
}) => {
  try {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(details),
    };
    const response = await fetch(API_URL + apiUrl, options);
    const data = await response.json();
    if (response?.ok && data?.status) {
      setIsError(false);
    } else {
      setIsError(true);
      setError(data?.message);
    }
    return data;
  } catch (error) {
    setIsError(true);
    setError(error.message);
  }
};

import { useEffect, useState } from "react";

const useDeviceOnline = () => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const checkOnline = () => {
      setIsOnline(true);
    };
    const checkOffline = () => {
      setIsOnline(false);
    };
    window.addEventListener("online", checkOnline);
    window.addEventListener("offline", checkOffline);
    return () => {
      window.removeEventListener("online", checkOnline);
      window.removeEventListener("offline", checkOffline);
    };
  });
  return isOnline;
};

export default useDeviceOnline;

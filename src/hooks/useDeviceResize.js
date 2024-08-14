import { useEffect, useState, useCallback } from "react";

const useDeviceResize = () => {
  const [size, setSize] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const changeDisplayHeightAndWidth = useCallback(() => {
    const debounce = (func, delay) => {
      let timeout;
      return (...args) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          func(...args);
        }, delay);
      };
    };

    debounce(() => {
      setSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }, 300)();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", changeDisplayHeightAndWidth);
    return () => {
      window.removeEventListener("resize", changeDisplayHeightAndWidth);
    };
  }, [changeDisplayHeightAndWidth]);

  return size;
};

export default useDeviceResize;

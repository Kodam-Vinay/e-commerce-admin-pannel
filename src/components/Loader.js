import React from "react";
import { Rings } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <Rings
        visible={true}
        height="80"
        width="80"
        color="#1976d3"
        ariaLabel="rings-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default Loader;

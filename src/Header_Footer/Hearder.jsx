import React from "react";
import logo from "../assets/logo.png";

const Hearder = () => {
  return (
    <div className="w-full bg-white">
      <header className="fixed top-0 p-4 flex left-0 z-50 w-full bg-white text-white py-2 border-b border-gray-200">
        <img src={logo} alt="logo" className="w-14 h-14" />
        <span className="mt-2 ml-2 text-black text-3xl font-bold">
          Voucher4U
        </span>
      </header>
    </div>
  );
};

export default Hearder;

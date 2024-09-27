import React from "react";
import logo from "../assets/logo.png";

const Hearder = () => {
  return (
    <div className="w-full bg-white">
      <header className="fixed h-20 items-center top-0 p-4 flex left-0 z-50 w-full bg-[#2F4F4F] text-[#eaf9e7] py-2">
        <img src={logo} alt="logo" className="w-14 h-14 rounded-full" />
        <span className="ml-2 text-3xl font-bold">Voucher4U</span>
      </header>
    </div>
  );
};

export default Hearder;

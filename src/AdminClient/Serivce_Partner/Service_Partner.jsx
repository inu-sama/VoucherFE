import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore, faHandshake } from "@fortawesome/free-solid-svg-icons";
import Service from "./Service";
import Partner from "./Partner";

const Service_Partner = () => {
  const [selected, setSelected] = useState("Service");
  const handleClick = (value) => {
    setSelected(value);
  };
  return (
    <div className="w-full min-h-[90vh]">
      <h1 className=" text-4xl text-[#2F4F4F] my-4 w-full text-center font-bold">
        Quản lí người dùng
      </h1>
      <div className="grid grid-cols-2 w-full gap-10 h-fit mt-6 font-bold justify-center bg-[#4ca771] text">
        <span
          onClick={() => handleClick("Service")}
          className={`cursor-pointer text-2xl py-2 px-4 text-center ${
            selected === "Service"
              ? "bg-[#eaf9e7] text-[#4ca771]"
              : "text-[#eaf9e7]"
          }`}
        >
          <FontAwesomeIcon icon={faHandshake} /> Service
        </span>
        <span
          onClick={() => handleClick("Partner")}
          className={`py-2 px-4 text-2xl cursor-pointer text-center ${
            selected === "Partner"
              ? "bg-[#eaf9e7] text-[#4ca771]"
              : "text-[#eaf9e7]"
          }`}
        >
          <FontAwesomeIcon icon={faStore} /> Partner
        </span>
      </div>
      <div className=" w-full p-4">
        {selected === "Service" && <Service />}
        {selected === "Partner" && <Partner />}
      </div>
    </div>
  );
};

export default Service_Partner;

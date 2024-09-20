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
    <div className="w-full ">
      <h1 className=" text-3xl my-4 w-full text-center font-bold">
        Thư mục quản lí người dùng
      </h1>
      <div className="flex w-full h-fit border mt-6 font-bold p-4 justify-center bg-white">
        <span
          onClick={() => handleClick("Service")}
          className={`cursor-pointer text-2xl px-2 ${
            selected === "Service"
              ? "border-b-2 border-[#0094F3] text-[#0094F3]"
              : "text-gray-500"
          }`}
        >
          <FontAwesomeIcon icon={faHandshake} /> Service
        </span>
        <span
          onClick={() => handleClick("Partner")}
          className={`mx-9 px-2 text-2xl cursor-pointer ${
            selected === "Partner"
              ? "border-b-2 border-[#0094F3] text-[#0094F3]"
              : "text-gray-500"
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

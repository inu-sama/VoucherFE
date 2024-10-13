import React from "react";
import Nav from "../Header_Footer/Nav";
import Statistical from "./DashBoard/Statistical";

const MainHomeAdmin = () => {
  return (
    <div className="w-full">
      <h1 className=" text-3xl my-4 w-full text-center font-bold">
        <Statistical />
      </h1>
    </div>
  );
};

export default MainHomeAdmin;

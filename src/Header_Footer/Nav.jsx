import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faFlag,
  faTicket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Nav = () => {
  return (
    <div className="sticky top-0 bg-[#4ca771] text-[#eaf9e7] w-full lg:h-full p-0 m-0">
      <h1 className="font-extrabold text-xl text-center pt-8 pb-10">
        DANH MỤC QUẢN LÝ
      </h1>
      <div className="p-4">
        <ul className="flex lg:block items-center justify-between">
          <Link
            to="ChartVoucher"
            className="w-full route text-lg lg:text-xl font-extrabold">
            <li className="w-full lg:hover:px-5 py-2 hover:bg-[#eaf9e7] hover:text-[#4ca771] text-center lg:text-left rounded-full mb-4">
              <FontAwesomeIcon icon={faChartLine} /> DashBoard
            </li>
          </Link>
          <Link
            to="Listvoucher"
            className="w-full route text-lg lg:text-xl font-extrabold">
            <li className="w-full lg:hover:px-5 py-2 l hover:bg-[#eaf9e7] hover:text-[#4ca771] text-center lg:text-left rounded-full mb-4">
              <FontAwesomeIcon icon={faTicket} /> Voucher
            </li>
          </Link>
          <Link
            to="ServicePartner"
            className="w-full route text-lg lg:text-xl font-extrabold">
            <li className="w-full lg:hover:px-5 line-clamp-1  py-[0.4rem] hover:bg-[#eaf9e7] hover:text-[#4ca771] text-center lg:text-left rounded-full mb-4">
              <FontAwesomeIcon icon={faUser} /> Service-Partner
            </li>
          </Link>
          <Link
            to="ListReport"
            className="w-full route text-lg lg:text-xl font-extrabold">
            <li className="w-full lg:hover:px-5 line-clamp-1  py-[0.4rem] hover:bg-[#eaf9e7] hover:text-[#4ca771] text-center lg:text-left rounded-full mb-4">
              <FontAwesomeIcon icon={faFlag} /> List Report
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Nav;

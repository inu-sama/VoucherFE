import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
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
        <ul className="flex lg:block items-center">
          <li className="w-full lg:hover:px-5 py-2 hover:bg-[#eaf9e7] hover:text-[#4ca771] text-center lg:text-left rounded-full mb-4">
            <Link to="ChartVoucher" className="route text-lg lg:text-xl font-extrabold">
              <FontAwesomeIcon icon={faChartLine} /> DashBoard
            </Link>
          </li>
          <li className="w-full lg:hover:px-5 py-2 hover:bg-[#eaf9e7] hover:text-[#4ca771] text-center lg:text-left rounded-full mb-4">
            <Link
              to="Listvoucher"
              className="route text-lg lg:text-xl font-extrabold"
            >
              <FontAwesomeIcon icon={faTicket} /> Voucher
            </Link>
          </li>
          <li className="w-full lg:hover:px-5 py-2 hover:bg-[#eaf9e7] hover:text-[#4ca771] text-center lg:text-left rounded-full mb-4">
            <Link
              to="ServicePartner"
              className="route text-lg lg:text-xl font-extrabold"
            >
              <FontAwesomeIcon icon={faUser} /> Service_Partner
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Nav;

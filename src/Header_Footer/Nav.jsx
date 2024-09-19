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
    <div className="bg-custom-gradient bg-green-300 w-1/4 p-0 m-0">
      <h1 className="font-extrabold text-black text-center pt-4">
        DANH MỤC QUẢN LÝ
      </h1>
      <div className="p-4">
        <ul>
          <li>
            <a
              href="/"
              className="route text-black text-xl font-extrabold hover:text-black"
            >
              <FontAwesomeIcon icon={faChartLine} /> DashBoard
            </a>
          </li>
          <li className="mt-4">
            <a
              href="/Listvoucher"
              className="route text-black text-xl font-extrabold hover:text-black"
            >
              <FontAwesomeIcon icon={faTicket} /> Voucher
            </a>
          </li>
          <li className="mt-4">
            <a
              href="/ServicePartner"
              className="route text-black text-xl font-extrabold hover:text-black"
            >
              <FontAwesomeIcon icon={faUser} /> Service_Partner
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Nav;

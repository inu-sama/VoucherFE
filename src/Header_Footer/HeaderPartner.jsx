import React, { useContext } from "react";
import { AuthContext } from "../Router/ProtectedRoute";
import logo from "../assets/logo-2da.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    const callback = localStorage.getItem("URLCallBack");
    if (callback) {
      window.location.href = callback;
      logout();
    } else {
      console.error("Callback URL not found");
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="w-full bg-white">
      <header className="fixed h-20 items-center top-0 p-4 flex left-0 z-50 w-full bg-gradient-to-bl to-[#3775a2] from-10% from-[#ffffff] text-[#eaf9e7] py-2">
        <img src={logo} alt="logo" className="w-14 h-14 rounded-full" />
        <span className="ml-2 text-3xl font-bold">VOUCHER4U</span>
        <div className="flex items-center ml-auto">
          <button
            className="bg-[#3775a2] hover:bg-[#e7f2f9] font-bold text-lg text-[#e7f2f9] hover:text-[#3775a2] border-2 border-[#3775a2] p-2 rounded-lg w-fit h-fit flex items-center justify-center"
            onClick={handleLogout}
          >
            <FontAwesomeIcon className="mr-2" icon={faRightFromBracket} /> Đăng
            xuất
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;

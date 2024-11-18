import { useContext } from "react";
import logo from "../assets/logo-2da.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../Router/ProtectedRoute";
import { useNavigate } from "react-router-dom";

const Hearder = () => {
  const { user, logout } = useContext(AuthContext);
  const OrderID = localStorage.getItem("OrderID");
  const navigate = useNavigate();

  const handleLogout = () => {
    window.location.href = `https://wowo.htilssu.id.vn/order/${OrderID}`;
    logout();
  };

  return (
    <div className="w-full bg-white">
      <header className="h-20 items-center top-0 p-4 flex left-0 z-50 w-full py-2">
        <img src={logo} alt="logo" className="w-14 h-14 rounded-full" />
        <span className="ml-2 text-3xl font-bold text-[#213a57]">
          VOUCHER4U
        </span>
        <div className="flex items-center ml-auto">
          <button
            className="font-bold text-3xl bg-gradient-to-r from-[#80ed99] to-[#0ad1c8] text-white hover:bg-clip-text hover:text-[#0ad1c8] p-2 rounded-full w-fit h-fit flex items-center justify-center"
            onClick={handleLogout}
          >
            <FontAwesomeIcon className="" icon={faCircleArrowLeft} />
          </button>
        </div>
      </header>
    </div>
  );
};

export default Hearder;

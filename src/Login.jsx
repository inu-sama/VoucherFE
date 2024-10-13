import { faEarthAsia } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const handelLogin = async () => {};

  return (
    <div
      className="flex items-center justify-center w-full h-screen bg-cover
    bg-[url('https://images2.alphacoders.com/108/1081121.png')]"
    >
      <div
        className="w-full lg:w-1/3 lg:h-2/3 bg-white bg-opacity-30 backdrop-blur-md rounded-3xl text-[#2F4F4F] overflow-hidden shadow-xl shadow-[#2F4F4F]"
        id="loginForm"
      >
        {/* <div className="w-full bg-[url('')] bg-cover"></div> */}
        <div className="w-full p-6">
          <p className="w-full text-4xl font-bold text-center mb-10">
            Login to your account
          </p>
          <div className="w-full rounded-3xl text-xl mb-4">
            <p className="w-full px-4 pt-2 rounded-full font-semibold">
              Can we have your Username?
            </p>
            <input
              type="text"
              className="w-full rounded-full py-2 px-4 bg-transparent outline-none border-b-4 border-[#2F4F4F] placeholder:text-[#eaf9e7]"
              name=""
              id=""
              placeholder="Username"
              required
            />
          </div>
          <div className="w-full rounded-3xl text-xl">
            <p className="w-full px-4 pt-2 rounded-full font-semibold">
              And your Password?
            </p>
            <input
              type="text"
              className="w-full rounded-full py-2 px-4 bg-transparent outline-none border-b-4 border-[#2F4F4F] placeholder:text-[#eaf9e7]"
              name=""
              id=""
              placeholder="Password"
              required
            />
          </div>
          <p className="w-full text-right mt-1 cursor-pointer hover:text-[#eaf9e7]">
            Forgot your password?
          </p>
          <div className="grid grid-cols-12 my-4">
            <div className="col-span-5 flex items-center">
              <div className="border border-[#2F4F4F] w-full"></div>
            </div>
            <div className="col-span-2 text-center text-lg">or</div>
            <div className="col-span-5 flex items-center">
              <div className="border border-[#2F4F4F] w-full"></div>
            </div>
          </div>
          <div className="w-full flex items-center text-3xl justify-center mb-6">
            <div className="w-fit grid grid-row-2 hover:text-[#eaf9e7] cursor-pointer">
              <div className="flex justify-center">
                <FontAwesomeIcon icon={faEarthAsia} className="" />
              </div>
              <span className="text-base">Oggy Login System</span>
            </div>
          </div>
          <div
            to="/CreateVoucher"
            className="w-full text-center text-xl py-3 font-bold cursor-pointer border-2 border-[#2F4F4F] hover:bg-[#2F4F4F] hover:text-white rounded-xl"
          >
            Login
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

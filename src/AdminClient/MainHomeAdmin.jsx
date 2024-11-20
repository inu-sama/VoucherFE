import { Outlet } from "react-router-dom";
import Nav from "../Header_Footer/Nav.jsx";
import Header from "../Header_Footer/Hearder.jsx";

const MainHomeAdmin = () => {
  return (
    <div className="mx-auto lg:pb-0 pb-16 items-center">
      <Header className="w-full" />
      <div className="grid grid-cols-12 gap-0 w-full pt-20 bg-[#eaf9e7] min-h-screen">
        <div className="col-span-12 lg:col-span-3">
          <Nav />
        </div>
        <div className="col-span-12 lg:col-span-9 min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainHomeAdmin;

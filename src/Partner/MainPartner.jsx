import { Outlet } from "react-router-dom";
import Nav from "../Header_Footer/NavPartner.jsx";
import Header from "../Header_Footer/HeaderPartner.jsx";
import Footer from "../Header_Footer/Footer.jsx";

const MainParter = () => {
  return (
    <div className="mx-auto items-center">
      <Header className="w-full" />
      <div className="grid grid-cols-12 gap-0 w-full pt-20 bg-[#eaf9e7] min-h-screen">
        <div className="col-span-12 lg:col-span-3">
          <Nav />
        </div>
        <div className="col-span-12 lg:col-span-9">
          <Outlet />
        </div>
      </div>
      <Footer className="w-full mt-6" />
    </div>
  );
};

export default MainParter;

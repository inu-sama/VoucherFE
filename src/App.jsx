import { Outlet } from "react-router-dom";
import Hearder from "./Header_Footer/Hearder.jsx";
import Nav from "./Header_Footer/Nav.jsx";

function App() {
  return (
    <div className="mx-auto items-center">
      <Hearder className="w-full" />
      <div className="grid grid-cols-12 gap-0 w-full pt-20 bg-[#eaf9e7] min-h-screen">
        <div className="col-span-12 lg:col-span-3">
          <Nav />
        </div>
        <div className="col-span-12 lg:col-span-9">
          <Outlet />
        </div>
        {/* <Nav className=" w-1/4" />
        <Outlet className="w-3/4" /> */}
      </div>
    </div>
  );
}

export default App;

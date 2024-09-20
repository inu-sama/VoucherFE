import { Outlet } from "react-router-dom";
import Hearder from "./Header_Footer/Hearder.jsx";
import Nav from "./Header_Footer/Nav.jsx";

function App() {
  return (
    <div className="container mx-auto flex flex-col items-center">
      <Hearder className="w-full" />
      <div className=" w-full mt-20 bg-slate-100 flex">
        <Nav className=" w-1/4" />
        <Outlet className="w-3/4" />
      </div>
    </div>
  );
}

export default App;

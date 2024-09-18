import { Outlet } from "react-router-dom";
import Hearder from "./Header_Footer/Hearder.jsx";
import Nav from "./Header_Footer/Nav.jsx";

function App() {
  return (
    <div className="container mx-auto flex flex-col items-center">
      <Hearder className="w-full" />
      <div className="flex w-full mt-20 bg-slate-100">
        <Nav />
        <Outlet className="w-full" />
      </div>
    </div>
  );
}

export default App;

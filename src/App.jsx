import { Outlet } from "react-router-dom";
import Hearder from "./Header_Footer/Hearder.jsx";
import Nav from "./Header_Footer/Nav.jsx";

function App() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default App;

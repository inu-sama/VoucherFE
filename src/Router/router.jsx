import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import ErrorPage from "./ErrorPage.jsx";
import MainHome from "../AdminClient/DashBoard.jsx";
import CreateVoucher from "../AdminClient/Voucher/CreateVoucher.jsx";
import ListVoucher from "../AdminClient/Voucher/ListVoucher.jsx";
import EditVoucher from "../AdminClient/Voucher/EditVoucher.jsx";
import DetailVoucher from "../AdminClient/Voucher/DetailVoucher.jsx";
import Service_Partner from "../AdminClient/Serivce_Partner/Service_Partner.jsx";
import GetListVoucher from "../Customer/getListVoucher.jsx";
import Login from "../Login.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MainHome />,
      },
      {
        path: "Createvoucher",
        element: <CreateVoucher />,
      },
      {
        path: "Listvoucher",
        element: <ListVoucher />,
      },
      {
        path: "Editvoucher/:id",
        element: <EditVoucher />,
      },
      {
        path: "Detailvoucher/:id",
        element: <DetailVoucher />,
      },
      {
        path: "ServicePartner",
        element: <Service_Partner />,
      },
    ],
  },
  {
    path: "/ApplyVoucher",
    element: <GetListVoucher />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/Login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
]);

export default router;

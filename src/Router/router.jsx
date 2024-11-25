// router.jsx
import { createBrowserRouter, Outlet } from "react-router-dom";
import App from "../App.jsx";
import ErrorPage from "./ErrorPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AuthProvider from "./AuthProvider.jsx";
import CreateVoucher from "../AdminClient/Voucher/CreateVoucher.jsx";
import ListVoucher from "../AdminClient/Voucher/ListVoucher.jsx";
import EditVoucher from "../AdminClient/Voucher/EditVoucher.jsx";
import DetailVoucher from "../AdminClient/Voucher/DetailVoucher.jsx";
import Service_Partner from "../AdminClient/Serivce_Partner/Service_Partner.jsx";
import GetListVoucher from "../Customer/GetListVoucher.jsx";
import ListVoucherPN from "../Partner/ListVoucher.partner.jsx";
import DetailVoucherPN from "../Partner/DetailVoucher.partner.jsx";
import CreateVoucherPN from "../Partner/CreateVoucher.partner.jsx";
import EditVoucherPN from "../Partner/EditVoucher.partner.jsx";
import Login from "../Login.jsx";
import MainHomeAdmin from "../AdminClient/MainHomeAdmin.jsx";
import MainPartner from "../Partner/MainPartner.jsx";
import CollectPoint from "../Customer/CollectPoint/CollectPoint.jsx";
import ChartVoucher from "../AdminClient/DashBoard/ChartVoucher.jsx";
import DashBoardPartner from "../Partner/DashBoard.partner.jsx";
import DetailDashBoard from "../Partner/DetailDashBoard.partner.jsx";
import DetailDashBoardAD from "../AdminClient/DashBoard/DetailDashBoard.jsx";
import ListReport from "../AdminClient/Report/ListReport.jsx";
const AuthLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/Login",
        element: <Login />,
      },
      {
        path: "/Admin",
        element: (
          <ProtectedRoute role="Admin">
            <MainHomeAdmin />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "CreateVoucher",
            element: <CreateVoucher />,
          },
          {
            path: "ListVoucher",
            element: <ListVoucher />,
          },
          {
            path: "EditVoucher/:id",
            element: <EditVoucher />,
          },
          {
            path: "DetailVoucher/:id",
            element: <DetailVoucher />,
          },
          {
            path: "ServicePartner",
            element: <Service_Partner />,
          },
          {
            path: "ChartVoucher",
            element: <ChartVoucher />,
          },
          {
            path: "DetailDashBoard/:id/:month/:year",
            element: <DetailDashBoardAD />,
          },
          {
            path:"ListReport",
            element:<ListReport/>
          }
        ],
      },
      {
        path: "/",
        element: (
          <ProtectedRoute role="user">
            <GetListVoucher />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "/GetListVoucher",
            element: <GetListVoucher />,
          },
        ],
      },
      {
        path: "/Partner",
        element: (
          <ProtectedRoute role="partner">
            <MainPartner />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "ListVoucherPN",
            element: <ListVoucherPN />,
          },
          {
            path: "CreateVoucherPN",
            element: <CreateVoucherPN />,
          },
          {
            path: "EditVoucherPN/:id",
            element: <EditVoucherPN />,
          },
          {
            path: "DetailVoucherPN/:id",
            element: <DetailVoucherPN />,
          },
          {
            path: "DashBoardPartner",
            element: <DashBoardPartner />,
          },
          {
            path: "DetailDashBoard/:id/:month/:year",
            element: <DetailDashBoard />,
          },
          
        ],
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);

export default router;

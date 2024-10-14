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
import GetListVoucher from "../Customer/getListVoucher.jsx";
import Login from "../Login.jsx";
import MainHomeAdmin from "../AdminClient/MainHomeAdmin.jsx";

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
        ],
      },
      {
        path: "/",
        element: (
          <ProtectedRoute role="user">
            <App />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "/Home",
            element: <GetListVoucher />,
          },
        ],
      },
      {
        path: "/Partner",
        element: (
          <ProtectedRoute role="partner">
            <GetListVoucher />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "aaa",
            element: <GetListVoucher />,
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

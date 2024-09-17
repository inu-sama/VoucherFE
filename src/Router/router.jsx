import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import ErrorPage from "./ErrorPage.jsx"; // Import ErrorPage component

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />, // Use ErrorPage here
    children: [
      {
        index: true,
        element: <App />,
      },
    ],
  },
]);

export default router;

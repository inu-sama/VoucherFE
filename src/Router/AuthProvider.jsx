import React, { useEffect, useState, createContext, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const OrderID =
    searchParams.get("OrderID") || localStorage.getItem("OrderID");
  const token = searchParams.get("Token") || localStorage.getItem("Token");
  const callback =
    searchParams.get("URLCallBack") || localStorage.getItem("URLCallBack");

  useEffect(() => {
    const checkUserAuth = async () => {
      if (token) {
        try {
          const response = await fetch(
            "https://server-voucher.vercel.app/api/readtoken",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);

            if (OrderID) localStorage.setItem("OrderID", OrderID);
            if (callback) localStorage.setItem("URLCallBack", callback);
            if (token) localStorage.setItem("Token", token);
            if (userData.role) localStorage.setItem("Role", userData.role);

            navigateBasedOnRole(userData.role);
          } else {
            navigate("/Login");
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu người dùng:", error);
          navigate("/Login");
        } finally {
          setIsLoading(false);
        }
      } else {
        navigate("/Login");
        setIsLoading(false);
      }
    };

    checkUserAuth();
  }, [OrderID, token, callback, navigate, searchParams]);

  const navigateBasedOnRole = (role) => {
    const savedCallback = localStorage.getItem("URLCallBack") || "/null";
    const currentPath = window.location.pathname;

    switch (role) {
      case "Admin":
        if (currentPath === "/sso") {
          navigate("/Admin/ChartVoucher");
        } else {
          if (!currentPath.includes("/Admin")) {
            navigate("/Admin/ChartVoucher");
          } else {
            navigate(currentPath);
          }
        }
        break;
      case "user":
        if (currentPath === "/sso") {
          navigate("/");
        } else {
          if (
            currentPath.includes("/Partner") ||
            currentPath.includes("/Admin")
          ) {
            navigate("/");
          } else {
            navigate(currentPath);
          }
        }
        break;
      case "partner":
        if (currentPath === "/sso") {
          navigate("/Partner/DashBoardPartner");
        } else {
          if (!currentPath.includes("/Partner")) {
            navigate("/Partner/DashBoardPartner");
          } else {
            navigate(currentPath);
          }
        }
        break;
      default:
        navigate("/Login");
    }
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("Token", userData.token);
    localStorage.setItem("OrderID", OrderID);
    localStorage.setItem("URLCallBack", callback);
    localStorage.setItem("Role", userData.role);
    navigateBasedOnRole(userData.role);
  };

  const value = useMemo(() => ({ user, login }), [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

import React, { useEffect, useState, createContext, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token =
    searchParams.get("Token") || localStorage.getItem("accessToken");

  useEffect(() => {
    const checkUserAuth = async () => {
      setIsLoading(true); // Đặt lại trạng thái loading khi gọi hàm

      if (!token) {
        setIsLoading(false);
        return navigate("/Login");
      }

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

        if (!response.ok) throw new Error("Failed to fetch user data");

        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("accessToken", token);

        // Điều hướng dựa trên vai trò
        switch (userData.role) {
          case "Admin":
            navigate("/Admin");
            break;
          case "user":
            navigate("/");
            break;
          case "partner":
            navigate("/Partner");
            break;
          default:
            navigate("/Login");
            break;
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
        navigate("/Login");
      } finally {
        setIsLoading(false); // Đảm bảo luôn đặt trạng thái loading về false
      }
    };

    checkUserAuth();
  }, [navigate, token]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("accessToken", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    navigate("/Login");
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

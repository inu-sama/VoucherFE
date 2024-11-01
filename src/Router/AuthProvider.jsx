import React, { useEffect, useState, createContext, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("Token") || localStorage.getItem("Token");

  useEffect(() => {
    const checkUserAuth = async () => {
      setIsLoading(true);

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
        localStorage.setItem("Token", token);

        if (userData) {
          window.location.href =
            "https://voucher4u-fe.vercel.app/?Token=" + token;
        } else {
          window.location.href = "https://voucher4u-fe.vercel.app/Login";
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
        window.location.href = "https://voucher4u-fe.vercel.app/Login";
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAuth();
  }, [navigate, token]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("Token", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("Token");
    navigate("/Login");
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

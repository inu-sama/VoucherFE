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
          const userData = await response.json();

          if (response.ok) {
            setUser(userData);
            setIsLoading(false);
            localStorage.setItem("accessToken", token);

            if (userData.role === "Admin") {
              navigate("/Admin");
            } else if (userData.role === "user") {
              navigate("/");
            } else if (userData.role === "partner") {
              navigate("/Partner");
            } else {
              navigate("/Login");
            }
          } else {
            setIsLoading(false);
            navigate("/Login");
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu người dùng:", error);
          setIsLoading(false);
          navigate("/Login");
        }
      } else {
        setIsLoading(false);
        navigate("/Login");
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

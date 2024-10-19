import React, { useEffect, useState, createContext, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  const token =
    searchParams.get("Token") ||
    localStorage.getItem("accessToken") ||
    getCookie("Token");

  if (token) {
    setCookie("Token", token, 1);
  }

  useEffect(() => {
    const checkUserAuth = async () => {
      if (token) {
        try {
          const response = await fetch(
            "https://servervoucher.vercel.app/api/readtoken",
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

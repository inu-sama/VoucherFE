import React, { useEffect, useState, createContext, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("Token") || localStorage.getItem("Token");
  const callback = searchParams.get("URLCallBack");

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
            localStorage.setItem("Token", token);
            localStorage.setItem("callback", callback);
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
  }, [navigate, token, callback]);

  const navigateBasedOnRole = (role) => {
    switch (role) {
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
    }
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("Token", userData.token);
    navigateBasedOnRole(userData.role);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("Token");
    localStorage.removeItem("callback");
    navigate("/Login");
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

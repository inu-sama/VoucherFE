import { createContext, useState } from "react";

export const AuthContext = createContext();

const ProtectedRouter = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("Token", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("Token");
    localStorage.removeItem("OrderID");
    localStorage.removeItem("Role");
    localStorage.removeItem("URLCallBack");
    localStorage.removeItem("URLCallBack");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default ProtectedRouter;

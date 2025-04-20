import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("authToken", token);
    const decoded = jwtDecode(token);
    setCurrentUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
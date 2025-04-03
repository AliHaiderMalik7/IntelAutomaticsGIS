import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/Auth/LoginForm";

const AppRouter: React.FC = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const updateToken = (newToken: string | null) => {
    setToken(newToken);
  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token") {
        setToken(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={token ? <HomePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={
            !token ? (
              <LoginPage updateToken={updateToken} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;

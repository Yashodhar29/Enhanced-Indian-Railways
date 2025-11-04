import { Navigate, useLocation } from "react-router-dom";
import { ReactNode, useState, useEffect } from "react";
import axios from "axios";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (token) {
      axios
        .get("https://improved-b-form-backend.onrender.com/api/get-user-and-role", {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response)
          setUserRole(response.data.role);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  if (loading) {
    return <div>Loading...</div>; // show spinner or placeholder
  }

  // 🚨 Role-based restriction
  if (location.pathname === "/users" && userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

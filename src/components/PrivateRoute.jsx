import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Layout from "./Layout";

const PrivateRoute = ({ children, hideSidebar = false }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout hideSidebar={hideSidebar}>{children}</Layout>
  );
};

export default PrivateRoute;

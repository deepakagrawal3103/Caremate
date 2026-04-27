import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Layout from "./Layout";

const PrivateRoute = ({ children, hideSidebar = false }) => {
  const { isAuthenticated, loading } = useAuth();

  // Temporarily disabled authentication check for direct access
  /*
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  */

  return (
    <Layout hideSidebar={hideSidebar}>{children}</Layout>
  );
};

export default PrivateRoute;

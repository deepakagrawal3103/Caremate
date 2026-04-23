import Layout from "./Layout";

const PrivateRoute = ({ children, hideSidebar = false }) => {
  return (
    <Layout hideSidebar={hideSidebar}>{children}</Layout>
  );
};

export default PrivateRoute;

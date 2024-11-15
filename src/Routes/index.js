import { Fragment } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import Home from "../Pages/Home";
import Signin from "../Pages/Signin";
import Signup from "../Pages/Signup";

const PrivateRoute = ({ element: Component }) => {
  const { signed } = useAuth();

  return signed ? <Component /> : <Navigate to="/" />;
};

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Fragment>
        <Routes>
          <Route path="/home" element={<PrivateRoute element={Home} />} />
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
};

export default RoutesApp;
import { Fragment } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import Signin from "../Pages/Signin";
import Signup from "../Pages/Signup";
import Main from "../BooksSearch/Main";

// Verifica a autenticação e redireciona se necessário.
const PrivateRoute = ({ element: Component }) => {
  const { signed } = useAuth();

  return signed ? <Component /> : <Navigate to="/" />;
};

const RoutesApp = () => {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/" element={<PrivateRoute element={Main} />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Fragment>
  );
};

export default RoutesApp;

import { Fragment } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import Signin from "../Pages/Signin";
import Signup from "../Pages/Signup";
import Main from "../BooksSearch/Main";
import SavedBooks from "../Pages/SavedBooks"; // Importe a nova página

// Verifica a autenticação e redireciona se necessário.
const PrivateRoute = ({ element: Component }) => {
  const { user } = useAuth();
  return user ? <Component /> : <Navigate to="/signin" />;
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
        <Route path="/saved-books" element={<PrivateRoute element={SavedBooks} />} />
      </Routes>
    </Fragment>
  );
};

export default RoutesApp;
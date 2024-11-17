import { useContext } from "react";
import { AuthContext } from "../Authentication/auth";

//Hook personalizado para autenticação
const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};

export default useAuth;

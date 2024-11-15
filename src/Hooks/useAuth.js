import { useContext } from "react";
import { AuthContext } from "../Authentication/auth";

const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};

export default useAuth;

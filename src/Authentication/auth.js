import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Função para realizar login
  const signin = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/auth/login", { email, password });
      const { token } = response.data;
      setToken(token);
      setUser(email); // Armazena o email do usuário logado
      return null; // Sem erro
    } catch (error) {
      return error.response?.data?.error || "Erro ao fazer login";
    }
  };

  // Função para realizar cadastro
  const signup = async (email, password) => {
    const usersStorage = JSON.parse(localStorage.getItem("users_bd"));
    const hasUser = usersStorage?.filter((user) => user.email === email);

    if (hasUser?.length) {
      return "Já tem uma conta com esse E-mail";
    }

    let newUser;
    if (usersStorage) {
      newUser = [...usersStorage, { email, password }];
    } else {
      newUser = [{ email, password }];
    }

    localStorage.setItem("users_bd", JSON.stringify(newUser));

    // Realiza o login automaticamente
    const token = Math.random().toString(36).substring(2);
    localStorage.setItem("user_token", JSON.stringify({ email, token }));
    setUser({ email, password });

    return null; // Sem erro
  };

  // Função para fazer logout
  const signout = () => {
    setUser(null);
    setToken(null);
  };

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setUser(true); // Define o estado como autenticado
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
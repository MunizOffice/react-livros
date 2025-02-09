import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Função para realizar login
  const signin = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5001/auth/login", { email, password });
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
    try {
      await axios.post("http://localhost:5001/auth/signup", { email, password });
      return null; // Sem erro
    } catch (error) {
      return error.response?.data?.error || "Erro ao criar conta";
    }
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
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Função para realizar login
  const signin = async (email, password) => {
    try {
      const response = await axios.post("https://localhost:5443/auth/login", { email, password });
      const { token } = response.data;
      setToken(token);
      localStorage.setItem("token", token); // Salva o token no localStorage
      setUser(email); // Armazena o email do usuário logado
      return null; // Sem erro
    } catch (error) {
      return error.response?.data?.error || "Erro ao fazer login";
    }
  };

  // Função para realizar cadastro
  const signup = async (email, password) => {
    try {
      const response = await axios.post("https://localhost:5443/auth/signup", { email, password });
      const { token } = response.data;
      setToken(token); // Armazena o token no estado
      localStorage.setItem("token", token); // Salva o token no localStorage
      setUser(email); // Define o estado como autenticado
      return null; // Sem erro
    } catch (error) {
      return error.response?.data?.error || "Erro ao criar conta";
    }
  };

  // Função para fazer logout
  const signout = async () => {
    try {
      await axios.post("https://localhost:5443/auth/logout", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error.message);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem("token"); // Remove o token do localStorage
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
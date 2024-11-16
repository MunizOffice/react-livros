import React, { useState } from "react";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import * as C from "./styles";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";

const Signin = () => {
  const { signin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [senhaError, setSenhaError] = useState("");

  const handleLogin = () => {
    // Resetar mensagens de erro
    setError("");
    setEmailError("");
    setSenhaError("");

    let hasError = false;

    // Validação do email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError("E-mail inválido");
      hasError = true;
    }

    // Validação da senha
    if (senha.length < 8) {
      setSenhaError("A senha deve ter pelo menos 8 caracteres");
      hasError = true;
    }

    // Verificar se campos estão preenchidos
    if (!email || !senha) {
      setError("Preencha todos os campos");
      hasError = true;
    }

    if (hasError) return;

    // Tentar fazer o login se não houver erros
    const res = signin(email, senha);

    if (res) {
      setError(res);
      return;
    }

    navigate("/");
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <>
      <C.BackButton onClick={handleGoBack}>
        Voltar para a página inicial
      </C.BackButton>
      <C.Container>
        <C.Label>FAÇA SEU LOGIN</C.Label>
        <C.Content>
          <Input
            type="email"
            placeholder="Digite o seu E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <C.labelError>{emailError}</C.labelError>}

          <Input
            type="password"
            placeholder="Digite a sua Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          {senhaError && <C.labelError>{senhaError}</C.labelError>}

          {error && <C.labelError>{error}</C.labelError>}

          <Button Text="Entrar" onClick={handleLogin} />

          <C.LabelSignup>
            Não tem uma conta?
            <C.Strong>
              <Link to="/signup">&nbsp;Registre-se</Link>
            </C.Strong>
          </C.LabelSignup>
        </C.Content>
      </C.Container>
    </>
  );
};

export default Signin;

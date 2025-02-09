import React, { useState, useEffect } from "react";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import * as C from "./styles";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [emailConf, setEmailConf] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailConfError, setEmailConfError] = useState("");
  const [senhaError, setSenhaError] = useState("");
  const navigate = useNavigate();
  const { signup } = useAuth();

  useEffect(() => {
    // Adiciona classe ao body
    document.body.classList.add("login-background");

    return () => {
      // Remove a classe ao desmontar o componente
      document.body.classList.remove("login-background");
    };
  }, []);

  const handleSignup = async () => {
    setError("");
    setEmailError("");
    setEmailConfError("");
    setSenhaError("");

    let hasError = false;

    // Validação do email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError("E-mail inválido");
      hasError = true;
    }

    // Verificar se os emails são iguais
    if (email !== emailConf) {
      setEmailConfError("Os e-mails não são iguais");
      hasError = true;
    }

    // Validação da senha
    if (senha.length < 8) {
      setSenhaError("A senha deve ter pelo menos 8 caracteres");
      hasError = true;
    }

    // Verificar campos preenchidos
    if (!email || !emailConf || !senha) {
      setError("Preencha todos os campos");
      hasError = true;
    }

    if (hasError) return;

    // Tentar fazer cadastro
    const res = await signup(email, senha);
    if (res) {
      setError(res);
      return;
    }

    navigate("/");
  };

  // Voltar para a página inicial
  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <>
      <C.BackButton onClick={handleGoBack}>
        Voltar para a página inicial
      </C.BackButton>
      <C.Container>
        <C.Label>FAÇA SEU CADASTRO</C.Label>
        <C.Content>
          <C.Names>E-mail:</C.Names>
          <Input
            type="email"
            placeholder="Digite seu E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <C.labelError>{emailError}</C.labelError>}

          <C.Names>Confirmação:</C.Names>
          <Input
            type="email"
            placeholder="Confirme seu E-mail"
            value={emailConf}
            onChange={(e) => setEmailConf(e.target.value)}
          />
          {emailConfError && <C.labelError>{emailConfError}</C.labelError>}

          <C.Names>Senha:</C.Names>
          <Input
            type="password"
            placeholder="Digite sua Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          {senhaError && <C.labelError>{senhaError}</C.labelError>}

          {error && <C.labelError>{error}</C.labelError>}

          <Button Text="Inscrever-se" onClick={handleSignup} />

          <C.LabelSignin>
            Já tem uma conta?
            <C.Strong>
              <Link to="/signin">&nbsp;Entre</Link>
            </C.Strong>
          </C.LabelSignin>
        </C.Content>
      </C.Container>
    </>
  );
};

export default Signup;

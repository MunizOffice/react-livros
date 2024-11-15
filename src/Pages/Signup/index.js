import React, { useState } from "react";
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

  const handleSignup = () => {
    // Resetando mensagens de erro
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

    // Fazer o cadastro sem erros
    const res = signup(email, senha);

    if (res) {
      setError(res);
      return;
    }

    alert("Usuário cadastrado com sucesso!");
    navigate("/");
  };

  return (
    <C.Container>
      <C.Label>SISTEMA DE LOGIN</C.Label>
      <C.Content>
        <Input
          type="email"
          placeholder="Digite seu E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <C.labelError>{emailError}</C.labelError>}

        <Input
          type="email"
          placeholder="Confirme seu E-mail"
          value={emailConf}
          onChange={(e) => setEmailConf(e.target.value)}
        />
        {emailConfError && <C.labelError>{emailConfError}</C.labelError>}

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
            <Link to="/">&nbsp;Entre</Link>
          </C.Strong>
        </C.LabelSignin>
      </C.Content>
    </C.Container>
  );
};

export default Signup;

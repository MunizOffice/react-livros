import React from "react";
import { GoStarFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import * as S from "./styles";

const Header = () => {
    const navigate = useNavigate();
    const { user, signout } = useAuth();

    // Funções de navegação
    const goToSavedBooks = () => navigate("/saved-books");
    const goToLogin = () => navigate("/signin");
    const goToRegistro = () => navigate("/signup");

    return (
        <S.HeaderContainer>
            <S.HeaderTitle>Buscador de Livros</S.HeaderTitle>
            <div>
                <S.FavoriteButton onClick={goToSavedBooks}>
                    <GoStarFill /> Favoritos
                </S.FavoriteButton>
                {!user ? (
                    <>
                        <S.HeaderButton onClick={goToLogin}>Login</S.HeaderButton>
                        <S.HeaderButton onClick={goToRegistro}>Registre-se</S.HeaderButton>
                    </>
                ) : (
                    <S.LogoutButton onClick={() => signout()}>Sair</S.LogoutButton>
                )}
            </div>
        </S.HeaderContainer>
    );
};

export default Header;
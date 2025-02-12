import styled from "styled-components";

// Container principal do Header
export const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
    width: 100%;
    background-color: rgb(22, 14, 5);
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.5);
    padding: 0 20px;
    position: fixed; 
    top: 0; 
    z-index: 1000; 

    @media (max-width: 768px) {
        height: 100px;  
    }
`;

// Título do cabeçalho
export const HeaderTitle = styled.h2`
    color: rgb(224, 175, 106); 
    font-size: 3rem; 
    margin: 0; 
    font-weight: bold; 

    @media (max-width: 910px) {
        font-size: 2.3rem; 
    }

    @media (max-width: 768px) {
        font-size: 2rem;  
    }
`;

// Botão genérico para reutilização
export const HeaderButton = styled.button`
    background-color: #007bff; 
    color: white;
    border: none;
    border-radius: 5px;
    margin: 10px;
    padding: 10px 15px; 
    font-size: 1.2rem;
    font-weight: bold; 
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3; 
    }

    &:active {
        background-color: #003f7f; 
    }

    @media (max-width: 910px) {
        padding: 8px 13px; 
        font-size: 1.1rem; 
    }

    @media (max-width: 768px) {
        padding: 5px 8px; 
        font-size: 1rem; 
    }
`;

// Botão específico para "Favoritos"
export const FavoriteButton = styled(HeaderButton)`
    background-color: #ff9800; 

    &:hover {
        background-color: #e68a00; 
    }

    &:active {
        background-color: #cc7a00; 
    }
`;

// Botão específico para "Sair"
export const LogoutButton = styled(HeaderButton)`
    background-color: #dc3545; 

    &:hover {
        background-color: #b02a37; 
    }

    &:active {
        background-color: #8f232d; 
    }
`;

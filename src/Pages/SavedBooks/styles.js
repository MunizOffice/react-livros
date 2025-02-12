import styled from "styled-components";

// Container principal
export const BookContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgb(49, 33, 15);
    min-height: 100vh;
    font-family: Arial, sans-serif;
    position: relative;
`;

export const Title = styled.h1`
    color: rgb(224, 175, 106);
    font-size: 2.5rem;
    margin-top: 170px;
`;

// Botão para voltar à página inicial
export const BackButton = styled.button`
    position: absolute;
    top: 100px;
    right: 5%;
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0056b3;
    }

    &:active {
        background-color: #003f7f;
    }
`;

// Lista de livros
export const BookList = styled.ul`
    list-style: none;
    padding: 0;
    margin-top: 40px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); 
    gap: 30px;
    width: 100%;
    max-width: 1200px;
`;

// Card de livro
export const BookCard = styled.li`
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    transition: transform 0.3s ease;
    position: relative; 
    height: 100%; 

    &:hover {
        transform: translateY(-5px);
    }
`;

// Imagem do livro
export const BookImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 10px;
`;

// Detalhes do livro
export const BookDetails = styled.div`
    text-align: center;
    flex-grow: 1; 
`;

// Título do livro
export const BookTitle = styled.h2`
    font-size: 1.2rem;
    margin: 10px 0;
    color: #333;
`;

// Autor do livro
export const BookAuthor = styled.p`
    font-size: 1rem;
    color: #666;
    margin-bottom: 10px;
`;

// Descrição do livro
export const BookDescription = styled.p`
    font-size: 0.9rem;
    color: #444;
    line-height: 1.4;
    margin-bottom: 15px;
`;

// Botão de exclusão
export const DeleteButton = styled.button`
    position: absolute; 
    bottom: 10px; 
    left: 50%; 
    transform: translateX(-50%); 
    padding: 10px 15px;
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.1rem;
    transition: background-color 0.3s ease;

    &:hover {
        background-color:rgb(209, 41, 41);
    }
`;

// Mensagem de erro
export const ErrorMessage = styled.p`
    color: #ff4d4d;
    font-size: 1rem;
    text-align: center;
    margin-top: 20px;
`;

// Mensagem de nenhum livro salvo
export const NoBooksMessage = styled.p`
    color: #666;
    font-size: 1.2rem;
    text-align: center;
    margin-top: 20px;
`;
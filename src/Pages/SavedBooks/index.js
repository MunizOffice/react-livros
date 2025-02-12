import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";
import * as C from "./styles";
import { useNavigate } from "react-router-dom"; // Importe o hook useNavigate
import Header from "../../Components/Header/header";

const SavedBooks = () => {
    const [books, setBooks] = useState([]); // Estado inicial como array vazio
    const [error, setError] = useState("");
    const { token } = useAuth();
    const navigate = useNavigate(); // Hook para navegação

    // Função para voltar à página inicial
    const handleGoBack = () => {
        navigate("/"); // Navega para a rota principal (Main.js)
    };

    useEffect(() => {
        const fetchSavedBooks = async () => {
            try {
                const response = await axios.get("https://localhost:5443/books", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (Array.isArray(response.data)) {
                    setBooks(response.data);
                } else {
                    console.error("Resposta inesperada do backend:", response.data);
                    setError("Erro ao carregar os livros salvos.");
                }
            } catch (err) {
                console.error("Erro ao buscar livros salvos:", err);
                setError("Erro ao carregar os livros salvos.");
            }
        };
        fetchSavedBooks();
    }, [token]);

    // Função para excluir um livro
    const deleteBook = async (id) => {
        try {
            await axios.delete(`https://localhost:5443/books/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
            alert("Livro excluído com sucesso!");
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir o livro.");
        }
    };

    return (
        <C.BookContainer>
            <Header />
            <C.BackButton onClick={handleGoBack}>Voltar para a página inicial</C.BackButton>

            <C.Title>Meus Livros Salvos</C.Title>
            {error && <C.ErrorMessage>{error}</C.ErrorMessage>}
            {books.length > 0 ? (
                <C.BookList>
                    {books.map((book) => (
                        <C.BookCard key={book.id}>
                            {book.thumbnail && (
                                <C.BookImage src={book.thumbnail} alt={book.title} />
                            )}
                            <C.BookDetails>
                                <C.BookTitle>{book.title}</C.BookTitle>
                                <C.BookAuthor>{book.author}</C.BookAuthor>
                                <C.BookDescription>{book.description}</C.BookDescription>
                            </C.BookDetails>
                            <C.DeleteButton onClick={() => deleteBook(book.id)}>
                                Excluir
                            </C.DeleteButton>
                        </C.BookCard>
                    ))}
                </C.BookList>
            ) : (
                <C.NoBooksMessage>Nenhum livro salvo.</C.NoBooksMessage>
            )}
        </C.BookContainer>
    );
};

export default SavedBooks;
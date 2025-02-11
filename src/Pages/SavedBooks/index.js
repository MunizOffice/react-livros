import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";

const SavedBooks = () => {
    const [books, setBooks] = useState([]); // Estado inicial como array vazio
    const [error, setError] = useState("");
    const { token } = useAuth();

    useEffect(() => {
        const fetchSavedBooks = async () => {
            try {
                const response = await axios.get("https://localhost:5443/books", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Garantir que a resposta seja um array
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
            setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id)); // Remove o livro da lista
            alert("Livro excluído com sucesso!");
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir o livro.");
        }
    };

    return (
        <div>
            <h1>Meus Livros Salvos</h1>
            {error && <p>{error}</p>}
            {books.length > 0 ? (
                <ul>
                    {books.map((book) => (
                        <li key={book.id}>
                            <img src={book.thumbnail} alt={book.title} />
                            <h2>{book.title}</h2>
                            <p>{book.author}</p>
                            <p>{book.description}</p>
                            <button onClick={() => deleteBook(book.id)}>Excluir</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhum livro salvo.</p>
            )}
        </div>
    );
};

export default SavedBooks;
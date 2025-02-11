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

    return (
        <div>
            <h1>Meus Livros Salvos</h1>
            {error && <p>{error}</p>}
            {books.length > 0 ? (
                <ul>
                    {books.map((book) => (
                        <li key={book.id}>
                            <img src={book.thumbnail} alt={book.title} />
                            <h3>{book.title}</h3>
                            <p>{book.author}</p>
                            <p>{book.description}</p>
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
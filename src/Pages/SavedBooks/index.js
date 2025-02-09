import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";

const SavedBooks = () => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState("");
    const { token } = useAuth();

    useEffect(() => {
        const fetchSavedBooks = async () => {
            try {
                const response = await axios.get("http://localhost:5000/books", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBooks(response.data);
            } catch (err) {
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
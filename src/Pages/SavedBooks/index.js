import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";
import * as C from "./styles";
import { useNavigate } from "react-router-dom";
import Modal from "../../BooksSearch/Modal"; // Importe o Modal

const SavedBooks = () => {
    const [books, setBooks] = useState([]); // Estado inicial como array vazio
    const [error, setError] = useState("");
    const { token } = useAuth();
    const navigate = useNavigate();

    // Estado para controlar o modal
    const [showModal, setShowModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    // Função para voltar à página inicial
    const handleGoBack = () => {
        navigate("/");
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

    // Função para abrir o modal com os detalhes do livro
    const openModal = (book) => {
        setSelectedBook(book);
        setShowModal(true);
    };

    // Função para fechar o modal
    const closeModal = () => {
        setSelectedBook(null);
        setShowModal(false);
    };

    return (
        <C.BookContainer>
            {/* Botão para voltar à página inicial */}
            <C.BackButton onClick={handleGoBack}>Voltar para a página inicial</C.BackButton>
            <C.Title>Meus Livros Salvos</C.Title>
            {error && <C.ErrorMessage>{error}</C.ErrorMessage>}
            {books.length > 0 ? (
                <C.BookList>
                    {books.map((book) => (
                        <C.BookCard key={book.id} onClick={() => openModal(book)}>
                            {book.thumbnail && (
                                <C.BookImage src={book.thumbnail} alt={book.title} />
                            )}
                            <C.BookDetails>
                                <C.BookTitle>{book.title}</C.BookTitle>
                                <C.BookAuthor>{book.author}</C.BookAuthor>
                                <C.BookDescription>{book.description}</C.BookDescription>
                            </C.BookDetails>
                            <C.DeleteButton onClick={(e) => {
                                e.stopPropagation(); // Evita que o clique no botão abra o modal
                                deleteBook(book.id);
                            }}>
                                Excluir
                            </C.DeleteButton>
                        </C.BookCard>
                    ))}
                </C.BookList>
            ) : (
                <C.NoBooksMessage>Nenhum livro salvo.</C.NoBooksMessage>
            )}

            {/* Modal */}
            {showModal && selectedBook && (
                <Modal
                    show={showModal}
                    item={{
                        volumeInfo: {
                            title: selectedBook.title,
                            authors: [selectedBook.author],
                            imageLinks: { smallThumbnail: selectedBook.thumbnail },
                            publisher: "Editora desconhecida",
                            publishedDate: "Data desconhecida",
                            description: selectedBook.description,
                            previewLink: "#",
                        },
                    }}
                    onClose={closeModal}
                />
            )}
        </C.BookContainer>
    );
};

export default SavedBooks;
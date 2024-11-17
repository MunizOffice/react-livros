import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import Card from "./Card";
import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const Main = () => {
    const [search, setSearch] = useState("");
    const [bookData, setData] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(""); // Estado para mensagens de erro
    const navigate = useNavigate();
    const suggestionsRef = useRef(null);
    const inputRef = useRef(null);
    const { user, signout } = useAuth(); // Pega o estado de autenticação do usuário e função para logout
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Verificar se o usuário está logado
        if (user) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [user]);

    const handleError = (message) => {
        setError(message);
        setTimeout(() => setError(""), 5000); // Limpa o erro após 5 segundos
    };

    const fetchBooks = (query, maxResults = 10) => {
        return axios
            .get(
                `https://www.googleapis.com/books/v1/volumes?q=${query}&key=AIzaSyCtLJQLGq6ZtyBFFaF2FDiv2-_2c4vrUB0&maxResults=${maxResults}`
            )
            .then((response) => response.data.items)
            .catch((err) => {
                console.error(err);
                if (err.response) {
                    throw new Error("Erro ao acessar a API. Tente novamente.");
                } else if (err.request) {
                    throw new Error("Sem resposta do servidor. Verifique sua conexão.");
                } else {
                    throw new Error("Erro inesperado. Tente novamente.");
                }
            });
    };

    useEffect(() => {
        if (user) {
            fetchBooks("best+sellers", 10)
                .then((books) => setData(books))
                .catch(() => handleError("Erro ao carregar os melhores livros."));
        }
    }, [user]);

    const fetchSuggestions = useCallback(() => {
        if (!user) {
            handleError("Você precisa estar logado para ver sugestões.");
            return;
        }

        fetchBooks(search, 40)
            .then((books) => {
                const booksSuggestions = books.map((item) => ({
                    title: item.volumeInfo.title,
                    thumbnail: item.volumeInfo.imageLinks?.smallThumbnail,
                }));
                setSuggestions(booksSuggestions);
                setError(""); // Limpa o erro se a busca foi bem-sucedida
            })
            .catch(() => handleError("Não foi possível carregar as sugestões."));
    }, [search, user]);

    useEffect(() => {
        if (search.length > 1 && user) {
            fetchSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [search, fetchSuggestions, user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setSuggestions([]);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const searchBook = (evt) => {
        if (evt.key === "Enter" || evt.key === undefined) {
            if (!user) {
                handleError("Você precisa estar logado para buscar livros.");
                return;
            }

            if (search.trim() === "") {
                handleError("Por favor, preencha o campo de busca.");
                return;
            }

            fetchBooks(search, 40)
                .then((books) => {
                    setData(books);
                    setError(""); // Limpa o erro em caso de sucesso
                    setSuggestions([]);
                })
                .catch(() => handleError("Erro ao buscar livros. Tente novamente."));
        }
    };

    const handleInputClick = () => {
        if (search.length > 1 && user) {
            fetchSuggestions();
        }
    };

    const goToLogin = () => {
        navigate("/signin");
    };

    const goToRegistro = () => {
        navigate("/signup");
    };

    return (
        <>
            <div className="header">
                <div className="row2">
                    <div className="logo">
                        <h2>Buscador de Livros</h2>
                        {!user ? (
                            <>
                                <button onClick={goToLogin} className="button login">
                                    Login
                                </button>
                                <button onClick={goToRegistro} className="button registro">
                                    Registre-se
                                </button>
                            </>
                        ) : (
                            <button onClick={() => signout()} className="button logout">
                                Sair
                            </button>
                        )}
                    </div>
                    <span className={`connected-label ${user ? 'connected' : 'disconnected'}`}>
                        {user ? "Conectado" : "Desconectado"}
                    </span>
                    <div className="search">
                        <input
                            type="text"
                            placeholder="O que você procura?"
                            value={search}
                            ref={inputRef}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={searchBook}
                            onClick={handleInputClick}
                        />
                        <button className="search" onClick={() => searchBook({ key: "Enter" })}>
                            <FiSearch size={25} color="#000" />
                        </button>
                    </div>
                    {error && (
                        <div className="error-message">
                            <h4>Erro:</h4>
                            <p>{error}</p>
                        </div>
                    )}
                    {suggestions.length > 0 && (
                        <ul className="suggestions" ref={suggestionsRef}>
                            {suggestions.map((book, index) => (
                                <li
                                    key={index}
                                    onClick={() => setSearch(book.title)}
                                >
                                    {book.thumbnail && (
                                        <img
                                            src={book.thumbnail}
                                            alt="Book thumbnail"
                                        />
                                    )}
                                    <span>{book.title}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="container">
                <Card book={bookData} />
            </div>
        </>
    );
};

export default Main;

import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import Card from "./Card";
import useAuth from "../Hooks/useAuth";
import debounce from "lodash.debounce";


const Main = () => {
    const [search, setSearch] = useState("");
    const [bookData, setData] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState("");
    const suggestionsRef = useRef(null);
    const inputRef = useRef(null);
    const { user } = useAuth();

    // Função para centralizar tratamento de erros
    const handleError = useCallback((message) => {
        setError(message);
        setSuggestions([]); // Limpa as sugestões sempre que há um erro
    }, []);

    // Função de fetchBooks movida para fora do useEffect
    const fetchBooks = useCallback(async (query, maxResults = 10) => {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${query}&key=AIzaSyCtLJQLGq6ZtyBFFaF2FDiv2-_2c4vrUB0&maxResults=${maxResults}`
            );
            return response.data.items;
        } catch (err) {
            console.error(err);
            if (err.response) {
                handleError("Erro ao acessar a API. Tente novamente.");
            } else if (err.request) {
                handleError("Sem resposta do servidor. Verifique sua conexão.");
            } else {
                handleError("Erro inesperado. Tente novamente.");
            }
        }
    }, [handleError]);

    // Chamada inicial para livros mais vendidos
    useEffect(() => {
        if (user) {
            fetchBooks("best+sellers", 10)
                .then(setData)
                .catch(() => handleError("Erro ao carregar os melhores livros."));
        }
    }, [user, fetchBooks, handleError]); // 'fetchBooks' como dependência

    // Usa useCallback diretamente dentro de useEffect para evitar warnings
    useEffect(() => {
        const fetchSuggestions = debounce(async (query) => {
            if (!user) {
                handleError("Você precisa estar logado para ver sugestões.");
                return;
            }
            try {
                const books = await fetchBooks(query, 40);
                const bookSuggestions = books.map((item) => ({
                    title: item.volumeInfo.title,
                    thumbnail: item.volumeInfo.imageLinks?.smallThumbnail,
                }));
                setSuggestions(bookSuggestions);
                setError(""); // Limpa o erro em caso de sucesso
            } catch (e) {
                handleError("Não foi possível carregar as sugestões.");
            }
        }, 500);

        if (search.length > 1 && user) {
            fetchSuggestions(search);
        } else {
            setSuggestions([]);
        }

        return () => {
            fetchSuggestions.cancel(); // Limpeza do debounce quando o componente for desmontado
        };
    }, [search, user, fetchBooks, handleError]); // 'fetchBooks' como dependência

    // Detecta cliques fora do input e da lista de sugestões para limpar as sugestões
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

    // Função para realizar a pesquisa de livros ao pressionar "Enter"
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
                    setData(books || []); // Garantir que setData receba um array vazio caso não haja livros
                    setSuggestions([]);
                    setError(""); // Limpa o erro em caso de sucesso
                })
                .catch(() => handleError("Erro ao buscar livros. Tente novamente."));
        }
    };

    return (
        <>
            <div className="header">
                <div className="row2">
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
                        />
                        <button className="search" onClick={() => searchBook({ key: "Enter" })}>
                            <FiSearch size={25} color="#000" />
                        </button>
                    </div>
                    {error && <div className="error-message"><h4>Erro:</h4><p>{error}</p></div>}
                    {suggestions.length > 0 && (
                        <ul className="suggestions" ref={suggestionsRef}>
                            {suggestions.map((book, index) => (
                                <li key={index} onClick={() => setSearch(book.title)}>
                                    {book.thumbnail && <img src={book.thumbnail} alt="Book thumbnail" />}
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
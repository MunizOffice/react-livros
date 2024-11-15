import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import Card from "./Card";
import { useNavigate } from "react-router-dom";

const Main = () => {
    const [search, setSearch] = useState("");
    const [bookData, setData] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();
    const suggestionsRef = useRef(null);
    const inputRef = useRef(null);

    // Função para buscar livros
    const fetchBooks = (query, maxResults = 10) => {
        return axios
            .get(
                `https://www.googleapis.com/books/v1/volumes?q=${query}&key=AIzaSyCtLJQLGq6ZtyBFFaF2FDiv2-_2c4vrUB0&maxResults=${maxResults}`
            )
            .then((response) => response.data.items)
            .catch((err) => console.log(err));
    };

    // Buscar livros "best sellers" ao inicializar
    useEffect(() => {
        fetchBooks("best+sellers", 10).then((books) => setData(books));
    }, []);

    const fetchSuggestions = useCallback(() => {
        fetchBooks(search, 40).then((books) => {
            const booksSuggestions = books.map((item) => ({
                title: item.volumeInfo.title,
                thumbnail: item.volumeInfo.imageLinks?.smallThumbnail,
            }));
            setSuggestions(booksSuggestions);
        });
    }, [search]);

    useEffect(() => {
        if (search.length > 1) {
            fetchSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [search, fetchSuggestions]);

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
        if (evt.key === "Enter") {
            fetchBooks(search, 40).then((books) => setData(books));
            setSuggestions([]);
        }
    };

    const handleInputClick = () => {
        if (search.length > 1) {
            fetchSuggestions();
        }
    };

    const goToLogin = () => {
        navigate("/signin");
    };

    return (
        <>
            <div className="header">
                <div className="row2">
                    <h2>Ache seu livro...</h2>
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
                        <button className="search">
                            <FiSearch size={25} color="#000" />
                        </button>
                    </div>
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
                <button onClick={goToLogin} className="login-button">
                    Login
                </button>
            </div>

            <div className="container">
                <Card book={bookData} />
            </div>
        </>
    );
};

export default Main;

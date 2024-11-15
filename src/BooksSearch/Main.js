import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import Card from "./Card";

const Main = () => {
    const [search, setSearch] = useState("");
    const [bookData, setData] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (search.length > 2) { // Verifica se a entrada tem mais de 2 caracteres
            const timeoutId = setTimeout(() => {
                axios.get('https://www.googleapis.com/books/v1/volumes?q=' + search + '&key=AIzaSyCtLJQLGq6ZtyBFFaF2FDiv2-_2c4vrUB0' + '&maxResults=40')
                    .then(response => {
                        const books = response.data.items.map(item => ({
                            title: item.volumeInfo.title,
                            thumbnail: item.volumeInfo.imageLinks?.smallThumbnail
                        }));
                        setSuggestions(books);
                    })
                    .catch(err => console.log(err));
            });

            return () => clearTimeout(timeoutId); // Limpa o timeout para evitar chamadas excessivas
        } else {
            setSuggestions([]); // Limpa as sugestões se a entrada for muito curta
        }
    }, [search]);

    const searchBook = (evt) => {
        if (evt.key === "Enter") {
            axios.get('https://www.googleapis.com/books/v1/volumes?q=' + search + '&key=AIzaSyCtLJQLGq6ZtyBFFaF2FDiv2-_2c4vrUB0' + '&maxResults=40')
                .then(res => setData(res.data.items))
                .catch(err => console.log(err));
            setSuggestions([]); // Limpa as sugestões após a pesquisa
        }
    };

    return (
        <>
            <div className="header">
                <div className="row2">
                    <h2>Ache seu livro...</h2>
                    <div className="search">
                        <input
                            type="text"
                            placeholder="O que você procura?"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={searchBook} />
                        <button className="search">
                            <FiSearch size={25} color="#000" />
                        </button>
                    </div>
                    {suggestions.length > 0 && (
                        <ul className="suggestions">
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

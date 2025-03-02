import React, { useState } from "react";
import Modal from "./Modal";
import useAuth from "../Hooks/useAuth";

const Card = ({ book }) => {
    const [show, setShow] = useState(false);
    const [bookItem, setBookItem] = useState(null);
    const { user } = useAuth();

    // Função para salvar o livro no backend
    const saveBook = async (item) => {
        try {
            const { volumeInfo } = item;
            // Verifica se o livro tem título
            if (!volumeInfo.title) {
                alert("Este livro não pode ser salvo porque falta o título.");
                return;
            }
            const payload = {
                title: volumeInfo.title, // Título obrigatório
                author: volumeInfo.authors?.join(", ") || "Autor Desconhecido", // Autor opcional
                description: volumeInfo.description,
                thumbnail: volumeInfo.imageLinks?.smallThumbnail,
            };
            const response = await fetch("https://localhost:5443/books", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.errors
                    ? errorData.errors.map((err) => err.msg).join(", ")
                    : "Erro desconhecido ao salvar o livro.";
                throw new Error(errorMessage);
            }
            alert("Livro salvo com sucesso!");
        } catch (error) {
            console.error(error);
            alert(`Erro ao salvar o livro: ${error.message}`);
        }
    };

    if (!user) {
        return <div>Erro: Nenhum livro encontrado. Tente outra pesquisa.</div>;
    }

    return (
        <>
            {Array.isArray(book) && book.length > 0 ? (
                book.map((item) => {
                    let thumbnail = item.volumeInfo.imageLinks?.smallThumbnail;
                    let amount = item.saleInfo.listPrice?.amount;
                    if (thumbnail !== undefined) {
                        return (
                            <div className="card" key={item.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px", borderRadius: "8px" }}>
                                <img className="card img" src={thumbnail} alt={item.volumeInfo.title} style={{ width: "100px", height: "150px", objectFit: "cover" }} />
                                <h3>{item.volumeInfo.title}</h3>
                                <p>₹{amount}</p>
                                <button className="card-button card-button-save" onClick={() => saveBook(item)}>
                                    Salvar
                                </button>
                                <button className="card-button card-button-details" onClick={() => { setBookItem(item); setShow(true); }}>
                                    Ver Detalhes
                                </button>
                            </div>
                        );
                    }
                    return null;
                })
            ) : (
                <div className="error-card-container">
                    <div className="error-card">Erro: Nenhum livro encontrado. Tente outra pesquisa.</div>
                </div>
            )}
            {show && bookItem && (
                <Modal show={show} item={bookItem} onClose={() => setShow(false)} />
            )}
        </>
    );
};

export default Card;
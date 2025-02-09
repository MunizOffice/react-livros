import React, { useState } from "react";
import Modal from "./Modal";
import useAuth from "../Hooks/useAuth";

const Card = ({ book }) => {
    const [show, setShow] = useState(false);
    const [bookItem, setBookItem] = useState(null); // Inicialize como null
    const { user } = useAuth();

    if (!user) {
        return <p>Erro: Nenhum livro encontrado. Tente outra pesquisa.</p>;
    }

    return (
        <>
            {Array.isArray(book) && book.length > 0 ? (
                book.map((item) => {
                    let thumbnail = item.volumeInfo.imageLinks?.smallThumbnail;
                    let amount = item.saleInfo.listPrice?.amount;

                    if (thumbnail !== undefined) {
                        return (
                            <div key={item.id}>
                                <button
                                    onClick={() => {
                                        setBookItem(item); // Define o livro selecionado
                                        setShow(true); // Abre o modal
                                    }}
                                >
                                    Salvar
                                </button>
                                <img src={thumbnail} alt={item.volumeInfo.title} />
                                <h3>{item.volumeInfo.title}</h3>
                                <p>₹{amount}</p>
                            </div>
                        );
                    }
                    return null; // Adicionar retorno vazio caso o thumbnail seja undefined
                })
            ) : (
                <p>Erro: Nenhum livro encontrado. Tente outra pesquisa.</p>
            )}
            {show && bookItem && (
                <Modal
                    show={show}
                    item={bookItem}
                    onClose={() => {
                        setShow(false);
                        setBookItem(null); // Limpa o livro selecionado ao fechar o modal
                    }}
                />
            )}
        </>
    );
};

export default Card;
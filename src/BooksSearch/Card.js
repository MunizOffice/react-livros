import React, { useState } from "react";
import Modal from "./Modal";
import useAuth from "../Hooks/useAuth"; // Certifique-se de importar corretamente

const Card = ({ book }) => {
    const [show, setShow] = useState(false);
    const [bookItem, setItem] = useState();
    const { user } = useAuth(); // Obtemos o estado do usuário autenticado

    if (!user) {
        return (
            <div className="no-results">
                <h4>Erro: Nenhum livro encontrado.<br />Tente outra pesquisa.</h4>
            </div>
        );
    }

    return (
        <>
            {Array.isArray(book) && book.length > 0 ? (
                book.map((item) => {
                    let thumbnail = item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.smallThumbnail;
                    let amount = item.saleInfo.listPrice && item.saleInfo.listPrice.amount;
                    if (thumbnail !== undefined) {
                        return (
                            <div
                                key={item.id}
                                className="card"
                                onClick={() => {
                                    setShow(true);
                                    setItem(item);
                                }}
                            >
                                <img src={thumbnail} alt="" />
                                <div className="bottom">
                                    <h3 className="title">{item.volumeInfo.title}</h3>
                                    <p className="amount">&#8377;{amount}</p>
                                </div>
                            </div>
                        );
                    }
                    return null; // Adicionar retorno vazio caso o thumbnail seja undefined
                })
            ) : (
                <div className="no-results">
                    <h4>Erro: Nenhum livro encontrado.<br />Tente outra pesquisa.</h4>
                </div>
            )}
            <Modal show={show} item={bookItem} onClose={() => setShow(false)} />
        </>
    );
};

export default Card;

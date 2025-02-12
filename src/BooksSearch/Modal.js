import React from "react";
import { IoMdCloseCircle } from "react-icons/io";

const Modal = ({ show, item, onClose }) => {
    if (!show || !item) {
        return null; // Não renderiza o modal se `item` for undefined
    }

    // Obtém a miniatura do livro, se disponível
    let thumbnail = item.volumeInfo.imageLinks?.smallThumbnail;

    return (
        <div className="overlay">
            <div className="overlay-inner">
                <button className="close" onClick={onClose}>
                    <IoMdCloseCircle />
                </button>
                <div className="inner-box">
                    {thumbnail && <img src={thumbnail} alt="book" />}
                    <h3>{item.volumeInfo?.title}</h3>
                    <h4>{item.volumeInfo?.authors?.join(", ")}</h4>
                    <p>{item.volumeInfo?.publisher} - {item.volumeInfo?.publishedDate}</p>
                    <a href={item.volumeInfo?.previewLink} target="_blank" rel="noopener noreferrer">
                        Ir para a página
                    </a>
                    <p className="description">{item.volumeInfo?.description}</p>
                </div>
            </div>
        </div>
    );
};

export default Modal;
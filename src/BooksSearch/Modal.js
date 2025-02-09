import React from "react";
import { IoMdCloseCircle } from "react-icons/io";

const Modal = ({ show, item, onClose }) => {
    if (!show || !item) {
        return null; // Não renderiza o modal se `item` for undefined
    }

    // Obtém a miniatura do livro, se disponível.
    let thumbnail = item.volumeInfo.imageLinks?.smallThumbnail;

    return (
        <div>
            <button onClick={onClose}>
                <IoMdCloseCircle />
            </button>
            <h2>{item.volumeInfo?.title}</h2>
            <p>{item.volumeInfo?.authors?.join(", ")}</p>
            <p>
                {item.volumeInfo?.publisher} - {item.volumeInfo?.publishedDate}
            </p>
            <a href={item.volumeInfo?.infoLink} target="_blank" rel="noopener noreferrer">
                Ir para a página
            </a>
            <p>{item.volumeInfo?.description}</p>
        </div>
    );
};

export default Modal;
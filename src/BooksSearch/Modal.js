import React from "react";
import { IoMdCloseCircle } from "react-icons/io";

const Modal = ({ show, item, onClose }) => {
    if (!show || !item) {
        return null; // Não renderiza o modal se `item` for undefined
    }

    // Verificações seguras para evitar erros
    const thumbnail = item.volumeInfo?.imageLinks?.smallThumbnail;
    const title = item.volumeInfo?.title || "Título não disponível";
    const authors = item.volumeInfo?.authors?.join(", ") || "Autor desconhecido";
    const publisher = item.volumeInfo?.publisher || "Editora desconhecida";
    const publishedDate = item.volumeInfo?.publishedDate || "Data de publicação desconhecida";
    const description = item.volumeInfo?.description || "Descrição não disponível";
    const previewLink = item.volumeInfo?.previewLink || "#";

    return (
        <div className="overlay">
            <div className="overlay-inner">
                <button className="close" onClick={onClose}>
                    <IoMdCloseCircle />
                </button>
                <div className="inner-box">
                    {thumbnail && <img src={thumbnail} alt="book" />}
                    <h3>{title}</h3>
                    <h4>{authors}</h4>
                    <p>{publisher} - {publishedDate}</p>
                    <a href={previewLink} target="_blank" rel="noopener noreferrer">
                        Ir para a página
                    </a>
                    <p className="description">{description}</p>
                </div>
            </div>
        </div>
    );
};

export default Modal;
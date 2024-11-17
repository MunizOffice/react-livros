import React from "react";
import { IoMdCloseCircle } from "react-icons/io";

const Modal = ({ show, item, onClose }) => {
    if (!show) {
        return null;
    }

    // Obtém a miniatura do livro, se disponível.
    let thumbnail = item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.smallThumbnail;

    return (
        <>
            <div className="overlay">
                <div className="overlay-inner">
                    <button className="close" onClick={onClose}><IoMdCloseCircle size={25} /></button>
                    <div className="inner-box">
                        <img src={thumbnail} alt="" />
                        <div className="info">
                            <h1>{item.volumeInfo.title}</h1>
                            <h3>{item.volumeInfo.authors}</h3>
                            <h4>{item.volumeInfo.publisher}<span>{item.volumeInfo.publishedDate}</span></h4><br />
                            <a href={item.volumeInfo.previewLink}><button>Ir para a página</button></a>
                        </div>
                    </div>
                    <h4 className="description">{item.volumeInfo.description}</h4>
                </div>
            </div>
        </>
    )
}
export default Modal;
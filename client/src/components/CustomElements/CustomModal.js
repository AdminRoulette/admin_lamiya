import React, {useRef} from "react";

export const CustomModal = ({
                                onSubmit,
                                onClose,
                                title,
                                children,
                                width = 400,
                                buttonName,
                            }) => {
    const modalRef = useRef(null);

    const closeModal = () => {
        if (modalRef.current) {
            modalRef.current.className = 'closingModal modal_main';
        }
        window.setTimeout(() => {
            onClose();
        }, 500);
    }

    return (
        <div ref={modalRef} className="modal_main">
            <div onClick={closeModal} className="modal_bg"/>
            <div
                className="modal_container"
                style={{
                    width: `${width}px`,
                    left: `calc((100vw - ${width}px) / 2)`,
                }}
            >
                <div className="modal_header">
                    <div>{title}</div>
                    <svg
                        onClick={closeModal}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#7c7c7c"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{cursor: "pointer"}}
                    >
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>
                <div className={`modal_body`}>{children}</div>
                {onSubmit && (
                    <div className="modal_footer">
                        <button onClick={closeModal} className="second_btn">
                            Закрити
                        </button>
                        <button onClick={onSubmit} className="custom_btn">
                            {buttonName}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

import React from 'react';
import classes from "../adminOrder.module.scss"

const CheckOrderModal = ({checks, closeCheckModal}) => {

    const PrintCheck = async (id, event) => {
        function printImg(imgSrc) {
            let printWindow = window.open('', 'Print Window', 'height=1000,width=1000');
            printWindow.document.write('<html lang="ua"><head><title>Print Window</title>');
            printWindow.document.write('</head><body onLoad="self.print(); self.close()"><img alt="" src=\'');
            printWindow.document.write(imgSrc);
            printWindow.document.write('\' /></body></html>');
            printWindow.document.close();
            printWindow.onload = function () {
                printWindow.print();
            };
        }

        printImg(`https://api.checkbox.in.ua/api/v1/receipts/${id}/png?paper_width=58&qrcode_scale=50`)
        event.stopPropagation();
    }

    return (
        <div className="modal_main">
            <div onClick={() => closeCheckModal()} className="modal_bg"/>
            <div className={'modal_container' + ' ' + classes.cancel_order_modal}>
                <div className="modal_header">
                    <div>ПРРО чеки</div>
                    <svg onClick={() => closeCheckModal()} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24" fill="none"
                         stroke="#7c7c7c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>
                <div className="modal_body">
                    {checks.map((check, index) => {
                        return <button onClick={(e) => PrintCheck(check.checkuuid, e)}
                                       className={classes.check_btns + ' ' + "second_btn"}>{`#${index + 1}${check.return ? " - Повернення" : ""}`}</button>
                    })}
                </div>
            </div>
        </div>
    );
};

export default CheckOrderModal;
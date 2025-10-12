import React, {useRef} from 'react';
import classes from "../article.module.scss";
const FaqItem = ({answer, question}) => {

    const refItem = useRef(null)
    const refArrow = useRef(null)

    const showAnswer = (event) => {
        if (refArrow.current.style.transform === "rotate(0deg)" || refArrow.current.style.transform === "") {
            refItem.current.style.height = refItem.current.scrollHeight + "px";
            refArrow.current.style.transform = "rotate(-180deg)"
        } else {
            refItem.current.style.height = '0';
            refArrow.current.style.transform = "rotate(0deg)";
        }
    }

    return (
        <div onClick={showAnswer} itemScope="" itemProp="mainEntity" itemType="https://schema.org/Question">

            <label itemProp="name" htmlFor="tab_1">{question}
                <svg ref={refArrow} xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                     viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                     strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>

            </label>
            <div className={classes.faq_item_answer} itemScope="" itemProp="suggestedAnswer acceptedAnswer" itemType="https://schema.org/Answer" ref={refItem}>
                <p itemProp="text">
                    {answer}
                </p>
            </div>


        </div>
    );
};

export default FaqItem;
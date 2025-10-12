import React, {useState} from 'react';
import {toast} from "react-toastify";
import classes from "../article.module.scss";

const CommentBlock = ({user, language}) => {

    const [email, setEmail] = useState(user.user.email ? user.user.email : "");
    const [userName, setUserName] = useState(user.user.firstname ? user.user.firstname : "");
    const [emailRequest, setEmailRequest] = useState(true);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const onChangeComment = (value) => {
        if (value.length < 2001) {
            setComment(value);
            const textArea = document.getElementById("comment_textarea");
            const error_label = document.getElementById("error_label");
            textArea.style.border = "1px solid #ccd0d3"
            error_label.style.display = "none"
        }
    };

    const Name_REGEXP = /^[а-яА-ЯЬьЮюЇїІіЄєҐґёЁыЫэЭъЪ'-]+$/;
    const ValidFirstName = (ev) => {
        const firstName = document.getElementById("unCorrectFirstName");
        const firstNameInput = document.getElementById("firstNameInput");
        if (ev.length > 1 || ev.length < firstName.length) {
            if (ev.match(Name_REGEXP)) {
                setUserName(ev);
                firstNameInput.style.borderBottom = ""
                firstName.style.display = 'none';
            }
        } else {
            if (ev.match(Name_REGEXP) || ev === "") {
                setUserName(ev);
            }
            firstNameInput.style.borderBottom = "1px solid #ff0000"
            firstName.style.display = 'flex';
        }
    }
    const EMAIL_REGEXP = /^[a-zA-Z0-9.-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
    const ValidEmail = (ev) => {
        const email = document.getElementById("unCorrectEmail");
        const emailInput = document.getElementById("emailInput");
        if (ev.match(EMAIL_REGEXP) || ev === "") {
            setEmail(ev);
            emailInput.style.borderBottom = ""
            email.style.display = 'none';
        } else {
            setEmail(ev);
            emailInput.style.borderBottom = "1px solid #ff0000"
            email.style.display = 'flex';
        }
    }

    const PostRating = async () => {
        setLoading(true);
        if (comment.length > 2000 || comment.length === 0 || userName.length > 50 || userName.length < 2
            || (!userName.match(Name_REGEXP)) || (emailRequest && ((!email.match(EMAIL_REGEXP)) || email.length < 6 || email.length > 50))) {
            if (comment.length > 2000) {
                const textAreaInput = document.getElementById("comment_textarea");
                const error_label = document.getElementById("error_label");
                if (textAreaInput && error_label) {
                    textAreaInput.style.border = "1px solid #ff0000"
                    error_label.style.display = "block"
                }
                toast(language.isLanguage ? "Коментарий слишком длинный" : "Коментар занадто довгий")
            }
            if (comment.length === 0) {
                const textAreaInput = document.getElementById("comment_textarea");
                const error_label = document.getElementById("error_label");
                if (textAreaInput && error_label) {
                    textAreaInput.style.border = "1px solid #ff0000"
                    error_label.style.display = "block"
                }
                toast(language.isLanguage ? "Коментарий пустой" : "Коментар порожній")
            }
            if (userName.length > 50 || userName.length < 2 || (!userName.match(Name_REGEXP))) {
                const firstNameInput = document.getElementById("firstNameInput");
                const firstName = document.getElementById("unCorrectFirstName");
                if (firstNameInput && firstName) {
                    firstNameInput.style.borderBottom = "1px solid #ff0000";
                    firstName.style.display = 'flex';
                }
                toast(language.isLanguage ? "Укажите ваше имя" : "Вкажіть ваше ім'я")

            }
            if (emailRequest && (email.length < 6 || email.length > 50 || (!email.match(EMAIL_REGEXP)))) {
                const emailInput = document.getElementById("emailInput");
                const email = document.getElementById("unCorrectEmail")
                if (emailInput && email) {
                    emailInput.style.borderBottom = "1px solid #ff0000"
                    email.style.display = 'flex';
                }
                toast(language.isLanguage ? "Для получения ответа укажите е-мейл" : "Для отримання відповіді вкажіть е-мейл")
            }
            setLoading(false)
        } else {

            // await addRating(formData).then((addRatingRes) => {
            //     toast(`Ваш коментар скоро буде опубліковано`);
            //     setComment("")
            // }).catch((error) => {
            //     toast.error(error.response?.data.message);
            // }).finally(() => {
            //     setLoading(false)
            // });

        }
    }


    return (
        <div className={classes.block_container}>
            <div className={classes.article_title}>Коментарі</div>
            <div className={classes.comment_container}>
                <label className={classes.comment_label}>{language.isLanguage ? "Комментарий" : "Коментар"}</label>
                <div className={classes.comment_text_block}>
                <textarea id="comment_textarea"
                          value={comment}
                          onChange={(event) => onChangeComment(event.target.value)}
                          className={classes.comment_textarea}/>
                    <div className={classes.label_error} id='error_label'>
                        {language.isLanguage ? "Комментарий должен иметь не более 2000 символов" : "Коментар повинен мати більше 2000 символів"}
                    </div>
                </div>
                <div className={classes.inputs_block}>
                    <label className={classes.comment_label}>{language.isLanguage ? "Ваше имя" : "Ваше ім'я"}</label>
                    <input className={classes.comment_input} id="firstNameInput" maxLength="40" formcontrolname="name"
                           onChange={(e) => {
                               ValidFirstName(e.target.value)
                           }} value={userName} type="text"/>
                    <div className={classes.reply_error}
                         id='unCorrectFirstName'>{language.isLanguage ? "Введите корректное имя кириллицей" : "Введіть корректне ім'я кирилицею"}</div>
                </div>
                <div className={classes.inputs_block}>
                    <label
                        className={classes.comment_label}>{language.isLanguage ? "Электронная почта" : "Електронна пошта"}</label>
                    <input className={classes.comment_input} id="emailInput" maxLength="50" formcontrolname="email"
                           inputMode="email" onChange={(e) => {
                        ValidEmail(e.target.value)
                    }} value={email} type="text"/>
                    <div className={classes.reply_error}
                         id='unCorrectEmail'>{language.isLanguage ? "Введите корректную эл. почту" : "Введіть корректну ел. пошту"}</div>
                </div>
                <div onClick={(e) => {
                    e.preventDefault();
                    setEmailRequest(!emailRequest)
                }} className={classes.mail_request}>
                    <input type="checkbox"
                           className={classes.custom_checkbox} id="customInput" onChange={() => {
                    }} checked={emailRequest}/>
                    <label onClick={(e) => {
                        e.preventDefault()
                    }} htmlFor="customInput"></label>
                    <div
                        className={classes.mail_request_text}>{language.isLanguage ? "Сообщать об ответах по электронной почте" : "Повідомляти про відповіді по електронній пошті"}</div>
                </div>
                <div className={classes.accept_btn}>
                    <button disabled={loading} className={"custom_btn" + " " + classes.rating_btn}
                            onClick={() => PostRating()}>{language.isLanguage ? "Опубликовать" : "Опублікувати"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentBlock;
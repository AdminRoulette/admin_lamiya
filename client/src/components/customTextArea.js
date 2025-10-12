import React, {useRef, useState} from 'react';
import classes from "../pages/Product/productPage.module.scss";
import {toast} from "react-toastify";

const CustomTextArea = ({onChange, maxLength, placeholder, value}) => {
    const textAreaRef = useRef(null);
    const [source, setSource] = useState(false);

    const addElement = async (elem) => {
        const textarea = textAreaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            if (start === end) {
                toast("Виділіть текст");
                return;
            }

            const selectedText = textarea.value.substring(start, end);
            let wrappedText;
            if (elem === 'upper') {
                wrappedText = `${selectedText.toUpperCase()}`;
            } else if (elem === 'ul_number') {
                wrappedText = `<ul style="list-style-type: decimal">${selectedText}</ul>`;
            } else if (elem === 'lower') {
                wrappedText = `${selectedText.toLowerCase()}`;
            } else if (elem === 'a') {
                wrappedText = `<${elem} href="">${selectedText}</${elem}>`;
            } else if (elem === 'li') {
                wrappedText = `<li>${selectedText.replaceAll("\n", "</li>\n<li>")}</li>`;
            } else {
                wrappedText = `<${elem}>${selectedText}</${elem}>`;
            }

            textarea.value = textarea.value.substring(0, start) + wrappedText + textarea.value.substring(end);
            const event = new Event('input', {bubbles: true});
            onChange({
                ...event,
                target: {
                    ...event.target,
                    value: textarea.value
                }
            });
            textarea.dispatchEvent(event);
        }
    }

    return (
        <>
            <div>
                <div className={classes.text_area_toolbox}>
                    <div title={"Додати список"}>
                        <span onClick={() => addElement("ul")} className="material-symbols-outlined">format_list_bulleted</span>
                    </div>
                    <div title={"Нумерований список"}>
                        <span onClick={() => addElement("ul_number")} className="material-symbols-outlined">format_list_numbered</span>
                    </div>
                    <div title={"Елемент списка"}>
                        <span onClick={() => addElement("li")} className="material-symbols-outlined">list_alt</span>
                    </div>

                    <div title={"Жирний текст"}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            onClick={() => addElement("strong")}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>
                        </svg>
                    </div>
                    <div title={"Підкреслення знизу"}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            onClick={() => addElement("u")}
                        >
                            <path d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16"/>
                        </svg>
                    </div>
                    <div title={"Посилання"}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            onClick={() => addElement("a")}>
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                    </div>
                    <div title={"Нахил текст"}>
                        <span onClick={() => addElement("em")}
                              className="material-symbols-outlined">format_italic</span>
                    </div>
                    <div title={"Абзац"}>
                        <svg style={{stroke:"none"}}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            xmlSpace="preserve"
                            width={24}
                            height={24}
                            onClick={() => addElement("p")}>
                            <path
                                d="M8.121 7.176c1.414-.007 2.78-.032 4.146-.001 1 .023 1.928.319 2.75.917 1.924 1.398 1.86 5.064-.678 6.236-1.016.469-2.081.53-3.17.513-1.139-.017-1.14-.004-1.142 1.12-.001.333-.019.668.004.999.026.38-.142.5-.5.482q-.6-.029-1.199-.001c-.343.015-.476-.116-.469-.464.016-.783.004-1.566.004-2.349 0-2.282-.003-4.565.005-6.847.001-.21-.112-.484.249-.606m5.411 5.799c.658-1.053.643-2.183.316-3.318-.213-.74-.729-1.206-1.515-1.351-.663-.122-1.328-.041-1.991-.065-.285-.01-.314.18-.313.399.001 1.581.003 3.161-.003 4.742-.001.277.109.39.386.385.532-.011 1.067.026 1.597-.014.576-.043 1.106-.235 1.524-.778M5.557 9.259l-2.615 1.687 2.21 1.431c1.128.73 1.261 1.057.986 2.418-.166.113-.28-.016-.4-.093a1593 1593 0 0 1-4.199-2.699c-.7-.452-.69-1.659.015-2.114a2238 2238 0 0 1 4.113-2.651c.122-.079.234-.195.465-.149.121.549.112 1.125.018 1.69-.043.26-.365.316-.593.481m12.513-.141c-.327-.155-.438-.382-.409-.705.038-.44-.055-.889.057-1.324.255-.048.401.115.561.218 1.375.878 2.742 1.77 4.122 2.641.261.165.31.361.35.648.116.836-.215 1.328-.944 1.745-1.241.71-2.417 1.535-3.622 2.307-.134.086-.257.224-.514.143 0-.507-.005-1.035.002-1.562.004-.263.237-.346.412-.46.905-.588 1.815-1.17 2.82-1.816l-2.836-1.836"/>
                        </svg>
                    </div>
                    <div title={"H2 Заголовок"}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            xmlSpace="preserve"
                            width={24}
                            height={24}
                            onClick={() => addElement("h2")}>
                            <path
                                d="M17.159 6.283c.552.099 1.058.187 1.541.381 1.441.577 2.073 1.958 1.553 3.424-.228.642-.597 1.193-1.133 1.615-1.191.937-2.392 1.86-3.588 2.79-.112.087-.217.183-.427.362h5.328c.049.096.086.138.09.183.08.897.078.899-.803.899-2.282.001-4.564.004-6.846-.005-.228-.001-.577.133-.647-.195-.079-.37-.193-.8.203-1.105q.95-.733 1.9-1.463c.952-.729 1.915-1.444 2.856-2.187.71-.561 1.224-1.23 1.01-2.224-.183-.848-.794-1.362-1.813-1.409-1.173-.055-2.305.149-3.244.909-.456.369-.607.061-.853-.222-.319-.367-.05-.517.205-.692 1.245-.857 2.636-1.148 4.123-1.078.166.008.333.008.545.018m-6.27 7.516c0 .6-.003 1.15.001 1.7.003.311-.128.448-.452.44-1.852-.044-1.512.29-1.543-1.444-.017-.966.009-1.933-.017-2.899-.028-1.076-.566-1.607-1.65-1.655-.482-.021-.967.009-1.45-.01-.371-.015-.449.163-.431.492.089 1.682.036 3.364.033 5.047-.001.39-.15.47-.503.473-1.495.012-1.495.021-1.496-1.451L3.38 7.344c0-.777.001-.778.753-.778h.45c.8 0 .805 0 .804.828 0 .349-.021.699-.041 1.048-.021.375.124.532.524.533.962.002 1.93-.088 2.882.161 1.455.381 2.098 1.159 2.138 2.666.017.649 0 1.3-.002 2"/>
                        </svg>
                    </div>
                    <div title={"Верхній регістр"}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            onClick={() => addElement("upper")}>
                            <path d="m3 15 4-8 4 8"/>
                            <path d="M4 13h6"/>
                            <path d="M15 11h4.5a2 2 0 0 1 0 4H15V7h4a2 2 0 0 1 0 4"/>
                        </svg>
                    </div>
                    <div title={"Нижній регістр"}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            onClick={() => addElement("lower")}>
                            <circle cx={7} cy={12} r={3}/>
                            <path d="M10 9v6"/>
                            <circle cx={17} cy={12} r={3}/>
                            <path d="M14 7v8"/>
                        </svg>
                    </div>

                    <div title={"Показати вигляд тексту"}>
                        <svg
                            style={source ? {backgroundColor: "#8d8d8d"} : {}}
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            onClick={() => setSource(!source)}>
                            <path d="M10 9.5 8 12l2 2.5m4-5 2 2.5-2 2.5"/>
                            <rect width={18} height={18} x={3} y={3} rx={2}/>
                        </svg>
                    </div>
                </div>
                {!source ? <textarea
                        ref={textAreaRef}
                        className={`${classes.text_area_container} ${!value && classes.red_input}`}
                        maxLength={maxLength}
                        placeholder={placeholder}
                        value={value}
                        onChange={(event) => onChange(event)}
                    ></textarea>
                    : <div className={classes.text_area_source} dangerouslySetInnerHTML={{__html: value}}/>}
            </div>

        </>
    );
};

export default CustomTextArea;

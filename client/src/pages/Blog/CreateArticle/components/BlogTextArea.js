import React, {useRef, useState} from 'react';
import classes from "../../blog.module.scss";
import {toast} from "react-toastify";
import BlogImageModal from "@/pages/Blog/CreateArticle/components/BlogImageModal";
import InstagramModal from "@/pages/Blog/CreateArticle/components/InstagramModal/InstagramModal";
import TikTokModal from "@/pages/Blog/CreateArticle/components/TikTokModal/TikTokModal";
import BlogProductModal from "@/pages/Blog/CreateArticle/components/BlogProductModal/BlogProductModal";
import ButtonModal from "@/pages/Blog/CreateArticle/components/ButtonModal/ButtonModal";

const BlogTextArea = ({text, setText, updateContentMenu, language}) => {
    const [imageModal, setImageModal] = useState(false);
    const [instagramModal, setInstagramModal] = useState(false);
    const [tikTokModal, setTikTokModal] = useState(false);
    const [productModal, setProductModal] = useState(false);
    const [buttonModal, setButtonModal] = useState(false);
    const textAreaRef = useRef(null);

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
            } else if (elem === 'lower') {
                wrappedText = `${selectedText.toLowerCase()}`;
            } else if (elem === 'a') {
                wrappedText = `<${elem} href="">${selectedText}</${elem}>`;
            } else if (elem === 'ul_dot') {
                wrappedText = `<ul><li>${selectedText.replaceAll("\n", "</li>\n<li>")}</li></ul>`;
            } else if (elem === 'ul_number') {
                wrappedText = `<ul style="list-style-type: decimal"><li>${selectedText.replaceAll("\n", "</li>\n<li>")}</li></ul>`;
            } else if (elem === 'ul_line') {
                wrappedText = `<ul style="list-style-type: '- '"><li>${selectedText.replaceAll("\n", "</li>\n<li>")}</li></ul>`;
            } else if (elem === 'h2') {
                wrappedText = `<h2 id="${selectedText}">${selectedText}</h2>`;
            } else {
                wrappedText = `<${elem}>${selectedText}</${elem}>`;
            }

            textarea.value = textarea.value.substring(0, start) + wrappedText + textarea.value.substring(end);
            const event = new Event('input', {bubbles: true});
            setText(textarea.value);
            textarea.dispatchEvent(event);
        }
    }

    const addElementWithoutSelect = async (elem) => {
        const textarea = textAreaRef.current;
        const start = textarea.selectionStart;
        const wrappedText = `${elem}`;

        textarea.value = textarea.value.substring(0, start) + wrappedText + textarea.value.substring(start);
        const event = new Event('input', {bubbles: true});
        setText(textarea.value);
        textarea.dispatchEvent(event);
    }

    return (<>
        {imageModal ? <BlogImageModal textAreaRef={textAreaRef} setText={setText}
                                      closeModal={() => {
                                          setImageModal(false);
                                          document.body.style.overflow = ''
                                      }}/> : <></>}
        {buttonModal ? <ButtonModal textAreaRef={textAreaRef} setText={setText}
                                    closeModal={() => {
                                        setButtonModal(false);
                                        document.body.style.overflow = ''
                                    }}/> : <></>}
        {instagramModal ? <InstagramModal textAreaRef={textAreaRef} setText={setText}
                                          closeModal={() => {
                                              setInstagramModal(false);
                                              document.body.style.overflow = ''
                                          }}/> : <></>}
        {tikTokModal ? <TikTokModal textAreaRef={textAreaRef} setText={setText}
                                    closeModal={() => {
                                        setTikTokModal(false);
                                        document.body.style.overflow = ''
                                    }}/> : <></>}
        {productModal ? <BlogProductModal textAreaRef={textAreaRef} setText={setText}
                                          closeModal={() => {
                                              setProductModal(false);
                                              document.body.style.overflow = ''
                                          }}/> : <></>}
        <div>
            <span>{language ? 'Текст статті російською:' : 'Текст статті:'}</span>
            <div className={classes.text_area_toolbox}>
                <div className={classes.area_toolbox_item}>
                    <span onClick={() => addElement("ul_dot")}
                          className="material-symbols-outlined">format_list_bulleted</span>
                    <div className={classes.toolbox_item_title}>Список з крапками</div>
                </div>
                <div className={classes.area_toolbox_item}>
                <span onClick={() => addElement("ul_number")}
                      className="material-symbols-outlined">format_list_numbered</span>
                    <div className={classes.toolbox_item_title}>Список з цифрами</div>
                </div>
                <div className={classes.area_toolbox_item}>
                    <span onClick={() => addElement("ul_line")}
                          className="material-symbols-outlined">reorder</span>
                    <div className={classes.toolbox_item_title}>Список з лініями</div>
                </div>
                <div className={classes.area_toolbox_item}>
                <span onClick={() => addElement("strong")}
                      className="material-symbols-outlined">format_bold</span>
                    <div className={classes.toolbox_item_title}>Жирний текст</div>
                </div>
                <div className={classes.area_toolbox_item}>
                <span onClick={() => addElement("em")}
                      className="material-symbols-outlined">format_italic</span>
                    <div className={classes.toolbox_item_title}>Нахил текст</div>
                </div>
                <div className={classes.area_toolbox_item}>
                <span onClick={() => addElement("u")}
                      className="material-symbols-outlined">format_underlined</span>
                    <div className={classes.toolbox_item_title}>Підкреслити знизу</div>
                </div>
                <div className={classes.area_toolbox_item}>
                <span onClick={() => addElement("a")}
                      className="material-symbols-outlined">link</span>
                    <div className={classes.toolbox_item_title}>Додати посилання</div>
                </div>

                <div className={classes.area_toolbox_item} onClick={() => addElement("p")}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        xmlSpace="preserve"
                        width={24}
                        height={24}
                    >
                        <path
                            d="M8.121 7.176c1.414-.007 2.78-.032 4.146-.001 1 .023 1.928.319 2.75.917 1.924 1.398 1.86 5.064-.678 6.236-1.016.469-2.081.53-3.17.513-1.139-.017-1.14-.004-1.142 1.12-.001.333-.019.668.004.999.026.38-.142.5-.5.482q-.6-.029-1.199-.001c-.343.015-.476-.116-.469-.464.016-.783.004-1.566.004-2.349 0-2.282-.003-4.565.005-6.847.001-.21-.112-.484.249-.606m5.411 5.799c.658-1.053.643-2.183.316-3.318-.213-.74-.729-1.206-1.515-1.351-.663-.122-1.328-.041-1.991-.065-.285-.01-.314.18-.313.399.001 1.581.003 3.161-.003 4.742-.001.277.109.39.386.385.532-.011 1.067.026 1.597-.014.576-.043 1.106-.235 1.524-.778M5.557 9.259l-2.615 1.687 2.21 1.431c1.128.73 1.261 1.057.986 2.418-.166.113-.28-.016-.4-.093a1593 1593 0 0 1-4.199-2.699c-.7-.452-.69-1.659.015-2.114a2238 2238 0 0 1 4.113-2.651c.122-.079.234-.195.465-.149.121.549.112 1.125.018 1.69-.043.26-.365.316-.593.481m12.513-.141c-.327-.155-.438-.382-.409-.705.038-.44-.055-.889.057-1.324.255-.048.401.115.561.218 1.375.878 2.742 1.77 4.122 2.641.261.165.31.361.35.648.116.836-.215 1.328-.944 1.745-1.241.71-2.417 1.535-3.622 2.307-.134.086-.257.224-.514.143 0-.507-.005-1.035.002-1.562.004-.263.237-.346.412-.46.905-.588 1.815-1.17 2.82-1.816l-2.836-1.836"/>
                    </svg>
                    <div className={classes.toolbox_item_title}>Виділити в абзац</div>
                </div>
                <div className={classes.area_toolbox_item} onClick={() => {
                    addElement("h2").then(() => {
                        updateContentMenu(language)
                    })
                }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        xmlSpace="preserve"
                        width={24}
                        height={24}
                    >
                        <path
                            d="M17.159 6.283c.552.099 1.058.187 1.541.381 1.441.577 2.073 1.958 1.553 3.424-.228.642-.597 1.193-1.133 1.615-1.191.937-2.392 1.86-3.588 2.79-.112.087-.217.183-.427.362h5.328c.049.096.086.138.09.183.08.897.078.899-.803.899-2.282.001-4.564.004-6.846-.005-.228-.001-.577.133-.647-.195-.079-.37-.193-.8.203-1.105q.95-.733 1.9-1.463c.952-.729 1.915-1.444 2.856-2.187.71-.561 1.224-1.23 1.01-2.224-.183-.848-.794-1.362-1.813-1.409-1.173-.055-2.305.149-3.244.909-.456.369-.607.061-.853-.222-.319-.367-.05-.517.205-.692 1.245-.857 2.636-1.148 4.123-1.078.166.008.333.008.545.018m-6.27 7.516c0 .6-.003 1.15.001 1.7.003.311-.128.448-.452.44-1.852-.044-1.512.29-1.543-1.444-.017-.966.009-1.933-.017-2.899-.028-1.076-.566-1.607-1.65-1.655-.482-.021-.967.009-1.45-.01-.371-.015-.449.163-.431.492.089 1.682.036 3.364.033 5.047-.001.39-.15.47-.503.473-1.495.012-1.495.021-1.496-1.451L3.38 7.344c0-.777.001-.778.753-.778h.45c.8 0 .805 0 .804.828 0 .349-.021.699-.041 1.048-.021.375.124.532.524.533.962.002 1.93-.088 2.882.161 1.455.381 2.098 1.159 2.138 2.666.017.649 0 1.3-.002 2"/>
                    </svg>
                    <div className={classes.toolbox_item_title}>H2 заголовок</div>
                </div>
                <div className={classes.area_toolbox_item} onClick={() => addElement("h3")}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        xmlSpace="preserve"
                        width={24}
                        height={24}
                    >
                        <path
                            d="M17.13 16.16c-2.109.356-4.673-.345-5.557-1.502.016-.042.025-.093.052-.131.521-.719.512-.704 1.243-.216 1.278.854 2.672 1.08 4.147.647.949-.279 1.406-1.08 1.243-2.052-.128-.761-.789-1.241-1.797-1.265a49 49 0 0 0-2.448.001c-.391.01-.53-.133-.527-.521.004-.387.103-.567.538-.566.847.001 1.701.103 2.541-.061.909-.178 1.308-.666 1.313-1.543.004-.785-.465-1.342-1.318-1.509-1.336-.262-2.578-.012-3.709.753-.497.336-.81.227-1.028-.34-.097-.252.085-.333.221-.436.873-.66 1.876-1.016 2.95-1.121 1.183-.115 2.362-.055 3.488.393 1.325.526 1.886 1.703 1.438 2.98-.226.647-.753.986-1.316 1.296.108.168.268.178.398.237.835.383 1.359.988 1.435 1.938.082 1.029-.286 1.823-1.187 2.349-.642.375-1.338.586-2.12.67M8.493 13.5c-.003-.666.009-1.283-.012-1.898-.037-1.079-.557-1.603-1.647-1.658-.498-.025-.999.006-1.498-.011-.322-.011-.378.132-.375.426.022 1.665.012 3.33.036 4.995.007.454-.147.639-.608.589a5 5 0 0 0-.898-.002c-.402.03-.517-.153-.516-.531.009-2.781.011-5.562-.002-8.343-.002-.403.156-.532.533-.507.315.021.634.024.949 0 .386-.03.55.119.536.509-.015.432.018.867-.006 1.298-.025.444.121.618.596.609.961-.018 1.927-.081 2.877.181 1.264.348 1.908 1.01 1.98 2.301.075 1.343.036 2.693.05 4.04.003.308-.121.451-.448.442-1.852-.047-1.509.305-1.547-1.491-.007-.3-.001-.6-.001-.949"/>
                    </svg>
                    <div className={classes.toolbox_item_title}>H3 заголовок</div>
                </div>
                <div className={classes.area_toolbox_item}>
                <span onClick={() => {
                    setImageModal(true);
                    document.body.style.overflow = 'hidden'
                }}
                      className="material-symbols-outlined">image</span>
                    <div className={classes.toolbox_item_title}>Додати фото</div>
                </div>
                <div className={classes.area_toolbox_item}
                     onClick={() => {
                         setInstagramModal(true);
                         document.body.style.overflow = 'hidden'
                     }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 33.6 24"
                        xmlSpace="preserve"
                        width={33.6}
                        height={24}
                    >
                        <path
                            d="M12.693 13.997c-.002-1.082.011-2.114-.008-3.146-.021-1.112-.544-1.652-1.645-1.708-.498-.025-.999.002-1.498-.009-.309-.007-.4.136-.398.427.012 1.73.007 3.46.019 5.19.002.277-.091.396-.373.388a21 21 0 0 0-1.198-.002c-.309.009-.408-.149-.408-.43q.003-3.072-.001-6.143c0-.265.104-.406.383-.397 1.545.048 3.095-.121 4.635.099 1.462.209 2.484 1.026 2.473 2.774-.008 1.231.003 2.462-.024 3.693-.007.303-.109.429-.409.405-.149-.012-.3.001-.449-.002-1.202-.023-1.08.19-1.099-1.139m3.288-4.261c.146-.853.653-1.339 1.411-1.57 1.91-.584 3.73-.374 5.436.596.066.275-.111.395-.18.556-.144.338-.35.381-.67.195a4.9 4.9 0 0 0-2.623-.676 2 2 0 0 0-.823.177c-.5.242-.567.769-.153 1.141.228.206.511.311.798.399q1.169.356 2.34.701.508.15.948.437c1.234.796 1.159 2.567-.156 3.231-1.174.592-2.444.588-3.711.465a6.3 6.3 0 0 1-2.332-.682c-.197-.104-.484-.205-.264-.51.181-.251.252-.716.767-.439 1.116.601 2.295.864 3.562.616.419-.082.779-.24.855-.707.086-.526-.292-.763-.693-.901-.769-.266-1.553-.486-2.334-.717a5.5 5.5 0 0 1-1.108-.446c-.716-.399-1.117-.98-1.069-1.866m11.641-1.572c.363 0 .68.017.995-.003.365-.023.503.126.506.491.004.37-.139.507-.503.488-.398-.021-.799.004-1.198-.007-.272-.007-.394.1-.392.379.008 1.132-.037 2.266.019 3.395.063 1.269.884 1.792 2.093 1.411.757-.238.757-.238 1.04.645a4.05 4.05 0 0 1-2.677.426c-1.661-.29-2.429-1.247-2.438-2.941-.005-.899-.024-1.798.006-2.696.016-.478-.138-.666-.623-.625-.272.023-.635.118-.656-.37-.018-.398.078-.619.55-.603.717.025.718-.003.721-.743 0-.067-.008-.134.002-.2.055-.367-.196-.911.146-1.068.481-.221 1.078-.093 1.624-.05.197.015.188.206.19.354.005.383.027.768-.003 1.148-.035.427.099.64.599.569M5.428 10.8c0 1.3-.013 2.549.006 3.799.006.412-.137.573-.55.543-.365-.026-.733-.014-1.099-.004-.301.009-.413-.129-.413-.422q.007-4.273-.003-8.547c-.001-.306.13-.393.419-.408 1.639-.088 1.639-.094 1.64 1.54z"/>
                    </svg>
                    <div className={classes.toolbox_item_title}>Інстаграм пост\профіль</div>
                </div>
                <div className={classes.area_toolbox_item}
                     onClick={() => {
                         setTikTokModal(true);
                         document.body.style.overflow = 'hidden'
                     }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 49.289 24"
                        xmlSpace="preserve"
                        width={49.289}
                        height={24}
                    >
                        <path
                            fill="none"
                            d="M30.149 24.099H.104V.108H49.37v23.991zM16.25 11.043v-4.97h-1.818v9.174h1.827v-3.048c.307 0 .573.029.83-.007.418-.059.654.114.87.465.485.787 1.014 1.546 1.532 2.311.078.115.193.284.296.288.645.027 1.291.013 2 .013l-2.432-3.553 2.291-3.288c-.59 0-1.102-.026-1.608.013a.85.85 0 0 0-.549.288c-.474.613-.953 1.23-1.344 1.896-.328.558-.738.798-1.361.675a1.13 1.13 0 0 1-.534-.259m25.033 3.668v.534h1.856v-3.044c.292 0 .542.03.782-.006.458-.069.71.137.942.513.485.786 1.013 1.547 1.538 2.307.08.116.239.244.367.249.605.026 1.212.012 1.894.012l-2.432-3.557 2.291-3.288c-.611 0-1.139-.02-1.664.012a.7.7 0 0 0-.468.253c-.572.767-1.114 1.556-1.675 2.331-.08.111-.205.257-.319.265-.419.032-.842.013-1.289.013V6.074h-1.824zm-2.284-.356c1.61-1.989.987-4.945-1.252-5.874-.952-.395-1.952-.448-2.958-.247-1.34.268-2.352.977-2.753 2.325-.412 1.384-.281 2.71.721 3.848 1.336 1.517 4.737 1.6 6.242-.051M6.502 7.042h2.962V6.07H.476v.993h3.533v8.185h1.917V7.042zm15.803 0h3.339v8.207h1.899V7.035h3.54v-.964h-9.077c.075.352.142.661.299.971m-9.823 5.404v-3.87h-1.821v6.666h1.821zm.054-5.814c-.222-.851-1.057-1.176-1.636-.633-.355.333-.414.741-.232 1.175.169.404.619.626 1.056.554.475-.078.749-.422.812-1.097"
                        />
                        <path
                            fill="#060505"
                            d="M16.251 11.091c.178.103.352.175.534.211.623.122 1.033-.117 1.361-.675.391-.666.87-1.283 1.344-1.896a.85.85 0 0 1 .549-.288c.506-.04 1.017-.013 1.608-.013l-2.291 3.288 2.432 3.553c-.708 0-1.355.013-2-.013-.103-.004-.218-.174-.296-.288-.519-.765-1.048-1.524-1.532-2.311-.216-.351-.452-.523-.87-.465-.257.036-.523.007-.83.007v3.048h-1.827V6.073h1.818zm25.033 3.572V6.074h1.824v5.229c.447 0 .87.019 1.289-.013.113-.009.238-.154.319-.265.561-.775 1.103-1.564 1.675-2.331a.7.7 0 0 1 .468-.253c.525-.032 1.054-.012 1.664-.012l-2.291 3.288 2.432 3.557c-.682 0-1.289.014-1.894-.012-.128-.006-.287-.133-.367-.249-.525-.76-1.053-1.521-1.538-2.307-.232-.375-.484-.581-.942-.513-.24.036-.49.006-.782.006v3.045h-1.856z"
                        />
                        <path
                            fill="#050305"
                            d="M38.978 14.383c-1.483 1.623-4.885 1.539-6.221.022-1.002-1.138-1.133-2.464-.721-3.848.401-1.347 1.413-2.057 2.753-2.325 1.006-.201 2.006-.148 2.958.247 2.239.929 2.862 3.886 1.231 5.903m-3.38.289c1.189.022 1.825-.41 2.143-1.553.267-.958.257-1.93-.113-2.869-.299-.761-.859-1.194-1.691-1.222-.86-.029-1.492.376-1.83 1.168-.377.884-.373 1.804-.189 2.723.178.891.649 1.543 1.68 1.752"
                        />
                        <path
                            fill="#060707"
                            d="M6.453 7.042h-.527v8.206H4.009V7.063H.477V6.07h8.988v.972zm15.807-.001a7 7 0 0 1-.253-.971h9.077v.964h-3.54v8.215h-1.9V7.042z"
                        />
                        <path fill="#080708" d="M12.482 12.496v2.746h-1.821V8.576h1.821z"/>
                        <path
                            fill="#050405"
                            d="M12.537 6.67c-.064.637-.338.981-.813 1.059-.437.072-.887-.15-1.056-.554-.182-.435-.122-.843.232-1.176.579-.543 1.414-.218 1.637.67"
                        />
                    </svg>
                    <div className={classes.toolbox_item_title}>Тік-ток відео</div>
                </div>
                <div className={classes.area_toolbox_item}>
                <span onClick={() => {
                    setProductModal(true);
                    document.body.style.overflow = 'hidden'
                }}
                      className="material-symbols-outlined">shopping_cart</span>
                    <div className={classes.toolbox_item_title}>Додати товар</div>
                </div>
                <div className={classes.area_toolbox_item}>
                <span onClick={() => addElement("upper")}
                      className="material-symbols-outlined">uppercase</span>
                    <div className={classes.toolbox_item_title}>Верхній регістр</div>
                </div>
                <div className={classes.area_toolbox_item}>
                <span onClick={() => addElement("lower")}
                      className="material-symbols-outlined">lowercase</span>
                    <div className={classes.toolbox_item_title}>Нижній регістр</div>
                </div>
                <div className={classes.area_toolbox_item}>
                <span onClick={() => addElement("s")}
                      className="material-symbols-outlined">strikethrough_s</span>
                    <div className={classes.toolbox_item_title}>Перекреслити текст</div>
                </div>
                <div className={classes.area_toolbox_item}>
                    <span className="material-symbols-outlined">sentiment_satisfied</span>
                    <div className={classes.toolbox_smile_block + " " + classes.toolbox_item_title}>
                        <div onClick={() => addElementWithoutSelect("😀")}>😀</div>
                        <div onClick={() => addElementWithoutSelect("🥰")}>🥰</div>
                        <div onClick={() => addElementWithoutSelect("😘")}>😘</div>
                        <div onClick={() => addElementWithoutSelect("😍")}>😍</div>
                        <div onClick={() => addElementWithoutSelect("😎")}>😎</div>
                        <div onClick={() => addElementWithoutSelect("🤬")}>🤬</div>
                        <div onClick={() => addElementWithoutSelect("👄")}>👄</div>
                        <div onClick={() => addElementWithoutSelect("🦷")}>🦷</div>
                        <div onClick={() => addElementWithoutSelect("💄")}>💄</div>
                        <div onClick={() => addElementWithoutSelect("❓")}>❓</div>
                        <div onClick={() => addElementWithoutSelect("❔")}>❔</div>
                        <div onClick={() => addElementWithoutSelect("❗")}>❗</div>
                        <div onClick={() => addElementWithoutSelect("⛔")}>⛔</div>
                        <div onClick={() => addElementWithoutSelect("🚫")}>🚫</div>
                        <div onClick={() => addElementWithoutSelect("🔆")}>🔆</div>
                        <div onClick={() => addElementWithoutSelect("🔥")}>🔥</div>
                        <div onClick={() => addElementWithoutSelect("😊")}>😊</div>
                        <span>Більше можна знайти за <a href="https://emojipedia.org/"
                                                        target="_blank">посиланням</a></span>
                    </div>
                </div>
                <div className={classes.area_toolbox_item}>
                    <svg onClick={() => {
                        setButtonModal(true);
                        document.body.style.overflow = 'hidden'
                    }}
                         xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 67.523 24"
                         xmlSpace="preserve"
                         width={67.523}
                         height={24}
                    >
                        <path
                            fill="#070404"
                            d="M11.94 14.787c-.965 1.402-2.365 1.907-3.922 1.978-1.591.073-3.187.016-4.828.016V5.267h2.261v2.939c.765 0 1.502-.016 2.238.003 1.398.037 2.71.354 3.742 1.371 1.308 1.288 1.515 3.444.508 5.207m-6.47.426c-.018.262-.033.482.362.463.662-.032 1.328.021 1.989-.019.923-.056 1.624-.508 1.963-1.382.451-1.163.448-2.354.014-3.523-.307-.829-.951-1.321-1.818-1.396-.816-.071-1.644-.015-2.509-.015z"
                        />
                        <path
                            fill="#050305"
                            d="M42.384 14.434c-.736-2.13-.311-4.267 1.149-5.46 1.352-1.105 2.951-1.312 4.631-1.039 3.316.538 4.968 3.806 3.447 6.816-.766 1.515-2.101 2.181-3.7 2.358-1.722.19-3.362-.055-4.65-1.356-.354-.358-.577-.846-.878-1.319m7.251-1.819c-.112-.709-.14-1.446-.357-2.122-.313-.972-1.06-1.501-2.102-1.536-1.077-.036-1.892.463-2.29 1.464-.541 1.36-.549 2.749-.013 4.114.403 1.026 1.186 1.518 2.261 1.507 1-.011 1.814-.553 2.158-1.556.191-.558.234-1.167.343-1.87"
                        />
                        <path
                            fill="#050202"
                            d="M17.779 15.465c1.124.11 2.206.194 3.329.282V8.251h2.281v8.537c-.911 0-1.835.03-2.755-.007-1.257-.051-2.53-.048-3.762-.261-1.581-.274-2.413-1.221-2.491-2.801-.089-1.814-.021-3.635-.021-5.482h2.301c0 1.767-.008 3.521.003 5.275.005.829.213 1.565 1.114 1.954"
                        />
                        <path
                            fill="#010103"
                            d="M59.711 8.301c2.525.28 3.436 1.663 3.358 3.599-.063 1.572-.015 3.147-.019 4.722 0 .036-.025.072-.048.137h-2.22c0-.774.007-1.55-.002-2.327-.011-1.097.015-2.197-.065-3.289-.082-1.121-.71-1.72-1.838-1.795-.862-.057-1.731-.011-2.65-.011v7.42h-2.284V8.294c1.917 0 3.815 0 5.768.007"
                        />
                        <path
                            fill="#050405"
                            d="M28.92 14.549c.455 1.573 1.382 1.853 3.383 1.033l.486 1.012c-1.399.64-2.802.789-4.222.256-1.35-.506-1.999-1.565-2.037-2.971-.04-1.488-.009-2.979-.009-4.527h-1.519V8.216h1.5V5.624h2.316v2.571h2.541v1.128h-2.453c0 1.759 0 3.467.015 5.225m8.773-5.221h-.504c0 1.663-.058 3.276.017 4.882.068 1.461 1.087 2.11 2.496 1.711.296-.084.583-.198.937-.321l.488.997c-1.574.693-3.128.839-4.661.052-1.091-.56-1.577-1.561-1.604-2.757-.033-1.491-.008-2.983-.008-4.534h-1.517V8.219h1.499V5.623h2.32v2.578h2.539v1.126z"
                        />
                    </svg>
                    <div className={classes.toolbox_item_title}>Додати кнопку з посиланням</div>
                </div>
            </div>

            <textarea
                id={language ? 'article_textarea_ru' : 'article_textarea'}
                ref={textAreaRef}
                className={classes.text_area}
                maxLength={50000}
                value={text}
                onChange={(event) => setText(event.target.value)}
            />
        </div>
    </>);
};

export default BlogTextArea;

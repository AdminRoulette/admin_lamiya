import React, {useState} from 'react';
import classes from '../../../../productPage.module.scss'
import {toast} from "react-toastify";

const OptionCodes = ({ optionElem,changeInfo}) => {
    const [codes, setCodes] = useState(
        optionElem.code
            ? optionElem.code.split(',').map(code => code.trim()).filter(Boolean)
            : []
    );
    const [newCode, setNewCode] = useState('');
    const [prefix, setPrefix] = useState('s0');

    const handleAddCode = (e) => {
        e.preventDefault();
        if(optionElem.sell_type === "on_tab" || optionElem.sell_type === "sell_bottle"){
            toast("Не варто додавати код в Розпив!")
        }else if(newCode === ""){
            toast("Пустий код")
        } else{
            const fullCode = `${prefix}-${newCode}`;
            if (fullCode && !codes.includes(fullCode.trim())) {
                changeInfo("code", [...codes, fullCode].join(","), optionElem.id)
                setCodes([...codes, fullCode]);
            }
            setNewCode('');
        }
    };

    const handleRemoveCode = (index) => {
        const updated = [...codes];
        updated.splice(index, 1);
        changeInfo("code", updated.join(","), optionElem.id)
        setCodes(updated);
    };

    return (
        <div className={classes.code_wrapper}>
            <div>
                <div className={classes.code_block}>
                    <div className={classes.code_list}>
                        <label className={classes.code_label}>Коди:</label>
                        {codes.map((code, idx) => (
                            <span className={classes.code_item} key={idx}>
            {code}
                                <button
                                    className={classes.remove_btn}
                                    onClick={() => handleRemoveCode(idx)}
                                    title="Видалити"
                                >
              ×
            </button>
          </span>
                        ))}
                    </div>
                    <form onSubmit={handleAddCode} className={classes.code_form}>
                        <select value={prefix} onChange={(e) => setPrefix(e.target.value)} style={{ padding: '5px' }}>
                            <option value="s0">it</option>
                            <option value="s1">luc</option>
                            <option value="s2">kosm</option>
                        </select>
                        <input
                            type="text"
                            value={newCode}
                            onChange={(e) => setNewCode(e.target.value)}
                            placeholder="Додати новий код"
                            className={classes.code_input}
                        />
                    </form>
                </div>
            </div>

            <div className="custom-select">
                <select value={optionElem.sell_type || ""}
                        onChange={(e) => {
                            changeInfo("sell_type", e.target.value, optionElem.id)
                        }}>
                    <option value={""}></option>
                    <option value={"preorder"}>По передзамовленню</option>
                    <option value={"storage"}>На складі</option>
                    <option value={"on_tab"}>Розпив</option>
                    <option value={"sell_bottle"}>Залишок у флаконі</option>
                    <option value={"tester"}>Тестер</option>
                </select>
            </div>
        </div>

    );
};

export default OptionCodes;
import React, {useState} from 'react';
import classes from "../../../productPage.module.scss";

const TagsForm = ({tags,setDeviceInfo,field}) => {
    const [tagsArray, setTagsArray] = useState(tags?.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) || []);
    const [input, setInput] = useState('');


    const addTags = (value) => {
        const newTags = value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag && !tagsArray.includes(tag));

        if (newTags.length === 0) return;

        const updatedTagsArray = [...tagsArray, ...newTags];
        setTagsArray(updatedTagsArray);
        setDeviceInfo(prev => ({ ...prev, [field]: updatedTagsArray.join(',') }));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTags(input);
            setInput('');
        }
    };

    const handleAddClick = () => {
        addTags(input);
        setInput('');
    };

    const handleDeleteClick = (tag) => {
        const updatedTagsArray = tagsArray.filter(item => item !== tag);
        setTagsArray(updatedTagsArray);
        setDeviceInfo(prev => ({ ...prev, [field]: updatedTagsArray.join(',') }));
    };

    return (
        <div  className={classes.tags_block}>
            <div className={classes.tags_box}>
            {tagsArray.map((tag, index) => (
                <span key={index} className={classes.tag}>{tag}
                    <svg onClick={()=>handleDeleteClick(tag)} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/><path
                        d="m6 6 12 12"/></svg>
                </span>
            ))}
            </div>
            <div className={classes.tags_input_wrapper}>
                <label className="input_with_placeholder">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="" type="text" maxLength="500"
                        onKeyDown={handleKeyDown}/>
                    <span className="input_field_placeholder">{field === 'tags' ? "Введіть теги" : "Введіть РУ теги"}</span>
                </label>
                <button className="second_btn" onClick={handleAddClick}>Додати</button>
            </div>
        </div>
    );
};

export default TagsForm;
import React, {useState} from "react";
import classes from '../../../productPage.module.scss';

const ImageBlock = ({setOptions, optionElem}) => {
    const [draggedIndex, setDraggedIndex] = useState(null);

    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDrop = (targetIndex) => {

        if (draggedIndex === null) return;

        const draggedItem = optionElem.deviceimages.find((img) => img.index === draggedIndex);
        if (!draggedItem) return;
        let images = optionElem.deviceimages;
        images.splice(draggedIndex, 1);
        images.splice(targetIndex, 0, draggedItem);
        const reindexed = images.map((img, idx) => ({...img, index: idx}));

        setOptions(prev => prev.map((item) => {
            if (optionElem.id === item.id) {
                return {
                    ...item, deviceimages: reindexed,
                }
            } else {
                return item;
            }
        }))
        setDraggedIndex(null);
    };

    const Delete = async (index) => {
        setOptions(prev => prev.map((item) => {
            if (optionElem.id === item.id) {
                const filteredImgs = item.deviceimages.filter((img) => img.index !== index);
                return {
                    ...item, deviceimages: filteredImgs.map((img, idx) => ({...img, index: idx})),
                }
            } else {
                return item;
            }
        }))
    };

    const selectFile = async (event) => {
        Array.from(event.target.files).forEach((file) => {
            setOptions(prev => prev.map((item) => {
                if (optionElem.id === item.id) {
                    return {...item,
                        deviceimages: [...item.deviceimages, {
                            file: file,
                            option_id: optionElem.id,
                            index: item.deviceimages.length > 0 ? item.deviceimages.length : 0
                        }],
                    }
                } else {
                    return item;
                }
            }))
        })
        event.target.value = '';
    };

    return (<>
        <div className={classes.product_edit_img_list}>
            {optionElem.deviceimages.map((imgElem, index) => (
                <div className={classes.product_edit_img_block}
                     key={imgElem.id}
                     draggable
                     onDragStart={() => handleDragStart(index, imgElem.option_id)}
                     onDragOver={(e) => e.preventDefault()}
                     onDrop={() => handleDrop(index)}
                >
                    <div className={classes.product_img_trash}>
                        <span>#{imgElem.index}</span>
                        <svg onClick={() => Delete(imgElem.index)} xmlns="http://www.w3.org/2000/svg" width="20"
                             height="20" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                            <path d="M3 6h18"/>
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </div>

                    <img
                        onClick={() => window.open(imgElem.image ? imgElem.image.replace(".webp", ".jpg") : URL.createObjectURL(imgElem.file), '_blank')}
                        src={imgElem.image ? imgElem.image : URL.createObjectURL(imgElem.file)}/>
                </div>))}
            <div className={classes.product_edit_img_block + " " + classes.product_plus_img}
                 onClick={() => {
                     document.getElementById(`uploadPhotos_${optionElem.id}`).click();
                 }}>
                <input onChange={(e)=>selectFile(e)} accept="image/webp, image/png, image/jpeg, image/jpg"
                       id={`uploadPhotos_${optionElem.id}`} type="file"
                       multiple style={{display: "none", width: "100%", height: "30px"}}/>

                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/>
                    <path d="M12 5v14"/>
                </svg>
            </div>
        </div>
    </>)
}
export default ImageBlock;

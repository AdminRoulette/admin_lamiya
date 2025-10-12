import React from 'react';
import TagsForm from "@/pages/Product/modals/CreateDeviceComponents/TagsFields/TagsForm";
import classes from "../../../productPage.module.scss";

const TagsFields = ({tags,tags_ru,setDeviceInfo}) => {
    return (
        <div className={classes.tags_container}>
            <TagsForm tags={tags} setDeviceInfo={setDeviceInfo} field={'tags'}/>
            <TagsForm tags={tags_ru} setDeviceInfo={setDeviceInfo} field={'tags_ru'}/>
        </div>
    );
};

export default TagsFields;
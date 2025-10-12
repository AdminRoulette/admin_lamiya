import React from 'react';
import CustomTextArea from "@/components/customTextArea";

const CosmeticsCareFields = ({OnChangeBodyCare,bodyCare}) => {

    return (
        <div>

            <b>Склад (англійською):</b> <textarea
            maxLength={1999}
            placeholder="Склад"
            value={bodyCare.composition}
            onChange={(event) => OnChangeBodyCare(event.target.value,'composition',1999)}
        />
            <b>Застосування:</b><textarea
            maxLength={499}
            placeholder="Застосування"
            value={bodyCare.applicationmethod}
            onChange={(event) => OnChangeBodyCare(event.target.value,'applicationmethod',499)}
        />
            <b>Застосування RU:</b><textarea
            maxLength={499}
            placeholder="Застосування RU"
            value={bodyCare.applicationmethod_ru}
            onChange={(event) => OnChangeBodyCare(event.target.value,'applicationmethod_ru',499)}
        />

            <b>Активні компоненти:</b>
            <CustomTextArea onChange={(event)=>OnChangeBodyCare(event.target.value,'activecomponents',2500)}
                    maxLength={2500} placeholder={"Активні компоненти"} value={bodyCare.activecomponents}/>
            <b>Активні компоненти RU:</b>
            <CustomTextArea onChange={(event)=>OnChangeBodyCare(event.target.value,'activecomponents_ru',2500)}
                            maxLength={2500} placeholder={"Активні компоненти RU"} value={bodyCare.activecomponents_ru}/>
        </div>
    );
};

export default CosmeticsCareFields;

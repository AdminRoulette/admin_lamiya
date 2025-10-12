import React, {useState} from "react";
import ProductTop from "./components/ProductTop";
import ProductBotInfo from "./components/ProductBotInfo";

const DeviceInfo = ({   productParam,setProductList,user,
                        deviceElem, copyName, setCopyName, copyDisc,handleEdit,
                        setCopyDisc, DiscCopyCounter, setDiscCopyCounter, setNameCopyCounter, NameCopyCounter
                    }) => {

    const [openDisc, setOpenDisc] = useState(false);

    return (
        <>
            <ProductTop deviceElem={deviceElem}
                        user={user}
                        setProductList={setProductList}
                        setOpenDisc={setOpenDisc}
                        copyName={copyName}
                        productParam={productParam}
                        openDisc={openDisc}
                        setCopyName={setCopyName}
                        copyDisc={copyDisc}
                        handleEdit={handleEdit}
                        setCopyDisc={setCopyDisc}
                        DiscCopyCounter={DiscCopyCounter}
                        setDiscCopyCounter={setDiscCopyCounter}
                        setNameCopyCounter={setNameCopyCounter}
                        NameCopyCounter={NameCopyCounter}/>

            <ProductBotInfo deviceElem={deviceElem} openDisc={openDisc}/>
        </>
    );
};
export default DeviceInfo;

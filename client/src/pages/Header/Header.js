import React, {useState} from 'react';
import CardModal from "@/pages/Header/Cart/CardModal";
import Shift from "@/pages/Header/Shift/Shift";
import CartIcon from "@/pages/Header/Cart/CartIcon";

const Header = () => {
    const [cardModalVisible, setCardModalVisible] = useState(false);

    return (
        <div className="header">
            {cardModalVisible ? <CardModal onHide={() => setCardModalVisible(false)}/> : <></>}
            <Shift/>
            <CartIcon showMobileMenu={() => {
            }} setCardModalVisible={setCardModalVisible}/>
        </div>
    );
};

export default Header;

import React, {Suspense, useEffect} from "react";
import './custom.scss';
import './admin.scss';
import {observer} from "mobx-react";
import Loader from "../components/Loader/Loader";
import "./admin.scss";

const Main = observer(() => {


    useEffect(() => {
        let linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@40,300,0,0';
        document.head.appendChild(linkElement);

        return () => {
            if (document.head.contains(linkElement)) {
                document.head.removeChild(linkElement);
            }
        };
    }, []);


    return (
        <Suspense fallback={<Loader/>}>
        <div className="admin_container">
            <>Розділ в розробці</>
        </div>
        </Suspense>
    );
});

export default Main;

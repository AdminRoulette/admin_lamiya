import React, {useContext, useEffect, Suspense, useState} from "react";
import "./globalCSS/App.scss";
import "@/pages/admin.scss";
import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter as Router} from "react-router-dom";
import {Context} from "./index";
import {ToastContainer} from "react-toastify";
import {Flip} from 'react-toastify';
import Loader from "@/components/Loader/Loader";
import {check} from "@/http/userApi";
import ScrollToTop from "@/components/Functions/ScrollToTop";
import Header from "@/pages/Header/Header";
import Menu from "@/pages/Menu/Menu";
import {CheckShift} from "@/http/ExternalApi/checkBoxAPI";

const AppRouter = React.lazy(() => import('./components/Router'));

const App = () => {
    const {user,shift} = useContext(Context);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setLoading(true);
            check()
                .then((userData) => {
                    user.setUser(userData);
                    user.setIsAuth(true);
                    if(userData.role.includes("ADMIN") || userData.role.includes("SELLER")) {
                        CheckShift().then((shiftRes) => {
                            shift.setShift(shiftRes)
                        }).catch((error) => {})
                    }
                })
                .catch(() => {})
                .finally(() => {
                    setLoading(false);
                });
        } else {
            // if(!window.location.href.includes("/login")){
            //     window.location.href = (process.env.NODE_ENV === "production" ?'https://admin.lamiya.com.ua/login':'http://localhost:3000/login')
            // }
            setLoading(false)
        }

        let linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@40,300,0,0';
        document.head.appendChild(linkElement);
    }, [user]);

    return !loading ? (
        <Suspense fallback={<Loader/>}>
            <Router>
                <div className="App">
                    <ScrollToTop/>
                    <ToastContainer
                        position="bottom-center"
                        autoClose={2500}
                        hideProgressBar={true}
                        newestOnTop={false}
                        limit={3}
                        closeOnClick
                        rtl={false}
                        transition={Flip}
                        pauseOnFocusLoss={false}
                        draggable
                        pauseOnHover={false}
                        theme="dark"/>
                    <div className="admin_container">
                        <Menu/>
                        <div className="admin_body">
                            <Header/>
                            <Suspense fallback={<></>}>
                                <AppRouter/>
                            </Suspense>
                        </div>
                    </div>
                </div>
            </Router>
        </Suspense>
    ) : (<Loader/>)
};

export default App;

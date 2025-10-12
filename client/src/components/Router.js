import React, {useContext} from 'react';
import {
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import {Context} from '../index';
import {adminRoutes, authorRoutes, filterRoutes, publicRoutes, seoRoutes} from '@/routes';
import {LOGIN_ROUTE, MAIN_ROUTE} from "@/utils/constants";

const AppRouter = () => {

    const {user} = useContext(Context).user

    return (
        <main className="Body_container">
            <Routes>
                {(user.role?.includes("ADMIN") || user.role?.includes("SELLER")) &&
                    adminRoutes.map(item =>
                        <Route path={item.path} element={<item.Component/>} exact key={item.path}></Route>
                    )}
                {(user.role?.includes("ADMIN") || user.role?.includes("FILTER")) &&
                    filterRoutes.map(item =>
                        <Route path={item.path} element={<item.Component/>} exact key={item.path}></Route>
                    )}
                {(user.role?.includes("ADMIN") || user.role?.includes("SEO")) &&
                    seoRoutes.map(item =>
                        <Route path={item.path} element={<item.Component/>} exact key={item.path}></Route>
                    )}
                {(user.role?.includes("ADMIN") || user.role?.includes("SEO") || user.role?.includes("AUTHOR")) &&
                    authorRoutes.map(item =>
                        <Route path={item.path} element={<item.Component/>} exact key={item.path}></Route>
                    )}
                {publicRoutes.map(item =>
                    <Route path={item.path} element={<item.Component/>} exact key={item.path}></Route>
                )}
                <Route path="*" element={<Navigate to={`${LOGIN_ROUTE}`} replace/>}></Route>
            </Routes>
        </main>
    )
};

export default AppRouter;

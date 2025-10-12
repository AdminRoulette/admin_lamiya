import React from "react";
import classes from './Loader.module.scss';

const Loader = () => {
    return (
        <div className={classes.loader_container}>
            <div className={classes.loader}>
                <svg viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32"></circle>
                </svg>
            </div>
        </div>
    );
};

export default Loader;

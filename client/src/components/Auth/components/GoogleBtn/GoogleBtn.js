import React, {useRef} from 'react';
import useScript from "../../../Functions/UseScript";
import classes from "../../Auth.module.scss";

const GoogleBtn = ({onGoogleSignIn}) => {

    const google_btn = useRef(null);

        useScript('https://accounts.google.com/gsi/client', () => {
                window.google.accounts.id.initialize({
                    client_id: "624389059690-u7gfdjmi9t9vbm1jtnfi7b2auc0f2bhi.apps.googleusercontent.com",
                    callback: onGoogleSignIn,
                });
                window.google.accounts.id.renderButton(google_btn.current, {
                    size: 'large',
                    text: `signin_with`,
                    type: "standard",
                    shape: "rectangular",
                    theme: 'outline',
                    width:'400',
                    logo_alignment: "center",
                });
        });

    return (
        <div className={classes.google_btn} ref={google_btn}></div>
    );
};

export default GoogleBtn;
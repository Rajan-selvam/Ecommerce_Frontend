import { useState, useEffect } from "react";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
// import { useNavigate, Link  } from 'react-router-dom';

import { clearErrors , forgotPassword } from "../../actions/userAction";
import Loader from "../layout/Loader/Loader";
import "./ForgotPassword.css";
import MetaData from "../layout/MetaData";

const ForgotPassword = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    // const navigate  = useNavigate();

    const { error, message, loading } = useSelector(state => state.forgotPassword);

    const [email, setEmail] = useState('');

    const forgotPasswordSubmitHandler = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set('email',email);
        dispatch(forgotPassword(myForm));
    };

    useEffect(()=>{

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if(message){
            alert.success(message);
        }
    },[dispatch, error, alert, message]);

    return ( <>
        {loading ? <Loader /> :
        <>
            <MetaData title="Forgot Password" />
            <div className="forgotPasswordContainer">
                <div className="forgotPasswordBox">
                    <h2 className="forgotPasswordHeading">Forgot Password</h2>
                <form className="forgotPasswordForm"
                    onSubmit={forgotPasswordSubmitHandler}
                    >
                    <div className="forgotPasswordEmail">
                        <MailOutlineIcon />
                        <input type="email" 
                            placeholder="Sample@gmail.com"
                            required
                            name="email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                    </div>
                    <input type="submit" value="Send" className="forgotPasswordBtn" />
                </form>
                </div>
            </div>
        </>
        }
    </>);
};

export default ForgotPassword;
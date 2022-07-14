import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { useNavigate, useParams } from 'react-router-dom';
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";

import { clearErrors, resetPassword } from "../../actions/userAction";
import Loader from "../layout/Loader/Loader";
import "./ResetPassword.css";
import MetaData from "../layout/MetaData";

const ResetPassword = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate  = useNavigate();
    const params = useParams();

    const { error, success, loading } = useSelector(state => state.forgotPassword);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const resetPasswordSubmitHandler = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set('password',password);
        myForm.set('confirmPassword',confirmPassword);
        dispatch(resetPassword(params.token, myForm));
    };

    useEffect(()=>{
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        console.log(success);
        if(success){
            alert.success('Password Updated Successfully!');
            navigate(`/login`);
        }
    },[dispatch, navigate, error, alert, success, params]);

    return  (<>
        {loading ? <Loader /> :
        <>
            <MetaData title="Change Password" />
            <div className="resetPasswordContainer">
                <div className="resetPasswordBox">
                    <h2 className="resetPasswordHeading">Reset Password</h2>
                <form className="resetPasswordForm"
                    encType="multipart/form-data"
                    onSubmit={resetPasswordSubmitHandler}
                    >
                    <div>
                        <LockOpenIcon />
                        <input type="password" 
                            placeholder="New Password"
                            required
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <LockIcon />
                        <input type="password" 
                            placeholder="Confirm Password"
                            required
                            value={confirmPassword}
                            onChange={(e)=> setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <input type="submit" value="Update" className="resetPasswordBtn" />
                </form>
                </div>
            </div>
        </>
        }
    </>);
};

export default ResetPassword;
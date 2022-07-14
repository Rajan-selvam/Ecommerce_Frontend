import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { useNavigate, useSearchParams } from 'react-router-dom';

import { clearErrors , login, register } from "../../actions/userAction";
import Loader from "../layout/Loader/Loader";
import "./LoginSignUp.css";
import Profile from "../../images/Profile.png";

export const LoginSignUp = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate  = useNavigate();
    let [searchParams] = useSearchParams();

    const {error, loading, isAuthenticated } = useSelector(state => state.user);

    const loginTab = useRef(null);
    const registerTab = useRef(null);
    const switcherTabs = useRef(null);

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { name, email, password } = user;
    const [avtar, setAvtar] = useState();
    const [avtarPreview, setAvtarPreview] = useState(Profile);

    const switchTabs = (e, tab) => {
        if (tab === 'login') {
            switcherTabs.current.classList.add('shiftToNeutral');
            switcherTabs.current.classList.remove('shiftToRight');

            registerTab.current.classList.remove('shiftToNeutralForm');
            loginTab.current.classList.remove('shiftToLeft');
        } else if (tab === 'register') {
            switcherTabs.current.classList.add('shiftToRight');
            switcherTabs.current.classList.remove('shiftToNeutral');

            registerTab.current.classList.add('shiftToNeutralForm');
            loginTab.current.classList.add('shiftToLeft');
        }
    };

    const LoginSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(login(loginEmail, loginPassword));
    };
   
    const registerSubmitHandler = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set('name',name);
        myForm.set('email',email);
        myForm.set('password',password);
        myForm.set('avtar',avtar);
        dispatch(register(myForm));
    };

    const registerDataChange = (e) => {
        if (e.target.name === 'avtar') {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvtarPreview(reader.result);
                    setAvtar(reader.result);
                }
            }
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({ ...user, [e.target.name]: [e.target.value]});
        }
    };
    
    const redirect = searchParams.get("redirect") ? searchParams.get("redirect") :"/profile";

    useEffect(()=>{
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if(isAuthenticated){
            navigate(redirect);
        }
    },[dispatch, error, alert, navigate, isAuthenticated, redirect]);

    return ( <>
       { loading ? <Loader /> :
        <div className="LoginSignUpContainer">
        <div className="LoginSignUpBox">
            <div>
                <div className="login_signUp_toggle">
                    <p onClick={(e)=> switchTabs(e, 'login')}>LOGIN</p>
                    <p onClick={(e)=> switchTabs(e, 'register')}>REGISTER</p>
                </div>
                <button ref={switcherTabs}></button>
            </div>
            <form className="loginForm" ref={loginTab} onSubmit={LoginSubmitHandler}>
                <div className="loginEmail">
                    <MailOutlineIcon />
                    <input type="email" 
                        placeholder="Sample@gmail.com"
                        required
                        value={loginEmail}
                        onChange={(e)=> setLoginEmail(e.target.value)}
                    />
                </div>
                <div className="loginPassword">
                    <LockOpenIcon />
                    <input type="password" 
                        placeholder="xxxx xxxx"
                        required
                        value={loginPassword}
                        onChange={(e)=> setLoginPassword(e.target.value)}
                    />
                </div>
                <Link to="/password/forgot">Forgot Password ?</Link>
                <input type="submit" value="Login" className="loginBtn" />
            </form>
            <form className="signUpForm"
                 ref={registerTab}
                 encType="multipart/form-data"
                 onSubmit={registerSubmitHandler}
                 >
                <div className="signUpName">
                    <FaceIcon />
                    <input type="text" 
                        placeholder="Enter the User Name"
                        required
                        name="name"
                        value={name}
                        onChange={registerDataChange}
                    />
                </div>
                <div className="signUpEmail">
                    <MailOutlineIcon />
                    <input type="email" 
                        placeholder="Sample@gmail.com"
                        required
                        name="email"
                        value={email}
                        onChange={registerDataChange}
                    />
                </div>
                <div className="signUpPassword">
                    <LockOpenIcon />
                    <input type="password" 
                        placeholder="xxxx xxxx"
                        required
                        name="password"
                        value={password}
                        onChange={registerDataChange}
                    />
                </div>
                <div id="registerImage">
                    <img src={avtarPreview} alt="Avtar Preview" />
                    <input 
                        type="file"
                        name="avtar"
                        accept="image/*"
                        onChange={registerDataChange}
                    />
                </div>
                <input type="submit" value="Register" className="signUpBtn" />
            </form>
        </div>
    </div>
    }
    </> );
};
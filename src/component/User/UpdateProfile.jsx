import { useState, useEffect } from "react";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import FaceIcon from "@material-ui/icons/Face";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { useNavigate, Link  } from 'react-router-dom';

import { clearErrors , loadUser, updateProfile } from "../../actions/userAction";
import Loader from "../layout/Loader/Loader";
import "./UpdateProfile.css";
import Profile from "../../images/Logo.jpg";
import { UPDATE_PROFILE_RESET } from "../../constants/userConstant";
import MetaData from "../layout/MetaData";

const UpdateProfile = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate  = useNavigate();

    const { user } = useSelector(state => state.user);
    const { error, isUpdated, loading } = useSelector(state => state.profile);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [avtar, setAvtar] = useState();
    const [avtarPreview, setAvtarPreview] = useState(Profile);

    const updateProfileSubmitHandler = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set('name',name);
        myForm.set('email',email);
        myForm.set('avtar',avtar);
        dispatch(updateProfile(myForm));
    };

    const updateProfileDataChange = (e) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvtarPreview(reader.result);
                setAvtar(reader.result);
            }
        }
        reader.readAsDataURL(e.target.files[0]);
    };

    useEffect(()=>{

        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvtarPreview(user.avtar.url);
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        
        if(isUpdated){
            alert.success('Profile Updated Successfully!');
            dispatch(loadUser());
            navigate(`/profile`);

            dispatch({
                type: UPDATE_PROFILE_RESET
            });
        }
    },[dispatch, error, alert, navigate, isUpdated, user]);

    return (
        <>
            {loading ? <Loader /> :
            <>
                <MetaData title="Update User Profile" />
                <div className="updateProfileContainer">
                    <div className="updateProfileBox">
                        <h2 className="updateProfileHeading">Update Profile</h2>
                    <form className="updateProfileForm"
                        encType="multipart/form-data"
                        onSubmit={updateProfileSubmitHandler}
                        >
                        <div className="updateProfileName">
                            <FaceIcon />
                            <input type="text" 
                                placeholder="Enter the User Name"
                                required
                                name="name"
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                            />
                        </div>
                        <div className="updateProfileEmail">
                            <MailOutlineIcon />
                            <input type="email" 
                                placeholder="Sample@gmail.com"
                                required
                                name="email"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                            />
                        </div>
                        <div id="updateProfileImage">
                            <img src={avtarPreview} alt="Avtar Preview" />
                            <input 
                                type="file"
                                name="avtar"
                                accept="image/*"
                                onChange={updateProfileDataChange}
                            />
                        </div>
                        <input type="submit" value="updateProfile" className="updateProfileBtn" />
                    </form>
                    </div>
                </div>
            </>
            }
        </>
    );
};

export default UpdateProfile;
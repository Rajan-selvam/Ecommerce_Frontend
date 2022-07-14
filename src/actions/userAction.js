import axios from 'axios';
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    CLEAR_ERRORS,
} from "../constants/userConstant";

const API_URL = "http://localhost:4000/api/v1";

//login
export const login = (email, password) => async(dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST });

        const config = { headers: { 'Content-Type': 'application/json' }};

        const { data } = await axios.post(
            `${API_URL}/login`,
            {email, password},
            config
        );

        await setCookie(data.token);

        dispatch({ type: LOGIN_SUCCESS, payload: data.user });
        
    } catch (error) {
        dispatch({ type: LOGIN_FAIL, payload: error.response.data.message });
    }
};

//register
export const register = (userData) => async(dispatch) => {
    try {
        dispatch({type: REGISTER_USER_REQUEST });

        const config = { headers: { 'Content-Type': 'multipart/form-data' }};

        const { data } = await axios.post(`${API_URL}/register`, userData, config);

        await setCookie(data.token);

        dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user });
    } catch (error) {
        dispatch({ type: REGISTER_USER_FAIL, payload: error.response.data.message });
    }
};

//Load User
export const loadUser = () => async(dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST });

        let link = `${API_URL}/current-user`;

        const { data } = await axios.get(link,{
            "Content-Type": "application/json",
            withCredentials: true
          });
        dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
        
    } catch (error) {
        dispatch({ type: LOAD_USER_FAIL, payload: "Kindly Login to Access" });
    }
};

//Logout
export const logout = () => async (dispatch) =>{
    try {

        await delete_cookie('token');
        
        const {data} = await axios.get(`${API_URL}/logout`);
        
        await dispatch({ type: LOGOUT_SUCCESS });

    } catch (error) {
        // dispatch({ type: LOGOUT_FAIL, payload: error.response.data.message });
    }
};

//clear errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
}

//Update Profile
export const updateProfile = (userData) => async(dispatch) => {
    try {
        dispatch({type: UPDATE_PROFILE_REQUEST });

        const config = { headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
                };

        const { data } = await axios.put(`${API_URL}/user/update`, userData, config);

        dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data.success });
    } catch (error) {
        dispatch({ type: UPDATE_PROFILE_FAIL, payload: error.response.data.message });
    }
};

//Update Password
export const updatePassword = (passwords) => async(dispatch) => {
    try {
        dispatch({type: UPDATE_PASSWORD_REQUEST });

        const config = { headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            };

        const { data } = await axios.put(`${API_URL}/password/update`, passwords, config);

        dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: data.success });
    } catch (error) {
        dispatch({ type: UPDATE_PASSWORD_FAIL, payload: error.response.data.message });
    }
};

//forgot Password
export const forgotPassword = (email) => async(dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST });

        const config = { headers: { 'Content-Type': 'application/json' }};

        const { data } = await axios.post(
            `${API_URL}/password/forgot`,
            email,
            config
        );

        await setCookie(data.token);

        dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data });
        
    } catch (error) {
        dispatch({ type: FORGOT_PASSWORD_FAIL, payload: error.response.data.message });
    }
};

//reset Password
export const resetPassword = (token,passwords) => async(dispatch) => {
    try {
        dispatch({ type: RESET_PASSWORD_REQUEST });

        const config = { headers: { 'Content-Type': 'application/json' }};

        const { data } = await axios.put(
            `${API_URL}/password/reset/${token}`,
            passwords,
            config
        );

        await setCookie(data.token);

        dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.success });
        
    } catch (error) {
        dispatch({ type: RESET_PASSWORD_FAIL, payload: error.response.data.message });
    }
};


const setCookie = (value) => {
    const d = new Date();
    d.setTime(d.getTime() + (60*60*3600));
    let expires = "Expires="+ d.toUTCString();
    document.cookie = "token =" + (value || "") + "; Path =/;"+ expires + ";";
}

const delete_cookie = (name) => {
    document.cookie = 'token = ;Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    console.log(document.cookie);
};
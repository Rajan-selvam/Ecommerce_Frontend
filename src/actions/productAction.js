import axios from "axios";
import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL,
    ADMIN_PRODUCT_REQUEST,
    ADMIN_PRODUCT_SUCCESS,
    ADMIN_PRODUCT_FAIL,
    NEW_PRODUCT_SUCCESS,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_FAIL,
    CLEAR_ERRORS
} from "../constants/productConstant";

const API_URL = "http://localhost:4000/api/v1";

export const getProduct = (keyword='',currentPage=1,price=[0,5000],category,ratings=0) => async (dispatch) => {
    try{
        dispatch({ type: ALL_PRODUCT_REQUEST });

        let link = `${API_URL}/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&rating[gte]=${ratings}`;

        if (category) {
            link = `${API_URL}/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&rating[gte]=${ratings}&category=${category}`;
        }

        const {data} = await axios.get(link);
        
        dispatch({
            type: ALL_PRODUCT_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: ALL_PRODUCT_FAIL,
            payload: error.response.data.message,
        });
    }
};

export const getAllProducts = () => async(dispatch) => {
    try {
        dispatch({ type: ADMIN_PRODUCT_REQUEST });

        const config = { withCredentials: true };

        const { data } = await axios.get(`${API_URL}/admin/products`, config);

        dispatch({
            type: ADMIN_PRODUCT_SUCCESS,
            payload: data.products 
        });
    } catch (error) {
        dispatch({
            type: ADMIN_PRODUCT_FAIL,
            payload: error.response.data.message,
        });
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
}

export const getProductDetails = (id) => async (dispatch) => {
    try{
        dispatch({ type: PRODUCT_DETAILS_REQUEST });

        const {data} = await axios.get(`${API_URL}/product/${id}`);

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message,
        });
    }
};

export const newReview = (reviewData) => async (dispatch) => {
    try{
        dispatch({ type: NEW_REVIEW_REQUEST });

        const config = {
            headers: {
              "Content-Type": "application/json",
            },withCredentials: true
          };
      
        const { data } = await axios.put(`${API_URL}/review`,reviewData,config);
      

        dispatch({
            type: NEW_REVIEW_SUCCESS,
            payload: data.success
        });
    } catch (error) {
        dispatch({
            type: NEW_REVIEW_FAIL,
            payload: error.response.data.message,
        });
    }
};

export const createNewProduct = (productData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_PRODUCT_REQUEST });

        const config = {
            headers: {
                "Content-Type" : "application/json",
            }, withCredentials: true
        };

        const { data } = await axios.post(`${API_URL}/admin/product/new`,productData,config);

        dispatch({
            type: NEW_PRODUCT_SUCCESS,
            payload: data,
            
        });

    } catch (error) {
        dispatch({
            type: NEW_PRODUCT_FAIL,
            payload: error.response.data.message
        });
    }
};

export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_PRODUCT_REQUEST });

        const config = { withCredentials: true };

        const { data } = await axios.delete(`${API_URL}/admin/product/${id}`,config);

        dispatch({
            type: DELETE_PRODUCT_SUCCESS,
            payload: data.success
        });

    } catch (error) {
        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload: error.response.data.message
        });
    }
};

export const updateProduct = (id,productData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PRODUCT_REQUEST });

        const config = {
            headers: {
                "Content-Type" : "application/json",
            }, withCredentials: true
        };

        const { data } = await axios.put(`${API_URL}/admin/product/${id}`,productData,config);

        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data.success,
            
        });

    } catch (error) {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: error.response.data.message
        });
    }
};
import axios from "axios";
import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
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
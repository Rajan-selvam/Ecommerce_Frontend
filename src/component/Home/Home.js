import { CgMouse } from "react-icons/all";

import ProductCard from "./ProductCard";
import "./Home.css";
import MetaData from "../layout/MetaData";
import { getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux" 
import { useEffect } from "react";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert"
import {clearErrors} from "../../actions/productAction"; 

const Home = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const {loading, error, products} = useSelector(state=>state.product);

    useEffect(() => {
        if(error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct());
    },[dispatch, error, alert]);

    return (
       
    <>
       <MetaData title="Ecommerce" />
        <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>Find Amazing Products Below</h1>
            <a href="#container">
                <button>
                    Scroll <CgMouse />
                </button>
            </a>
        </div>
        { loading ? (<Loader/>) :
        (<div id="container">
            <h2 className="homeHeading">Featured Products</h2>

            <div className="container">
                {products && products.map(product => (
                    <ProductCard product={product} key={product._id}/>
                ))}
            </div>
        </div>)
        }
    </> 
    );
};

export default Home;
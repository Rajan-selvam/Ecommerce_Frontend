import "./Products.css";
import Loader from "../layout/Loader/Loader";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import ProductCard from "../Home/ProductCard";
import { useEffect, useState } from "react";
import { useParams  } from "react-router-dom";
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import {useAlert} from "react-alert";
import MetaData from "../layout/MetaData";

const categories = [
    "Laptop",
    "FootWear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones"
];

export const Products = () => {

    const dispatch = useDispatch();

    let params = useParams();

    const alert = useAlert();

    const [currentPage, setCurrentPage ] = useState(1);

    const [price, setPrice ] = useState([0, 25000]);
    
    const [category, setCategory ] = useState('');

    const [ratings, setRatings] = useState(0);

    const { 
        products, 
        loading, 
        error, 
        productsCount, 
        resultPerPage,
        filteredProductsCount
        } = useSelector( state => state.product );

    const keyword = params.keyword;

    let count = filteredProductsCount;

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    };

    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
    };
    
    useEffect(()=>{
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct(keyword,currentPage,price,category,ratings));
    },[dispatch, keyword, currentPage, price, category, ratings, alert, error]);

    return (
        <>
            {loading ? <Loader /> : (
                <>
                <MetaData title="Products" />
                    <h2 className="productsHeading">Products</h2>
                    <div className="products">
                        {products && products.map((product)=> (
                            <ProductCard product={product} key={product._id}/>
                        ))}
                    </div>

                    <div className="filterBox">
                        <Typography>Price</Typography>
                        <Slider
                        value={price}
                        onChange={priceHandler}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        min={0}
                        max={5000}
                        />
                        <Typography>Categories</Typography>
                        <ul className="categoryBox">
                            {categories.map((category)=>(
                                <li className="category-link"
                                key={category}
                                onClick={()=>setCategory(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>

                        <fieldset>
                            <Typography component="legend">Rating Above</Typography>
                            <Slider 
                                value={ratings}
                                onChange={(e, newRating)=> setRatings(newRating) }
                                aria-labelledby="continuous-slider"
                                min={0} max={5} 
                                valueLabelDisplay="auto"
                            />
                        </fieldset>

                    </div>

                    { currentPage < count && (
                        <div className="paginationBox">
                        <Pagination 
                            activePage={currentPage}
                            itemsCountPerPage={resultPerPage}
                            totalItemsCount={productsCount}
                            onChange={setCurrentPageNo}
                            nextPageText="Next"
                            prevPageText="Prev"
                            firstPageText="1st"
                            lastPageText="Last"
                            itemClass="page-item"
                            linkClass="page-link"
                            activeClass="pageItemActive"
                            activeLinkClass="pageLinkActive"
                        />
                    </div>
                    )}
                </>
            )}
        </>
    );
};
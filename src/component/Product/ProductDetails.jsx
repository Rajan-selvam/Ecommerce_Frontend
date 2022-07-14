import Carousel from 'react-material-ui-carousel'
import "./ProductDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetails } from "../../actions/productAction";
import { useEffect, useState } from 'react';
import { useParams  } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import ReviewCard from "./ReviewCard.jsx";
import Loader from "../layout/Loader/Loader";
import {clearErrors} from "../../actions/productAction"; 
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { addItemsToCart } from '../../actions/cartActions';


export const ProductDetails = () => {
    const dispatch = useDispatch();
    let params = useParams();
    const alert = useAlert();

    const { product, loading, error } = useSelector((state) => state.productDetails);
    const images = product.images;

    const options = {
        edit: false,
        color: "rgba(20,20,20,0.1)",
        activeColor: "tomato",
        size: window.innerWidth < 600 ? 20: 25 ,
        value: product.rating,
        isHalf: true
    };

    const [quantity, setQuantity] = useState(1);

    const increaseQuantity = () => {
        if(product.stock <= quantity)return;

        const qty = quantity + 1;
        setQuantity(qty);
    };

    const decreaseQuantity = () => {
        if( 1 >= quantity)return;
        const qty = quantity - 1;
        setQuantity(qty);
    };

    const addToCartHandler = () => {
        dispatch(addItemsToCart(params.id, quantity));
        alert.success(`${product.name} Added to Cart`);
    };

    useEffect(()=>{
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProductDetails(params.id));
    },[dispatch, params.id, error, alert]);
    console.log(product);
    return (
       <>
        {loading ? <Loader /> : 
        ( <>
            <MetaData title={`${product.name}`} />
            <div className="ProductDetails">
                <div>
                    <Carousel>
                        { images &&
                            Object.entries(images).map((item, i) =>
                                (
                            <img className='CarouselImage'
                            key={item[1].url}
                            src={item[1].url}
                            alt={`${i} Slide`}/>
                        ))
                    }
                    </Carousel>
                </div>
                <div>
                    <div className='detailsBlock-1'>
                        <h2>{product.name}</h2>
                        <p>Product # {product._id}</p>
                    </div>
                    <div className='detailsBlock-2'>
                        <ReactStars {...options} />
                        <span> ( {product.numOfReviews } Reviews ) </span>
                    </div>
                    <div className='detailsBlock-3'>
                        <h1>{`₹${product.price}`}</h1>
                        <div className='detailsBlock-3-1'>
                            <div className='detailsBlock-3-1-1'> 
                                <button onClick={decreaseQuantity}>-</button>
                                <input readOnly value={quantity} type='number' />
                                <button onClick={increaseQuantity}>+</button>
                            </div>{" "}
                            <button disabled={product.stock > 1? true : false } onClick={addToCartHandler}>Add to Cart</button>
                        </div>
                        <p>
                            Status: {" "}
                            <b className={product.stock < 1 ? "redColor": "greenColor"}>
                                {product.stock < 1 ? "OutOfStock" : "InStock"}
                            </b>
                        </p>
                    </div>
                    <div className='detailsBlock-4'>
                        Description : <p>{product.description}</p>
                    </div>
                    <button className='submitReview'>Submit Review</button>
                </div>
            </div> 
            <h3 className='reviewsHeading'>Reviews</h3>
            { product.reviews && product.reviews[0] ? (
                <div className='reviews'>
                    {product.reviews &&
                     product.reviews.map((review) => <ReviewCard key={review._id} review={review} />)}
                </div>
            ) : ( <p className='noReviews'>No Reviews Yet!</p> )}
            </>
            )}
       </>
    );
};

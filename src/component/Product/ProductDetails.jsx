import Carousel from 'react-material-ui-carousel'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { useParams  } from "react-router-dom";
import { useAlert } from "react-alert";
import { Rating } from '@material-ui/lab';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button
} from '@material-ui/core';

import { addItemsToCart } from '../../actions/cartActions';
import { getProductDetails, newReview } from "../../actions/productAction";
import { NEW_REVIEW_RESET } from '../../constants/productConstant';
import { clearErrors } from "../../actions/productAction"; 
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import ReviewCard from "./ReviewCard.jsx";
import "./ProductDetails.css";

export const ProductDetails = () => {

    const dispatch = useDispatch();
    let params = useParams();
    const alert = useAlert();

    const { product, loading, error } = useSelector((state) => state.productDetails);
    const { success, error: reviewError } = useSelector((state) => state.newReview);

    const images = product.images;

    const options = {
        size: 'large' ,
        value: product.rating,
        readOnly: true,
        precision: 0.5,
    };

    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState();

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

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
    };

    const reviewSubmitHandler = () => {
        const myForm = new FormData();
        myForm.set('rating', rating);
        myForm.set('comment', comment);
        myForm.set('productId', params.id);
        dispatch(newReview(myForm));
        setOpen(false);
    };

    useEffect(()=>{
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors());
        }
        if (success) {
            alert.success('Review Submitted Successfully.');
            dispatch({ type: NEW_REVIEW_RESET});
        }
        dispatch(getProductDetails(params.id));
    },[dispatch, params.id, error, reviewError, success, alert]);
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
                        <Rating {...options} />
                        <span className='detailsBlock-2-span'> 
                        {" "}( {product.numOfReviews } Reviews ) </span>
                    </div>
                    <div className='detailsBlock-3'>
                        <h1>{`₹${product.price}`}</h1>
                        <div className='detailsBlock-3-1'>
                            <div className='detailsBlock-3-1-1'> 
                                <button onClick={decreaseQuantity}>-</button>
                                <input readOnly value={quantity} type='number' />
                                <button onClick={increaseQuantity}>+</button>
                            </div>{" "}
                            <button disabled={product.stock < 1? true : false } onClick={addToCartHandler}>Add to Cart</button>
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
                    <button onClick={submitReviewToggle} className='submitReview'>Submit Review</button>
                </div>
            </div> 
            <h3 className='reviewsHeading'>Reviews</h3>
            <Dialog 
                aria-labelledby='simple-dialog-title'
                open={open}
                onClose={submitReviewToggle}
            >
                <DialogTitle>Submit Review</DialogTitle>
                <DialogContent className='submitDialog'>
                    <Rating onChange={(e)=> setRating(e.target.value)}
                        value={rating}
                        rows="5"
                    />
                    <textarea className='submitDialogTextArea'
                    cols='30' 
                    rows='5'
                    value={comment}
                    onChange={(e)=>{setComment(e.target.value)}}
                    ></textarea>
                </DialogContent>
                <DialogActions>
                    <Button onClick={submitReviewToggle} color='secondary'>Cancel</Button>
                    <Button onClick={reviewSubmitHandler} color='primary'>Submit</Button>
                </DialogActions>
            </Dialog>
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

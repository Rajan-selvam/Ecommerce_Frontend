import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { useAlert } from "react-alert";
import { Typography } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";
// import stripe
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import axios from "axios";
import "./payment.css";
import {
    CreditCard,
    Event,
    VpnKey
} from "@material-ui/icons";
import { createOrder, clearErrors } from "../../actions/orderAction";

const Payment = () => {

    const navigate = useNavigate();
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));

    const dispatch = useDispatch();
    const alert = useAlert();
    const stripe = useStripe();
    const elements = useElements();
    const payBtn = useRef(null);

    const  { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder);

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100),
    };

    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice,
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        payBtn.current.disabled = true;

        try {
            const config = {
                headers: {
                    "Content-Type" : "application/json",
                },
                withCredentials: true,
            };

            const API_URL = "http://localhost:4000/api/v1";

            const { data } = await axios.post(
                `${API_URL}/payment/process`,
                paymentData,
                config
            );

            const client_secret = data.client_secret;

            if (!stripe || !elements) return;

            const result = await stripe.confirmCardPayment(client_secret,{
                payment_method:{
                    card: elements.getElement(CardNumberElement),
                    billing_details:{
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country,
                        },
                    },
                },
            });

            if (result.error) {
                payBtn.current.disabled = false;

                alert.error(result.error.message);
            } else {
                if (result.paymentIntent.status === "succeeded") {
                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status,
                    };
                    console.log(order);
                    dispatch(createOrder(order));

                    navigate("/success");
                } else {
                    alert.error("There's some issue while processing payment!");
                }
            }

        } catch (error) {
            payBtn.current.disabled = false;
            alert.error(error.response.data.message);
        }
    };

    useEffect(() => {
        if (error) {
          alert.error(error);
          dispatch(clearErrors());
        }
    }, [dispatch, error, alert]);

    return (
        <>
            <MetaData title="Payment" />
            <CheckoutSteps activeStep={2} />
            <div className="paymentContainer">
                <form className="paymentForm" onSubmit={(e)=> submitHandler(e)}>
                    <Typography>Card Info</Typography>
                    <div>
                        <CreditCard />
                        <CardNumberElement className="paymentInput" />
                    </div>
                    <div>
                        <Event />
                        <CardExpiryElement className="paymentInput" />
                    </div>
                    <div>
                        <VpnKey />
                        <CardCvcElement className="paymentInput" />
                    </div>
                    <input type="submit"
                        value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
                        ref={payBtn}
                        className="paymentFormBtn"
                    />
                </form>
            </div>
        </>
    );
};

// export const removeCartItems = (cartItems) => {

// };

export default Payment;
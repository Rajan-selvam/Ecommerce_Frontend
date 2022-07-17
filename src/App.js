import Header from "./component/layout/Header/Header";
import Footer from "./component/layout/Footer/Footer";
import { Routes, Route } from "react-router-dom";
import './App.css';
import { useState, useEffect, useCallback } from "react";
import WebFont from "webfontloader";
import axios from "axios";
import Home from "./component/Home/Home";
import { ProductDetails } from "./component/Product/ProductDetails";
import { Products } from "./component/Product/Products";
import { Search } from "./component/Product/Search";
import { LoginSignUp } from "./component/User/LoginSignUp";
import store from "./Store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import Payment from "./component/Cart/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/orderSuccess";
import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";
import Dashboard from "./component/Admin/Dashboard";
import ProductList from "./component/Admin/ProductList";

const App = () => {

  const {isAuthenticated, user} = useSelector(state => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  const isAdmin = user && user.role && user.role === 'admin';

  const getStripApiKey = async () => {
    const API_URL = "http://localhost:4000/api/v1";
    const {data} = await axios.get(`${API_URL}/stripeapikey`,{
      withCredentials: true
    });
    
    setStripeApiKey(data.stripeApiKey);
  };

  const memoizedCallback = useCallback(()=> {
    getStripApiKey();
  },[isAuthenticated,user]);

  useEffect(()=>{
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      }
    });

    store.dispatch(loadUser());

    memoizedCallback();
    
    // getStripApiKey();

  },[]);

  return (
    <>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/product/:id" element={<ProductDetails />} />
          <Route exact path="/products" element={<Products />} />
          <Route path="/products/:keyword" element={<Products />} />
          <Route exact path="/search" element={<Search />} />
          { isAuthenticated && <Route exact path="/profile" element={<Profile />} /> }
          <Route exact path="/login" element={<LoginSignUp />} />
          { isAuthenticated &&  <Route exact path="/user/update" element={<UpdateProfile />} />}
          { isAuthenticated &&  <Route exact path="/password/update" element={<UpdatePassword />} />}
          <Route exact path="/password/forgot" element={<ForgotPassword />} />
          <Route exact path="/password/reset/:token" element={<ResetPassword />} />
          <Route exact path="/cart" element={<Cart />} />
          { isAuthenticated &&  <Route exact path="/login/shipping" element={<Shipping />} />}
          { isAuthenticated &&  <Route exact path="/order/confirm" element={<ConfirmOrder />} />}
          { isAuthenticated &&  <Route exact path="/process/payment"
           element={ stripeApiKey &&  <Elements stripe={loadStripe(stripeApiKey)}><Payment /></Elements>} />}
          <Route exact path="/success" element={isAuthenticated && <OrderSuccess />} />
          <Route exact path="/orders" element={isAuthenticated && <MyOrders />} />
          <Route exact path="/order/:id" element={isAuthenticated && <OrderDetails />} />
          <Route exact path="/admin/dashboard" element={(isAuthenticated && isAdmin) && <Dashboard />} />
          <Route exact path="/admin/products" element={(isAuthenticated && isAdmin) && <ProductList />} />
        </Routes>
      <Footer />
      </>
  );
}

export default App;
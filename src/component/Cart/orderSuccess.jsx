import { CheckCircle } from "@material-ui/icons";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

import './orderSuccess.css';

const OrderSuccess = () => {
    
    return (
        <div className="orderSuccess">
            <CheckCircle />
            <Typography>Your Order has been Placed Successfully.</Typography>
            <Link to='/orders'>View Orders</Link>
        </div>
    );
    
};

export default OrderSuccess;
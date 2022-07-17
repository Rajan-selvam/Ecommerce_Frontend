import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { ShoppingCart } from "@material-ui/icons";
import { Backdrop } from "@material-ui/core";

import { logout } from "../../../actions/userAction";
import Profile from "../../../images/Profile.png";
import "./Header.css";

const UserOptions = ({user}) => {
    const {cartItems} = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const dashboard = () => { navigate('/admin/dashboard')};
    const orders = () => { navigate('/orders')};
    const account = () => { navigate('/profile')};
    const cart = () => { navigate('/cart')};
    const logoutUser = async () => {
        await dispatch(logout());
        navigate('/');
        window.location.reload();
    };

    const options = [
        { icon: <ListAltIcon />, name: "Orders", func: orders },
        { icon: <PersonIcon />, name: "Profile", func: account },
        { icon: <ShoppingCart 
            style={{ color: cartItems.length > 0 ? "tomato" : "unset"}}
        />, name: `Cart(${cartItems.length})`, func: cart },
        { icon: <ExitToAppIcon />, name: "Log Out", func: logoutUser },
    ];

    if (user.role === 'admin') {
        options.unshift({
            icon: <DashboardIcon />,
            name: "DashBoard",
            func: dashboard,
        });
    }

    return <>
        <Backdrop open={open} style={{ zIndex: "10" }} />
        <SpeedDial
            ariaLabel="SpeedDail Tooltip example"
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            direction="down"
            className="speedDial"
            icon={<img
                    style={{height: "100px"}}
                    className="speedDailIcon"
                    src={user.avtar.url ?? Profile}
                    alt="Profile"
                />}
        >
           {options.map((item, index)=>(
                <SpeedDialAction key={index} icon={item.icon} 
                tooltipTitle={item.name} onClick={item.func}
                tooltipOpen={window.innerWidth <= 600? true : false} />
           ))}
        </SpeedDial>
    </>;
};

export default UserOptions;
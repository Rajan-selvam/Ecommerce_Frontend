import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { getAllProducts } from "../../actions/productAction";
import { getAllOrders } from '../../actions/orderAction';
import Sidebar from './Sibebar';
import './dashboard.css';

const Dashboard = () => {

    const dispatch = useDispatch();

    const { products } = useSelector(state => state.product);
    const { orders } = useSelector(state => state.allOrders);
    const { users } = useSelector(state => state.allUsers);

    let outOfStock = 0;

    products && products.forEach(item => {
        if (item.stock === 0) {
            outOfStock += 1;
        }
    });

    useEffect(()=>{
        dispatch(getAllProducts());
        dispatch(getAllOrders());
        dispatch(getAllUsers());
    },[dispatch]);

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
        ArcElement
      );

    const lineState = {
        labels: ["Initial Amount", "Amount Earned"],
        datasets: [
            {
                label: "TOTAL AMOUNT",
                backgroundColor: ["tomato"],
                hoverBackgroundColor: ["rgb(197, 72, 49)"],
                data: [0, 4000],
            },
        ],
    };
    const stockProduct = products ? (products.length - outOfStock) : 0;
    const doughnutState = {
        labels: ["Out of Stock", "Instock"],
        datasets: [
            {
                backgroundColor: ["#00A6B4", "#6800B4"],
                hoverBackgroundColor: ["#4B5000", "35014F"],
                data: [outOfStock, stockProduct]
            },
        ],
    };

    return (
        <div className='dashboard'>
            <Sidebar />
            <div className='dashboardContainer'>
                <Typography component='h1'>Dashboard</Typography>
                <div className='dashboardSummary'>
                    <div>
                        <p>
                            Total Amount <br />$1200
                        </p>
                    </div>
                    <div className='dashboardSummaryBox2'>
                        <Link to="/admin/products">
                        <p>Product</p>
                        <p>{products && products.length}</p>
                        </Link>
                        <Link to="/admin/orders">
                        <p>Orders</p>
                        <p>{orders && orders.length}</p>
                        </Link>
                        <Link to="/admin/users">
                        <p>Users</p>
                        <p>{users && users.length}</p>
                        </Link>
                    </div>
                </div>
                <div className='lineChart'>
                    <Line data={lineState} />
                </div>
                <div className='doughnutChart'>
                    <Doughnut 
                        data={doughnutState}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { Typography } from '@material-ui/core';
import { Launch } from '@material-ui/icons';

import { myOrders, clearErrors } from '../../actions/orderAction';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader/Loader';
import './myOrders.css';

const MyOrders = () => {

    const dispatch = useDispatch();
    const alert = useAlert();

    const {loading, error, orders} = useSelector(state => state.myOrders);
    const {user} = useSelector(state => state.user);

    const columns = [
        {
            field: 'id', 
            headerName:'Order ID', 
            minWidth:200, 
            flex:1
        },
        {
            field: 'status', 
            headerName:'Status', 
            minWidth:110, flex:0.5, 
            cellClassName: (params) => {
                return params.getValue(params.id, "status") === "Delivered"
                  ? "greenColor"
                  : "redColor";
              },
        },
        {
            field: 'itemsQty', 
            headerName:'Item Qty', 
            type:'number', 
            minWidth:110, 
            flex:0.3
        },
        {
            field: 'amount', 
            headerName:'Amount', 
            type:'number', 
            minWidth:220, 
            flex:0.5
        },
        {
            field: 'action', 
            headerName:'Action', 
            type:'number', 
            minWidth:130, 
            flex:0.3, 
            sortable: false,
            renderCell: (params) => {
                return (
                    <Link to={`/order/${params.getValue(params.id,'id')}`}>\
                        <Launch />
                    </Link>
                );
            },
        },
    ];
    const rows = [];

    orders && orders.forEach(item => {
        rows.push({
            itemsQty: item.orderItems.length,
            id: item._id,
            status: item.orderStatus,
            amount: item.totalPrice
        });
    });

    useEffect(()=>{
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(myOrders());
    },[dispatch, alert, error]);

    return <>
        <MetaData title={`${user.name} - Orders`} />
        { loading ? <Loader /> : (
            <div className='top-padding'>
            <div className='myOrdesPage'>
                <DataGrid 
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    disableSelectionOnClick
                    className='myOrdersTable'
                    autoHeight
                />
                <Typography id='myOrdersHeading'>{user.name} - Orders</Typography>
            </div>
            </div> 
       )}
    </>;

};

export default MyOrders;
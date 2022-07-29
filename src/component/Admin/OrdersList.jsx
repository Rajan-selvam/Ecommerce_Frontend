import { useEffect } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import "./productList.css";
import { 
    getAllOrders, 
    deleteOrder, 
    clearErrors 
} from "../../actions/orderAction";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";

const OrdersList = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const { error, orders } = useSelector(state => state.allOrders);
    const { error:deleteError, isDeleted } = useSelector(state => state.order);

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id));
    };

    const columns = [
        { field:"id", headerName: "Order ID", minWidth: 200, flex: 1 },
        {
            field:"status", 
            headerName: "Status", 
            minWidth: 150, 
            flex: 0.5,
            cellClassName: (params) => {
                return params.getValue(params.id,'status') === "Delivered"
                ? "greenColor"
                : "redColor";
            },
        },
        {
            field:"itemsQty", 
            headerName: "Items Qty", 
            type: "number",
            minWidth: 130, 
            flex: 0.4
        },
        {
            field:"amount", 
            headerName: "Amount", 
            type: "number",
            minWidth: 240, 
            flex: 0.5
        },
        {
            field:"actions", 
            headerName: "Actions",
            flex: 0.3,
            minWidth: 150,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return <>
                <Link to={`/admin/order/${params.getValue(params.id,'id')}`} >
                    <Edit />
                </Link>
                <Button onClick={()=>deleteOrderHandler(params.getValue(params.id,'id'))}>
                    <Delete />
                </Button>
                </>;
            },
        },
    ];

    const rows = [];

    orders && orders.forEach((item) => {
        rows.push({
            id: item._id,
            itemsQty: item.orderItems.length,
            amount: item.totalPrice,
            status: item.orderStatus,
        });
    });

    useEffect(()=>{
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }
        if (isDeleted) {
            alert.success("Order Deleted SuccessFully..");
            navigate('/admin/orders');
            dispatch({ type: DELETE_ORDER_RESET });
        }
        dispatch(getAllOrders());
    },[dispatch, error, alert, deleteError, isDeleted, navigate]);

    return <>
        <MetaData title="All Orders - Admin" />
        <div className="dashboard">
            <Sidebar />
            <div className="productListContainer">
                <h1 id="productListHandling">All Orders</h1>

                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    disableSelectionOnClick
                    className="productListTable"
                    autoHeight
                />
            </div>
        </div>
    </>;
};

export default OrdersList;
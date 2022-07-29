import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { Edit, Delete } from "@material-ui/icons";

import { 
    getAllProducts, 
    deleteProduct,
    clearErrors 
} from "../../actions/productAction";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import './productList.css';
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";

const ProductList = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const { error, products } = useSelector(state => state.product);
    const { error:deleteError, isDeleted } = useSelector(state => state.products);

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
    };

    const columns = [
        { field:"id", headerName: "Product ID", minWidth: 200, flex: 0.5 },
        {
            field:"name", 
            headerName: "Name", 
            minWidth: 320, 
            flex: 1
        },
        {
            field:"stock", 
            headerName: "Stock", 
            type: "number",
            minWidth: 110, 
            flex: 0.3
        },
        {
            field:"price", 
            headerName: "Price", 
            type: "number",
            minWidth: 140, 
            flex: 0.5
        },
        {
            field:"actions", 
            headerName: "Actions",
            flex: 0.5,
            minWidth: 150,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return <>
                <Link to={`/admin/product/${params.getValue(params.id,'id')}`} >
                    <Edit />
                </Link>
                <Button onClick={()=>deleteProductHandler(params.getValue(params.id,'id'))}>
                    <Delete />
                </Button>
                </>;
            },
        },
    ];

    const rows = [];

    products && products.forEach((item) => {
        rows.push({
            id: item._id,
            stock: item.stock,
            price: item.price,
            name: item.name,
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
            alert.success("Product Deleted SuccessFully..");
            navigate('/admin/dashboard');
            dispatch({ type: DELETE_ORDER_RESET });
        }
        dispatch(getAllProducts());
    },[dispatch, error, alert, deleteError, isDeleted, navigate]);

    return <>
        <MetaData title="All Products - Admin" />
        <div className="dashboard">
            <Sidebar />
            <div className="productListContainer">
                <h1 id="productListHandling">All Products</h1>

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

export default ProductList;
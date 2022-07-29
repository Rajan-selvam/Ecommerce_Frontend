import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { Edit, Delete } from "@material-ui/icons";

import { 
    getAllUsers,
    deleteUser,
    clearErrors 
} from "../../actions/userAction";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import './productList.css';
import { DELETE_USER_RESET } from "../../constants/userConstant";

const UsersList = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const { error, users } = useSelector(state => state.allUsers);
    const { error:deleteError, isDeleted, message } = useSelector(state => state.profile);

    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id));
    };

    const columns = [
        { field:"id", headerName: "User ID", minWidth: 150, flex: 0.8 },
        {
            field:"email", 
            headerName: "Email", 
            minWidth: 280, 
            flex: 1
        },
        {
            field:"name", 
            headerName: "Name",
            minWidth: 110, 
            flex: 0.5
        },
        {
            field:"role", 
            headerName: "Role", 
            minWidth: 120, 
            flex: 0.3,
            cellClassName: (params) => {
                return params.getValue(params.id,'role') === "admin"
                ? "greenColor"
                : "redColor";
            },
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
                <Link to={`/admin/user/${params.getValue(params.id,'id')}`} >
                    <Edit />
                </Link>
                <Button onClick={()=>deleteUserHandler(params.getValue(params.id,'id'))}>
                    <Delete />
                </Button>
                </>;
            },
        },
    ];

    const rows = [];

    users && users.forEach((item) => {
        rows.push({
            id: item._id,
            email: item.email,
            role: item.role,
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
            alert.success(message);
            navigate('/admin/users');
            dispatch({ type: DELETE_USER_RESET });
        }
        dispatch(getAllUsers());
    },[dispatch, error, alert, deleteError, isDeleted, navigate, message]);

    return <>
        <MetaData title="All Users - Admin" />
        <div className="dashboard">
            <Sidebar />
            <div className="productListContainer">
                <h1 id="productListHandling">All Users</h1>

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

export default UsersList;
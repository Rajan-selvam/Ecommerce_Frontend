
import { Link } from "react-router-dom";
import { TreeView, TreeItem } from "@material-ui/lab";
import {
    ExpandMore,
    PostAdd,
    Add,
    ImportExport,
    ListAlt,
    Dashboard,
    People,
    RateReview
} from "@material-ui/icons";

import './sidebar.css';
import Logo from '../../images/Logo.png';

const Sidebar = () => {

    return <div className="sidebar">
        <Link to="/">
            <img src={Logo} alt="Ecommerce" />
        </Link>
        <Link to="/admin/dashboard">
           <p>
            <Dashboard />Dashboard
           </p>
        </Link>
        <Link to=''>
            <TreeView 
                defaultCollapseIcon={<ExpandMore />}
                defaultExpandIcon={<ImportExport />}
            >
                <TreeItem nodeId="1" label="Product">
                    <Link to='/admin/products'>
                        <TreeItem nodeId="2" label="All" icon={<PostAdd />} />
                    </Link>
                    <Link to='/admin/product'>
                        <TreeItem nodeId="3" label="Create" icon={<Add />} />
                    </Link>
                </TreeItem>
            </TreeView>
        </Link>
        <Link to="/admin/orders">
            <p>
                <ListAlt />
                Orders
            </p>
        </Link>
        <Link to="/admin/users">
            <p>
                <People />Users
            </p>
        </Link>
        <Link to="/admin/reviews">
            <p>
                <RateReview />Reviews
            </p>
        </Link>
    </div>
};

export default Sidebar;
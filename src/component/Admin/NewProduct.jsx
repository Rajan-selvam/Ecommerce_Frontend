import { Button } from "@material-ui/core";
import { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    AccountTree,
    Description,
    Storage,
    Spellcheck,
    AttachMoney
} from "@material-ui/icons";

import { createNewProduct, clearErrors } from "../../actions/productAction";
import MetaData from "../layout/MetaData";
import "./newProduct.css";
import Sidebar from "./Sidebar";
import { NEW_PRODUCT_RESET } from "../../constants/productConstant";

const categories = [
    "Laptop",
    "FootWear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones"
];

const NewProduct = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const { loading, error, success } = useSelector(state => state.newProduct);

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    useEffect(()=>{
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (success) {
            alert.success("Product crearted SuccessFully..");
            navigate('/admin/dasboard');
            dispatch({type: NEW_PRODUCT_RESET});
            window.location.reload();
        }
    },[dispatch, error, alert, success, navigate]);

    const createNewProductHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('price', price);
        formData.set('description', description);
        formData.set('stock', stock);
        formData.set('category', category);

        images.forEach(images=>{
            formData.append("images",images);
        });
        dispatch(createNewProduct(formData));
    };

    const createProductImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setImages([]);
        setImagesPreview([]);
        files.forEach((file)=>{
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImages((old)=>[...old, reader.result]);
                    setImagesPreview((old)=>[...old, reader.result]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    return <>
        <MetaData title="Create New Product" />
        <div className="dashboard">
            <Sidebar />
            <div className="newProductContainer">
                <form className="createProductForm" encType="multipart/form-data"
                    onSubmit={createNewProductHandler}>
                    <h1>Create Product</h1>
                    <div>
                        <Spellcheck />
                        <input 
                            type="text"
                            placeholder="Product Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <AttachMoney />
                        <input 
                            type="number"
                            placeholder="Product Price"
                            required
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div>
                        <Description />
                        <textarea 
                            placeholder="Product Description"
                            value={description}
                            onChange={(e)=>setDescription(e.target.value)}
                            cols="30"
                            rows="1"
                        ></textarea>
                    </div>
                    <div>
                        <AccountTree />
                        <select onChange={(e)=> setCategory(e.target.value)}>
                            <option value="">Choose Category</option>
                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Storage />
                        <input 
                            type="number"
                            placeholder="Product Stock"
                            required
                            onChange={(e) => setStock(e.target.value)}
                        />
                    </div>
                    <div id="createProductFormFile">
                        <input 
                            type="file"
                            name="avatar"
                            accept="image/*"
                            multiple
                            onChange={createProductImagesChange}
                        />
                    </div>
                    <div id="createProductFormImage">
                        {imagesPreview.map((image,index)=> (
                            <img key={index} src={image} alt="Product Preview" />
                        ))}
                    </div>
                    <Button 
                        id="createProductBtn"
                        type="submit"
                        disabled={loading ? true : false}
                    >Create</Button>
                </form>
            </div>
        </div>
    </>;
};

export default NewProduct;
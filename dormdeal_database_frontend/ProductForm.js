import React, { useState } from "react";
import axios from "axios";

function ProductForm() {
  const [formData, setFormData] = useState({
    seller_name: "",
    mobile_number: "",
    product_name: "",
    product_category: "",
    product_description: "",
    product_details: "",
    price: "",
  });

  const [productImage, setProductImage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    data.append("product_image", productImage);

    try {
      await axios.post("http://localhost:3000/addProduct", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Product added successfully!");
      setFormData({
        seller_name: "",
        mobile_number: "",
        product_name: "",
        product_category: "",
        product_description: "",
        product_details: "",
        price: "",
      });
      setProductImage(null);
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Product</h2>
      <label>Seller Name:</label>
      <input
        type="text"
        name="seller_name"
        value={formData.seller_name}
        onChange={handleChange}
        required
      />
      <br />

      <label>Mobile Number:</label>
      <input
        type="text"
        name="mobile_number"
        value={formData.mobile_number}
        onChange={handleChange}
        required
      />
      <br />

      <label>Product Name:</label>
      <input
        type="text"
        name="product_name"
        value={formData.product_name}
        onChange={handleChange}
        required
      />
      <br />

      <label>Product Category:</label>
      <input
        type="text"
        name="product_category"
        value={formData.product_category}
        onChange={handleChange}
      />
      <br />

      <label>Product Description:</label>
      <textarea
        name="product_description"
        value={formData.product_description}
        onChange={handleChange}
      ></textarea>
      <br />

      <label>Product Details:</label>
      <textarea
        name="product_details"
        value={formData.product_details}
        onChange={handleChange}
      ></textarea>
      <br />

      <label>Price:</label>
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        required
      />
      <br />

      <label>Product Image:</label>
      <input type="file" name="product_image" onChange={handleImageChange} />
      <br />

      <button type="submit">Add Product</button>
    </form>
  );
}

export default ProductForm;

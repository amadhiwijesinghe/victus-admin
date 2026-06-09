import React, { useEffect, useState } from "react";
import axios from "axios";

function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [colors, setColors] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios.get("https://victus-production.up.railway.app/products")
      .then(res => setProducts(res.data));
  }, []);

const addProduct = async () => {
  if (!name || !price || !image) {
    alert("Fill all fields");
    return;
  }

  const token = localStorage.getItem("token");

  try {
    if (editId) {
      // 🔥 UPDATE MODE
      await axios.put(
        `https://victus-production.up.railway.app/products/${editId}`,
        {
          name,
          price,
          image,
          description,
          colors: colors.split(",").map(c => c.trim())
        },
        {
          headers: {
            Authorization: token
          }
        }
      );

      alert("Product updated ✅");
      setEditId(null);

    } else {
      // ➕ ADD MODE
      await axios.post(
        "https://victus-production.up.railway.app/products",
        {
          name,
          price,
          image,
          description,
          colors: colors.split(",").map(c => c.trim())
        },
        {
          headers: {
            Authorization: token
          }
        }
      );

      alert("Product added ✅");
    }

    // RESET
    setName("");
    setPrice("");
    setImage("");
    setDescription("");
    setColors("");

    const res = await axios.get("https://victus-production.up.railway.app/products");
    setProducts(res.data);

  } catch (err) {
    console.log(err);
    alert("Error ❌");
  }
};

  const inputStyle = {
  width: "100%",
  marginBottom: "10px",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "rgba(255,255,255,0.08)",
  color: "#fff"
};

    const btnStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg,#00ffcc,#00aaff)",
    fontWeight: "700",
    cursor: "pointer"
    };

  return (
    <div style={{ padding: "40px", color: "#fff", background: "#000" }}>
      <h1>Manage Products</h1>

      {/* CREATE */}
    <div style={{
        maxWidth: "700px",
        marginBottom: "30px",
        padding: "20px",
        borderRadius: "16px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(0,255,204,0.1)",
        backdropFilter: "blur(10px)"
        }}>

        <h2 style={{ marginBottom: "15px" }}>Add Product</h2>

        <input
            placeholder="Product Name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={inputStyle}
        />

        <input
            placeholder="Price"
            value={price}
            onChange={e => setPrice(e.target.value)}
            style={inputStyle}
        />

        <input
            placeholder="Image URL"
            value={image}
            onChange={e => setImage(e.target.value)}
            style={inputStyle}
        />

        <input
            placeholder="Colors (comma separated)"
            value={colors}
            onChange={e => setColors(e.target.value)}
            style={inputStyle}
        />

        <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={inputStyle}
        />



        <button style={btnStyle} onClick={addProduct}>
            {editId ? "💾 Update Product" : "➕ Add Product"}
        </button>

        {editId && (
            <button
                style={{
                marginTop: "10px",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                background: "#444",
                color: "#fff",
                cursor: "pointer"
                }}
                onClick={() => {
                setEditId(null);
                setName("");
                setPrice("");
                setImage("");
                setDescription("");
                setColors("");
                }}
            >
                Cancel Edit
            </button>
            )}

    </div>

      {/* LIST */}
      {products.map(p => (
        <div key={p.id}>
          <img src={p.image} width="50" alt="" />
          <p>{p.name} - LKR {p.price}</p>
          <p style={{ fontSize: "12px", opacity: 0.6 }}>
            {p.description}
          </p>

          <div style={{ display: "flex", gap: "5px" }}>
            {p.colors?.map((c, i) => (
                <div
                key={i}
                style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundImage: `url(${c})`,
                    backgroundSize: "cover",
                    border: "1px solid #fff"
                }}
                />
            ))}
            </div>

          <button
            style={{
                marginRight: "10px",
                padding: "6px 10px",
                borderRadius: "6px",
                border: "none",
                background: "#ffaa00",
                color: "#000",
                cursor: "pointer"
            }}
            onClick={() => {
                setEditId(p.id);
                setName(p.name);
                setPrice(p.price);
                setImage(p.image);
                setDescription(p.description || "");
                setColors(p.colors?.join(",") || "");
            }}
            >
            Edit
            </button>

          <button onClick={async () => {
           const token = localStorage.getItem("token");

            await axios.delete(
            `https://victus-production.up.railway.app/products/${p.id}`,
            {
                headers: {
                Authorization: token
                }
            }
            );
            setProducts(products.filter(x => x.id !== p.id));
          }}>
            Delete
          </button>

        </div>
      ))}
    </div>
  );
}

export default ProductsAdmin;
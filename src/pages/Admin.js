import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Admin() {

  const navigate = useNavigate(); 

  const [orders, setOrders] = useState([]);

    useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get(
        "https://victus-production.up.railway.app/orders",
        {
        headers: {
            Authorization: token
        }
        }
    )
    .then(res => setOrders(res.data))
    .catch(err => {
        console.log(err);

        if (err.response?.status === 403) {
            localStorage.removeItem("token");
            navigate("/");
        }
        });
    },  [navigate]);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(o => o.status === "Pending").length;

  const revenue = orders.reduce((sum, o) => sum + Number(o.total), 0);

  const cardStyle = {
    flex: 1,
    padding: "20px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(0,255,204,0.1)",
    backdropFilter: "blur(10px)"
    };

    const labelStyle = {
    fontSize: "13px",
    opacity: 0.6
    };

    const valueStyle = {
    marginTop: "5px",
    fontSize: "24px",
    fontWeight: "700"
    };
 return (
  <div
    style={{
      minHeight: "100vh",
      background: "#000",
      color: "#fff",
      padding: "40px",
      fontFamily: "Outfit, sans-serif"
    }}
  >
    <h1
      style={{
        fontSize: "32px",
        fontWeight: "800",
        marginBottom: "30px",
        background: "linear-gradient(90deg,#00ffcc,#00aaff)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }}
    >
      Admin Dashboard
    </h1>

    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
    <button
        onClick={() => navigate("/products")}
        style={{
        padding: "10px 16px",
        border: "none",
        borderRadius: "8px",
        background: "#00ffcc",
        color: "#000",
        cursor: "pointer",
        fontWeight: "bold"
        }}
    >
        Manage Products
    </button>

    <button
        onClick={() => window.location.reload()}
        style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#ffaa00",
            color: "#000",
            cursor: "pointer",
            fontWeight: "bold"
        }}
        >
        Refresh
        </button>

    <button
        onClick={() => {
        localStorage.removeItem("token");
        navigate("/");
        }}
        style={{
        padding: "10px 16px",
        border: "none",
        borderRadius: "8px",
        background: "#ff4d4d",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold"
        }}
    >
        Logout
    </button>
    </div>

    <div style={{
        display: "flex",
        gap: "20px",
        marginBottom: "30px"
        }}>

        {/* TOTAL ORDERS */}
        <div style={cardStyle}>
            <p style={labelStyle}>Total Orders</p>
            <h2 style={valueStyle}>{totalOrders}</h2>
        </div>

        {/* PENDING */}
        <div style={cardStyle}>
            <p style={labelStyle}>Pending</p>
            <h2 style={{ ...valueStyle, color: "#ffaa00" }}>{pendingOrders}</h2>
        </div>

        {/* REVENUE */}
        <div style={cardStyle}>
            <p style={labelStyle}>Revenue</p>
            <h2 style={{ ...valueStyle, color: "#00ffcc" }}>
            LKR {revenue}
            </h2>
        </div>

        </div>

    {orders.length === 0 ? (
      <p>No orders yet</p>
    ) : (
      orders.map(order => (
        <div
            key={order.id}
            style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            marginBottom: "20px",
            padding: "20px",
            borderRadius: "18px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(0,255,204,0.1)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            transition: "0.3s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >

            {/* 🔵 LEFT SIDE */}
            <div style={{ maxWidth: "70%" }}>
            
            <h3 style={{ margin: 0 }}>{order.name}</h3>

            <p style={{ opacity: 0.6, fontSize: "12px" }}>
                {new Date(order.created_at).toLocaleString()}
            </p>

            <p>📞 {order.phone1}</p>
            <p>📍 {order.address}</p>

            {/* STATUS BADGE */}
            <span style={{
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                background: order.status === "Delivered"
                ? "rgba(0,255,204,0.2)"
                : "rgba(255,170,0,0.2)",
                color: order.status === "Delivered"
                ? "#00ffcc"
                : "#ffaa00"
            }}>
                {order.status}
            </span>

            {/* BUTTONS */}
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>

                <button
                style={{
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#ff4d4d",
                    color: "#fff",
                    cursor: "pointer"
                }}
                onClick={async () => {
                    const token = localStorage.getItem("token");

                    await axios.delete(
                    `https://victus-production.up.railway.app/orders/${order.id}`,
                    {
                        headers: {
                        Authorization: token
                        }
                    }
                    );
                    setOrders(orders.filter(o => o.id !== order.id));
                }}
                >
                Delete
                </button>

                <button
                style={{
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "8px",
                    background: order.status === "Delivered" ? "#444" : "#00ffcc",
                    color: "#000",
                    cursor: "pointer"
                }}
                onClick={async () => {
                    const newStatus =
                    order.status === "Pending" ? "Delivered" : "Pending";

                    const token = localStorage.getItem("token");

                    await axios.put(
                    `https://victus-production.up.railway.app/orders/${order.id}`,
                    { status: newStatus },
                    {
                        headers: {
                        Authorization: token
                        }
                    }
                    );

                    setOrders(orders.map(o =>
                    o.id === order.id ? { ...o, status: newStatus } : o
                    ));
                }}
                >
                {order.status === "Pending" ? "Mark Delivered" : "Mark Pending"}
                </button>

            </div>

            </div>

            {/* 🟣 RIGHT SIDE */}
            <div style={{ textAlign: "right" }}>

            <p style={{ fontSize: "13px", opacity: 0.7 }}>Items</p>

            {JSON.parse(order.items).map((item, i) => (
                <p key={i}>
                {item.name} x{item.qty}
                </p>
            ))}

            <h3 style={{ color: "#00ffcc", marginTop: "10px" }}>
                LKR {order.total}
            </h3>

            </div>

        </div>
        ))
    )}
  </div>
);
}

export default Admin;
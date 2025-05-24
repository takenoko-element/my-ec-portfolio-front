// import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { selectCartTotalQuantity } from "../features/cart/cartSlice";

export default function Header() {
    const totalQuantity = useSelector(selectCartTotalQuantity);

    return (
        <header style={{position: "fixed", width: "80%", height: "10%", alignItems: "center", display:"flex", justifyContent:"space-between", padding:"1rem", backgroundColor: "#f0f0f0"}}>
            <h1>My EC Site</h1>
            <nav>
                <Link to="/">ホーム</Link> | <Link to="/cart">カート（{totalQuantity}）</Link>
            </nav>
        </header>
    );
}
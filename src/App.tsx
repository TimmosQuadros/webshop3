// import { useState } from 'react'
import './App.css'
import { shoppingCart } from "./shopping_cart.ts";
import { DisplayProducts } from "./products.tsx";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Example additional pages
import Home from './Home'; // You need to create this component
import About from './About'; // You need to create this component
import Contact from './Contact'; // You need to create this component


function App() {
    //const [cart, setCart] = useState(shoppingCart);

    //const [count, setCount] = useState(0)
    return (
        <Router>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><Link to="/shop">Shop</Link></li> {/* Link to your shop */}
                </ul>
            </nav>

            {/* Define your routes */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/shop" element={
                    <>
                        <a href="/" className="home-logo">
                            <img src="/home-logo.png" alt="Home" />
                        </a>
                        <div id="shopping-cart-icon" className="shopping-cart">
                            <img src="/shopping-basket-solid.svg" alt="Shopping Cart" />
                            <span id="cart-count">0</span>
                            <div id="cart-summary" className="cart-summary">
                                {/* Product summary will be dynamically inserted here */}
                                Your cart is empty.
                            </div>
                        </div>
                        <div id="products" className="products-container">
                            <DisplayProducts addItem={shoppingCart.addItem}></DisplayProducts>
                            {/* Products will be dynamically inserted here by displayProducts */}
                        </div>
                    </>
                } />
            </Routes>
        </Router>
    )
}

export default App

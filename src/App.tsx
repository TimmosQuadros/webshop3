import { useState } from 'react'
import './App.css'
import { ShoppingCart, CartItem } from './shoppingcart.tsx';
import {DisplayProducts} from "./products.tsx";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

//import Home from './Home';
import About from './About';
import Contact from './Contact';
import CheckoutPage from "./CheckoutPage.tsx";

function App() {

    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addItem = (item: CartItem) => {
        setCartItems([...cartItems, item]);
    }

    const removeItem = (itemId: string) => {
        setCartItems(cartItems.filter(item => item.id !== itemId));
    }

    // const addItem = (item: any) => {
    //     setCartItems(prevItems => {
    //         const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
    //         if (existingItemIndex > -1) {
    //             const updatedItems = [...prevItems];
    //             console.log(updatedItems[existingItemIndex].quantity);
    //             updatedItems[existingItemIndex].quantity += 1;
    //             return updatedItems;
    //         } else {
    //             return [...prevItems, { ...item, quantity: 1 }];
    //         }
    //     });
    // };

    // const removeItem = (itemId: string) => {
    //     setCartItems(currentItems =>
    //         currentItems.reduce((acc, item) => {
    //             if (item.id === itemId && item.quantity > 1) {
    //                 acc.push({ ...item, quantity: item.quantity - 1 });
    //             } else if (item.id !== itemId) {
    //                 acc.push(item);
    //             }
    //             return acc;
    //         }, [] as CartItem[])
    //     );
    // };


    return (
        <Router>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><Link to="/shop">Shop</Link></li> {/* This is top bar */}
                </ul>
            </nav>

            {/* Define your routes */}
            <Routes>
                <Route path="/" element={
                    <>
                        <a href="/" className="home-logo">
                            <img src="/home-logo.png" alt="Home"/>
                        </a>
                        <ShoppingCart cartItems={cartItems} removeItem={removeItem} setCartItems={setCartItems} />
                        <div id="products" className="products-container">
                            <DisplayProducts addItem={addItem}></DisplayProducts>
                            {/* Products will be dynamically inserted here by displayProducts */}
                        </div>
                    </>
                }/>
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/checkout" element={<CheckoutPage cartItems={cartItems} removeItem={removeItem} setCartItems={setCartItems}/>} />
                <Route path="/shop" element={
                    <>
                        <a href="/" className="home-logo">
                            <img src="/home-logo.png" alt="Home"/>
                        </a>
                        <ShoppingCart cartItems={cartItems} removeItem={removeItem} setCartItems={setCartItems} />
                        <div id="products" className="products-container">
                            <DisplayProducts addItem={addItem}></DisplayProducts>
                            {/* Products will be dynamically inserted here by displayProducts */}
                        </div>
                    </>
                }/>
            </Routes>
        </Router>
    )
}

export default App

import {useEffect, useState} from 'react'
import './css/App.css'
import { ShoppingCart, CartItem } from './components/shoppingcart.tsx';
import {DisplayProducts} from "./components/products.tsx";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AddressFormProvider } from './components/addressFormContext.tsx';

//import Home from './Home';
import About from './routes/About.tsx';
import Contact from './routes/Contact.tsx';
import CheckoutPage from "./routes/CheckoutPage.tsx";
import OrderCompleted from "./routes/OrderCompleted.tsx";

function App() {

    //const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const [cartItems, setCartItems] = useState(() => {
        // Get initial cart items from local storage or set to empty array
        const localData = localStorage.getItem('cartItems');
        return localData ? JSON.parse(localData) : [];
    });


    const addItem = (item: CartItem) => {
        setCartItems([...cartItems, item]);
    }

    const removeItem = (itemId: string) => {
        setCartItems(cartItems.filter((item: { id: string; }) => item.id !== itemId));
    }

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        // Save cart items to local storage whenever they change
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

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
        <AddressFormProvider>
        <Router>
            <nav className="nav">
                <div className="hamburger-menu" onClick={toggleMenu}>
                    &#9776;
                </div>
                <ul className={`menu ${isMenuOpen ? 'open' : ''}`}>
                    <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                    <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
                    <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
                    <li><Link to="/shop" onClick={() => setIsMenuOpen(false)}>Shop</Link></li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={
                    <>
                        <Link to="/" className="home-logo">
                            <img src="/home-logo.png" alt="Home"/>
                        </Link>
                        <ShoppingCart cartItems={cartItems} removeItem={removeItem} setCartItems={setCartItems}/>
                        <div id="products" className="products-container">
                            <DisplayProducts addItem={addItem}></DisplayProducts>
                            {/* Products will be dynamically inserted here by displayProducts */}
                        </div>
                    </>
                }/>
                <Route path="/about" element={<About/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/checkout" element={<CheckoutPage cartItems={cartItems} removeItem={removeItem}
                                                               setCartItems={setCartItems}/>}/>
                <Route path="/shop" element={
                    <>
                        <Link to="/" className="home-logo">
                            <img src="/home-logo.png" alt="Home"/>
                        </Link>
                        <ShoppingCart cartItems={cartItems} removeItem={removeItem} setCartItems={setCartItems}/>
                        <div id="products" className="products-container">
                            <DisplayProducts addItem={addItem}></DisplayProducts>
                            {/* Products will be dynamically inserted here by displayProducts */}
                        </div>
                    </>
                }/>
                <Route path="/OrderComplete" element={<OrderCompleted/>}></Route>
            </Routes>

        </Router>
        </AddressFormProvider>
    )
}

export default App

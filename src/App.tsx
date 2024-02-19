import { useState } from 'react'
import './App.css'
import {shoppingCart} from "./shopping_cart.ts";
import {DisplayProducts} from "./products.tsx";


function App() {

    const [cart, setCart] = useState(shoppingCart);

  //const [count, setCount] = useState(0)
  return (
      <>
          <a href="/" className="home-logo">
              <img src="/home-logo.png" alt="Home"/>
          </a>
          <div id="shopping-cart-icon" className="shopping-cart">
              <img src="/shopping-basket-solid.svg" alt="Shopping Cart"/>
              <span id="cart-count">0</span>
              <div id="cart-summary" className="cart-summary">
                  {/* Product summary will be dynamically inserted here */}
                  Your cart is empty.
                  {}
              </div>
          </div>
          <div id="products" className="products-container">
              <DisplayProducts addItem={shoppingCart.addItem}></DisplayProducts>
              {/* Products will be dynamically inserted here by displayProducts */}
          </div>
      </>
  )
}

export default App

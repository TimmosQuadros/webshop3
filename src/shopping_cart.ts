type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

class ShoppingCart {
    items: CartItem[] = [];

    addItem(item: CartItem) {
        const existingItem = this.items.find((existingItem) => existingItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.items.push(item);
        }
        console.log(this.items)
        //this.updateCartUI();
    }

    removeAllItem(itemId: string) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.updateCartUI(); // Update the cart UI after removal
    }

    removeItem(itemId: string) {
        const itemIndex = this.items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            this.items[itemIndex].quantity -= 1; // Decrease quantity by one
            if (this.items[itemIndex].quantity <= 0) {
                this.items.splice(itemIndex, 1); // Remove the item if quantity is 0 or less
            }
            this.updateCartUI(); // Update the UI to reflect the change
        }
    }

    /*updateCartUI() {
        const cartCountElement = document.getElementById('cart-count');
        const cartSummaryElement = document.getElementById('cart-summary');
        if (cartCountElement) {
            const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems.toString();
        }

        if (cartSummaryElement) {
            cartSummaryElement.innerHTML = '<ul class="cart-items-list"></ul>'; // Use UL for the list
            const list = cartSummaryElement.querySelector('.cart-items-list');

            if (this.items.length > 0 && list) {
                this.items.forEach((item) => {
                    const itemElement = document.createElement('li');
                    itemElement.className = 'cart-item';
                    itemElement.innerHTML = `
          <span class="product-name">${item.name}</span>
          <span class="product-price">$${item.price.toFixed(2)}</span>
          <span class="product-quantity">x${item.quantity}</span>
          <button class="delete-item" data-id="${item.id}">X</button>
        `;
                    list.appendChild(itemElement);
                });
            } else if (list) {
                list.innerHTML = '<li>Your cart is empty.</li>';
            }

            this.attachDeleteEventListeners();
        }
    }*/

    updateCartUI() {
        const cartCountElement = document.getElementById('cart-count');
        const cartSummaryElement = document.getElementById('cart-summary');
        if (cartCountElement) {
            const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems.toString();
        }

        if (cartSummaryElement) {
            cartSummaryElement.innerHTML = '<ul class="cart-items-list"></ul>'; // Initialize the list container
            const list = cartSummaryElement.querySelector('.cart-items-list');

            if (this.items.length > 0 && list) {
                this.items.forEach((item) => {
                    const itemElement = document.createElement('li');
                    itemElement.className = 'cart-item';
                    itemElement.innerHTML = `
                    <span class="product-name">${item.name}</span>
                    <span class="product-price">$${item.price.toFixed(2)}</span>
                    <span class="product-quantity">${item.quantity} pc. </span>
                    <button class="delete-item" data-id="${item.id}">X</button>
                `;
                    list.appendChild(itemElement);
                });

                // Calculate and display total cost
                const totalCost = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
                const totalCostElement = document.createElement('li');
                totalCostElement.className = 'cart-total';
                totalCostElement.textContent = `Total: $${totalCost.toFixed(2)}`;
                list.appendChild(totalCostElement); // Append the total cost to the list

                // Add checkout button
                const checkoutButtonElement = document.createElement('li');
                checkoutButtonElement.className = 'checkout-button-li';
                checkoutButtonElement.innerHTML = '<button class="checkout-button">Checkout</button>';
                list.appendChild(checkoutButtonElement); // Append the checkout button to the list

                // Optionally, add an event listener to the checkout button here
                // @ts-ignore
                checkoutButtonElement.querySelector('.checkout-button').addEventListener('click', () => {
                    console.log('Proceeding to checkout...');
                    // Implement your checkout logic here
                });
            } else if (list) {
                list.innerHTML = '<li>Your cart is empty.</li>';
            }

            this.attachDeleteEventListeners();
        }
    }

    attachDeleteEventListeners() {
        const deleteButtons = document.querySelectorAll('.delete-item');
        deleteButtons.forEach(button => {
            button.removeEventListener('click', this.handleDeleteItem); // Prevent multiple bindings
            button.addEventListener('click', this.handleDeleteItem.bind(this));
        });
    }

    handleDeleteItem(event: Event) {
        const itemId = (event.target as HTMLElement).getAttribute('data-id');
        if (itemId) {
            this.removeItem(itemId);
        }
    }
}

export const shoppingCart = new ShoppingCart();

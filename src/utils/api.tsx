// api.js
export const fetchProducts = async () => {
    const url = 'https://webapp7.crabdance.com/api/products'; // Update the URL based on your server setup
    try {
        const response = await fetch(url);
        if (!response.ok) { // Check if the HTTP status code is in the range 200-299
            throw new Error('Network response was not ok');
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Failed to fetch products:', error);
        throw error; // Re-throw the error if you want to handle it in the component
    }
}; 

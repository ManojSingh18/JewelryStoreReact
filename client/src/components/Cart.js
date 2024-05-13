import React, { useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../Cart.css'; // Create and import a new CSS file for custom styles

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const checkoutButtonRef = useRef(null); 
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the logged-in user's info
        axios.get('http://localhost:3001/api/users/current', { withCredentials: true })
            .then(response => setUsername(response.data.username))
            .catch(error => console.error('Error fetching user:', error));

        // Fetch the user's cart items
        axios.get('http://localhost:3001/api/cart', { withCredentials: true })
            .then(response => setCartItems(response.data))
            .catch(error => console.error('Error fetching cart items:', error));
        
           // Add event listener to the checkout button
           if (checkoutButtonRef.current) {
            const button = checkoutButtonRef.current;
            button.addEventListener('click', createParticles);

            // Cleanup the event listener when the component unmounts
            return () => {
                button.removeEventListener('click', createParticles);
            };
        }
    }, []);

     // Function to simulate particle effect
     function createParticles(e) {
        for (let i = 0; i < 30; i++) {
            createParticle(e.clientX, e.clientY);
        }
    }

    function createParticle(x, y) {
        const particle = document.createElement('particle');
        document.body.appendChild(particle);

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        const animation = particle.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(1)', opacity: 0 }
        ], {
            duration: 500,
            easing: 'ease-out'
        });
        animation.onfinish = () => {
            particle.remove();
        };
    }

    

    // const handleAddMore = (productId) => {
    //     // Animation: Assuming product ID is unique and used directly for element ID
    //     const itemElement = document.getElementById(`item-${productId}`);
    //     if (itemElement) {
    //         itemElement.classList.add('adding');
    //     }

    //     setTimeout(() => {
    //         axios.post('http://localhost:3001/api/cart/add', { productId }, { withCredentials: true })
    //             .then(() => {
    //                 axios.get('http://localhost:3001/api/cart', { withCredentials: true })
    //                     .then(response => {
    //                         setCartItems(response.data);
    //                         if (itemElement) {
    //                             itemElement.classList.remove('adding');
    //                         }
    //                     })
    //                     .catch(error => console.error('Error refetching cart items:', error));
    //             })
    //             .catch(error => console.error('Error adding more items:', error));
    //     }, 300);
    // };

    const [addingItems, setAddingItems] = useState(new Set());

    const handleAddMore = (productId) => {
        setAddingItems(prev => new Set([...prev, productId]));
        setTimeout(() => {
            axios.post(`http://localhost:3001/api/cart/add`, { productId }, { withCredentials: true })
                .then(() => {
                    axios.get(`http://localhost:3001/api/cart`, { withCredentials: true })
                        .then(response => {
                            setCartItems(response.data);
                            setAddingItems(prev => new Set([...prev].filter(id => id !== productId)));
                        })
                        .catch(error => console.error('Error refetching cart items:', error));
                })
                .catch(error => console.error('Error adding more items:', error));
        }, 300);
    };

    const [removingItems, setRemovingItems] = useState(new Set());

    // const handleRemove = (cartItemId) => {
    //     setRemovingItems(prev => new Set([...prev, cartItemId]));
    //     setTimeout(() => {
    //         axios.delete(`http://localhost:3001/api/cart/${cartItemId}`, { withCredentials: true })
    //             .then(() => {
    //                 axios.get('http://localhost:3001/api/cart', { withCredentials: true })
    //                     .then(response => {
    //                         setCartItems(response.data);
    //                         setRemovingItems(prev => {
    //                             const newSet = new Set(prev);
    //                             newSet.delete(cartItemId);
    //                             return newSet;
    //                         });
    //                     })
    //                     .catch(error => console.error('Error refetching cart items:', error));
    //             })
    //             .catch(error => console.error('Error removing cart item:', error));
    //     }, 300);
    // };

    const handleRemove = (cartItemId) => {
        setRemovingItems(prev => new Set([...prev, cartItemId]));
        setTimeout(() => {
            axios.delete(`http://localhost:3001/api/cart/${cartItemId}`, { withCredentials: true })
                .then(() => {
                    axios.get(`http://localhost:3001/api/cart`, { withCredentials: true })
                        .then(response => {
                            setCartItems(response.data);
                            setRemovingItems(prev => new Set([...prev].filter(id => id !== cartItemId)));
                        })
                        .catch(error => console.error('Error refetching cart items:', error));
                })
                .catch(error => console.error('Error removing cart item:', error));
        }, 300);
    };
    
    
    const handleCheckout = () => navigate('/checkout');

    // Determine the appropriate CSS class based on whether the cart is empty
    const cartContainerClass = cartItems.length > 0 ? 'cart-container' : 'cart-container empty';
    

    return (
        <div className={cartContainerClass}>
            {cartItems.length > 0 ? (
                <>
                    <ul className="cart-items">
                    {cartItems.map(item => (
                        <li key={item.id} id={`item-${item.product_id}`} className={`${addingItems.has(item.product_id) ? 'adding' : ''} ${removingItems.has(item.id) ? 'removing' : ''}`}>
                            {item.name} - ${item.price} x {item.quantity}
                            <button onClick={() => handleRemove(item.id)} className="button-action">Remove</button>
                            <button onClick={() => handleAddMore(item.product_id)} className="button-action">Add More</button>
                        </li>
                    ))}
                    </ul>
                    <button ref={checkoutButtonRef} onClick={handleCheckout} className="btn checkout-success">Proceed to Checkout</button>
                </>
            ) : (
                <div className="cart-empty">
                    <p>Your cart is empty. Browse our products <Link to="/products">here</Link>.</p>
                </div>
            )}
        </div>
    );
}
export default Cart;

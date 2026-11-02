import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cart, removeFromCart, clearCart, totalFee } = useCart();

  return (
    <div className="page">
      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/events">Browse events</Link>
        </p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.id}>
                <span>
                  {item.name} - {item.fee === 0 ? "Free" : `Rs. ${item.fee}`}
                </span>
                <button className="secondary" onClick={() => removeFromCart(item.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <h3>Total fee: Rs. {totalFee}</h3>
          <button onClick={clearCart}>Clear Cart</button>
        </>
      )}
    </div>
  );
}

export default Cart;

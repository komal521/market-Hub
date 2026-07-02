import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import addIcon from "../assets/add.png";
import minusIcon from "../assets/minus.png";
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    const itemsWithQty = items.map((item) => ({
      ...item,
      quantity: item.quantity || 1, }));
    setCartItems(itemsWithQty); }, []);
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items)); };
  const updateQty = (index, delta) => {
    const updated = [...cartItems];
    const newQty = (updated[index].quantity || 1) + delta;
    if (newQty < 1) return;
    updated[index] = { ...updated[index], quantity: newQty };
    saveCart(updated); };
  const removeItem = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    saveCart(updated); };
  const clearCart = () => saveCart([]);
  const getPrice = (item) =>
    parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
  const subtotal = cartItems.reduce(
    (acc, item) => acc + getPrice(item) * (item.quantity || 1),  0 );
  const TAX_RATE = 0.08;
  const FREE_DELIVERY_THRESHOLD = 500;
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 49;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + tax + delivery;
  const handlePromo = () => {
    if (promoCode.trim().toUpperCase() === "SAVE10") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code.");
      setPromoApplied(false);
    }
  };
  const formatINR = (val) =>
    `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f8f6f2] dark:bg-gray-900 py-10 px-4 md:px-8 text-[#111] dark:text-gray-100 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 style={{ fontFamily: "Georgia, serif" }} className="text-3xl md:text-4xl font-bold text-[#111] dark:text-white">
                Shopping Cart
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
              </p>
            </div>
            {cartItems.length > 0 && (
              <button onClick={clearCart}
                className="text-sm text-gray-500 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition font-medium border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 rounded-full hover:border-red-300 shadow-sm" >
                Clear All
              </button>  )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-sm p-16 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-orange-50 dark:bg-gray-750 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-[#d7a53f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-[#111] dark:text-white mb-3">Your cart is empty</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                    Discover our curated collection of premium products
                  </p>
                  <Link to="/services"
                    className="inline-block bg-[#6f4e37] text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition shadow-lg">
                    Continue Shopping </Link>
                </div> ) : (
                cartItems.map((item, index) => (
                  <div key={index}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-all">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-750">
                      <img src={item.img || (item.image && !item.image.startsWith('http') ? `http://localhost:5000/uploads/${item.image}` : item.image)}
                        alt={item.title}
                        className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#111] dark:text-white text-sm md:text-base leading-tight truncate">
                        {item.title}  </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{item.tag || item.subtitle}</p>
                      {item.variant && (
                        <p className="text-xs font-medium text-[#d9a63d] mt-1">{item.variant}</p>
                      )}
                      <span className="inline-block mt-2 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
                        In Stock </span>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-1 py-1 bg-gray-50 dark:bg-gray-750">
                          <button onClick={() => updateQty(index, -1)}
                            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                            <img src={minusIcon} alt="minus" className="w-3 h-3 dark:invert" />
                          </button>
                          <span className="text-sm font-semibold w-5 text-center text-[#111] dark:text-white">
                            {item.quantity || 1}
                          </span>
                          <button onClick={() => updateQty(index, 1)}
                            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                            <img src={addIcon} alt="add" className="w-3 h-3 dark:invert"/>
                          </button>
                        </div>
                        <button onClick={() => removeItem(index)}
                          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition font-medium" >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-[#111] dark:text-white text-base md:text-lg">
                        {formatINR(getPrice(item) * (item.quantity || 1))}
                      </p>
                      {(item.quantity || 1) > 1 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {formatINR(getPrice(item))} each
                        </p>  )}
                    </div>
                  </div>
                )) )}
              {cartItems.length > 0 && (
                <div className="pt-2">
                  <Link to="/services"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#d7a53f] dark:hover:text-[#d7a53f] transition font-medium border border-gray-200 dark:border-gray-700 px-5 py-2.5 rounded-full hover:border-[#d7a53f] bg-white dark:bg-gray-800 shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div> )}
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Your data is protected by SSL encryption
              </p>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold text-[#111] dark:text-white mb-5">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#111] dark:text-white">{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Estimated Delivery</span>
                    <span className={`font-semibold ${delivery === 0 ? "text-green-600 dark:text-green-400" : "text-[#111] dark:text-white"}`}>
                      {delivery === 0 ? "Free" : formatINR(delivery)}
                    </span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Discount (10%)</span>
                      <span className="font-semibold">−{formatINR(discount)}</span>
                    </div>  )}
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-semibold text-[#111] dark:text-white">{formatINR(tax)}</span>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="flex gap-2">
                    <input type="text" value={promoCode} onChange={(e) => {  setPromoCode(e.target.value);
                        setPromoError(""); setPromoApplied(false); }}
                      placeholder="Promo Code"
                      className="flex-1 bg-gray-50 dark:bg-gray-700 text-[#111] dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#d7a53f] transition" />
                    <button onClick={handlePromo}
                      className="px-4 py-2 bg-[#111] dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition tracking-wider">
                      APPLY </button>
                  </div>
                  {promoError && <p className="text-xs text-red-500 mt-1">{promoError}</p>}
                  {promoApplied && <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium"> Promo code applied! 10% off</p>}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Try: <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">SAVE10</span></p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-5" />
                <div className="flex justify-between items-center mb-1">
                  <span className="text-lg font-bold text-[#111] dark:text-white">Total</span>
                  <span className="text-xl font-bold text-[#d7a53f]">{formatINR(total)}</span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 text-right mb-5">INCLUSIVE OF ALL TAXES</p>
                <button onClick={() => navigate("/checkout")}
                  className="w-full flex items-center justify-center gap-2 bg-[#6f4e37] hover:opacity-90 text-white py-3.5 rounded-xl font-bold text-base transition shadow-lg shadow-amber-900/20" >
                  Proceed to Checkout
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="mt-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4 text-[#d7a53f] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Complimentary delivery on orders over ₹500
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4 text-[#d7a53f] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Secure checkout with 256-bit encryption
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4 text-[#d7a53f] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    30-day effortless returns policy
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;

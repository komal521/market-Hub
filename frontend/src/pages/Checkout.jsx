import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import upiIcon from "../assets/credit-card.png";
import cardIcon from "../assets/credit-card (1).png";
import cashIcon from "../assets/money.png";
import locationIcon from "../assets/location.png";
import carIcon from "../assets/car.png";
import lockIcon from "../assets/lock.png";
const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment_method: "cod",
    card_number: "",
    expiry_date: "",
    cvv: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(items);
    if (items.length === 0) {
      navigate("/cart");
    }
    const user = JSON.parse(localStorage.getItem("user")) || {};
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customer_name: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || ""
      }));
    }
  }, [navigate]);
  const total = cartItems.reduce((acc, item) => acc + (parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0), 0);
  const tax = total * 0.18; // 18% GST/Tax
  const grandTotal = total + tax;
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const serializedItems = JSON.stringify(cartItems.map((item) => ({
      title: item.title,
      image: item.img || item.image || "",
      price: item.price,
      qty: item.quantity || 1,
      variant: item.variant || ""
    })));
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          total_amount: grandTotal,
          estimated_tax: tax,
          items: serializedItems,
          shipping_method: "Standard Delivery"
        })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem(`order_items_${data.orderId}`, JSON.stringify(cartItems));
        localStorage.removeItem("cart");
        navigate(`/order-confirmation/${data.orderId}`);
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#faf9f6] dark:bg-gray-900 py-12 px-4 md:px-8 text-[#111] dark:text-gray-100 font-sans transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-medium tracking-wide uppercase">
            <span className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 transition-colors" onClick={() => navigate("/home")}>Shop</span>
            <span>&gt;</span>
            <span className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 transition-colors" onClick={() => navigate("/cart")}>Cart</span>
            <span>&gt;</span>
            <span className="text-[#6f4e37] dark:text-[#d7a53f] font-bold">Checkout</span>
          </div>
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-8 md:p-10 shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-gray-700 flex items-center justify-center border border-amber-100 dark:border-gray-600 flex-shrink-0">
                    <img src={locationIcon} alt="Location" className="w-6 h-6 object-contain dark:invert" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-805 dark:text-white tracking-tight font-serif">Shipping Details</h2>
                  </div>
                </div>
                <p className="text-sm text-gray-400 ml-16 mb-8">Please enter your delivery information carefully.</p>
                <div className="space-y-5">
                  <div>
                    <label className="text-[11px] text-black uppercase tracking-widest font-bold block mb-2">Full Name</label>
                    <input  type="text" name="customer_name" required value={formData.customer_name}
                      onChange={handleChange}
                      className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50 text-gray-800 dark:text-white rounded-xl px-5 py-4 text-base outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-[#6f4e37] transition-all"
                      placeholder="Alexander Sterling" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[11px] text-black uppercase tracking-widest font-bold block mb-2">Email Address</label>
                      <input  type="email"  name="email"  required  value={formData.email}  onChange={handleChange}
                        className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50 text-gray-800 dark:text-white rounded-xl px-5 py-4 text-base outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-[#6f4e37] transition-all"
                        placeholder="alexander@luxury.com" />
                    </div>
                    <div>
                      <label className="text-[11px] text-black uppercase tracking-widest font-bold block mb-2">Phone Number</label>
                      <input type="text" name="phone" required value={formData.phone} onChange={handleChange}
                        className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50 text-gray-800 dark:text-white rounded-xl px-5 py-4 text-base outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-[#6f4e37] transition-all"
                        placeholder="+1 (555) 000-0000"  />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-black uppercase tracking-widest font-bold block mb-2">Shipping Address</label>
                    <input type="text" name="address" required value={formData.address}
                      onChange={handleChange}
                      className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50 text-gray-800 dark:text-white rounded-xl px-5 py-4 text-base outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-[#6f4e37] transition-all"
                      placeholder="Apt 4B, 725 5th Ave" />
                  </div>
                  <div className="grid grid-cols-3 gap-5">
                    <div>
                      <label className="text-[11px] text-black uppercase tracking-widest font-bold block mb-2">City</label>
                      <input  type="text"  name="city"  required value={formData.city}
                        onChange={handleChange}
                        className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50 text-gray-800 dark:text-white rounded-xl px-4 py-4 text-base outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-[#6f4e37] transition-all"
                        placeholder="New York"  />
                    </div>
                    <div>
                      <label className="text-[11px] text-black uppercase tracking-widest font-bold block mb-2">State</label>
                      <input type="text"  name="state"  required  value={formData.state}
                        onChange={handleChange}
                        className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50 text-gray-800 dark:text-white rounded-xl px-4 py-4 text-base outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-[#6f4e37] transition-all"
                        placeholder="NY" />
                    </div>
                    <div>
                      <label className="text-[11px] text-black uppercase tracking-widest font-bold block mb-2">Pincode</label>
                      <input  type="text"  name="pincode"  required  value={formData.pincode}  onChange={handleChange}
                        className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50 text-gray-800 dark:text-white rounded-xl px-4 py-4 text-base outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-[#6f4e37] transition-all"
                        placeholder="10022" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-8 md:p-10 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-gray-700 flex items-center justify-center border border-amber-100 dark:border-gray-600 flex-shrink-0">
                    <img src={lockIcon} alt="Lock" className="w-6 h-6 object-contain dark:invert" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-850 dark:text-white tracking-tight font-serif">Payment Method</h2>
                </div>
                <div className="grid grid-cols-1 gap-5 mb-8">
                  <label
                    className={`relative cursor-pointer border rounded-2xl p-5 flex flex-col items-start gap-5 transition-all ${
                      formData.payment_method === "cod"
                        ? "border-[#6f4e37] bg-amber-50/10 dark:bg-amber-900/10 shadow-sm ring-1 ring-[#6f4e37]"
                        : "border-gray-100 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"  }`}  >
                    <input   type="radio"  name="payment_method"  value="cod"  checked={formData.payment_method === "cod"}
                      onChange={handleChange}  className="sr-only" />
                    <div className="w-full flex justify-between items-center">
                      <div className="w-11 h-11 rounded-full bg-amber-50 dark:bg-gray-700 flex items-center justify-center border border-amber-100 dark:border-gray-600">
                        <img src={cashIcon} alt="Cash" className="w-5 h-5 dark:invert" />
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.payment_method === 'cod' ? 'border-[#6f4e37]' : 'border-gray-300 dark:border-gray-600'}`}>
                        {formData.payment_method === 'cod' && <div className="w-3 h-3 rounded-full bg-[#6f4e37]" />}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-805 dark:text-white">Cash On Delivery</p>
                      <p className="text-[11px] text-gray-400 mt-1">Pay at your doorstep</p>
                    </div>
                  </label>
                </div>

              </div>
              <div className="pt-2">
                <button type="submit" disabled={submitting}
                  className="w-full bg-[#6f4e37] hover:bg-[#5a3e2a] text-white py-5 rounded-full font-bold  tracking-widest uppercase transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 h-16" >
                  {submitting ? "Processing..." : `Pay Now (₹${grandTotal.toFixed(2)})`}
                </button>
              </div>
            </form>
            <div className="lg:col-span-5 space-y-8">
              {/* Order Summary */}
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-8 md:p-10 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-805 dark:text-white mb-6 tracking-tight font-serif">Order Summary</h2>
                <div className="space-y-5 max-h-[350px] overflow-y-auto pr-1">
                  {cartItems.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-3.5 border-b border-gray-50 dark:border-gray-700 last:border-0">
                      <div className="flex items-center gap-4">
                        <img src={item.img || item.image} alt={item.title}
                          className="w-14 h-14 rounded-2xl object-cover border border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700" />
                        <div>
                          <p className="font-bold text-sm text-gray-850 dark:text-white leading-snug">{item.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{item.tag || item.subtitle || "Qty: 1"}</p>
                          {item.variant && <p className="text-xs font-medium text-[#d9a63d] mt-0.5">{item.variant}</p>}
                        </div>
                      </div>
                      <span className="font-bold text-sm text-gray-800 dark:text-white tracking-tight">{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-dashed border-gray-100 dark:border-gray-700 my-6"></div>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 items-center">
                    <span className="flex items-center gap-2">
                      <img src={carIcon} alt="Car" className="w-4 h-4 object-contain dark:invert" />
                      Shipping
                    </span>
                    <span className="font-bold text-green-600 dark:text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Estimated Tax</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">₹{tax.toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 my-6 pt-5 flex justify-between items-center">
                  <span className="font-bold text-base text-gray-800 dark:text-white">Total Amount</span>
                  <span className="text-2xl font-bold text-[#6f4e37] dark:text-[#d7a53f]">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="bg-[#fdfcfb] dark:bg-gray-800 rounded-3xl p-6 border border-[#ece7df] dark:border-gray-700 flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center border border-gray-100 dark:border-gray-600 flex-shrink-0">
                  <img src={lockIcon} alt="Secure Lock" className="w-4.5 h-4.5 object-contain dark:invert" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1">
                    Secure Transaction
                    <span className="cursor-pointer text-gray-450 hover:text-gray-850 dark:hover:text-gray-300">ⓘ</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Your data is encrypted using 256-bit SSL protocols. VogueCart ensures a 100% safe payment experience.
                  </p>
                </div>
              </div>
              <div className="flex justify-center items-center gap-5 opacity-40 pt-2">
                <img src={cardIcon} alt="Visa" className="h-5 object-contain dark:invert" />
                <img src={upiIcon} alt="UPI" className="h-5 object-contain dark:invert" />
                <img src={cashIcon} alt="COD" className="h-5 object-contain dark:invert" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;

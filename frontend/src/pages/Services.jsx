import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import heart from "../assets/heart (1).png";
import b1 from "../assets/b1.webp";
import b3 from "../assets/b3.webp";
import b5 from "../assets/b5.webp";
import c1 from "../assets/c1.avif";
import c3 from "../assets/c3.avif";
import k3 from "../assets/k3.webp";
import b2 from "../assets/b2.webp";
import b4 from "../assets/b4.webp";
import star from "../assets/star (1).png";
import arrow1 from "../assets/right-arrow (1).png";
import arrow from "../assets/right-arrow.png";
import verified from "../assets/verified.png";
import checked from "../assets/checked.png";
import appointment from "../assets/appointment.png";
import cart from "../assets/shopping-cart.png";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
const Services = () => {
  const navigate = useNavigate();
const [services, setServices] = useState([]);
const [settings, setSettings] = useState({
  bookings_count: "15K+",
  average_rating: "4.9/5",
  services_count: "50+"
});
const [wishlistedIds, setWishlistedIds] = useState(() => {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const ids = {};
  wishlist.forEach((item) => {
    if (item && item.id) ids[item.id] = true;
  });
  return ids;
});
useEffect(() => {
  fetch("http://localhost:5000/api/products")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setServices(data.products);
      }
    })
    .catch((err) => console.log(err));

  fetch("http://localhost:5000/api/settings")
    .then((res) => res.json())
    .then((data) => {
      if (data.success && data.settings) {
        setSettings({
          bookings_count: data.settings.bookings_count || "15K+",
          average_rating: data.settings.average_rating || "4.9/5",
          services_count: data.settings.services_count || "50+"
        });
      }
    })
    .catch((err) => console.log(err));
}, []);
const handleWishlist = (e, item) => {
  e.stopPropagation();

  const wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

  const exists = wishlist.find(
    (p) => p.id === item.id
  );

  if (exists) {
    const updatedWishlist = wishlist.filter(
      (p) => p.id !== item.id
    );

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );
    setWishlistedIds((prev) => ({
      ...prev,
      [item.id]: false,
    }));
  } else {
    const newItem = {
      id: item.id,
      image: item.image ? `http://localhost:5000/uploads/${item.image}` : b1,
      name: item.product_name,
      category: "Service",
      price: `₹${item.base_price}`,
    };

    localStorage.setItem(
      "wishlist",
      JSON.stringify([...wishlist, newItem])
    );

    setWishlistedIds((prev) => ({
      ...prev,
      [item.id]: true,
    }));
  }

  window.dispatchEvent(
    new Event("wishlistUpdated")
  );
};
  return (
    <>
      <Navbar />
      <div className="bg-[#faf8f6] dark:bg-gray-900 text-gray-850 dark:text-gray-100 transition-colors duration-300 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold dark:text-white">
              Our <span className="text-[#6f4e37] italic">Spiritual Services</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
              Experience divine blessings through our trusted puja and
              spiritual services performed by certified priests.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-5 max-w-lg mx-auto mt-10 text-center">
            <div>
              <h3 className="font-bold text-xl dark:text-white">{settings.bookings_count}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Bookings</p>
            </div>
            <div>
              <h3 className="font-bold text-xl dark:text-white">{settings.average_rating}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Ratings</p>
            </div>
            <div>
              <h3 className="font-bold text-xl dark:text-white">{settings.services_count}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Services</p>
            </div>
          </div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {services.map((item, index) => (
  <div  key={index}  onClick={() => navigate("/product?id=" + item.id)}
    className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col" >
<div className="relative">
  <img  src={item.image ? `http://localhost:5000/uploads/${item.image}` : b1}
    alt={item.product_name}
    className="w-full h-52 sm:h-56 md:h-60 object-cover" />
<button
  onClick={(e) => handleWishlist(e, item)}
  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition z-10">
  <svg
    className="w-5 h-5"
    fill={wishlistedIds[item.id] ? "#e11d48" : "none"}
    stroke={wishlistedIds[item.id] ? "#e11d48" : "#6b7280"}
    strokeWidth="2"
    viewBox="0 0 24 24" >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
</button>
</div>
    <div className="p-5 flex flex-col flex-1">
      {item.rating && parseFloat(item.rating) > 0 ? (
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((s) => {
            const rVal = parseFloat(item.rating);
            const isFilled = s <= Math.round(rVal);
            return (
              <img key={s} src={star} alt="star" className={`w-4 h-4 object-contain ${isFilled ? "" : "opacity-30"}`} />
            );
          })}
          <span className="text-gray-500 dark:text-gray-400 text-xs ml-1 font-semibold">({item.rating})</span>
        </div>
      ) : (
        <div className="mb-3">
          <span className="text-gray-400 dark:text-gray-500 text-xs italic">not rating yet</span>
        </div>
      )}
      <p className="text-[10px] tracking-wider text-gray-500 uppercase mb-1">
        {item.category || "Product"} {item.brand ? `• ${item.brand}` : ""}
      </p>
      <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
        {item.product_name}
      </h3>
      {item.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>}
      {item.variants && (() => {
        try {
          const parsed = typeof item.variants === 'string' ? JSON.parse(item.variants) : item.variants;
          if (Array.isArray(parsed) && parsed.length > 0) {
            return (
              <div className="mt-2 flex gap-1 flex-wrap max-h-12 overflow-hidden">
                {parsed.map((v, i) => (
                  <span key={i} className="flex items-center text-[10px] bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">
                    {v.colour && <span className="inline-block w-2 h-2 rounded-full mr-1 border border-gray-300" style={{backgroundColor: v.colour}}></span>}
                    {v.name || v.size || "Variant"}
                  </span>
                ))}
              </div>
            );
          }
        } catch(e) {}
        return null;
      })()}
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-6 mt-2 flex-1">
       {item.description}
      </p>
      <p className="text-[#6f4e37] font-bold text-xl mt-4">
     ₹{item.base_price}
      </p>
      <button   onClick={(e) => {
          e.stopPropagation();
          const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
          cartItems.push({ img: item.image ? `http://localhost:5000/uploads/${item.image}` : b1, title: item.product_name, price: `₹${item.base_price}`, tag: "Service" });
          localStorage.setItem("cart", JSON.stringify(cartItems));
          navigate("/cart");
        }}
        className="mt-4 w-full bg-[#6f4e37] hover:bg-[#5a3d2b] text-white py-3 rounded-full flex items-center justify-center gap-2 transition">
        <span>Add to Cart</span>
        <img src={cart} alt="Cart" className="w-5 h-5 brightness-0 invert" />
      </button>
    </div>
  </div>
))}
          </div>
          <div className="flex justify-center mt-10">
            <button className="border border-[#6f4e37] text-[#6f4e37] px-6 py-3 rounded-full flex items-center gap-2 hover:bg-amber-50 dark:hover:bg-gray-800 transition">
              Explore More Services
              <img src={arrow} alt=""  className="w-4 h-4"/>
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-850 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <img src={verified} alt="" className="w-14 mx-auto" />
                <h3 className="font-bold mt-4 dark:text-white">
                  Certified Priests
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  Experienced and verified priests.
                </p>
              </div>
              <div className="text-center">
                <img   src={checked}   alt=""   className="w-14 mx-auto" />
                <h3 className="font-bold mt-4 dark:text-white">
                  Divine Timings
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  Auspicious muhurat guidance.
                </p>
              </div>
              <div className="text-center">
                <img src={appointment}  alt=""  className="w-14 mx-auto"/>
                <h3 className="font-bold mt-4 dark:text-white">
                  Flexible Booking
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  Easy scheduling for your puja.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="py-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-center text-3xl font-bold mb-10 dark:text-white">
              What Devotees Say
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map((s)=>(
                    <img key={s} src={star} alt="" className="w-4 h-4"  />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  The priest was highly knowledgeable and the entire
                  ceremony was conducted perfectly.
                </p>
                <div className="flex items-center gap-3 mt-5">
                  <img src={b2} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <h4 className="font-semibold dark:text-white">
                    Ramesh Kumar
                  </h4>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map((s)=>(
                    <img   key={s}   src={star} alt="" className="w-4 h-4" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Excellent service. Booking process was smooth and
                  the puja experience was wonderful.
                </p>
                <div className="flex items-center gap-3 mt-5">
                  <img src={b4} alt="" className="w-12 h-12 rounded-full object-cover"/>
                  <h4 className="font-semibold dark:text-white">
                    Anita Sharma
                  </h4>
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

export default Services;
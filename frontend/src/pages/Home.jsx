 import heroImage from "../assets/p1.avif";
import arrowIcon from "../assets/right-arrow (1).png";
import starIcon from "../assets/star.png";
import Navbar from "../component/Navbar";
import heart from "../assets/heart (1).png";
import { useState, useEffect } from "react";
import axios from "axios";
import k1 from "../assets/k1.webp";
import k2 from "../assets/k2.webp";
import k3 from "../assets/k3.webp";
import k4 from "../assets/k4.webp";
import k5 from "../assets/k5.webp";
import k6 from "../assets/k6.webp";
import m1 from "../assets/m1.webp";
import m2 from "../assets/m2.webp";
import m3 from "../assets/m3.webp";
import m4 from "../assets/m4.webp";
import o1 from "../assets/o1.webp";
import addIcon from "../assets/add.png";
import rightArrow from "../assets/right-arrow.png";
import leftArrow from "../assets/left-arrow.png";
import u1 from "../assets/u1.avif";
import u2 from "../assets/u2.webp";
import u3 from "../assets/u3.avif";
import truckIcon from "../assets/cargo-truck.png";
import verifiedIcon from "../assets/verified.png";
import musicIcon from "../assets/musical-note.png";
import shoppingCartIcon from "../assets/shopping-cart.png";
import Footer from "../component/Footer";
import cartIcon from "../assets/shopping-cart.png";
import viewArrow from "../assets/right-arrow (1).png";
const Home = () => {
  const [activeCategory, setActiveCategory] = useState(1);
  const [activeReview, setActiveReview] = useState(1);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
  });
  const getTestimonialImage = (img) => {
    if (!img) return u1;
    if (img === "u1.avif") return u1;
    if (img === "u2.webp") return u2;
    if (img === "u3.avif") return u3;
    return `http://localhost:5000/uploads/${img}`;
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        if (response.data.success) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/brands");
        if (response.data.success) {
          setBrands(response.data.brands);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/testimonials");
        if (response.data.success) {
          setTestimonials(response.data.testimonials);
          if (response.data.testimonials.length > 0) {
            setActiveReview(response.data.testimonials[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    fetchCategories();
    fetchProducts();
    fetchBrands();
    fetchTestimonials();
  }, []);
const featuredProducts = [
  {
    id: 1,
    image: m1,
    category: "Electronics",
    title: "Aura Noise Cancelling",
    price: "₹20,999",
    oldPrice: "₹24,999",
    discount: "17% OFF",
  },
  {
    id: 2,
    image: m2,
    category: "Accessories",
    title: "Lumina Smart Timepiece",
    price: "₹33,999",
    oldPrice: "₹39,999",
    discount: "",
  },
  {
    id: 3,
    image: m3,
    category: "Home & Living",
    title: "Zenith Minimalist Coffee",
    price: "₹10,999",
    oldPrice: "₹13,499",
    discount: "19% OFF",
  },
  {
    id: 4,
    image: m4,
    category: "Fashion",
    title: "Voyager Leather Travel",
    price: "₹18,499",
    oldPrice: "₹22,999",
    discount: "",
  },
];
const newArrivals = [
  {
    id: 1,
    image: k2,
    title: "Urban Edge Hoodie",
    price: "₹5,500",
  },
  {
    id: 2,
    image: k1,
    title: "Nordic Ceramic Vases",
    price: "₹12,000",
  },
  {
    id: 3,
    image: k4,
    title: "Professional Tablet Pro",
    price: "₹99,000",
  },
];
const fetchedFeaturedProducts = products.slice(0, 4).map((p) => ({
  id: p.id,
  image: p.image ? `http://localhost:5000/uploads/${p.image}` : m1,
  category: p.category,
  title: p.product_name,
  price: `₹${Number(p.base_price || 999).toFixed(2)}`,
  oldPrice: p.discount_price && p.discount_price > 0 ? `₹${Number(p.discount_price || 1299).toFixed(2)}` : "",
  discount: "",
  rating: p.rating,
  description: p.description,
  brand: p.brand,
}));
let displayFeatured = [...fetchedFeaturedProducts];
const fetchedNewArrivals = products.slice(0, 3).map((p) => ({
  id: p.id,
  image: p.image ? `http://localhost:5000/uploads/${p.image}` : k1,
  title: p.product_name,
  price: `₹${Number(p.base_price || 999).toFixed(2)}`,
  description: p.description,
  brand: p.brand,
  category: p.category,
}));
let displayNewArrivals = [...fetchedNewArrivals];
  return (
       <>
      <Navbar />
    <section className="bg-[#f7f7f7] dark:bg-gray-900 transition-colors duration-300 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-left">
            <span className="inline-block bg-blue-100 dark:bg-blue-900/40 text-black dark:text-blue-200 text-xs font-semibold px-4 py-2 rounded-full animate-fade-in-down delay-100">
              SPRING COLLECTION 2024
            </span>
            <h1 className="mt-6 text-5xl lg:text-7xl font-bold leading-tight dark:text-white animate-fade-in-up delay-200">
              Refine Your
              <br />
              <span className="text-[#6f4e37] dark:text-[#d7a53f] italic">
                Aesthetic
              </span>
              <br />
              Every Day.
            </h1>
            <p className="mt-6 text-gray-600 dark:text-gray-300 text-lg max-w-lg animate-fade-in-up delay-300">
              Discover curated selections from the world's most innovative
              brands. Premium quality, sustainable materials and timeless
              design at your fingertips.
            </p>
            <div className="flex flex-wrap gap-4 mt-8 animate-fade-in-up delay-400">
              <button onClick={() => (window.location.href = "/categories")}
                className="bg-[#6f4e37] text-white px-7 py-4 rounded-full flex items-center gap-3 hover:bg-blue-700 dark:hover:bg-amber-700 transition hover:scale-105 active:scale-95 duration-200">
                Shop Now
                <img src={arrowIcon} alt="" className="w-4 h-4 invert" />
              </button>
              <button onClick={() => (window.location.href = "/services")}
                className="border border-gray-300 dark:border-gray-600 dark:text-gray-200 px-7 py-4 rounded-full hover:bg-white dark:hover:bg-gray-800 transition hover:scale-105 active:scale-95 duration-200" >
                Explore Products
              </button>
            </div>
            <div className="flex flex-wrap gap-10 mt-12 animate-fade-in-up delay-500">
              <div className="hover:scale-105 transition-transform">
                <h3 className="text-3xl font-bold dark:text-white">15k+</h3>
                <p className="text-gray-500 dark:text-gray-400">Premium Items</p>
              </div>
              <div className="hover:scale-105 transition-transform">
                <h3 className="text-3xl font-bold dark:text-white">98%</h3>
                <p className="text-gray-500 dark:text-gray-400">Happy Customers</p>
              </div>
              <div className="hover:scale-105 transition-transform">
                <h3 className="text-3xl font-bold dark:text-white">24h</h3>
                <p className="text-gray-500 dark:text-gray-400">Fast Delivery</p>
              </div>
            </div>
          </div>
          <div className="relative animate-fade-in-right">
            <img src={heroImage} alt="" className="rounded-2xl shadow-2xl w-full hover:scale-[1.02] transition-transform duration-500"/>
            <div className="absolute -bottom-5 left-4 bg-white dark:bg-gray-800 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-float">
              <img src={starIcon} alt="" className="w-5 h-5"/>
              <div>
                <h4 className="font-semibold text-sm dark:text-white">
                  Flash Deal Live
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Up to 40% off electronics
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
<section className="bg-[#f7f7f7] dark:bg-gray-800 py-20 transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex items-center justify-between mb-10">
      <div>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          Categories
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Explore our curated collections — tap any category to discover products.
        </p>
      </div>
      <button onClick={() => window.location.href = "/categories"} className="hidden md:flex items-center gap-2 text-[#6f4e37] font-semibold hover:underline">
        View All
        <img src={viewArrow} alt="" className="w-4 h-4" style={{ filter: "invert(35%) sepia(60%) saturate(600%) hue-rotate(10deg) brightness(80%)" }} />
      </button>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mb-10">
      {categories.slice(0, 12).map((cat, index) => (
        <div
          key={cat.id}
          onClick={() => window.location.href = `/services?category=${encodeURIComponent(cat.category_name)}`}
          className="cursor-pointer rounded-2xl border p-5 transition-all duration-300 flex flex-col items-center text-center bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:shadow-lg hover:scale-105 active:scale-95 animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }} >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 overflow-hidden bg-gray-100 dark:bg-gray-600 transition-transform duration-300 hover:rotate-6">
            {cat.image ? (
              <img
                src={`http://localhost:5000/uploads/${cat.image}`}
                alt={cat.category_name}
                className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">📦</span>
            )}
          </div>
          <h3 className="font-semibold text-sm text-gray-800 dark:text-white leading-tight">
            {cat.category_name}
          </h3>
          {cat.brand && (
            <p className="text-[10px] text-[#6f4e37] dark:text-amber-400 mt-1 font-medium truncate w-full">
              {cat.brand}
            </p>
          )}
        </div>
      ))}
    </div>

    <div className="flex justify-center mt-8">
      <button onClick={() => window.location.href = "/categories"} className="flex items-center gap-2 text-[#6f4e37] font-semibold hover:underline">
        View All Categories
        <img src={viewArrow} alt="" className="w-4 h-4" style={{ filter: "invert(35%) sepia(60%) saturate(600%) hue-rotate(10deg) brightness(80%)" }} />
      </button>
    </div>
  </div>
</section>
<section className="py-20 bg-gradient-to-r from-[#e9e9ef] to-[#ffe9b8] dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
        Featured Products
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mt-3">
        Handpicked by our experts for exceptional quality and innovative design.
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayFeatured.map((product, index) => (
        <div key={product.id} 
             className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01] animate-fade-in-up"
             style={{ animationDelay: `${index * 100}ms` }}>
        <div className="relative">
  <img src={product.image}  alt=""
    className="w-full h-64 object-cover"/>
  {product.discount && (
    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
      {product.discount}
    </span> )}
  <button  onClick={(e) => {   e.stopPropagation();
      const currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const exists = currentWishlist.some((w) => w.image === product.image);
      let updated;
      if (exists) {
        updated = currentWishlist.filter((w) => w.image !== product.image);
      } else {
        updated = [...currentWishlist, {
          id: Date.now(),
          image: product.image,
          name: product.title,
          category: product.category,
          price: product.price,
        }];
      }
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setWishlist(updated);
      window.dispatchEvent(new Event("wishlistUpdated"));
    }}
    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-all duration-300" >
    <svg className="w-5 h-5"
      fill={wishlist.some((w) => w.image === product.image) ? "#e11d48" : "none"}
      stroke={wishlist.some((w) => w.image === product.image) ? "#e11d48" : "#6b7280"}
      strokeWidth="2"
      viewBox="0 0 24 24"  >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  </button>
</div>
          <div className="p-4">
            <p className="text-xs uppercase text-gray-400 dark:text-gray-300 mb-1">
              {product.category || "Product"} {product.brand ? `• ${product.brand}` : ""}
            </p>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white leading-tight">{product.title}</h3>
            {product.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{product.description}</p>}
            {product.rating && parseFloat(product.rating) > 0 ? (
              <div className="flex items-center gap-1 my-3">
                {[1, 2, 3, 4, 5].map((s) => {
                  const rVal = parseFloat(product.rating || "0");
                  const isFilled = s <= Math.round(rVal);
                  return (
                    <img key={s} src={starIcon} alt="star"
                         onClick={async (e) => {
                            e.preventDefault();
                            if(product.id.toString().startsWith("static")) {
                               alert("Cannot rate static products"); return;
                            }
                            try {
                               await fetch(`http://localhost:5000/api/products/${product.id}/rate`, {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ rating: s })
                               });
                               alert("Rating updated! Please refresh.");
                            } catch(err) { console.log(err); }
                         }}
                         className={`w-4 h-4 object-contain cursor-pointer transition-transform hover:scale-110 ${isFilled ? "" : "opacity-30"}`} />
                  );
                })}
                <span className="text-gray-500 dark:text-gray-400 text-xs ml-1 font-semibold">({product.rating})</span>
              </div>
            ) : (
              <div className="my-3">
                <span className="text-gray-400 dark:text-gray-500 text-xs italic">not rating yet</span>
              </div>
            )}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold dark:text-white">{product.price}</span>
              <span className="text-sm text-gray-400 line-through">{product.oldPrice}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => window.location.href = "/product?id=" + product.id} className="flex-1 border border-gray-300 dark:border-gray-600 dark:text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition">Details</button>
              <button
                onClick={() => {
                  const cart = JSON.parse(localStorage.getItem("cart")) || [];
                  cart.push({
                    img: product.image,
                    tag: product.category,
                    title: product.title,
                    price: product.price,
                  });
                  localStorage.setItem("cart", JSON.stringify(cart));
                  window.location.href = "/cart";
                }}
                className="bg-[#6f4e37] hover:bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <img src={cartIcon} alt="" className="w-4 h-4 invert" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
<section className="bg-[#f7f7f7] dark:bg-gray-900 py-20 transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex justify-between items-center mb-10">
      <div>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          New Arrivals
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          The latest trends and tech, fresh from the design studio.
        </p>
      </div>
      <div className="hidden md:flex gap-3">
        <button className="w-10 h-10 rounded-full border dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition">
         <img src={leftArrow} alt="" className="w-3 dark:invert" /> 
        </button>
        <button className="w-10 h-10 rounded-full border dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          <img src={rightArrow} alt="" className="w-3 dark:invert" />
        </button>
      </div>
    </div>
    <div className="grid md:grid-cols-3 gap-6">
      {displayNewArrivals.map((item, index) => (
        <div key={item.id}
          className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4 flex items-center gap-4 hover:shadow-2xl hover:-translate-y-1.5 duration-300 transition-all animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}>
          <img src={item.image} alt="" className="w-24 h-24 rounded-lg object-cover"/>
          <div>
            <p className="text-[10px] tracking-wider text-gray-500 uppercase mb-1">
              {item.category || "Product"} {item.brand ? `• ${item.brand}` : ""}
            </p>
            <h3 className="font-semibold text-gray-900 dark:text-white leading-tight">
              {item.title}
            </h3>
            {item.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>}
            <p className="text-blue-600 dark:text-blue-400 font-bold mt-1">
              {item.price}
            </p>
         <button onClick={() => {   const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({
      img: item.image,
      tag: "New Arrivals",
      title: item.title,
      price: item.price,
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "/cart";
  }}
  className="mt-3 w-full min-w-[170px] bg-[#8B6B4A] hover:bg-[#73563A] text-white py-3 px-4 rounded-md flex items-center justify-center gap-3 whitespace-nowrap transition-all duration-300">
  <img src={shoppingCartIcon} alt="Cart" className="w-5 h-5 flex-shrink-0"/>
  <span className="text-base font-medium">
    Add to Cart
  </span>
</button>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-28">
      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          What Our Customers Say
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-3">
          Real experiences from our global community of design enthusiasts.
        </p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        {testimonials.map((item) => (
         <div key={item.id} onClick={() => setActiveReview(item.id)}
  className={`rounded-2xl p-8 border cursor-pointer transition-all duration-300 ${
    activeReview === item.id
      ? "bg-[#ccb09b] border-black-300 dark:border-gray-600"
      : "bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg" }`}>
            <div className="flex gap-1 mb-5">
              {[1, 2, 3, 4, 5].map((star) => (
                <img key={star} src={starIcon} alt="" className="w-4 h-4"/>
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">
              "{item.review}"
            </p>
            <div className="flex items-center gap-3 mt-6">
              <img src={getTestimonialImage(item.image)} alt=""
                className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h4 className="font-semibold dark:text-white">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="border-t dark:border-gray-700 mt-20 pt-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div onClick={() => (window.location.href = "/checkout")} className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition">
          <img src={truckIcon} alt="" className="w-8 h-8 dark:invert" />
          <div>
            <h4 className="font-semibold dark:text-white">
              Free Express Shipping
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Orders over ₹1500
            </p>
          </div>
        </div>
        <div onClick={() => (window.location.href = "/checkout")} className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition">
          <img src={verifiedIcon} alt="" className="w-8 h-8 dark:invert" />
          <div>
            <h4 className="font-semibold dark:text-white">
              Secure Payment
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              100% protected data
            </p>
          </div>
        </div>
        <div onClick={() => (window.location.href = "/services")} className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition">
          <img src={starIcon} alt="" className="w-8 h-8 dark:invert" />
          <div>
            <h4 className="font-semibold dark:text-white">
              Genuine Products
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Direct from manufacturers
            </p>
          </div>
        </div>
        <div onClick={() => (window.location.href = "/contact")} className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition">
          <img src={musicIcon} alt="" className="w-8 h-8 dark:invert" />
          <div>
            <h4 className="font-semibold dark:text-white">
              24/7 Support
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Dedicated team
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  <Footer />
     </>
       
  );
};

export default Home;
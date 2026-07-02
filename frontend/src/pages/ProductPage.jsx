import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import z2 from "../assets/z2.webp";
import star from "../assets/star.png";
import star1 from "../assets/star (1).png";
import add from "../assets/add.png";
import minus from "../assets/minus.png";
import cart from "../assets/shopping-cart.png";
import truck from "../assets/cargo-truck.png";
import verified from "../assets/verified.png";
import returns from "../assets/product-return.png";
import premium from "../assets/premium.png";
import arrow from "../assets/right-arrow (1).png";
import m1 from "../assets/m1.webp";
import m2 from "../assets/m2.webp";
import m3 from "../assets/m3.webp";
import m4 from "../assets/m4.webp";
import k2 from "../assets/k2.webp";
import k3 from "../assets/k3.webp";
import k4 from "../assets/k4.webp";
import b1 from "../assets/b1.webp";
import b2 from "../assets/b2.webp";
import b3 from "../assets/b3.webp";
import b4 from "../assets/b4.webp";
import b5 from "../assets/b5.webp";
import b6 from "../assets/b6.webp";
import c1 from "../assets/c1.avif";
import c2 from "../assets/c2.webp";
import c3 from "../assets/c3.avif";
import u1 from "../assets/u1.avif";
const curatedProducts = [
  { img: m1,  tag: "Headphones",  title: "Zenith Studio Headphones",    price: "₹24,500",  oldPrice: "₹29,999", rating: "4.8" },
  { img: k2,  tag: "Accessories", title: "Urban Edge Hoodie",            price: "₹3,799",   oldPrice: "₹4,999",  rating: "4.7" },
  { img: k3,  tag: "Watches",     title: "Lumina Smart Timepiece",       price: "₹31,999",  oldPrice: "₹38,500", rating: "4.9" },
  { img: b1,  tag: "Handbags",    title: "Minimalist Leather Tote",      price: "₹26,500",  oldPrice: "₹32,000", rating: "4.8" },
  { img: b2,  tag: "Accessories", title: "Eclipse Aviator Shades",       price: "₹14,999",  oldPrice: "₹18,000", rating: "4.6" },
  { img: b3,  tag: "Electronics", title: "Pro Laptop Series X",          price: "₹89,999",  oldPrice: "₹99,999", rating: "4.9" },
  { img: b4,  tag: "Fashion",     title: "Luxury Travel Bag",            price: "₹29,999",  oldPrice: "₹36,000", rating: "4.8" },
  { img: b5,  tag: "Apparel",     title: "Silk Evening Dress",           price: "₹15,500",  oldPrice: "₹19,500", rating: "4.7" },
  { img: b6,  tag: "Watches",     title: "Smart Watch Pro",              price: "₹38,999",  oldPrice: "₹45,000", rating: "4.9" },
];
const timelessProducts = [
  { img: c1, tag: "Fragrance", title: "Signature Fragrance",   price: "₹17,399", oldPrice: "₹21,000", rating: "4.9" },
  { img: k3, tag: "Watches",   title: "Gold Dial Watch",        price: "₹73,490", oldPrice: "₹89,000", rating: "5.0" },
  { img: c2, tag: "Fashion",   title: "Italian Silk Scarf",     price: "₹11,726", oldPrice: "₹14,500", rating: "4.7" },
  { img: c3, tag: "Footwear",  title: "Handcrafted Loafers",    price: "₹34,660", oldPrice: "₹42,000", rating: "4.8" },
];
const voiceFeatured = [
  {
    img: b2,
    name: "Priya Sharma",
    role: "Fashion Stylist",
    review:
      "The attention to detail in the packaging alone was breathtaking. The accessories are a true masterpiece of modern craftsmanship.",
  },
  {
    img: b4,
    name: "Rahul Verma",
    role: "Art Director",
    review:
      "The customer service team was exceptional. They helped me track my international shipment and ensured everything arrived perfectly.",
  },
  {
    img: u1,
    name: "Anjali Mehra",
    role: "Lifestyle Blogger",
    review:
      "I've owned many high-end products, but the Zenith Studio collection is on a whole different level of clarity and luxury.",
  },
];
const voiceMore = [
  {
    img: m2,
    name: "Vikram Singh",
    role: "Tech Executive",
    review:
      "Absolutely love the watch collection. The Aurora Chronograph exceeded every expectation — worth every rupee.",
  },
  {
    img: m3,
    name: "Sneha Kapoor",
    role: "Interior Designer",
    review:
      "The minimalist design philosophy is exactly what I was looking for. Premium quality at its finest.",
  },
  {
    img: m4,
    name: "Arjun Nair",
    role: "Travel Photographer",
    review:
      "Finding premium travel accessories that are actually durable is tough. The Voyager collection is now my go-to for every shoot.",
  },
  {
    img: k4,
    name: "Kavita Patel",
    role: "Product Manager",
    review:
      "Incredible experience from browsing to delivery. The product quality matched every single description perfectly.",
  },
];
const features = [
  { icon: truck,    title: "Fast Delivery",    desc: "Free shipping all over India" },
  { icon: verified, title: "Secure Checkout",  desc: "100% secure payments" },
  { icon: returns,  title: "Easy Returns",     desc: "7 Days Return Policy" },
  { icon: premium,  title: "Premium Quality",  desc: "Certified Products" },
];
const HeartIcon = ({ filled, onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur p-2 rounded-full shadow hover:scale-110 transition z-10"
    aria-label={filled ? "Remove from wishlist" : "Add to wishlist"} >
    <svg className="w-5 h-5 text-gray-500 dark:text-gray-300" fill={filled ? "#e11d48" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24" >
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  </button>
);
const TimelessHeart = ({ item }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  useEffect(() => {
    const syncWishlist = () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const exists = wishlist.some((w) => w.image === item.img);
      setIsWishlisted(exists);
    };
    syncWishlist();
    window.addEventListener("wishlistUpdated", syncWishlist);
    return () => window.removeEventListener("wishlistUpdated", syncWishlist);
  }, [item.img]);
  const handleToggle = (e) => {
    e.stopPropagation();
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = wishlist.some((w) => w.image === item.img);
    if (exists) {
      wishlist = wishlist.filter((w) => w.image !== item.img);
      setIsWishlisted(false);
    } else {
      wishlist.push({
        id: Date.now(),
        image: item.img,
        name: item.title,
        category: item.tag,
        price: item.price
      });
      setIsWishlisted(true);
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };
  return (
    <button onClick={handleToggle}
      className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur p-2 rounded-full shadow hover:scale-110 transition z-10"
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"} >
      <svg className="w-4 h-4 text-gray-500 dark:text-gray-300" fill={isWishlisted ? "#e11d48" : "none"}
        stroke="currentColor" strokeWidth="2"
        viewBox="0 0 24 24"  >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
};
const ProductCard = ({ id, img, tag, title, price, oldPrice, rating, showButton = false, variants, description, brand }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
useEffect(() => {
  const syncWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = wishlist.find((item) => item.id === id);
    setIsWishlisted(!!exists);
  };
  syncWishlist();
  window.addEventListener("wishlistUpdated", syncWishlist);
  return () => {
    window.removeEventListener("wishlistUpdated", syncWishlist);
  };
}, [id]);

  const navigate = useNavigate();
const handleWishlist = (e) => {
  e.stopPropagation();
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Please login to use wishlist");
    navigate("/login");
    return;
  }
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const exists = wishlist.find((item) => item.id === id);
  if (exists) {
    wishlist = wishlist.filter((item) => item.id !== id);
    setIsWishlisted(false);
  } else {
    wishlist.push({
      id,
      image: img,
      name: title,
      category: tag,
      price
    });
    setIsWishlisted(true);
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  window.dispatchEvent(new Event("wishlistUpdated"));
};
const getWishlist = () => {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
};
  return (
    <div className="bg-white dark:bg-gray-800 rounded-[24px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group w-full relative border dark:border-gray-700">
      <div className="relative overflow-hidden">
        <HeartIcon filled={isWishlisted} onClick={handleWishlist} />
        <img src={img} alt={title}
          className="w-full h-[240px] sm:h-[260px] object-cover group-hover:scale-105 transition duration-500"/>
        <span className="absolute top-4 left-4 bg-white/90 dark:bg-gray-700 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-250 shadow pointer-events-none">
          {tag || "Product"} {brand ? `• ${brand}` : ""}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{title}</h3>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{description}</p>}
        {variants && (() => {
          try {
            const parsed = JSON.parse(variants);
            if (Array.isArray(parsed) && parsed.length > 0) {
              return (
                <div className="mt-2 flex gap-1 flex-wrap max-h-12 overflow-hidden">
                  {parsed.map((v, i) => (
                    <span key={i} className="flex items-center text-[10px] bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-305 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">
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
        <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#6f4e37] dark:text-amber-100 font-bold text-base">{price}</span>
            {oldPrice && (
              <span className="text-gray-400 dark:text-gray-500 line-through text-xs">{oldPrice}</span> )}
          </div>
          <div className="flex items-center gap-1">
            {rating && parseFloat(rating) > 0 ? (
              <div className="flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform" onClick={async (e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 if(!id || id.toString().startsWith("static") || id.toString().startsWith("f")) {
                    alert("Cannot rate static products"); return; }
                 const newRating = prompt("Enter your rating (1-5):", "5");
                 if(newRating && !isNaN(newRating) && parseFloat(newRating) >= 1 && parseFloat(newRating) <= 5) {
                    try {
                       await fetch(`http://localhost:5000/api/products/${id}/rate`, {
                          method: "POST", headers: {"Content-Type": "application/json"},
                          body: JSON.stringify({ rating: parseFloat(newRating) })
                       });
                       alert("Rating updated! Please refresh.");
                    } catch(err) { console.log(err); }
                 } else if (newRating) {
                    alert("Please enter a valid rating between 1 and 5.");
                 }
              }}>
                <img src={star1} alt="star" className="w-4 h-4 object-contain" />
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{rating}</span>
              </div>
            ) : (
              <span className="text-gray-400 dark:text-gray-500 text-xs italic">not rating yet</span>
            )}
          </div>
        </div>
        {showButton && (
          <button onClick={(e) => {
  e.stopPropagation();
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ img, title, tag, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "/cart";
}} className="mt-3 w-full bg-[#6f4e37] text-white py-2 rounded-full text-sm font-semibold hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
            <img src={cart} alt="Cart" className="w-4 h-4 brightness-0 invert" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};
const SectionHeader = ({ title, highlight, subtitle, btnLabel = "View All Collection" }) => (
  <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        {title} <span className="text-[#6f4e37]">{highlight}</span>
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{subtitle}</p>
    </div>
    <button className="hidden sm:flex items-center gap-2 border border-black dark:border-white text-[#6f4e37] dark:text-amber-100 px-5 py-2 rounded-full hover:bg-amber-50 dark:hover:bg-gray-800 transition text-sm font-medium">
      {btnLabel}
      <img src={arrow} alt="" className="w-4 h-4 dark:invert" />
    </button>
  </div>
);
const ProductPage = () => {
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [activeReview, setActiveReview] = useState(0);
  const [selectedCarat, setSelectedCarat] = useState("18kt");
  const [selectedColor, setSelectedColor] = useState("Gold");
  const [selectedSize, setSelectedSize] = useState("7");
  const [selectedDiamond, setSelectedDiamond] = useState("VS-SI-GHI");
  const [heroProduct, setHeroProduct] = useState(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [dynamicTimeless, setDynamicTimeless] = useState([]);
  const [isMainWishlisted, setIsMainWishlisted] = useState(false);
  useEffect(() => {
  fetch("http://localhost:5000/api/products")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setProducts(data.products);
        if (data.products && data.products.length > 0) {
          const urlParams = new URLSearchParams(window.location.search);
          const productId = urlParams.get("id");
          const foundProduct = productId ? data.products.find(p => p.id === parseInt(productId, 10)) : null;
          setHeroProduct(foundProduct || data.products[0]);
        }
        const mappedFeatured = data.products.slice(0, 4).map(p => ({
          img: p.image ? `http://localhost:5000/uploads/${p.image}` : c1,
          tag: p.category,
          title: p.product_name,
          price: `₹${p.base_price}`,
          oldPrice: p.discount_price > 0 ? `₹${p.discount_price}` : "",
          rating: p.rating,
          description: p.description,
          brand: p.brand
        }));
        setDynamicTimeless(mappedFeatured);
      }
    })
    .catch((err) => console.log(err));
}, []);
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5] dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="w-full relative">
              <HeartIcon 
                filled={isMainWishlisted} 
                onClick={async (e) => {
                  e.stopPropagation();
                  const user = JSON.parse(localStorage.getItem("user"));
                  if (!user) {
                    alert("Please login to use wishlist");
                    navigate("/login");
                    return;
                  }
                  const nextVal = !isMainWishlisted;
                  setIsMainWishlisted(nextVal);
                  try {
                    await fetch("http://localhost:5000/api/wishlist", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ userId: user.id, productId: 1 }) // default/mock product id for main hero banner product
                    });
                    window.dispatchEvent(new Event("wishlistUpdated"));
                  } catch (err) {
                    console.error(err); }  }}  />
              <img src={heroProduct?.image ? `http://localhost:5000/uploads/${heroProduct.image}` : z2} alt="Product"
                className="w-full rounded-[30px] shadow-xl object-cover max-h-[480px] lg:max-h-none" />
              {heroProduct && heroProduct.tags && (
                <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                  {(() => {
                    try {
                      const parsedTags = JSON.parse(heroProduct.tags);
                      return Array.isArray(parsedTags) ? parsedTags.map((tag, idx) => (
                        <span key={idx} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-200 shadow">
                          {tag}
                        </span>
                      )) : null;
                    } catch { return null; }
                  })()}
                </div>
              )}
            </div>
            <div className="w-full">
              <span className="border border-amber-300 dark:border-amber-500/30 text-[#6f4e37] dark:text-amber-100 px-4 py-1 rounded-full text-sm font-medium">
                {heroProduct?.sub_category || "New Collection"}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 leading-tight text-gray-900 dark:text-white">
                {heroProduct?.product_name || "Mastery in Motion."}
              </h1>
              {heroProduct?.rating && parseFloat(heroProduct.rating) > 0 ? (
                <div className="flex items-center gap-1 mt-4 flex-wrap">
                  {[1, 2, 3, 4, 5].map((s) => {
                    const rVal = parseFloat(heroProduct.rating || "0");
                    const isFilled = s <= Math.round(rVal);
                    return (
                      <img key={s} src={isFilled ? star : star1} alt="" className="w-4 h-4 object-contain" />
                    );
                  })}
                  <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">({heroProduct.rating} Rating)</span>
                </div>
              ) : (
                <div className="mt-4">
                  <span className="text-gray-400 dark:text-gray-500 text-sm italic">not rating yet</span>
                </div>
              )}
              <p className="text-gray-600 dark:text-gray-305 mt-5 leading-7 text-sm sm:text-base">
                {heroProduct?.description || "Experience premium craftsmanship with modern design. Built for style, durability and everyday comfort."}
              </p>
              <div className="mt-6 flex items-center gap-4 flex-wrap">
                <span className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
                  ₹{(() => {
                    let price = heroProduct?.base_price || 41297;
                    if (heroProduct?.variants) {
                      try {
                        const parsed = JSON.parse(heroProduct.variants);
                        const varPrice = parsed[selectedVariantIndex]?.price;
                        if (varPrice) price += Number(varPrice);
                      } catch {}
                    }
                    return price;
                  })()}
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-6">Taxes included.</p>
              
              <div className="space-y-6">
                {heroProduct && heroProduct.variants && (() => {
                  try {
                    const variants = JSON.parse(heroProduct.variants);
                    if (Array.isArray(variants) && variants.length > 0) {
                      return (
                        <div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">Select Variant</p>
                          <div className="flex gap-3 flex-wrap">
                            {variants.map((v, idx) => (
                              <button key={idx} onClick={() => setSelectedVariantIndex(idx)} 
                                className={`px-4 py-2 flex flex-col items-center justify-center rounded-xl border text-sm font-medium transition ${selectedVariantIndex === idx ? 'bg-[#0b1b3d] text-white border-[#0b1b3d] dark:bg-amber-600 dark:text-white dark:border-amber-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-350 border-gray-400 dark:border-gray-600 hover:border-black dark:hover:border-white'}`}>
                                <span>{v.name || `Variant ${idx + 1}`}</span>
                                {(v.size || v.colour) && (
                                  <span className="text-xs opacity-80 mt-1">
                                    {v.size && `Size: ${v.size}`} {v.colour && `Color: ${v.colour}`}
                                  </span>
                                )}
                                {v.price && <span className="text-xs mt-1 text-[#d9a63d]">+₹{v.price}</span>}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  } catch {}
                  return null;
                })()}
              </div>
              <div className="mt-8 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full border-[3px] border-green-100"></div>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider">1 IN STOCK</span>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Quantity</span>
                <div className="w-28 flex items-center justify-between border border-gray-300 dark:border-gray-600 rounded-full px-3 py-1 gap-2">
                  <button onClick={() => qty > 1 && setQty(qty - 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
                    <img src={minus} alt="" className="w-2.5 dark:invert" />
                  </button>
                  <span className="font-semibold text-sm w-5 text-center">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
                    <img src={add} alt="" className="w-2.5 dark:invert" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button 
                  onClick={() => {
                    if (!heroProduct) return;
                    const cart = JSON.parse(localStorage.getItem("cart")) || [];
                    let finalPrice = heroProduct.base_price || 0;
                    let variantInfo = "";
                    if (heroProduct.variants) {
                      try {
                        const parsed = JSON.parse(heroProduct.variants);
                        const selectedVar = parsed[selectedVariantIndex];
                        if (selectedVar) {
                          if (selectedVar.price) finalPrice += Number(selectedVar.price);
                          variantInfo = `${selectedVar.name || ""} ${selectedVar.size ? `Size: ${selectedVar.size}` : ""} ${selectedVar.colour ? `Color: ${selectedVar.colour}` : ""}`.trim();
                        }
                      } catch (e) {}
                    }
                    cart.push({
                      id: heroProduct.id,
                      img: heroProduct.image ? `http://localhost:5000/uploads/${heroProduct.image}` : z2,
                      tag: heroProduct.category || "Product",
                      title: heroProduct.product_name,
                      price: `₹${finalPrice}`,
                      quantity: qty,
                      variant: variantInfo
                    });
                    localStorage.setItem("cart", JSON.stringify(cart));
                    window.location.href = "/cart";
                  }}
                  className="flex-1 bg-white dark:bg-gray-800 border border-[#0b1b3d] dark:border-amber-500 text-[#0b1b3d] dark:text-amber-100 px-8 py-4 rounded-md font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                  Add to cart
                </button>
                <button  onClick={() => {
                    if (!heroProduct) return;
                    const cart = JSON.parse(localStorage.getItem("cart")) || [];
                    let finalPrice = heroProduct.base_price || 0;
                    let variantInfo = "";
                    if (heroProduct.variants) {
                      try {
                        const parsed = JSON.parse(heroProduct.variants);
                        const selectedVar = parsed[selectedVariantIndex];
                        if (selectedVar) {
                          if (selectedVar.price) finalPrice += Number(selectedVar.price);
                          variantInfo = `${selectedVar.name || ""} ${selectedVar.size ? `Size: ${selectedVar.size}` : ""} ${selectedVar.colour ? `Color: ${selectedVar.colour}` : ""}`.trim();
                        }
                      } catch (e) {}
                    }
                    cart.push({
                      id: heroProduct.id,
                      img: heroProduct.image ? `http://localhost:5000/uploads/${heroProduct.image}` : z2,
                      tag: heroProduct.category || "Product",
                      title: heroProduct.product_name,
                      price: `₹${finalPrice}`,
                      quantity: qty,
                      variant: variantInfo
                    });
                    localStorage.setItem("cart", JSON.stringify(cart));
                    window.location.href = "/cart";
                  }}
                  className="flex-1 bg-[#0b1b3d] dark:bg-amber-600 text-white px-8 py-4 rounded-md font-semibold transition-all hover:bg-opacity-90 dark:hover:bg-amber-700">
                  Buy it now
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-16">
            {features.map((item, index) => (
              <div key={index} onClick={() => setActive(index)}
                className={`cursor-pointer rounded-3xl p-6 border transition-all duration-300 ${
                  active === index
                    ? "bg-[#6f4e37] text-white shadow-2xl scale-105 border-transparent"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white hover:shadow-lg"  }`} >
                <div   className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    active === index ? "bg-white shadow-md" : "bg-[#6f4e37] dark:bg-amber-600" }`} >
                  <img src={item.icon} alt="" className="w-8 h-8 object-contain dark:invert" />
                </div>
                <h3 className={`font-semibold text-lg ${active === index ? "text-white" : "text-gray-800 dark:text-white"}`}>
                  {item.title}
                </h3>
                <p className={`text-sm mt-2 leading-6 ${active === index ? "text-white/90" : "text-gray-500 dark:text-gray-400"}`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
          <SectionHeader title="Curated" highlight="Essentials"
            subtitle="Discover the season's most wanted luxury items." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {products.map((item) => (
   <ProductCard
     key={item.id}
     id={item.id}
     img={item.image ? `http://localhost:5000/uploads/${item.image}` : z2}
     tag={item.category}
     title={item.product_name}
     price={`₹${item.base_price}`}
     oldPrice={`₹${item.discount_price}`}
     rating={item.rating}
     variants={item.variants}
     description={item.description}
     brand={item.brand}
     showButton={true}  />))}
          </div>
             <div className="flex justify-center mt-8 sm:hidden">
            <button className="flex items-center gap-2 border border-amber-300 text-[#6f4e37] px-5 py-2 rounded-full text-sm">
              View All Collection
              <img src={arrow} alt="" className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="bg-gradient-to-b from-[#fdf9f0] to-white dark:from-gray-900 dark:to-gray-850 py-16 border-t dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-center mb-4">
              <span className="bg-[#6f4e37] text-black text-xs font-bold px-4 py-1 rounded-full tracking-widest uppercase">
                Best Sellers
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Timeless{" "}
              <span className="text-[#6f4e37] italic">Masterpieces</span>
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-10">
              Hand-curated selections that define enduring style.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(dynamicTimeless.length > 0 ? dynamicTimeless : timelessProducts).map((item, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-[20px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group w-full relative border dark:border-gray-700" >
                  <div className="relative overflow-hidden">
                    <TimelessHeart item={item} />
                    <img src={item.img} alt={item.title}
                      className="w-full h-[200px] sm:h-[220px] object-cover group-hover:scale-105 transition duration-500"/>
                    <span className="absolute top-3 left-3 bg-white/90 dark:bg-gray-700 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-250 shadow pointer-events-none">
                      {item.tag || "Product"} {item.brand ? `• ${item.brand}` : ""}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{item.title}</h3>
                    {item.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>}
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <img key={s} src={star1} alt="" className="w-3 h-3 object-contain" />
                      ))}
                      <span className="text-gray-400 dark:text-gray-500 text-xs ml-1">{item.rating}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
                      <span className="text-[#6f4e37] dark:text-amber-100 font-bold">{item.price}</span>
                      {item.oldPrice && (
                        <span className="text-gray-400 dark:text-gray-500 line-through text-xs">{item.oldPrice}</span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button className="flex-1 border border-black dark:border-white text-[#6f4e37] dark:text-amber-100 py-2 rounded-full text-xs font-semibold hover:bg-amber-50 dark:hover:bg-gray-700 transition">
                        Quick View
                      </button>
                      <button 
                        onClick={() => {
                          const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
                          cartItems.push({ img: item.img, title: item.title, tag: item.tag, price: item.price });
                          localStorage.setItem("cart", JSON.stringify(cartItems));
                          window.location.href = "/cart";
                        }}
                        className="w-10 h-10 border border-black dark:border-white bg-amber-50 dark:bg-gray-700 hover:bg-[#6f4e37] dark:hover:bg-[#6f4e37] hover:text-white dark:hover:text-white text-[#6f4e37] dark:text-amber-100 flex items-center justify-center rounded-full transition group-hover:shadow-md">
                        <img src={cart} alt="cart" className="w-4 h-4 hover:invert group-hover:brightness-0 dark:invert transition" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="py-16 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Voices of{" "}
                <span className="text-[#6f4e37] italic">Luxury</span>
              </h2>
              <p className="text-black dark:text-gray-300 text-sm sm:text-base mt-2">
                What our global community says about their AURA experience.
              </p>
            </div>
           <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
  {voiceMore.map((item, i) => (
    <div
      key={i}
      onClick={() => setActiveReview(i)}
      className={`border rounded-2xl p-5 shadow-sm cursor-pointer transition-all duration-300 ${
        activeReview === i
          ? "bg-[#6f4e37] text-white"
          : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:shadow-md"  }`} >
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((s) => (
          <img key={s}  src={star1}  alt=""
            className="w-4 h-4 object-contain" />  ))}
      </div>
      <p  className={`italic leading-relaxed text-xs ${
        activeReview === i
            ? "text-white"
            : "text-gray-600 dark:text-gray-300"
        }`} >
        "{item.review}"
      </p>
      <div className="mt-5">
        <h4 className={`font-semibold text-xs ${
            activeReview === i
              ? "text-white"
              : "text-gray-900 dark:text-white"
          }`}  >
          {item.name}
        </h4>
        <p
          className={`text-xs uppercase tracking-wider ${
            activeReview === i
              ? "text-gray-200"
              : "text-gray-500 dark:text-gray-400"
          }`}  >
          {item.role}
        </p>
      </div>
        </div>
         ))}
          </div>
          </div>
        </div>
        <div className="py-14 bg-[#f8f5f2] dark:bg-gray-900 border-t dark:border-gray-850">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-black rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
              <span className="bg-black text-white text-xs font-bold px-4 py-1 rounded-full tracking-widest uppercase">
                Exclusive Access
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-5 mb-3">
                Join the{" "}
                <span className="text-[#6f4e37]">Inner Circle</span>
              </h2>
              <p className="text-gray-200 text-sm sm:text-base max-w-xl mx-auto mb-8">
                Subscribe to receive exclusive access to private sales, new collections,
                and artisan stories.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input type="email" placeholder="Enter your email address"
                  className="flex-1 rounded-full px-5 py-3 text-sm outline-none border border-white/20 bg-white/10 text-white placeholder-gray-300 focus:bg-white/20 transition" />
                <button className="bg-white hover:bg-[#6f4e37] text-black font-bold px-6 py-3 rounded-full text-sm transition-all hover:scale-105 whitespace-nowrap">
                  Subscribe Now
                </button>
              </div>
              <p className="text-gray-400 text-xs mt-5 uppercase tracking-wider">
                *By subscribing you agree to our Privacy Policy and Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
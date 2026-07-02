import { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import cloths from "../assets/cloths.jpeg";
import filterIcon from "../assets/filter.png";
import downArrow from "../assets/down-arrow.png";
import k3 from "../assets/k3.webp";
import purse from "../assets/purse.webp";
import c2 from "../assets/c2.webp";
import bag from "../assets/bag.webp";
import earrings from "../assets/earrings.webp";
import shoes from "../assets/shoes.webp";
import heart from "../assets/heart (1).png";
import star from "../assets/star (1).png";
import cart from "../assets/shopping-cart.png";
import b1 from "../assets/b1.webp";
import b3 from "../assets/b3.webp";
import c3 from "../assets/c3.avif";
import bagIcon from "../assets/bag.png";
import watchIcon from "../assets/wristwatch.png";
import laptopIcon from "../assets/laptop.png";
import rightArrow from "../assets/right-arrow (1).png";
const Categories =() =>{
  const [categories,setCategories] = useState([]);
  const [brandsList, setBrandsList] = useState([]);
  const [products, setProducts] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [maxPriceFilter, setMaxPriceFilter] = useState(200000);
  const [wishlistedIds, setWishlistedIds] = useState({});
  const [colorsList, setColorsList] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchColors();
  }, []);
  useEffect(() => {
    fetchProducts();
  }, [selectedCategories, selectedBrands, maxPriceFilter]);
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const ids = {};
    wishlist.forEach((item) => {
      if (item && item.id) {
        ids[item.id] = true;
      } else if (item && item.name) {
        const match = products.find(p => p.product_name === item.name);
        if (match) ids[match.id] = true;
      }
    });
    setWishlistedIds(ids);
  }, [products]);
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/categories"
      );
      const data = await res.json();
      console.log("API Response:", data);
      setCategories(
        Array.isArray(data)
          ? data
          : data.categories || []
      );
    } catch (error) {
      console.log("Error fetching categories", error);
    }
  };
  const fetchBrands = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/brands");
      const data = await response.json();
      if (data.success) {
        setBrandsList(data.brands.map(b => b.brand_name));
      }
    } catch (error) {
      console.log("Error fetching brands", error);
    }
  };
  const fetchColors = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/colors");
      const data = await response.json();
      if (data.success) {
        setColorsList(data.colors || []);
      }
    } catch (error) {
      console.log("Error fetching colors", error);
    }
  };
  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("minPrice", 0);
      queryParams.append("maxPrice", maxPriceFilter);
      if (selectedBrands.length > 0) {
        queryParams.append("brands", selectedBrands.join(","));
      }
      if (selectedCategories.length > 0) {
        queryParams.append("categories", selectedCategories.join(","));
      }
      const res = await fetch(`http://localhost:5000/api/products?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };
  const handleBrandChange = (brandName) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]
    );
  };
  const handleCategoryChange = (catName) => {
    setSelectedCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };
  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMaxPriceFilter(200000);
  };
  const handleWishlist = (e, item) => {
    e.stopPropagation();
    const wishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = wishlist.find(
      (p) => p.id === item.id || p.name === item.product_name
    );
    if (exists) {
      const updatedWishlist = wishlist.filter(
        (p) => p.id !== item.id && p.name !== item.product_name
      );
      localStorage.setItem(
        "wishlist",
        JSON.stringify(updatedWishlist)
      );
      setWishlistedIds((prev) => ({
        ...prev,
        [item.id]: false,
      })); } else {
      const newItem = {
        id: item.id,
        image: item.image ? `http://localhost:5000/uploads/${item.image}` : `https://via.placeholder.com/300?text=No+Image`,
        name: item.product_name,
        category: item.category || "Product",
        price: `₹${Number(item.base_price || 0).toLocaleString()}`,
      };
      localStorage.setItem(
        "wishlist",
        JSON.stringify([...wishlist, newItem])
      );
      setWishlistedIds((prev) => ({
        ...prev,
        [item.id]: true,
      })); }
    window.dispatchEvent(
      new Event("wishlistUpdated") );};
  return(
    <>
    <Navbar/>
    <div className ="bg-[#f5f5fa] dark:bg-gray-900 min-h-screen py-8 px-4 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl h-[220px] md:h-[320px]">
          <img src= {cloths}alt="Luxury Collection" className="w-full h-full object-cover"/>
          <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 text-white max-w-md">
            <span className="bg-white text-black top-7 px-3 py-1 rounded-full text-xs font-semibold">   Curated Selection</span>
            <h1 className="mt-3 text-3xl md:text-6xl font-bold leading-none text-white"> Luxury <br/>
            <span className="text-black italic dark:text-amber-100">  Essentials</span></h1>
            <p className="mt-3 text-sm  md:text-base"> Explore our artisan-crafted collection designed
                  for the modern lifestyle.</p>
            <div className="flex gap-3 mt-4">
              <button className="bg-[#6f4e37] hover:bg-[#5a3d2b] text-white px-4 py-2 rounded-lg font-medium">  Explore All</button>
              <button className= "bg-white/90 text-gray-700 px-4 py-2 rounded-lg font-medium">View Lookbook</button>
            </div>
          </div>
        </div>
      </div>
      <div className ="max-w-7xl mx-auto mt-8">
              <div className="flex flex-col lg:flex-row gap-6">
              <div className = "w-full lg:w-72 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border dark:border-gray-700">
                <div className ="flex items-center justify-between  mb-6">
                  <div className="flex items-center gap-2">
                    <img src ={filterIcon} alt="" className="w-4 h-4 dark:invert"></img>
                    <h3 className ="font-semibold dark:text-white">Filter By</h3>
                  </div>
                  <button onClick={handleClearAll} className="text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">Clear All</button>
                </div>
                {/*Categories*/}
                <div className ="border-b dark:border-gray-700 pb-4 mb-4">
                  < div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm  font-bold dark:text-white">Categories</h4>
                  <img src={downArrow} alt="" className="W-3 h-3 dark:invert"/>
                  </div>
               <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {categories.map((item) => (
               <label  key={item.id}
               className="flex items-center gap-2 cursor-pointer" >
                <input  type="checkbox"  checked={selectedCategories.includes(item.category_name)}
                  onChange={() => handleCategoryChange(item.category_name)} className="accent-[#6f4e37]" />
             {item.category_name}
              </label> ))}
                   </div>
                       </div>
                        <div className="border-b dark:border-gray-700 pb-4 mb-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className=" text-sm font-medium dark:text-white">Price Range</h4>
                            <img src={downArrow} alt="" className="w-3 h-3 dark:invert"/>
                          </div>
                          <input   type="range"  min="0"  max="200000"  step="1000" value={maxPriceFilter}
                            onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                            className="w-full accent-[#6f4e37]" />
                          <div className="flex gap-3 mt-4">
                            <div>
                              <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-1"> MIN </p>
                              <input type="text" value="₹0" readOnly 
                              className="w-20 border dark:border-gray-600 rounded px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 dark:text-white"/>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">Max</p>
                              <input type="text" value={`₹${maxPriceFilter.toLocaleString()}`} readOnly className="w-20 border dark:border-gray-600 rounded px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 dark:text-white"/>
                            </div>
                           </div>
                            </div>
                             {/* Featured Brands */}
                            <div className="border-b dark:border-gray-700 pb-4 mb-4">
                              <div className="flex items-center  justify-between mb-3">
                                <h4 className="text-sm  font-semibold dark:text-white">Featured Brands</h4>
                                <img src ={downArrow} alt="" className="w-3 h-3 dark:invert"/>
                              </div>
                              <div className="space-y-2 text-sm  text-gray-600 dark:text-gray-300">
                                {brandsList.map((brand) => (
                                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                                    <input  type="checkbox"  checked={selectedBrands.includes(brand)}
                                      onChange={() => handleBrandChange(brand)}
                                      className="accent-[#6f4e37]" />
                                    {brand}
                                  </label> ))}
                              </div>
                            </div>
                            <div className="border-b dark:border-gray-700 pb-4 mb-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium dark:text-white"> Colour Palette</h4>
                                <img  src={downArrow} alt="" className=" w-3 h-3 dark:invert"/>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {colorsList.map((color) => (
                                  <button key={color.id}
                                    onClick={() => {
                                      setSelectedColors((prev) =>
                                        prev.includes(color.color_name) ? prev.filter(c => c !== color.color_name) : [...prev, color.color_name]
                                      );
                                    }}
                                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                                      selectedColors.includes(color.color_name)
                                        ? "border-[#6f4e37] ring-2 ring-[#6f4e37] ring-offset-1"
                                        : "border-gray-200"
                                    }`}
                                    style={{ backgroundColor: color.hex_code || "#ccc" }}
                                    title={color.color_name} />
                                ))}
                              </div>
                            </div>
                            <div  className=" bg-[#6f4e37] border border-black rounded-2xl p-4">
                              <h4 className="text-black font-semibold mb-2"> Prive Membership</h4>
                              <p className="text-xs text-white mb-4"> Join our inner circle for exclusive early access and bespoke concierge services.</p>
                              <button className="bg-white text-black  px-4 py-2 rounded-full text-xs font-medium">Join Now</button>
                            </div>
                             </div>
                     <div className="flex-1">
                      <div className="flex items-center justify-between mb-6">
                       <p className="text-sm text-gray-500 dark:text-gray-400">
                         Showing 1-{products.length} of {products.length} exquisite items
                          </p>
                <div className="flex items-center gap-2">
                 <span className="text-xs text-gray-500">SORT BY</span>
                       <button className="border dark:border-gray-700 rounded-lg px-3 py-2 text-sm flex items-center gap-2 bg-white dark:bg-gray-800">
                     Most Coveted
                     <img src={downArrow} alt="" className="w-3 h-3 dark:invert" />
               </button>
                 </div>
                  </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((item) => (
              <div key={item.id}
  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition border dark:border-gray-700">
  <div className="relative">
    <img src={item.image ? `http://localhost:5000/uploads/${item.image}` : `https://via.placeholder.com/300?text=No+Image`} alt={item.product_name}
      className="w-full h-64 object-cover" />
    <button onClick={(e) => handleWishlist(e, item)}
      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:scale-110 transition" >
      <svg  className="w-4 h-4"  fill={wishlistedIds[item.id] ? "#e11d48" : "none"}
        stroke={wishlistedIds[item.id] ? "#e11d48" : "#6b7280"}
        strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
    <button  onClick={() => {
        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        cartItems.push({ img: item.image ? `http://localhost:5000/uploads/${item.image}` : `https://via.placeholder.com/300?text=No+Image`, title: item.product_name, tag: item.category || "Product", price: `₹${Number(item.base_price || 0).toLocaleString()}` });
        localStorage.setItem("cart", JSON.stringify(cartItems));
        window.location.href = "/cart"; }}
      className="absolute top-3 right-12 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition">
      <img src={cart} alt="" className="w-4 h-4" />
    </button>
  </div>
  <div className="p-4">
    <p className="text-[10px] tracking-wider text-gray-500 uppercase">
      {item.category || "Product"} {item.brand ? `• ${item.brand}` : ""}
    </p>
    <h3 className="mt-1 font-medium text-gray-800 dark:text-gray-100">
      {item.product_name}
    </h3>
    {item.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>}
    <p className="text-sm font-bold text-gray-900 dark:text-white mt-2">
      ₹{Number(item.base_price || 0).toLocaleString()}
    </p>
    <button   onClick={() => {
        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        cartItems.push({ img: item.image ? `http://localhost:5000/uploads/${item.image}` : `https://via.placeholder.com/300?text=No+Image`, title: item.product_name, tag: item.category || "Product", price: `₹${Number(item.base_price || 0).toLocaleString()}` });
        localStorage.setItem("cart", JSON.stringify(cartItems));
        window.location.href = "/cart"; }}
      className="mt-4 w-full bg-[#6f4e37] hover:bg-[#5a3d2b] transition text-white py-2 rounded-lg">
      Add to Cart
         </button>
            </div>
            </div>
                    ))}
                      </div>
                        </div>                
                           </div>
          <div className="flex justify-center items-center gap-3 mt-10">
              <button className="border dark:border-gray-700 px-4 py-2 rounded-lg text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
               Prev
              </button>
           {[1, 2, 3, 4, 5].map((page) => (
         <button key={page} onClick={() => setActivePage(page)} className={`w-10 h-10 rounded-lg transition
        ${
          activePage === page
            ? "bg-[#6f4e37] text-white shadow-lg"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border dark:border-gray-700"
        }`} >
      {page}
    </button>))}
  <button className="border dark:border-gray-700 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800">
    Next
  </button>
</div>  
    </div>
       </div>
         <div></div>
                <Footer/>
       </>
  )
}
export default Categories;
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import searchIcon from "../assets/search.png";
import heartIcon from "../assets/heart.png";
import cartIcon from "../assets/shopping-cart.png";
import userIcon from "../assets/user.png";
import menuIcon from "../assets/menu1.png";
import sunIcon from "../assets/sun.png";
import moonIcon from "../assets/moon.png";
import logo from "../assets/logo.png";
import profileImg from "../assets/profile.jpg";
import downArrow from "../assets/down-arrow.png";

// Static pages for search
const PAGES = [
  { name: "Home", path: "/home", icon: "🏠", desc: "Back to homepage" },
  { name: "All Products", path: "/services", icon: "🛍️", desc: "Browse all products" },
  { name: "Shop by Categories", path: "/categories", icon: "📂", desc: "Explore categories" },
  { name: "About Us", path: "/about", icon: "ℹ️", desc: "Learn about us" },
  { name: "Contact", path: "/contact", icon: "📞", desc: "Get in touch" },
  { name: "Profile", path: "/profile", icon: "👤", desc: "Your account" },
  { name: "Cart", path: "/cart", icon: "🛒", desc: "View your cart" },
  { name: "Wishlist", path: "/wishlist", icon: "❤️", desc: "Your saved items" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ products: [], categories: [], pages: [] });
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Search products + categories from backend + pages
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();

      // Match pages
      const matchedPages = PAGES.filter(p =>
        p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
      );

      // Fetch products + categories from backend
      fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          setSearchResults({
            products: (data.products || []).slice(0, 5),
            categories: (data.categories || []).slice(0, 3),
            pages: matchedPages.slice(0, 3),
          });
        })
        .catch(() => {
          setSearchResults({ products: [], categories: [], pages: matchedPages.slice(0, 3) });
        });

      setShowSearchDropdown(true);
    } else {
      setSearchResults({ products: [], categories: [], pages: [] });
      setShowSearchDropdown(false);
    }
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [wishlistCount, setWishlistCount] = useState(0);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || document.documentElement.classList.contains("dark");
  });
  const location = useLocation();

  const fetchWishlistCount = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistCount(wishlist.length);
  };

  useEffect(() => {
    fetchWishlistCount();
    window.addEventListener("wishlistUpdated", fetchWishlistCount);
    return () => window.removeEventListener("wishlistUpdated", fetchWishlistCount);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const navLink = (path) =>
    location.pathname === path
      ? "text-[#6f4e37] font-semibold border-b-2 border-[#6f4e37] pb-0.5"
      : `hover:text-[#6f4e37] transition-colors duration-200 ${darkMode ? "text-gray-300" : "text-gray-600"}`;

  const hasAnyResults = searchResults.products.length > 0 || searchResults.categories.length > 0 || searchResults.pages.length > 0;

  const handleSearchItemClick = (path) => {
    setShowSearchDropdown(false);
    setSearchQuery("");
    navigate(path);
  };

  return (
    <header className={`sticky top-0 z-50 border-b shadow-sm transition-colors duration-300 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
           <Link to="/home" className="md:hidden flex items-center gap-2">
  <img src={logo} alt="Logo" className="w-400 h-[60px] object-contain"  />
            </Link>
<Link to="/home" className="hidden md:flex items-center mr-4">
  <img  src={logo}  alt="Logo"  className="w-400 h-[70px] object-contain"/></Link>
            <nav className="hidden md:flex items-center gap-7">
              <Link to="/home" className={navLink("/home")}>Home</Link>
              <div className="relative group cursor-pointer py-2">
              <span
  className={`flex items-center gap-1 transition-colors duration-200 ${
    location.pathname === "/services" || location.pathname === "/categories"
      ? "text-[#6f4e37] font-semibold"
      : darkMode
      ? "text-gray-300 hover:text-[#6f4e37]"
      : "text-gray-600 hover:text-[#6f4e37]"}`}>
  Products
  <img src={downArrow} alt="Down Arrow" className="w-3 h-3 object-contain" />
           </span>
                <div className={`absolute left-0 top-full mt-0 w-48 rounded-xl shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
                  <div className="p-2 flex flex-col gap-1">
                    <Link to="/services" className={`block px-4 py-2 text-sm rounded-lg ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-amber-50"}`}>All Products</Link>
                    <Link to="/categories" className={`block px-4 py-2 text-sm rounded-lg ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-amber-50"}`}>Shop by Categories</Link>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* Search Bar with Dynamic Dropdown */}
          <div className="relative hidden lg:block z-50" ref={searchRef}>
            <div className={`flex items-center rounded-full px-5 py-3 w-[420px] transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
              <img src={searchIcon} alt="" className={`w-5 h-5 opacity-60 ${darkMode ? "invert" : ""}`} />
              <input type="text" placeholder="Search products, categories, pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchQuery.trim()) setShowSearchDropdown(true); }}
                className={`bg-transparent outline-none ml-3 w-full text-sm ${darkMode ? "text-white placeholder-gray-400" : "text-black"}`}/>
            </div>

            {/* Search Results Dropdown */}
            {showSearchDropdown && (
              <div className={`absolute top-full mt-2 w-full rounded-2xl shadow-2xl overflow-hidden z-50 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                {!hasAnyResults && searchQuery.trim() ? (
                  <div className="px-4 py-8 text-center">
                    <div className="text-3xl mb-2">🔍</div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No results for "{searchQuery}"
                    </p>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Try different keywords
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Pages Section */}
                    {searchResults.pages.length > 0 && (
                      <div>
                        <div className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500 bg-gray-900' : 'text-gray-400 bg-gray-50'}`}>
                          Pages
                        </div>
                        {searchResults.pages.map((page) => (
                          <button
                            key={page.path}
                            onClick={() => handleSearchItemClick(page.path)}
                            className={`flex items-center gap-3 w-full text-left px-4 py-3 transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-amber-50'}`}
                          >
                            <span className="text-lg">{page.icon}</span>
                            <div>
                              <h4 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{page.name}</h4>
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{page.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Categories Section */}
                    {searchResults.categories.length > 0 && (
                      <div>
                        <div className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500 bg-gray-900' : 'text-gray-400 bg-gray-50'}`}>
                          Categories
                        </div>
                        {searchResults.categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => handleSearchItemClick(`/services?category=${encodeURIComponent(cat.category_name)}`)}
                            className={`flex items-center gap-3 w-full text-left px-4 py-3 transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-amber-50'}`}
                          >
                            <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-sm">📂</span>
                            <div>
                              <h4 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{cat.category_name}</h4>
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{cat.status || "Category"}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Products Section */}
                    {searchResults.products.length > 0 && (
                      <div>
                        <div className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500 bg-gray-900' : 'text-gray-400 bg-gray-50'}`}>
                          Products
                        </div>
                        {searchResults.products.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleSearchItemClick(`/product?id=${product.id}`)}
                            className={`flex items-center gap-3 w-full text-left px-4 py-3 transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-amber-50'}`}
                          >
                            <img
                              src={product.image ? `http://localhost:5000/uploads/${product.image}` : ''}
                              alt=""
                              className="w-10 h-10 object-cover rounded-lg border dark:border-gray-600"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>{product.product_name}</h4>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${darkMode ? 'text-amber-300' : 'text-[#6f4e37]'}`}>₹{product.base_price}</span>
                                {product.category && <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>• {product.category}</span>}
                                {product.brand && <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>• {product.brand}</span>}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* View All Results */}
                    {searchResults.products.length > 0 && (
                      <div className={`px-4 py-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                        <button
                          onClick={() => handleSearchItemClick(`/services`)}
                          className="w-full text-center text-xs font-semibold text-[#6f4e37] dark:text-amber-300 hover:underline"
                        >
                          View All Products →
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center mr-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                title="Toggle Theme"
                className={`p-2 rounded-full transition-all duration-300 shadow-md ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-yellow-100 hover:bg-yellow-200"}`}>
                <img src={darkMode ? moonIcon : sunIcon} alt="theme" className="w-4 h-4 object-contain" />
              </button>
            </div>
            <Link to="/wishlist" className="relative cursor-pointer flex items-center gap-1">
              <img src={heartIcon} alt="" className={`w-5 h-5 md:w-6 md:h-6 hover:scale-110 transition-transform ${darkMode ? "invert" : ""}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -left-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span> )} </Link>
            <Link to="/cart" className="relative cursor-pointer flex items-center gap-1">
              <img src={cartIcon} alt="" className={`w-5 h-5 md:w-6 md:h-6 hover:scale-110 transition-transform ${darkMode ? "invert" : ""}`} />
              <span className={`hidden sm:inline font-semibold text-sm ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Cart</span>
              <span className="absolute -top-2 -left-2 bg-[#6f4e37] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {JSON.parse(localStorage.getItem("cart"))?.length || 0}
              </span>
            </Link>
            {!user ? (
              <Link to="/login"
                className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-205 ${
                  location.pathname === "/login"
                    ? "bg-[#5a3d2b] text-white"
                    : "bg-[#6f4e37] text-white hover:bg-[#5a3d2b]"}`}>
                <img src={userIcon} alt="" className="w-4 h-4 invert" />
                Sign In
              </Link> ) : (
              <div className="relative group hidden sm:block">
                <Link to="/profile"
                  className="block w-9 h-9 rounded-full overflow-hidden border-2 border-[#6f4e37] hover:scale-105 transition-all duration-200" >
                  <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
                </Link>
                <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
                  <div className={`p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                    <p className={`text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>My Account</p>
                    <p className={`text-xs truncate ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{user?.email || "Guest"}</p>
                  </div>
                  <div className="p-2">
                    <Link to="/profile" className={`block px-4 py-2 text-sm rounded-lg ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-amber-50"}`}>View Profile</Link>
                    <button onClick={() => { localStorage.removeItem("user"); window.location.href="/login"; }} className={`w-full text-left block px-4 py-2 text-sm rounded-lg ${darkMode ? "text-red-400 hover:bg-gray-700" : "text-red-600 hover:bg-red-50"}`}>Logout</button>
                  </div>
                </div>
              </div> )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
              <img src={menuIcon} alt="" className={`w-7 h-7 ${darkMode ? "invert" : ""}`} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className={`md:hidden border-t py-4 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
            <div className="flex flex-col gap-4 px-2">
              {/* Mobile Search */}
              <div className={`flex items-center rounded-xl px-4 py-2 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                <img src={searchIcon} alt="" className={`w-4 h-4 opacity-60 ${darkMode ? "invert" : ""}`} />
                <input type="text" placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (searchQuery.trim()) setShowSearchDropdown(true); }}
                  className={`bg-transparent outline-none ml-3 w-full text-sm ${darkMode ? "text-white placeholder-gray-400" : "text-black"}`} />
              </div>
              {[
                { path: "/home", label: "Home" },
                { path: "/services", label: "All Products" },
                { path: "/categories", label: "Shop by Categories" }
              ].map(({ path, label }) => (
                <Link key={path} to={path} onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === path
                      ? "bg-purple-50 text-purple-600 font-semibold"
                      : `${darkMode ? "text-gray-300 hover:text-purple-400" : "text-gray-700 hover:text-purple-600"}`
                  }`}>
                  {label}
                </Link> ))}
              {!user ? (
                <Link to="/login"
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg text-center text-sm font-semibold ${
                    location.pathname === "/login"
                      ? "bg-[#5a3d2b] text-white"
                      : "bg-[#6f4e37] text-white" }`} >
                  Sign In
                </Link> ) : (
                <>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}
                    className={`px-4 py-2 rounded-lg text-center text-sm font-semibold border border-[#6f4e37] ${
                      location.pathname === "/profile"
                        ? "bg-[#6f4e37] text-white"
                        : "text-[#6f4e37]"  }`} >
                    Profile
                  </Link>
                  <button onClick={() => { localStorage.removeItem("user"); window.location.href="/login"; }}
                    className="px-4 py-2 rounded-lg text-center text-sm font-semibold bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300" >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
export default Navbar;
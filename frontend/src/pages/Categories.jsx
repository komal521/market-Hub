import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import cloths from "../assets/cloths.jpeg";
import filterIcon from "../assets/filter.png";
import downArrow from "../assets/down-arrow.png";
import rightArrowIcon from "../assets/right-arrow (1).png";
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [activePage, setActivePage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    let filtered = [...categories];
    if (selectedStatus !== "All") {
      filtered = filtered.filter(c => c.status === selectedStatus);
    }
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      filtered = filtered.filter(c =>
        c.category_name?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.parent_category?.toLowerCase().includes(q)
      );
    }
    setFilteredCategories(filtered);
    setActivePage(1);
  }, [categories, selectedStatus, searchText]);
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const data = await res.json();
      setCategories(
        Array.isArray(data) ? data : data.categories || []
      );
    } catch (error) {
      console.log("Error fetching categories", error);
    } };
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const paginatedCategories = filteredCategories.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE );
  const statusOptions = ["All", "Active", "Trending", "Hidden"];
  const getCategoryGradient = (index) => {
    const gradients = [
      "from-amber-500 to-orange-600",
      "from-emerald-500 to-teal-600",
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-pink-600",
      "from-rose-500 to-red-600",
      "from-cyan-500 to-blue-600",
      "from-yellow-500 to-amber-600",
      "from-green-500 to-emerald-600",
      "from-violet-500 to-purple-600",
      "from-fuchsia-500 to-pink-600",
    ];
    return gradients[index % gradients.length];
  };
  const getCategoryIcon = (name) => {
    const n = (name || "").toLowerCase();
    if (n.includes("electron") || n.includes("laptop") || n.includes("phone")) return "💻";
    if (n.includes("fashion") || n.includes("cloth")) return "👗";
    if (n.includes("watch")) return "⌚";
    if (n.includes("shoe") || n.includes("foot")) return "👟";
    if (n.includes("bag") || n.includes("handbag")) return "👜";
    if (n.includes("jewel") || n.includes("ring")) return "💍";
    if (n.includes("fragran") || n.includes("perfum")) return "🌸";
    if (n.includes("accessor")) return "🕶️";
    if (n.includes("home") || n.includes("decor")) return "🏠";
    if (n.includes("sport") || n.includes("fitness")) return "⚽";
    if (n.includes("book")) return "📚";
    if (n.includes("food") || n.includes("grocery")) return "🍎";
    return "📦";
  };
  return (
    <>
      <Navbar />
      <div className="bg-[#f5f5fa] dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8">
          <div className="relative overflow-hidden rounded-3xl h-[200px] md:h-[280px]">
            <img src={cloths} alt="Categories" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />
            <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 text-white max-w-md">
              <span className="bg-white text-black px-3 py-1 rounded-full text-xs font-semibold">
                Browse Categories
              </span>
              <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight">
                Shop by{" "}
                <span className="italic text-amber-300">Category</span>
              </h1>
              <p className="mt-2 text-sm md:text-base text-gray-200">
                Explore curated collections organized for your shopping convenience.
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8 pb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-64 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border dark:border-gray-700 h-fit lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <img src={filterIcon} alt="" className="w-4 h-4 dark:invert" />
                  <h3 className="font-semibold dark:text-white">Filter</h3>
                </div>
                <button onClick={() => { setSelectedStatus("All"); setSearchText(""); }}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition" >
                  Clear All
                </button>
              </div>
              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 block">Search</label>
                <input type="text" placeholder="Search categories..." value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm outline-none focus:border-[#6f4e37] dark:text-white transition" />
              </div>
              <div className="border-b dark:border-gray-700 pb-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold dark:text-white">Status</h4>
                  <img src={downArrow} alt="" className="w-3 h-3 dark:invert" />
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {statusOptions.map((status) => (
                    <label key={status} className="flex items-center gap-2 cursor-pointer">
                      <input   type="radio"   name="statusFilter"
                        checked={selectedStatus === status}
                        onChange={() => setSelectedStatus(status)}
                        className="accent-[#6f4e37]" />
                      {status}
                      <span className="ml-auto text-xs text-gray-400">
                        {status === "All"
                          ? categories.length
                          : categories.filter(c => c.status === status).length}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="bg-[#6f4e37] border border-black rounded-2xl p-4">
                <h4 className="text-black font-semibold mb-2">Browse All</h4>
                <p className="text-xs text-white mb-4">
                  {categories.length} categories available. Click any category to explore products.
                </p>
                <Link to="/services" className="bg-white text-black px-4 py-2 rounded-full text-xs font-medium inline-block hover:bg-gray-100 transition">
                  View All Products
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {paginatedCategories.length} of {filteredCategories.length} categories
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">SORT BY</span>
                  <button className="border dark:border-gray-700 rounded-lg px-3 py-2 text-sm flex items-center gap-2 bg-white dark:bg-gray-800">
                    Latest Added
                    <img src={downArrow} alt="" className="w-3 h-3 dark:invert" />
                  </button>
                </div>
              </div>
              {paginatedCategories.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">📂</div>
                  <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">No categories found</h3>
                  <p className="text-sm text-gray-400 mt-2">Add categories from the admin panel to see them here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedCategories.map((cat, index) => (
                    <Link
                      key={cat.id}
                      to={`/services?category=${encodeURIComponent(cat.category_name)}`}
                      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border dark:border-gray-700 group"   >
                      <div className="relative h-48 overflow-hidden">
                        {cat.image ? (
                          <img
                            src={`http://localhost:5000/uploads/${cat.image}`}
                            alt={cat.category_name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(index)} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                            <span className="text-6xl opacity-80">{getCategoryIcon(cat.category_name)}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          cat.status === "Active" ? "bg-green-500/90 text-white" :
                          cat.status === "Trending" ? "bg-amber-500/90 text-white" :
                          "bg-gray-500/90 text-white"
                        }`}>
                          {cat.status || "Active"}
                        </span>
                        {cat.featured === 1 && (
                          <span className="absolute top-3 right-3 bg-white/90 text-amber-700 px-2 py-1 rounded-full text-[10px] font-bold">
                             Featured
                          </span>
                        )}
                        <div className="absolute bottom-3 left-4 right-4">
                          <h3 className="text-white font-bold text-lg truncate drop-shadow-lg">
                            {cat.category_name}
                          </h3>
                        </div>
                      </div>
                      <div className="p-4">
                        {cat.parent_category && (
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                            Parent: {cat.parent_category}
                          </p>
                        )}
                        {cat.description ? (
                          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                            {cat.description}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                            Explore {cat.category_name} collection
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t dark:border-gray-700">
                          <span className="flex items-center gap-1.5 text-xs font-medium text-[#6f4e37] dark:text-amber-300">
                            Explore Collection
                            <img src={rightArrowIcon} alt="arrow" className="w-3 h-3 object-contain" style={{ filter: "invert(35%) sepia(60%) saturate(600%) hue-rotate(10deg) brightness(80%)" }} />
                          </span>
                          {cat.brand ? (
                            <span className="text-[10px] text-white bg-[#6f4e37] px-2 py-0.5 rounded-full font-medium">
                              {cat.brand}
                            </span>
                          ) : cat.slug ? (
                            <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                              {cat.slug}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-10">
                  <button
                    onClick={() => setActivePage(p => Math.max(1, p - 1))}
                    disabled={activePage === 1}
                    className="border dark:border-gray-700 px-4 py-2 rounded-lg text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 disabled:opacity-40" >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setActivePage(page)}
                      className={`w-10 h-10 rounded-lg transition ${
                        activePage === page
                          ? "bg-[#6f4e37] text-white shadow-lg"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border dark:border-gray-700"
                      }`} >
                      {page}
                    </button>
                  ))}
                  <button onClick={() => setActivePage(p => Math.min(totalPages, p + 1))}
                    disabled={activePage === totalPages}
                    className="border dark:border-gray-700 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 disabled:opacity-40"  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Categories;
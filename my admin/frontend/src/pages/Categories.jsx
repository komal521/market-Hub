import { useState, useEffect } from "react";
import filterIcon from "../assets/filter.png";
import addIcon from "../assets/add.png";
import cateIcon from "../assets/cate.png";
import clockIcon from "../assets/clock.png";
import rightUpIcon from "../assets/right-up.png";
import viewIcon from "../assets/view.png";
import dotsIcon from "../assets/dots.png";
import downloadIcon from "../assets/download.png";
import packageIcon from "../assets/package.png";
import uploadIcon from "../assets/upload.png";
import informationIcon from "../assets/information.png";
import smartHomeIcon from "../assets/cat-smart-home.svg";
import premiumAudioIcon from "../assets/cat-premium-audio.svg";
import wearableTechIcon from "../assets/cat-wearable-tech.svg";
import officeIcon from "../assets/cat-minimal-office.svg";
import legacyIcon from "../assets/cat-legacy-component.svg";
import ecoLivingIcon from "../assets/cat-eco-living.svg";
import c1 from "../assets/c1.jpg";
import c2 from "../assets/c2.jpg";
import c3 from "../assets/c3.jpg";
import closeIcon from "../assets/close.png";
import AddCategory from "./AddCategory";
import deleteIcon from "../assets/bin (1).png";
import pencilIcon from "../assets/pencil (1).png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const Categories = ({ darkMode, setActive, setEditData }) => {
  const [activeButton, setActiveButton] = useState("add");
  const defaultCards = [
    { title: "Total Categories", value: "48", percent: "+12%", icon: cateIcon },
    { title: "Active Categories", value: "36", percent: "+4%", icon: clockIcon },
    { title: "Trending Now", value: "08", percent: "+25%", icon: rightUpIcon },
    { title: "Hidden Items", value: "04", percent: "-2%", icon: viewIcon }, ];
  const [cards, setCards] = useState(defaultCards);
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState("");
  const [showAddPage, setShowAddPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewCat, setViewCat] = useState(null);
  const [editCat, setEditCat] = useState(null);
  useEffect(() => {
    fetchCategories();
    fetchCardsData();
  }, []);
  const fetchCardsData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories/cards");
      const data = await res.json();
      if (res.ok) {
        const totalCategories = Number(data.totalCategories || 0);
        const activeCategories = Number(data.activeCategories || 0);
        const trendingNow = Number(data.trendingNow || 0);
        const hiddenItems = Number(data.hiddenItems || 0);
        setCards([
          { title: "Total Categories", value: totalCategories.toString().padStart(2, "0"), percent: "+12%", icon: cateIcon },
          { title: "Active Categories", value: activeCategories.toString().padStart(2, "0"), percent: "+4%", icon: clockIcon },
          { title: "Trending Now", value: trendingNow.toString().padStart(2, "0"), percent: "+25%", icon: rightUpIcon },
          { title: "Hidden Items", value: hiddenItems.toString().padStart(2, "0"), percent: "-2%", icon: viewIcon },
        ]);}
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const data = await res.json();
      if (!res.ok) {
        setCategories([]);
        setCategoryError(data.message || "Categories load nahi ho paayi.");
        return;
      }
      setCategories(data.categories || data || []);
      setCategoryError("");
    } catch (error) {
      console.log(error);
      setCategories([]);
      setCategoryError("Backend se connection nahi ho pa raha.");
    }
  };
  const deleteCategory = async (id) => {
    try {
      const confirmDelete = window.confirm("Delete this category?");
      if (!confirmDelete) return;

      const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => prev.filter((item) => item.id !== id));
        fetchCardsData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditCatSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${editCat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCat),
      });
      const data = await res.json();
      if (data.success) {
        setEditCat(null);
        fetchCategories();
        fetchCardsData();
      } else {
        alert("Failed to update category");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const exportPDF = () => {
    if (categories.length === 0) {
      alert("No data available to download");
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Categories Full History Report", 14, 18);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}  |  Total Categories: ${categories.length}`, 14, 26);
    
    const tableColumn = ["ID", "Name", "Slug", "Status", "Products", "Created At"];
    const tableRows = [];
    categories.forEach(item => {
      tableRows.push([
        item.id,
        item.category_name,
        item.slug,
        item.status,
        item.stats || 0,
        new Date(item.created_at || Date.now()).toLocaleDateString()
      ]);
    }); 
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 32,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [111, 78, 55], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [252, 251, 248] },
    });
    const fileName = `Categories_Full_History_${new Date().toLocaleDateString().replace(/\//g, "-")}.pdf`;
    const pdfBlob = doc.output('blob');
    const formData = new FormData();
    formData.append("report", pdfBlob, fileName);
    fetch("http://localhost:5000/api/reports/save", { method: "POST", body: formData }).catch(console.log);

    if (window.showSaveFilePicker) {
      window.showSaveFilePicker({
        suggestedName: fileName,
        types: [{ description: 'PDF Document', accept: { 'application/pdf': ['.pdf'] } }],
      }).then(handle => handle.createWritable())
        .then(writable => { writable.write(pdfBlob); writable.close(); })
        .catch(err => { if (err.name !== 'AbortError') doc.save(fileName); });
    } else {
      doc.save(fileName);
    }
  };

  if (showAddPage) {
    return <AddCategory darkMode={darkMode} />;
  }
  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className={`rounded-3xl p-4 shadow-sm sm:p-6 ${darkMode ? "bg-[rgb(27,27,27)]" : "bg-[#f8f8f8]"}`}>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className={`text-2xl font-bold sm:text-3xl ${darkMode ? "text-white" : "text-[#1b1b1b]"}`}>
              Category Management
            </h1>
            <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Manage and organize your product catalog structures efficiently.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
            <div className={`flex h-[48px] min-w-full items-center rounded-2xl px-4 sm:min-w-[260px] ${darkMode ? "border border-[#222] bg-[#111]" : "border border-gray-200 bg-white"}`}>
              <input type="text" placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-1 bg-transparent text-sm outline-none ${darkMode ? "text-white" : "text-black"}`} />
            </div>
            <button  onClick={() => setActiveButton("filter")}
              className={`flex h-[48px] items-center justify-center gap-2 rounded-2xl px-5 text-sm font-medium transition-all duration-300 ${
                activeButton === "filter" ? "bg-[#111111] text-white" : darkMode ? "bg-white text-black" : "border border-gray-200 bg-white text-black"
              }`} >
              <img src={filterIcon} alt="" className={`h-4 w-4 ${activeButton === "filter" ? "brightness-0 invert" : ""}`} />
              Filter
            </button>
            <button onClick={() => { setActiveButton("add"); setShowAddPage(true); }}
              className="flex items-center gap-3 bg-[#6f4e37] text-white px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300">
              <img src={addIcon} alt="" className="w-4 h-4 brightness-0 invert" />
              <span className="font-semibold text-sm">Add Category</span>
            </button>
            <button onClick={exportPDF}
              className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300" >
              <img src={uploadIcon} alt="" className="w-4 h-4" />
              <span className="font-medium text-yellow-900 text-sm">Export</span>
            </button>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div key={card.title} className="relative overflow-hidden rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer border border-white/20">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#f3d3b5,#b78457,#6f4e37)]"></div>
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="flex items-start justify-between relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/90 flex items-center justify-center shadow-lg">
                  <img src={card.icon} alt="" className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/80 text-white">
                  {card.percent}
                </span>
              </div>
              <div className="mt-8 relative z-10">
                <p className="text-xs tracking-[2px] text-white/80 font-semibold uppercase">{card.title}</p>
                <h2 className="text-3xl font-bold text-white mt-4 leading-none">{card.value}</h2>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6">
          <div className="rounded-[26px] bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#1f2937]">Primary Categories</h2>
                <p className="text-xs text-gray-400">Image, category info, item stats, status and creation date.</p>
              </div>
              <span className="text-xs text-gray-400">Showing all {categories.length} entries</span>
            </div>
            <div className="hidden md:grid w-full grid-cols-[70px_150px_120px_90px_100px_120px] justify-between border-b border-gray-100 px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-gray-400 items-center">
              <span>Image</span>
              <span>Category Info</span>
              <span>Brand</span>
              <span>Status</span>
              <span>Created At</span>
              <span className="text-right pr-4">Actions</span>
            </div>
            <div className="space-y-3">
              {categoryError && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
                  {categoryError}
                </div>
              )}
              {!categoryError && categories.length === 0 && (
                <div className="rounded-2xl border border-gray-100 bg-[#fcfbf7] px-4 py-8 text-center text-sm font-semibold text-gray-500">
                  Abhi koi category add nahi hui hai.
                </div>
              )}
              {categories.filter(item => item.category_name?.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                <div
                  key={item.id || item.category_name}
                  className="w-full grid grid-cols-1 md:grid-cols-[70px_150px_120px_90px_100px_120px] justify-between gap-x-2 rounded-2xl border border-gray-100 bg-[#fcfbf7] px-4 py-3 shadow-sm md:items-center" >
                  <img
                    src={item.image ? `http://localhost:5000/uploads/${item.image}` : "https://via.placeholder.com/80"}
                    alt={item.category_name || "Category"}
                    className="h-14 w-14 rounded-xl object-cover"/>
                  <div className="min-w-0 flex flex-col">
                    <h3 className="font-bold text-[#1f2937] truncate">{item.category_name || "Untitled category"}</h3>
                    <p className="mt-1 text-xs text-gray-400 truncate">{item.slug || "No slug"}</p>
                  </div>
                  <div className="min-w-0">
                    {item.brand ? (
                      <span className="text-xs font-semibold text-white bg-[#6f4e37] px-2 py-1 rounded-full">
                        {item.brand}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>
                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                      item.status === "Active"
                        ? "bg-[#c6eadf] text-[#138368]"
                        : item.status === "Trending"
                        ? "bg-[#ffc83d] text-[#754a00]"
                        : "bg-gray-100 text-gray-500"
                    }`} >
                    {item.status}
                  </span>
                  <span className="text-xs text-gray-500">{new Date(item.created_at || Date.now()).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2 justify-end pr-2">
                    <button onClick={() => setViewCat(item)}
                      className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-blue-100 text-black transition-all"
                      title="View">
                      <img src={viewIcon} alt="View" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditData({
                          ...item,
                          displayedImage: item.image ? `http://localhost:5000/uploads/${item.image}` : "https://via.placeholder.com/120"
                        });
                        setActive("Edit Category");
                      }}
                      className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-amber-100 text-amber-600 transition-all"
                      title="Edit">
                      <img src={pencilIcon} alt="Edit" className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteCategory(item.id)}
                      className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-red-100 text-red-600 transition-all"
                      title="Delete" >
                      <img src={deleteIcon} alt="Delete" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-2xl border border-[#1f2937] py-3 text-sm font-semibold text-[#1f2937] transition-all hover:bg-[#1f2937] hover:text-white">
              Load more categories
            </button>
          </div>
        </div>
      </div>
      {viewCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className={`w-full max-w-md rounded-3xl p-6 ${darkMode ? "bg-[#1e293b]" : "bg-white"} shadow-2xl relative`}>
            <button onClick={() => setViewCat(null)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
  <img src={closeIcon} alt="Close" className="w-5 h-5 cursor-pointer"/>
</button>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-black"}`}>Category Details</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-center mb-4">
                <img
                  src={viewCat.image ? `http://localhost:5000/uploads/${viewCat.image}` : "https://via.placeholder.com/120"}
                  alt=""
                  className="w-24 h-24 rounded-2xl object-cover border" />
              </div>
              <p><strong>Name:</strong> {viewCat.category_name}</p>
              <p><strong>Slug:</strong> {viewCat.slug || "N/A"}</p>
              <p><strong>Parent Category:</strong> {viewCat.parent_category || "None"}</p>
              <p><strong>Description:</strong> {viewCat.description || "N/A"}</p>
              <p><strong>SEO Title:</strong> {viewCat.seo_title || "N/A"}</p>
              <p><strong>SEO Description:</strong> {viewCat.seo_description || "N/A"}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    viewCat.status === "Active" ? "bg-[#c6eadf] text-[#138368]" : "bg-gray-100 text-gray-500"
                  }`}>
                  {viewCat.status}
                </span>
              </p>
            </div>
            <div className="mt-8 text-right">
              <button onClick={() => setViewCat(null)} className="px-6 py-2 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Categories;
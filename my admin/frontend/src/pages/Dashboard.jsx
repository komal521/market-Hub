import { useEffect, useState } from "react";
import downloadIcon from "../assets/download.png";
import addIcon from "../assets/add.png";
import filterIcon from "../assets/filter.png";
import dotsIcon from "../assets/dots.png";
import pencilIcon from "../assets/pencil.png";
import binIcon from "../assets/bin.png";
import sendIcon from "../assets/send.png";
import showIcon from "../assets/show.png";
import a1 from "../assets/a1.jpeg";
import a2 from "../assets/a2.jpeg";
import a3 from "../assets/a3.jpeg";
import a4 from "../assets/a4.jpeg";
import a5 from "../assets/a5.jpeg";
import orderIcon from "../assets/order.png";
import revenueIcon from "../assets/revenue.png";
import boxIcon from "../assets/box.png";
import groupIcon from "../assets/group.png";
import closeIcon from "../assets/close.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const Dashboard = ({ darkMode, setActive, setEditData }) => {
  const [activeGraph, setActiveGraph] = useState("current");
  const [activePage, setActivePage] = useState(1);
  const [cardData, setCardData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    activeUsers: 0,
  });
  const [cardsLoading, setCardsLoading] = useState(true);
  const [cardsError, setCardsError] = useState("");
  const [dbProducts, setDbProducts] = useState([]);
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [revenueData, setRevenueData] = useState(Array(12).fill(0));
  const [salesPerformance, setSalesPerformance] = useState({ direct: 40, social: 30, referral: 20, email: 10 });
  useEffect(() => {
    const loadDashboardCards = async () => {
      try {
        setCardsLoading(true);
        setCardsError("");
        const response = await fetch("http://localhost:5000/api/dashboard/cards");
        if (!response.ok) {
          throw new Error("Dashboard cards API failed");
        }
        const data = await response.json();
        setCardData(data);
      } catch (error) {
        setCardsError("Data load nahi hua");
        console.error(error);
      } finally {
        setCardsLoading(false);
      }
    };
    const loadRevenueGraph = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/revenue-graph");
        const data = await response.json();
        if (data.success) {
          setRevenueData(data.data);
        }
      } catch (error) {
        console.error("Error loading revenue graph:", error);
      }
    };
    const loadSalesPerformance = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sales-performance");
        const data = await response.json();
        if (data.success) {
          setSalesPerformance(data.data);
        }
      } catch (error) {
        console.error("Error loading sales performance:", error);
      }
    };
    loadDashboardCards();
    loadProducts();
    loadRevenueGraph();
    loadSalesPerformance();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) throw new Error("Products API failed");
      const data = await response.json();
      const mapped = (data.products || []).map((p) => ({
        raw: p,
        image: p.image ? `http://localhost:5000/uploads/${p.image}` : a1,
        name: p.product_name,
        category: p.category || "General",
        price: `₹${Number(p.base_price || 0).toLocaleString("en-IN")}`,
        stock: `${p.stock_quantity || 0} Units`,
        status: p.is_active ? "Active" : p.stock_quantity === 0 ? "Out Of Stock" : "Draft",
        dot: p.is_active ? "bg-green-500" : p.stock_quantity === 0 ? "bg-red-500" : "bg-yellow-500",
      }));
      setDbProducts(mapped);
    } catch (error) {
      console.error("Products load error:", error);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      loadProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/products/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: editForm.product_name,
          description: editForm.description,
          sku: editForm.sku,
          brand: editForm.brand,
          category: editForm.category,
          subCategory: editForm.sub_category,
          basePrice: editForm.base_price,
          discountPrice: editForm.discount_price,
          stockQuantity: editForm.stock_quantity,
          isActive: editForm.is_active,
          isFeatured: editForm.is_featured,
          weight: editForm.weight,
          length: editForm.length,
          width: editForm.width,
          height: editForm.height,
          baseColor: editForm.base_color,
          metaTitle: editForm.meta_title,
          metaDescription: editForm.meta_description,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      setEditProduct(null);
      loadProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to update product");
    }
  };
  const formatCount = (value) => {
    const number = Number(value || 0);
    if (number >= 1000) {
      return new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(number);
    }
    return new Intl.NumberFormat("en-US").format(number);
  };
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      notation: Number(value || 0) >= 1000 ? "compact" : "standard",
      maximumFractionDigits: 2,
    }).format(Number(value || 0));
  const cards = [
    {
      title: "TOTAL ORDERS",
      value: formatCount(cardData.totalOrders),
      growth: "+12.5%",
      icon: orderIcon,
    },
    {
      title: "TOTAL REVENUE",
      value: formatCurrency(cardData.totalRevenue),
      growth: "+24.8%",
      icon: revenueIcon,
    },
    {
      title: "TOTAL PRODUCTS",
      value: formatCount(cardData.totalProducts),
      growth: "-2.4%",
      icon: boxIcon,
    },
    {
      title: "ACTIVE USERS",
      value: formatCount(cardData.activeUsers),
      growth: "+5.2%",
      icon: groupIcon,
    },
  ];

  const staticProducts = [
    { image: a1, name: "Classic Silk Blazer", category: "Apparel", price: "₹1,200", stock: "24 Units", status: "Active", dot: "bg-green-500" },
    { image: a2, name: "Gold Embossed Watch", category: "Accessories", price: "₹3,450", stock: "8 Units", status: "Low Stock", dot: "bg-yellow-500" },
    { image: a3, name: "Luxury Leather Tote", category: "Bags", price: "₹890", stock: "45 Units", status: "Active", dot: "bg-green-500" },
    { image: a4, name: "Velvet Night Gown", category: "Evening Wear", price: "₹2,100", stock: "0 Units", status: "Out Of Stock", dot: "bg-red-500" },
    { image: a5, name: "Diamond Stud Earrings", category: "Jewelry", price: "₹5,800", stock: "12 Units", status: "Active", dot: "bg-green-500" },
  ];

  const displayProducts = dbProducts.length > 0 ? dbProducts : staticProducts;
  const filteredProducts = displayProducts.filter(
    (p) => p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Dashboard Report", 14, 18);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);
    doc.setFontSize(13);
    doc.text("Summary", 14, 36);
    autoTable(doc, {
      head: [["Metric", "Value"]],
      body: [
        ["Total Orders", String(cardData.totalOrders || 0)],
        ["Total Revenue", `Rs. ${Number(cardData.totalRevenue || 0).toLocaleString("en-IN")}`],
        ["Total Products", String(cardData.totalProducts || 0)],
        ["Active Users", String(cardData.activeUsers || 0)],
      ],
      startY: 42,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [111, 78, 55], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [252, 251, 248] },
    });
    const afterSummaryY = doc.lastAutoTable?.finalY || 90;
    doc.setFontSize(13);
    doc.text("Products List", 14, afterSummaryY + 10);
    const productRows = displayProducts.map((p) => [
      p.name, p.category, p.price, p.stock, p.status
    ]);
    autoTable(doc, {
      head: [["Product Name", "Category", "Price", "Stock", "Status"]],
      body: productRows,
      startY: afterSummaryY + 16,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [111, 78, 55], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [252, 251, 248] },
    });
  
    const fileName = `Dashboard_Report_${new Date().toLocaleDateString().replace(/\//g, "-")}.pdf`;
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
  const maxVal = Math.max(...revenueData, 10000);
  const totalSales = salesPerformance.direct + salesPerformance.social + salesPerformance.referral + salesPerformance.email || 100;
  const pctDirect = Math.round((salesPerformance.direct / totalSales) * 100);
  const pctSocial = Math.round((salesPerformance.social / totalSales) * 100);
  const pctReferral = Math.round((salesPerformance.referral / totalSales) * 100);
  const pctEmail = 100 - pctDirect - pctSocial - pctReferral;
  const points = revenueData.map((val, idx) => {
    const x = Math.round((idx / 11) * 700);
    const y = Math.round(270 - (val / maxVal) * 220); // 30px padding
    return `${x},${y}`;
  });
  const lineD = points.length > 0 ? `M ${points.join(" L ")}` : "M 0 270 L 700 270";
  const areaD = `${lineD} L 700 270 L 0 270 Z`;
  const yLabels = [
    Math.round(maxVal),
    Math.round(maxVal * 0.75),
    Math.round(maxVal * 0.5),
    Math.round(maxVal * 0.25),
    0 ];
  return (
    <div  className={` w-full p-4 md:p-8 transition-all duration-300 min-h-screen
    ${darkMode
          ? "bg-[#0f172a] text-white"
          : "bg-[#f4f7fb] text-black"  } `}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <h1
            className={`text-3xl md:text-5xl font-bold ${darkMode ? "text-white" : "text-[#111827]"}`}>
            Dashboard Overview </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-lg">
            Welcome back, Julian. Here's what's happening today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button onClick={handleExportPDF} className=" flex items-center gap-3 bg-[#6f4e37] px-5 py-3 rounded-2xl border border-gray-200 hover:shadow-lg
            transition-all duration-300 ">
            <img src={downloadIcon} alt="" className="w-4 h-4" />
            <span className="font-medium text-white text-sm ">Export PDF</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
        {cards.map((card, index) => (
          <div key={index}
            className=" relative overflow-hidden rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all duration-500
            hover:-translate-y-2 group cursor-pointer border border-white/20 ">
            <div
              className={` absolute inset-0
              ${index === 0
                  ? "bg-[linear-gradient(135deg,#f3d3b5,#b78457,#6f4e37)]"
                  : index === 1
                    ? "bg-[linear-gradient(135deg,#f3d3b5,#b78457,#6f4e37)]"
                    : index === 2
                      ? "bg-[linear-gradient(135deg,#f3d3b5,#b78457,#6f4e37)]"
                      : "bg-[linear-gradient(135deg,#f3d3b5,#b78457,#6f4e37)]"
                } `}></div>
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="flex items-start justify-between relative z-10">
              <div className=" w-14 h-14 rounded-2xl bg-white/90 flex items-center justify-center
                shadow-lg ">
                <img src={card.icon} alt="" className="w-7 h-7" />
              </div>
              <span className={` text-xs font-semibold px-3 py-1 rounded-full
                ${card.growth.includes("-")
                  ? "bg-red-100 text-red-600"
                  : "bg-black/80 text-white"} `} >
                {card.growth}
              </span>
            </div>
            <div className="mt-8 relative z-10">
              <p className="text-xs tracking-[2px] text-white/80 font-semibold">
                {card.title}</p>
              <h2 className="text-4xl font-bold mt-3 text-white">
                {cardsLoading ? "..." : card.value}
              </h2>
              {cardsError && index === 0 && (
                <p className="text-xs text-red-100 mt-2">{cardsError}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6 mt-8">
        <div
          className={`2xl:col-span-2 rounded-[28px] border p-4 sm:p-5 md:p-6 overflow-hidden ${darkMode
              ? "bg-[#1e293b] border-gray-700"
              : "bg-[#f7f7f7] border-gray-200"}`}>
          <div
            className=" flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6 ">
            <div>
              <h2
                className={`text-[13px] sm:text-[15px] font-bold tracking-[2px] sm:tracking-[3px] ${darkMode ? "text-white" : "text-[#1f1f1f]"}`} >
                REVENUE ANALYTICS (Total: {cardsLoading ? "..." : formatCurrency(cardData.totalRevenue)}) </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Monthly performance overview</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <button onClick={() => setActiveGraph("current")}
                className=" flex items-center gap-2 text-xs sm:text-sm ">
                <div className={` w-2.5 h-2.5 rounded-full
            ${activeGraph === "current"
                    ? "bg-[#c89a33]"
                    : "bg-[#d1b067]"} `}></div>
                <span className="text-gray-600 font-medium whitespace-nowrap">
                  Current Year
                </span>
              </button>
              <button onClick={() => setActiveGraph("previous")}
                className=" flex items-center gap-2 text-xs sm:text-sm ">
                <div className={`  w-2.5 h-2.5 rounded-full
            ${activeGraph === "previous"
                    ? "bg-[#8b8b8b]"
                    : "bg-[#cfcfcf]"}`} ></div>
                <span className="text-gray-600 font-medium whitespace-nowrap">
                  Previous Year
                </span>
              </button>
            </div>
          </div>
          <div
            className=" relative w-full h-[240px] sm:h-[300px] md:h-[340px] pl-8 sm:pl-10 pb-8 ">
            <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(5)].map((_, i) => (
                <div key={i}
                  className="border-t border-dashed border-[#d9d9d9] w-full" ></div>
              ))}
            </div>
            <div
              className=" absolute left-0 top-0 h-full flex flex-col justify-between
        text-[9px] sm:text-[11px] text-gray-400">
              {yLabels.map((val, idx) => (
                <span key={idx}>₹{val.toLocaleString("en-IN")}</span>
              ))}
            </div>
            <svg viewBox="0 0 700 300"
              className=" absolute left-8 sm:left-10 top-0 w-[calc(100%-2rem)] sm:w-[calc(100%-2.5rem)] h-full"
              preserveAspectRatio="none" >
              {activeGraph === "current" && (
                <>
                  <defs>
                    <linearGradient
                      id="goldGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1">
                      <stop offset="0%" stopColor="#c89a33" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#c89a33" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={areaD} fill="url(#goldGradient)" />
                  <path
                    d={lineD}
                    fill="none"
                    stroke="#c89a33"
                    strokeWidth="4"
                    strokeLinecap="round" />
                </>
              )}
              {activeGraph === "previous" && (
                <>
                  <defs>
                    <linearGradient
                      id="grayGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1">
                      <stop
                        offset="0%"
                        stopColor="#9ca3af"
                        stopOpacity="0.25" />
                      <stop
                        offset="100%"
                        stopColor="#9ca3af"
                        stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={areaD}
                    fill="url(#grayGradient)" />
                  <path
                    d={lineD}
                    fill="none"
                    stroke="#7b8794"
                    strokeWidth="4"
                    strokeLinecap="round" />
                </>
              )}
            </svg>
            <div
              className="
        absolute
        bottom-0
        left-8 sm:left-10
        right-0
        flex justify-between
        text-[9px] sm:text-[11px]
        text-gray-500
        pr-1
        ">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
            </div>
          </div>
        </div>
        <div
          className="
    bg-[#f7f7f7]
    rounded-[28px]
    p-4 sm:p-6
    border border-gray-200
    overflow-hidden " >
          <h2
            className=" text-[13px] sm:text-[15px] font-bold tracking-[2px] sm:tracking-[3px] text-[#1f1f1f] " >
            SALES PERFORMANCE
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Distribution by channel</p>
          <div className="flex justify-center items-center mt-6 sm:mt-8">
            <div
              className=" relative w-36 h-36 sm:w-44 sm:h-44 " >
              <svg viewBox="0 0 36 36"
                className="w-full h-full -rotate-90" >
                <path
                  d="
            M18 2.5
            a 15.5 15.5 0 1 1 0 31
            a 15.5 15.5 0 1 1 0 -31
            "
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3" />
                <path
                  d="M18 2.5 a 15.5 15.5 0 1 1 0 31 a 15.5 15.5 0 1 1 0 -31"
                  fill="none"
                  stroke="#c89a33"
                  strokeWidth="3"
                  strokeDasharray={`${pctDirect} 100`} />
                <path
                  d="M18 2.5 a 15.5 15.5 0 1 1 0 31 a 15.5 15.5 0 1 1 0 -31"
                  fill="none"
                  stroke="#1f1f1f"
                  strokeWidth="3"
                  strokeDasharray={`${pctSocial} 100`}
                  strokeDashoffset={-pctDirect} />
                <path
                  d="M18 2.5 a 15.5 15.5 0 1 1 0 31 a 15.5 15.5 0 1 1 0 -31"
                  fill="none"
                  stroke="#d1d5db"
                  strokeWidth="3"
                  strokeDasharray={`${pctReferral} 100`}
                  strokeDashoffset={-(pctDirect + pctSocial)} />
                <path
                  d="M18 2.5 a 15.5 15.5 0 1 1 0 31 a 15.5 15.5 0 1 1 0 -31"
                  fill="none"
                  stroke="#8b8b8b"
                  strokeWidth="3"
                  strokeDasharray={`${pctEmail} 100`}
                  strokeDashoffset={-(pctDirect + pctSocial + pctReferral)} />
              </svg>
              <div   className=" absolute inset-6 sm:inset-7 bg-[#f7f7f7] rounded-full " ></div>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#c89a33]"></div>
                <span className="text-yellow-900">Direct</span>
              </div>
              <span className="font-semibold text-yellow-900">{pctDirect}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                <span className="text-yellow-900">Social</span>
              </div>
              <span className="font-semibold text-yellow-900">{pctSocial}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#d1d5db]"></div>
                <span className="text-yellow-900">Referral</span>
              </div>
              <span className="font-semibold text-yellow-900">{pctReferral}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#8b8b8b]"></div>
                <span className="text-yellow-900">Email</span>
              </div>
              <span className="font-semibold text-yellow-900">{pctEmail}%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
        <div className="bg-[#6f4e37] px-4 md:px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-[15px] md:text-lg font-bold tracking-[3px] text-[#1f1f1f]">
              PRODUCT MANAGEMENT </h2>
            <p className="text-sm text-white mt-1">
              Overview of your current inventory and listings
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl min-w-[200px]">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search products..." value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setActivePage(1); }}
                className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder:text-gray-400" />
            </div>
            <button className=" flex items-center gap-2 bg-white px-5 py-3 rounded-2xl " >
              <img src={filterIcon} alt="" className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide text-yellow-900">
                FILTER
              </span>
            </button>
            <button>
              <img src={dotsIcon} alt="" className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-[#f7f7f7] border-b border-gray-200">
              <tr className="text-left">
                <th className="px-4 sm:px-6 md:px-8 py-4 md:py-5 text-[12px] sm:text-[13px] md:text-[14px]
              tracking-[1px] sm:tracking-[2px] text-black font-bold whitespace-nowrap">
                  PRODUCT
                </th>
                <th className="px-4 sm:px-6 py-4 md:py-5 text-[12px] sm:text-[13px] md:text-[14px]
               tracking-[1px] sm:tracking-[2px] text-black font-bold whitespace-nowrap">
                  NAME
                </th>
                <th className="px-4 sm:px-6 py-4 md:py-5 text-[12px] sm:text-[13px] md:text-[14px]
              tracking-[1px] sm:tracking-[2px] text-black font-bold whitespace-nowrap">
                  CATEGORY
                </th>
                <th className="px-4 sm:px-6 py-4 md:py-5 text-[12px] sm:text-[13px] md:text-[14px]
            tracking-[1px] sm:tracking-[2px] text-black font-bold whitespace-nowrap">
                  PRICE
                </th>
                <th className="px-4 sm:px-6 py-4 md:py-5 text-[12px] sm:text-[13px] md:text-[14px]
             tracking-[1px] sm:tracking-[2px] text-black font-bold whitespace-nowrap">
                  STOCK
                </th>
                <th className="px-4 sm:px-6 py-4 md:py-5 text-[12px] sm:text-[13px] md:text-[14px]
               tracking-[1px] sm:tracking-[2px] text-black font-bold whitespace-nowrap">
                  STATUS
                </th>
                <th className="px-4 sm:px-6 py-4 md:py-5 text-[12px] sm:text-[13px] md:text-[14px]
             tracking-[1px] sm:tracking-[2px] text-black font-bold text-center whitespace-nowrap">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((item, index) => (
                <tr key={index} className=" border-b border-gray-100 hover:bg-[#fafafa] transition-all duration-300">
                  <td className="px-8 py-5">
                    <img src={item.image} alt=""
                      className="  w-12 h-12 rounded-full object-cover border border-gray-200" />
                  </td>
                  <td className="px-6 py-5">
                    <h3 className="font-semibold text-[#1f2937] whitespace-nowrap">
                      {item.name}
                    </h3>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className=" px-4 py-2 rounded-full bg-[#f3f4f6] text-xs text-gray-600 ">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-bold text-[#111827]">
                    {item.price}
                  </td>
                  <td className="px-6 py-5 font-semibold">
                    {item.stock}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.dot}`}></div>
                      <span className="text-sm">{item.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => setViewProduct(item)}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-50 hover:bg-blue-100 transition-all hover:scale-110"
                        title="View">
                        <img src={showIcon} alt="View" className="w-4 h-4 opacity-70" />
                      </button>
                      <button
                        onClick={() => {
                          if (item.raw) {
                            setEditData(item.raw);
                            setActive("Edit Product");
                          } else {
                            alert("Static products cannot be edited");
                          }
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-50 hover:bg-amber-100 transition-all hover:scale-110"
                        title="Edit">
                        <img src={pencilIcon} alt="Edit" className="w-4 h-4 opacity-70" />
                      </button>
                      <button onClick={() => {
                          if (item.raw) handleDelete(item.raw.id);
                          else alert("Static products cannot be deleted");
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-red-50 hover:bg-red-100 transition-all hover:scale-110"
                        title="Delete">
                        <img src={binIcon} alt="Delete" className="w-4 h-4 opacity-70" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedProducts.length === 0 && (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-5 px-6 py-6 " >
          <p className="text-sm text-gray-500 italic">
            Showing {(activePage - 1) * itemsPerPage + 1} to {Math.min(activePage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} items
          </p>
          <div className="flex items-center gap-3">
            <button
              disabled={activePage === 1}
              onClick={() => setActivePage((p) => Math.max(p - 1, 1))}
              className="text-sm text-gray-400 hover:text-black disabled:opacity-50">
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button key={idx + 1} onClick={() => setActivePage(idx + 1)}
                className={` w-10 h-10 rounded-full
                font-semibold transition-all duration-300
                ${activePage === idx + 1
                    ? "bg-[#6f4e37] text-white shadow-lg scale-110"
                    : "bg-transparent text-gray-600 hover:bg-gray-100"} `}>
                {idx + 1}
              </button>
            ))}
            <button
              disabled={activePage === totalPages}
              onClick={() => setActivePage((p) => Math.min(p + 1, totalPages))}
              className="text-sm text-gray-700 hover:text-black disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className={`w-full max-w-2xl rounded-3xl p-6 ${darkMode ? "bg-[#1e293b]" : "bg-white"} shadow-2xl relative`}>
           <button onClick={() => setViewProduct(null)} className="absolute top-4 right-4">
  <img src={closeIcon} alt="Close" className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" />
        </button>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-black"}`}>Product Details</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <img src={viewProduct.image} alt="" className="w-48 h-48 rounded-2xl object-cover" />
              <div className={`space-y-3 flex-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                <p><strong>Name:</strong> {viewProduct.name}</p>
                <p><strong>Category:</strong> {viewProduct.category}</p>
                <p><strong>Price:</strong> {viewProduct.price}</p>
                <p><strong>Stock:</strong> {viewProduct.stock}</p>
                <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${viewProduct.dot === "bg-green-500" ? "bg-green-100 text-green-700" : viewProduct.dot === "bg-red-500" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{viewProduct.status}</span></p>
                {viewProduct.raw && (
                  <>
                    <p><strong>SKU:</strong> {viewProduct.raw.sku || "N/A"}</p>
                    <p><strong>Brand:</strong> {viewProduct.raw.brand || "N/A"}</p>
                    <p><strong>Description:</strong> {viewProduct.raw.description || "N/A"}</p>
                  </>
                )}
              </div>
            </div>
            <div className="mt-8 text-right">
              <button onClick={() => setViewProduct(null)}
                className="px-6 py-2 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={handleEditSubmit}
            className={`w-full max-w-xl rounded-3xl p-6 ${darkMode ? "bg-[#1e293b]" : "bg-white"} shadow-2xl relative`}>
            <button type="button" onClick={() => setEditProduct(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 font-bold text-xl">
              ✕
            </button>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-black"}`}>Edit Product</h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label>
                <input type="text" required value={editForm.product_name || ""}
                  onChange={(e) => setEditForm({ ...editForm, product_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d7a53f]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₹)</label>
                  <input type="number" value={editForm.base_price || ""}
                    onChange={(e) => setEditForm({ ...editForm, base_price: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d7a53f]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock</label>
                  <input type="number" value={editForm.stock_quantity || ""}
                    onChange={(e) => setEditForm({ ...editForm, stock_quantity: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d7a53f]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                <input type="text" value={editForm.category || ""}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d7a53f]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Brand</label>
                <input type="text" value={editForm.brand || ""}
                  onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d7a53f]" />
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button type="button" onClick={() => setEditProduct(null)}
                className="px-6 py-2 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300">Cancel</button>
              <button type="submit"
                className="px-6 py-2 rounded-xl bg-[#d7a53f] text-[#111] font-semibold hover:opacity-90">Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

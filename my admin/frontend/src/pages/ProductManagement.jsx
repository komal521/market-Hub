import { useEffect, useState } from "react";
import uploadIcon from "../assets/upload.png";
import searchIcon from "../assets/search.png";
import filterIcon from "../assets/filter.png";
import boxIcon from "../assets/box.png";
import checkIcon from "../assets/check-mark.png";
import clockIcon from "../assets/clock.png";
import informationIcon from "../assets/information.png";
import g1 from "../assets/ga.webp";
import g2 from "../assets/g2.webp";
import g3 from "../assets/g3.jpg";
import g4 from "../assets/g4.jpg";
import g5 from "../assets/g5.webp";
import showIcon from "../assets/show.png";
import pencilIcon from "../assets/pencil (1).png";
import binIcon from "../assets/bin (1).png";
import addIcon from "../assets/add.png";
import AddProduct from "./AddProduct";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import closeIcon from "../assets/close.png";
const ProductManagement = ({ darkMode, setActive, setEditData }) => {
  const handleExportPDF = () => {
    if (visibleProducts.length === 0) {
      alert("No data available to download");
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Product Catalog Full History Report", 14, 18);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}  |  Total Products: ${visibleProducts.length}`, 14, 26);
    
    const tableColumn = ["SKU ID", "Product Name", "Category", "Brand", "Price", "Stock", "Status"];
    const tableRows = [];
    visibleProducts.forEach(product => {
      const rowData = [
        product.sku || product.raw?.sku || "",
        product.name || product.product_name || "",
        product.category || "",
        product.brand || "",
        product.price || `₹${product.base_price}`,
        product.stock || `${product.stock_quantity} Units`,
        product.status || (product.is_active ? "Active" : "Draft")
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 32,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [111, 78, 55], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [252, 251, 248] },
    });
    
    const fileName = `Product_Report_Full_History_${new Date().toLocaleDateString().replace(/\//g, "-")}.pdf`;
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

  const [activePage, setActivePage] = useState(1);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [dbProducts, setDbProducts] = useState([]);
  const [viewProduct, setViewProduct] = useState(null);
  const [cards, setCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const loadCards = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/product/cards");

      if (!response.ok) {
        throw new Error("Cards API failed");
      }

      const data = await response.json();

      setCards([
        {
          title: "Total Products",
          value: data.totalProducts,
          growth: "+12%",
          icon: boxIcon,
        },
        {
          title: "Active Products",
          value: data.activeProducts,
          growth: "+5.4%",
          icon: checkIcon,
        },
        {
          title: "Low Stock",
          value: data.lowStockProducts,
          growth: "+2.1%",
          icon: clockIcon,
        },
        {
          title: "Out of Stock",
          value: data.outOfStockProducts,
          growth: "+0.5%",
          icon: informationIcon,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };
  const products = [
    {
      image: g1,
      name: "Aura Quartz Watch",
      sku: "AQ-W-20-G",
      category: "Accessories",
      brand: "Aura Premium",
      price: "₹299.00",
      stock: 124,
      status: "Active",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      image: g2,
      name: "Sonic Over-Ear Headphones",
      sku: "SH-50-BK",
      category: "Electronics",
      brand: "AudioTech",
      price: "₹159.50",
      stock: 45,
      status: "Active",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      image: g3,
      name: "Crimson Sprint Sneakers",
      sku: "CS-V2-RE",
      category: "Footwear",
      brand: "SprintMax",
      price: "₹89.00",
      stock: 0,
      status: "Out of Stock",
      statusColor: "bg-red-100 text-red-600",
    },
    {
      image: g4,
      name: "Polarized Retro Shades",
      sku: "PR-SH-77",
      category: "Accessories",
      brand: "Luna Eye",
      price: "₹120.00",
      stock: 12,
      status: "Active",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      image: g5,
      name: "Minimalist Glass Kettle",
      sku: "MK-01-CL",
      category: "Home & Kitchen",
      brand: "PureBrew",
      price: "₹45.99",
      stock: 8,
      status: "Draft",
      statusColor: "bg-gray-200 text-gray-600",
    },
  ];
  const loadProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");

      if (!response.ok) {
        throw new Error("Products API failed");
      }
      const data = await response.json();
      const mappedProducts = (data.products || []).map((product) => ({
        raw: product,
        image: product.image ? `http://localhost:5000/uploads/${product.image}` : g1,
        name: product.product_name,
        sku: product.sku,
        category: product.category,
        brand: product.brand,
        price: `₹${Number(product.base_price || 0).toFixed(2)}`,
        stock: product.stock_quantity,
        status: product.is_active ? "Active" : "Draft",
        statusColor: product.is_active
          ? "bg-green-100 text-green-700"
          : "bg-gray-200 text-gray-600",
      }));
      setDbProducts(mappedProducts);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    loadProducts();
    loadCards();
  }, []);
  const baseProducts = dbProducts.length > 0 ? dbProducts : products;
  const visibleProducts = baseProducts.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku?.toLowerCase().includes(searchQuery.toLowerCase()));
  if (showAddProduct || editingProduct) {
    return (
      <AddProduct
        key={editingProduct ? editingProduct.id : "new"}
        darkMode={darkMode}
        product={editingProduct}
        onBack={() => {
          setShowAddProduct(false);
          setEditingProduct(null);
          loadProducts();
        }} />
    );
  }
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );
  if (!confirmDelete) return;
  try {
    const response = await fetch(
      `http://localhost:5000/api/products/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Delete failed");
    }
    loadProducts();
    loadCards();
  } catch (error) {
    console.error(error);
    alert("Failed to delete product");
  }
};
  return (
    <div
      className={`min-h-screen p-4 sm:p-5 md:p-7 ${darkMode ? "bg-[#0f172a]" : "bg-[#f4f7fb]"}`}>
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-7">
        <div>
          <h1 className={`text-3xl md:text-4xl font-bold ${darkMode ? "text-white" : "text-[#1a1a1a]"}`} >
            Product Management
          </h1>
          <p className={`mt-1 text-sm md:text-base ${darkMode ? "text-gray-400" : "text-gray-500"}`} >
            Refine and organize your master luxury catalog for Q4.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddProduct(true)}
            className="flex items-center gap-3 bg-[#6f4e37] text-white px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300" >
            <img src={addIcon} alt="" className="w-4 h-4 brightness-0 invert" />
            <span className="font-semibold text-sm">Insert</span>
          </button>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border min-w-[240px]
            ${darkMode
              ? "bg-[#1a2234] border-[#2b3548]"
              : "bg-white border-gray-200"}`} >
            <img src={searchIcon} alt="" className="w-4 h-4 opacity-70" />
            <input type="text" placeholder="Search products..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className={`bg-transparent outline-none text-sm w-full
              ${darkMode
                  ? "text-white placeholder:text-gray-400"
                  : "text-gray-700 placeholder:text-gray-400"}`} />
          </div>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300" >
            <img src={uploadIcon} alt="" className="w-4 h-4" />
            <span className="font-medium text-yellow-900 text-sm">Export (PDF)</span>
          </button>
          <button
            onClick={() => setShowAddProduct(true)}
            className="flex items-center gap-3 bg-[#6f4e37] text-white px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300">
            <img src={addIcon} alt="" className="w-4 h-4 brightness-0 invert" />
            <span className="font-semibold text-sm">Add Product</span>
          </button>
        </div>
      </div>
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className={`w-full max-w-2xl rounded-3xl p-6 ${darkMode ? "bg-[#1e293b]" : "bg-white"} shadow-2xl relative`}>
          <button onClick={() => setViewProduct(null)} className="absolute top-4 right-4">
  <img src={closeIcon} alt="Close"
    className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform"/>
</button>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-black"}`}>Product Details</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <img src={viewProduct.image} alt="" className="w-48 h-48 rounded-2xl object-cover" />
              <div className={`space-y-3 flex-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                <p><strong>Name:</strong> {viewProduct.name}</p>
                <p><strong>SKU:</strong> {viewProduct.sku}</p>
                <p><strong>Category:</strong> {viewProduct.category}</p>
                <p><strong>Brand:</strong> {viewProduct.brand}</p>
                <p><strong>Price:</strong> {viewProduct.price}</p>
                <p><strong>Stock:</strong> {viewProduct.stock}</p>
                <p><strong>Status:</strong> {viewProduct.status}</p>
              </div>
            </div>
            <div className="mt-8 text-right">
              <button 
                onClick={() => setViewProduct(null)}
                className="px-6 py-2 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-10 mb-7">
        {cards.map((card, index) => (
          <div key={index}
            className="relative overflow-hidden rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer border border-white/20">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#f3d3b5,#b78457,#6f4e37)]"></div>
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="flex items-start justify-between relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/90 flex items-center justify-center shadow-lg">
                <img src={card.icon} alt="" className="w-7 h-7" />
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/80 text-white">
                {card.growth}
              </span>
            </div>
            <div className="mt-8 relative z-10">
              <p className="text-xs tracking-[2px] text-white/80 font-semibold uppercase">{card.title}</p>
              <h2 className="text-3xl font-bold text-white mt-4 leading-none">{card.value}</h2>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <div className={`rounded-3xl overflow-hidden border
            ${darkMode
              ? "bg-[#111827] border-[#1f2937]"
              : "bg-white border-gray-200"}`} >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5 bg-[#f5ecd2]">
              <div>
                <h2 className="text-lg font-bold text-[#1f1f1f]">
                  Product Catalog
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your inventory and product listings.
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all">
                <img src={filterIcon} alt="" className="w-4 h-4" />
                Filters
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="px-6 py-4">
                      <input type="checkbox" />
                    </th>
                    <th className="px-4 py-4 text-sm text-gray-500 font-semibold">
                      Image
                    </th>
                    <th className="px-4 py-4 text-sm text-gray-500 font-semibold">
                      Product Name
                    </th>
                    <th className="px-4 py-4 text-sm text-gray-500 font-semibold">
                      SKU ID
                    </th>
                    <th className="px-4 py-4 text-sm text-gray-500 font-semibold">
                      Category
                    </th>
                    <th className="px-4 py-4 text-sm text-gray-500 font-semibold">
                      Brand
                    </th>
                    <th className="px-4 py-4 text-sm text-gray-500 font-semibold">
                      Price
                    </th>
                    <th className="px-4 py-4 text-sm text-gray-500 font-semibold">
                      Stock
                    </th>
                    <th className="px-4 py-4 text-sm text-gray-500 font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-4 text-sm text-gray-500 font-semibold">
                      Manage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProducts.map((product, index) => (
                    <tr key={index}
                      className="border-b border-gray-100 hover:bg-[#faf7ef] transition-all" >
                      <td className="px-6 py-5">
                        <input type="checkbox" />
                      </td>
                      <td className="px-4 py-5">
                        <img src={product.image} alt=""
                          className="w-14 h-14 rounded-2xl object-cover border border-gray-200" />
                      </td>
                      <td className="px-4 py-5">
                        <h3 className="text-sm font-semibold text-[#1f1f1f]">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Added 2023-10-12
                        </p>
                      </td>
                      <td className="px-4 py-5 text-sm text-gray-600">
                        {product.sku}
                      </td>
                      <td className="px-4 py-5">
                        <span className="px-3 py-1 rounded-full text-xs bg-[#f3f4f6] text-gray-600">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-sm text-gray-700 font-medium">
                        {product.brand}
                      </td>
                      <td className="px-4 py-5 text-sm font-semibold text-[#1f1f1f]">
                        {product.price}
                      </td>
                      <td
                        className={`px-4 py-5 text-sm font-semibold ${product.stock === 0
                            ? "text-red-500"
                            : "text-gray-700"}`} >
                        {product.stock}
                      </td>
                      <td className="px-4 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${product.statusColor}`} >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-4">
                          <button className="hover:scale-110 transition-all" onClick={() => setViewProduct(product)}>
                            <img src={showIcon} alt="" className="w-4 h-4 opacity-70" />
                          </button>
                           <button className="hover:scale-110 transition-all" onClick={() => {
                             if (product.raw) {
                               setEditData({
                                 ...product.raw,
                                 displayedImage: product.image
                               });
                             } else {
                               setEditData({
                                 id: product.sku || Date.now(),
                                 product_name: product.name,
                                 category: product.category,
                                 brand: product.brand,
                                 base_price: product.price ? product.price.replace('₹', '') : '0',
                                 stock_quantity: product.stock,
                                 is_active: product.status === "Active" ? 1 : 0,
                                 displayedImage: product.image
                               });
                             }
                             setActive("Edit Product");
                           }}>
                            <img src={pencilIcon} alt="" className="w-4 h-4 opacity-70" />
                          </button>
                          <button className="hover:scale-110 transition-all" onClick={() => {
                           if (product.raw) {
                             handleDelete(product.raw.id); 
                           } else {
                             const confirmDelete = window.confirm("Are you sure you want to delete this static product?");
                             if (confirmDelete) {
                               alert("Static product deleted.");
                             }
                           } 
                          }}>
                           <img src={binIcon} alt="" className="w-4 h-4 opacity-70" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-5">
              <p className="text-sm text-gray-500">
                Showing 1 to {visibleProducts.length} of {visibleProducts.length} entries
              </p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100">
                  Previous
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    onClick={() => setActivePage(page)}
                    className={`w-9 h-9 rounded-full text-sm font-medium transition-all
                    ${activePage === page
                        ? "bg-[#6f4e37] text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-[#f5ecd2]"
                      }`} >
                    {page}
                  </button>
                ))}
                <button className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100">
                  Next
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-[#6f4e37] rounded-[16px] px-5 py-4 shadow-sm relative overflow-hidden h-[95px]">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#b8860b33] flex items-center justify-center">
                  <img src={boxIcon} alt="" className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-black">
                    Warehouse A
                  </h3>
                  <p className="text-[11px] text-white mt-[1px]">
                    Main Distribution
                  </p>
                </div>
              </div>
              <div className="absolute bottom-4 left-5 right-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-white font-medium">
                    Storage Capacity
                  </span>
                  <span className="text-[11px] text-black font-semibold">
                    84%
                  </span>
                </div>
                <div className="w-full h-[4px] bg-[#e6d3a1] rounded-full overflow-hidden">
                  <div className="w-[84%] h-full bg-black rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="bg-[#6f4e37] rounded-[16px] px-5 py-4 shadow-sm relative overflow-hidden h-[95px]">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#b8860b33] flex items-center justify-center">
                  <img src={boxIcon} alt="" className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-black">
                    Warehouse B
                  </h3>
                  <p className="text-[11px] text-white mt-[1px]">
                    Seasonal Overflow
                  </p>
                </div>
              </div>
              <div className="absolute bottom-4 left-5 right-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-white font-medium">
                    Storage Capacity
                  </span>
                  <span className="text-[11px] text-black font-semibold">
                    72%
                  </span>
                </div>
                <div className="w-full h-[4px] bg-[#e6d3a1] rounded-full overflow-hidden">
                  <div className="w-[72%] h-full bg-black rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="bg-[#6f4e37] rounded-[16px] px-5 py-4 shadow-sm relative overflow-hidden h-[95px]">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#b8860b33] flex items-center justify-center">
                  <img src={clockIcon} alt="" className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-black">
                    Processing
                  </h3>
                  <p className="text-[11px] text-white mt-[1px]">
                    Inbound Shipments
                  </p>
                </div>
              </div>
              <div className="absolute bottom-4 left-5 right-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-white font-medium">
                    Target ETA
                  </span>
                  <span className="text-[11px] text-black font-semibold">
                    12h 40m
                  </span>
                </div>
                <div className="w-full h-[4px] bg-[#e6d3a1] rounded-full overflow-hidden">
                  <div className="w-[78%] h-full bg-black rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductManagement;

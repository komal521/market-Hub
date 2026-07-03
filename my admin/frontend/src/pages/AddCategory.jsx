import { useState, useEffect } from "react";
import boxIcon from "../assets/box.png";
import linkIcon from "../assets/link.png";
import cateIcon from "../assets/cate.png";
import downIcon from "../assets/down.png";
import imageIcon from "../assets/image.png";
import globalIcon from "../assets/global.png";
import closeIcon from "../assets/close.png";
import fileIcon from "../assets/file.png";
import checkIcon from "../assets/check-mark.png";
import infoIcon from "../assets/information.png";
import arrowIcon from "../assets/arrow.png";
import camraIcon from "../assets/camra.png";
import axios from "axios";

const InputIcon = ({ icon }) => (
  <img src={icon} alt=""
    className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-65" />
);

const defaultFieldClass =
  "bg-white border-[#e7e2da] text-gray-700 placeholder:text-gray-400";
const defaultLabelClass = "text-[#23417d]";

const TextInput = ({
  label,
  name,
  icon,
  placeholder,
  type = "text",
  fieldClass = defaultFieldClass,
  labelClass = defaultLabelClass,
  className = "",
  defaultValue,
  onChange
}) => (
  <div className={className}>
    <label className={`mb-2 block text-sm font-semibold ${labelClass}`}>
      {label}
    </label>
    <div className="relative">
      <InputIcon icon={icon} />
      <input type={type} name={name} placeholder={placeholder} defaultValue={defaultValue} onChange={onChange}
        className={`h-12 w-full rounded-2xl border pl-12 pr-4 text-sm outline-none ${fieldClass}`} />
    </div>
  </div>
);

const SectionHeader = ({ icon, title, desc, darkMode = false }) => (
  <div className="mb-5 flex items-center gap-3 border-b border-gray-200 pb-4">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef2ff]">
      <img src={icon} alt="" className="h-5 w-5" />
    </div>
    <div>
      <h2 className={`text-base font-bold ${darkMode ? "text-white" : "text-[#14356f]"}`}>
        {title}
      </h2>
      {desc && <p className="mt-1 text-xs text-gray-500">{desc}</p>}
    </div>
  </div>
);

const AddCategory = ({ darkMode, onBack }) => {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState({ name: "", description: "" });
  const [colors, setColors] = useState([]);
  const [newColor, setNewColor] = useState({ name: "", hex: "#6f4e37" });

  const [featured, setFeatured] = useState(false);
  const [sitemap, setSitemap] = useState(true);
  const [globalSearch, setGlobalSearch] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [formData, setFormData] = useState({
    category_name: "",
    slug: "",
    parent_category: "",
    description: "",
    breadcrumb: "",
  });
  const [image, setImage] = useState(null);

  const fieldClass = darkMode
    ? "bg-[#1a2234] border-[#2b3548] text-white placeholder:text-gray-500"
    : "bg-white border-[#e7e2da] text-gray-700 placeholder:text-gray-400";
  const mutedCard = darkMode
    ? "border-[#2b3548] bg-[#111827]"
    : "border-[#f0dfbd] bg-white";
  const labelClass = darkMode ? "text-gray-200" : "text-[#23417d]";

  const fetchBrands = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/brands");
      if (res.data.success) setBrands(res.data.brands);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchColors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/colors");
      if (res.data.success) setColors(res.data.colors);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchColors();
  }, []);

  const handleAddColor = async () => {
    if (!newColor.name) return;
    try {
      await axios.post("http://localhost:5000/api/colors", {
        colorName: newColor.name,
        hexCode: newColor.hex
      });
      setNewColor({ name: "", hex: "#6f4e37" });
      fetchColors();
      alert("Color added");
    } catch (err) {
      alert("Failed to add color");
    }
  };
  const handleDeleteColor = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/colors/${id}`);
      fetchColors();
    } catch (err) {
      alert("Failed to delete color");
    }
  };

  const handleAddBrand = async () => {
    if (!newBrand.name) return;
    try {
      await axios.post("http://localhost:5000/api/brands", {
        brandName: newBrand.name,
        description: newBrand.description
      });
      setNewBrand({ name: "", description: "" });
      fetchBrands();
      alert("Brand added");
    } catch (err) {
      alert("Failed to add brand");
    }
  };
  const handleDeleteBrand = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/brands/${id}`);
      fetchBrands();
    } catch (err) {
      alert("Failed to delete brand");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      data.append("featured", featured);
      data.append("sitemap", sitemap);
      data.append("global_search", globalSearch);
      data.append("status", isActive ? "Active" : "Inactive");
      if (image) {
        data.append("image", image);
      }
      const res = await axios.post("http://localhost:5000/api/categories", data);
      alert(res.data.message);
      onBack?.();
    } catch (error) {
      alert(error.response?.data?.message || "Backend server error");
    }
  };

  return (
    <div className={`min-h-screen p-4 sm:p-5 lg:p-8 ${darkMode ? "bg-[#0f172a]" : "bg-[#f7f8fa]"}`}>
      <div className="mx-auto max-w-[1180px]">
        
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} aria-label="Back to categories"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow transition-all hover:bg-[#f5ecd2]">
              <img src={arrowIcon} alt="Back" className="h-4 w-4 object-contain" />
            </button>
            <div>
              <h1 className={`text-2xl font-bold leading-tight md:text-3xl ${darkMode ? "text-white" : "text-[#111]"}`}>
                Insert New Category
              </h1>
              <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Organize your product catalog by creating high-level groupings.
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 font-semibold text-[#d4af37] md:flex">
            <div className="h-4 w-4 rounded-full border-2 border-[#d4af37]" />
            Aurelian Admin
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
        
            <div className="space-y-6">
              
              <div className={`rounded-[26px] border p-4 shadow-sm sm:p-6 lg:p-8 ${mutedCard}`}>
                <SectionHeader icon={boxIcon} title="Basic Information" desc="Define category identifiers and metadata" darkMode={darkMode} />
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <TextInput label="Category Name *" name="category_name" icon={cateIcon} placeholder="e.g. Minimalist Home Decor" onChange={handleChange} fieldClass={fieldClass} labelClass={labelClass} />
                    <TextInput label="Slug (URL Path)" name="slug" icon={linkIcon} placeholder="minimalist-home-decor" onChange={handleChange} fieldClass={fieldClass} labelClass={labelClass} />
                  </div>
                  
                  <div>
                    <label className={`mb-2 block text-sm font-semibold ${labelClass}`}>Parent Category</label>
                    <div className="relative">
                      <InputIcon icon={cateIcon} />
                      <select name="parent_category" onChange={handleChange}
                        className={`h-12 w-full appearance-none rounded-2xl border pl-12 pr-11 text-sm outline-none ${fieldClass}`}>
                        <option value="">None (Root Category)</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Home Decor">Home Decor</option>
                      </select>
                      <img src={downIcon} alt="" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-70" />
                    </div>
                  </div>

                  <div>
                    <label className={`mb-2 block text-sm font-semibold ${labelClass}`}>Description</label>
                    <textarea name="description" rows={5} placeholder="Describe the category's essence..." onChange={handleChange}
                      className={`w-full resize-none rounded-2xl border p-4 text-sm outline-none ${fieldClass}`} />
                  </div>
                </div>
              </div>

              <div className={`rounded-[26px] border p-4 shadow-sm sm:p-6 lg:p-8 ${mutedCard}`}>
                <SectionHeader icon={camraIcon} title="Visual Media" desc="Upload Category Image" darkMode={darkMode} />
                <label className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed px-4 text-center transition-all ${
                  darkMode ? "border-[#2b3548] bg-[#1a2234] hover:border-[#d4af37]" : "border-gray-200 bg-[#fcfcfc] hover:border-[#d4af37]"
                }`}>
                  <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="hidden" />
                  {image ? (
                    <div className="flex flex-col items-center">
                      <img src={URL.createObjectURL(image)} alt="Preview" className="h-32 w-32 object-cover rounded-xl mb-3 shadow-md" />
                      <p className="text-sm font-medium text-gray-500">Click to change</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff7db]">
                        <img src={camraIcon} alt="" className="h-7 w-7" />
                      </div>
                      <h3 className={darkMode ? "font-bold text-white" : "font-bold text-[#1f1f1f]"}>
                        Upload category image
                      </h3>
                      <p className="mt-2 max-w-[360px] text-xs text-gray-500 sm:text-sm">
                        Recommended size: 800x800px. Supports PNG, JPG, and WebP.
                      </p>
                      <span className="mt-5 rounded-full bg-[#f5ecd2] px-5 py-2 text-sm font-semibold text-[#5c4033]">
                        Choose File
                      </span>
                    </>
                  )}
                </label>
              </div>

            </div>

            <div className="space-y-6">
              
              <div className={`rounded-[26px] border p-4 shadow-sm sm:p-6 ${mutedCard}`}>
                <SectionHeader icon={globalIcon} title="Classification" desc="Settings and visibility" darkMode={darkMode} />
                
                <div className="mt-6 flex flex-col gap-4">
                  <button type="button" onClick={() => setIsActive((value) => !value)}
                    className={`flex w-full items-center justify-center gap-3 rounded-full border px-4 py-3 text-sm font-semibold transition-all ${
                      isActive ? "border-[#e0b23d] bg-[#fff8df] text-[#14356f]" : "border-gray-200 bg-gray-100 text-gray-500"
                    }`}>
                    <span className={`flex h-6 w-11 items-center rounded-full p-1 transition-all ${isActive ? "bg-[#d9a63d]" : "bg-gray-300"}`}>
                      <span className={`h-4 w-4 rounded-full bg-white shadow transition-all ${isActive ? "translate-x-5" : "translate-x-0"}`} />
                    </span>
                    Category is Active
                  </button>

                  <label className="flex items-center gap-3 text-sm text-gray-600 mt-2">
                    <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4" />
                    Featured Category
                  </label>
                  <label className="flex items-center gap-3 text-sm text-gray-600">
                    <input type="checkbox" checked={sitemap} onChange={(e) => setSitemap(e.target.checked)} className="h-4 w-4" />
                    Enable Sitemap Indexing
                  </label>
                  <label className="flex items-center gap-3 text-sm text-gray-600">
                    <input type="checkbox" checked={globalSearch} onChange={(e) => setGlobalSearch(e.target.checked)} className="h-4 w-4" />
                    Include in Global Search
                  </label>
                </div>
                
                <div className="mt-6">
                  <TextInput label="Custom Breadcrumb Label" name="breadcrumb" icon={infoIcon} placeholder="Minimalist" onChange={handleChange} fieldClass={fieldClass} labelClass={labelClass} />
                </div>
              </div>

              <div className={`rounded-[26px] border p-4 shadow-sm sm:p-6 ${mutedCard}`}>
                <SectionHeader icon={boxIcon} title="Manage Brands" desc="Add associated brands" darkMode={darkMode} />
                <div className="mb-4">
                  <input type="text" placeholder="Brand Name" value={newBrand.name} onChange={(e) => setNewBrand({...newBrand, name: e.target.value})} className={`w-full mb-2 rounded-xl border p-3 text-sm outline-none ${fieldClass}`} />
                  <textarea rows={2} placeholder="Description (Optional)" value={newBrand.description} onChange={(e) => setNewBrand({...newBrand, description: e.target.value})} className={`w-full mb-2 resize-none rounded-xl border p-3 text-sm outline-none ${fieldClass}`} />
                  <button type="button" onClick={handleAddBrand} className="w-full rounded-xl bg-[#d9a63d] text-white py-2 text-sm font-semibold hover:bg-[#c3922f] transition">Add Brand</button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                  {brands.map(b => (
                    <div key={b.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{b.brand_name}</p>
                      </div>
                      <button type="button" onClick={() => handleDeleteBrand(b.id)} className="text-red-500 hover:text-red-700 text-xs font-bold uppercase">Delete</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`rounded-[26px] border p-4 shadow-sm sm:p-6 ${mutedCard}`}>
                <SectionHeader icon={boxIcon} title="Colour Palette" desc="Add category colors" darkMode={darkMode} />
                <div className="mb-4">
                  <input type="text" placeholder="Color Name" value={newColor.name} onChange={(e) => setNewColor({...newColor, name: e.target.value})} className={`w-full mb-2 rounded-xl border p-3 text-sm outline-none ${fieldClass}`} />
                  <div className="flex items-center gap-3 mb-2">
                    <input type="color" value={newColor.hex} onChange={(e) => setNewColor({...newColor, hex: e.target.value})} className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                    <span className="text-sm text-gray-500 font-mono">{newColor.hex}</span>
                  </div>
                  <button type="button" onClick={handleAddColor} className="w-full rounded-xl bg-[#d9a63d] text-white py-2 text-sm font-semibold hover:bg-[#c3922f] transition">Add Color</button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                  {colors.map(c => (
                    <div key={c.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: c.hex_code || "#ccc" }}></div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{c.color_name}</p>
                      </div>
                      <button type="button" onClick={() => handleDeleteColor(c.id)} className="text-red-500 hover:text-red-700 text-xs font-bold uppercase">Delete</button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <div className="mt-6 flex flex-col items-center justify-end gap-4 border-t border-gray-200 pt-6 sm:flex-row">
            <button type="button" onClick={onBack}
              className="w-full rounded-2xl border border-[#1f4ed8] bg-[#eef4ff] px-8 py-3 font-semibold text-[#1f4ed8] transition-all hover:bg-[#d9a63d] hover:text-white sm:w-auto">
              Cancel & Discard
            </button>
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d9a63d] px-8 py-3 font-semibold text-white transition-all hover:bg-[#c3922f] sm:w-auto">
              <img src={checkIcon} alt="" className="h-4 w-4" />
              Save Category & Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
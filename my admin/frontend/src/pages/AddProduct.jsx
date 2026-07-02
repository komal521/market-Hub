import { useState } from "react";
import boxIcon from "../assets/box.png";
import linkIcon from "../assets/link.png";
import cateIcon from "../assets/cate.png";
import downIcon from "../assets/down.png";
import camraIcon from "../assets/camra.png";
import addIcon from "../assets/add.png";
import carIcon from "../assets/car.png";
import scanningIcon from "../assets/scanning.png";
import closeIcon from "../assets/close.png";
import menuIcon from "../assets/menu.png";
import globalIcon from "../assets/global.png";
import informationIcon from "../assets/information.png";
import checkIcon from "../assets/check-mark.png";
import artIcon from "../assets/art.png";
import a2 from "../assets/a2.jpeg";
import a3 from "../assets/a3.jpeg";
import arrowIcon from "../assets/arrow.png";
const InputIcon = ({ icon }) => (
  <img src={icon} alt=""
    className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-65" />);
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
}) => (
  <div className={className}>
    <label className={`mb-2 block text-sm font-semibold ${labelClass}`}>
      {label}
    </label>
    <div className="relative">
      <InputIcon icon={icon} />
      <input type={type} name={name} placeholder={placeholder} defaultValue={defaultValue}
        className={`h-12 w-full rounded-2xl border pl-12 pr-4 text-sm outline-none ${fieldClass}`}/>
    </div>
  </div>
);
const SelectInput = ({
  label,
  name,
  icon,
  placeholder,
  options = ["Luxury", "Premium", "Classic"],
  fieldClass = defaultFieldClass,
  labelClass = defaultLabelClass,
  defaultValue,
}) => (
  <div>
    <label className={`mb-2 block text-sm font-semibold ${labelClass}`}>
      {label}
    </label>
    <div className="relative">
      <InputIcon icon={icon} />
      <select
        name={name}
        defaultValue={defaultValue}
        className={`h-12 w-full appearance-none rounded-2xl border pl-12 pr-11 text-sm outline-none ${fieldClass}`} >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <img  src={downIcon}  alt=""
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-70"/>
    </div>
  </div>
);
const SectionHeader = ({ icon, title, desc, darkMode = false }) => (
  <div className="mb-5 flex items-center gap-3 border-b border-gray-200 pb-4">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef2ff]">
      <img src={icon} alt="" className="h-5 w-5" />
    </div>
    <div>
      <h2 className={`text-base font-bold ${
          darkMode ? "text-white" : "text-[#14356f]"
        }`} >
        {title}
      </h2>
      {desc && <p className="mt-1 text-xs text-gray-500">{desc}</p>}
    </div>
  </div>
);
const AddProduct = ({ darkMode, onBack, product }) => {
  const [isActive, setIsActive] = useState(product ? Boolean(product.is_active) : true);
  const [image, setImage] = useState(null);
  const [variants, setVariants] = useState(() => {
    try {
      return product?.variants ? JSON.parse(product.variants) : [];
    } catch {
      return [];
    }
  });
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [newVariant, setNewVariant] = useState({ name: "", colour: "", size: "", price: "" });
  const [tags, setTags] = useState(() => {
    try {
      return product?.tags ? JSON.parse(product.tags) : [];
    } catch {
      return [];
    }
  });
  const [tagInput, setTagInput] = useState("");

  const fieldClass = darkMode
    ? "bg-[#1a2234] border-[#2b3548] text-white placeholder:text-gray-500"
    : "bg-white border-[#e7e2da] text-gray-700 placeholder:text-gray-400";
  const mutedCard = darkMode
    ? "border-[#2b3548] bg-[#111827]"
    : "border-[#f0dfbd] bg-white";
  const labelClass = darkMode ? "text-gray-200" : "text-[#23417d]";
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    form.append("isActive", isActive);
    form.append("variants", JSON.stringify(variants));
    form.append("tags", JSON.stringify(tags));
    if (image) {
      form.append("image", image);
    }

    try {
      const url = product ? `http://localhost:5000/api/products/${product.id}` : "http://localhost:5000/api/products";
      const method = product ? "PUT" : "POST";
      const response = await fetch(url, {
        method: method,
        body: form,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Product create nahi hua");}
      alert(data.message);
      onBack?.();
    } catch (error) {
      alert(error.message || "Backend server nahi chal raha");
    } };
  return (
    <div
      className={`min-h-screen p-4 sm:p-5 lg:p-8 ${
        darkMode ? "bg-[#0f172a]" : "bg-[#f7f8fa]"
      }`} >
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
           <button onClick={onBack} aria-label="Back to products"
  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow transition-all hover:bg-[#f5ecd2]">
  <img src={arrowIcon} alt="Back"  className="h-4 w-4 object-contain" />
        </button>
            <div>
              <h1 className={`text-2xl font-bold leading-tight md:text-3xl ${
                  darkMode ? "text-white" : "text-[#111]" }`} >
                {product ? "Edit Product" : "Insert New Product"}
              </h1>
              <p className={`mt-1 text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}  >
                Add a high-end masterpiece to your digital boutique.
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 font-semibold text-[#d4af37] md:flex">
            <div className="h-4 w-4 rounded-full border-2 border-[#d4af37]" />
            Aurelian Admin
          </div>
        </div>
        <div className={`rounded-[26px] border p-4 shadow-sm sm:p-6 lg:p-8 ${mutedCard}`}>
          <SectionHeader  icon={boxIcon}  title="General Information"
            desc="Fill all required product details" />
          <form onSubmit={handleSubmit} className="space-y-6">
            <TextInput label="Product Name *" name="productName" icon={linkIcon}
              placeholder="e.g. Midnight Sapphire Chronograph" defaultValue={product?.product_name} />
            <div>
              <label className={`mb-2 block text-sm font-semibold ${labelClass}`}>
                Product Description </label>
              <textarea  name="description"  rows={5}
                placeholder="Craft a compelling narrative for this item..."
                className={`w-full resize-none rounded-2xl border p-4 text-sm outline-none ${fieldClass}`} defaultValue={product?.description}  />
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <TextInput  label="SKU / Product ID"  name="sku" icon={boxIcon}  placeholder="AUR-2024-MS-001" defaultValue={product?.sku} />
              <TextInput label="Brand Name"  name="brand" icon={cateIcon} placeholder="e.g. Aurelian Luxe"
                defaultValue={product?.brand} />
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <SelectInput  label="Category" name="category" icon={cateIcon} placeholder="Select Category"
                options={["Electronics", "Accessories", "Fashion", "Home"]}
                defaultValue={product?.category} />
              <SelectInput label="Sub-Category" name="subCategory" icon={cateIcon}
                placeholder="Select Sub-Category"  options={["Luxury", "Premium", "Classic", "New Arrival"]}
                defaultValue={product?.sub_category} />
            </div>
            <div className="pt-2">
              <SectionHeader icon={camraIcon} title="Media & Gallery" />
              <label className={`mb-2 block text-sm font-semibold ${labelClass}`}>
                Product Image (Primary)
              </label>
              <label
                className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed px-4 text-center transition-all ${
                  darkMode
                    ? "border-[#2b3548] bg-[#1a2234] hover:border-[#d4af37]"
                    : "border-gray-200 bg-[#fcfcfc] hover:border-[#d4af37]"
                }`} >
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
                      Upload product image
                    </h3>
                    <p className="mt-2 max-w-[360px] text-xs text-gray-500 sm:text-sm">
                      Recommended size: 1200x1200px. Supports PNG, JPG, and WebP.
                    </p>
                    <span className="mt-5 rounded-full bg-[#f5ecd2] px-5 py-2 text-sm font-semibold text-[#5c4033]">
                      Choose File
                    </span>
                  </>
                )}
              </label>
            </div>
            <div className="pt-2">
              <SectionHeader icon={cateIcon} title="Pricing & Inventory" />
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <TextInput label="Base Price (₹) *" name="basePrice" icon={linkIcon} placeholder="0.00" defaultValue={product?.base_price} />
                <TextInput label="Discount Price (₹)" name="discountPrice" icon={linkIcon} placeholder="0.00" defaultValue={product?.discount_price} />
                <TextInput label="Stock Quantity" name="stockQuantity" icon={cateIcon} placeholder="0" defaultValue={product?.stock_quantity} />
              </div>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => setIsActive((value) => !value)}
                  className={`flex w-fit items-center gap-3 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                    isActive
                      ? "border-[#e0b23d] bg-[#fff8df] text-[#14356f]"
                      : "border-gray-200 bg-gray-100 text-gray-500"
                  }`} >
                  <span
                    className={`flex h-6 w-11 items-center rounded-full p-1 transition-all ${
                      isActive ? "bg-[#d9a63d]" : "bg-gray-300"
                    }`} >
                    <span
                      className={`h-4 w-4 rounded-full bg-white shadow transition-all ${
                        isActive ? "translate-x-5" : "translate-x-0"
                      }`} />
                  </span>
                  Product is Active
                </button>
                <label className="flex items-center gap-3 text-sm text-gray-600">
                  <input type="checkbox" name="isFeatured" className="h-4 w-4" defaultChecked={product ? Boolean(product.is_featured) : false} />
                  Mark as Featured Product
                </label>
              </div>
            </div>
            <div className="pt-2">
              <SectionHeader icon={carIcon} title="Shipping & Specifications" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <TextInput label="Weight (kg)" name="weight" icon={carIcon} placeholder="0.0" defaultValue={product?.weight} />
                <TextInput label="Length (cm)" name="length" icon={scanningIcon} placeholder="0.0" defaultValue={product?.length} />
                <TextInput label="Width (cm)" name="width" icon={scanningIcon} placeholder="0.0" defaultValue={product?.width} />
                <TextInput label="Height (cm)" name="height" icon={scanningIcon} placeholder="0.0" defaultValue={product?.height} />
              </div>
              <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <SelectInput label="Base Color" name="baseColor" icon={artIcon}
                  placeholder="Select primary aesthetic color" options={["Gold", "Platinum", "Black", "Silver"]}
                  defaultValue={product?.base_color} />
                <div>
                  <label className={`mb-2 block text-sm font-semibold ${labelClass}`}>
                    Product Tags
                  </label>
                  <div className={`flex min-h-12 flex-wrap items-center gap-2 rounded-2xl border px-3 py-2 ${fieldClass}`}>
                    {tags.map((tag, idx) => (
                      <span key={idx}
                        className="flex items-center gap-2 rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#23417d]" >
                        {tag}
                        <img src={closeIcon} alt="Remove tag" className="h-3 w-3 cursor-pointer" onClick={() => setTags(tags.filter((_, i) => i !== idx))} />
                      </span>
                    ))}
                    <input type="text" placeholder="Add..."
                      className="min-w-[80px] flex-1 bg-transparent text-sm outline-none"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          const val = tagInput.trim();
                          if (val && !tags.includes(val)) {
                            setTags([...tags, val]);
                            setTagInput("");
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={`rounded-[24px] border p-4 sm:p-5 ${darkMode ? "border-[#2b3548]" : "border-[#f0dfbd]"}`}>
              <SectionHeader icon={menuIcon} title="Product Variants"
                desc="Add multiple sizes, materials, or color options for this product." />
              <div className="overflow-x-auto mb-4">
                <table className="w-full min-w-[720px] overflow-hidden rounded-2xl text-sm">
                  <thead className="bg-[#faf7ef] text-left text-xs font-bold uppercase text-[#23417d]">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Colour</th>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Additional Price</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((v, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="px-4 py-4 text-gray-700">{v.name || "-"}</td>
                        <td className="px-4 py-4 text-gray-700">
                          <div className="flex items-center gap-2">
                            {v.colour && <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: v.colour }}></div>}
                            {v.colour || "-"}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-700">{v.size || "-"}</td>
                        <td className="px-4 py-4 text-gray-700">{v.price ? `+₹${v.price}` : "-"}</td>
                        <td className="px-4 py-4">
                          <button type="button" onClick={() => setVariants(variants.filter((_, i) => i !== idx))} className="text-red-500 font-bold hover:underline">Remove</button>
                        </td>
                      </tr>
                    ))}
                    {variants.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-4 py-4 text-center text-gray-500">No variants added yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {showVariantForm ? (
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-700 mb-1">Name (e.g. 18kt)</label>
                    <input type="text" className={`p-2 rounded border ${fieldClass}`} value={newVariant.name} onChange={(e) => setNewVariant({...newVariant, name: e.target.value})} placeholder="Variant Name" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-700 mb-1">Colour (e.g. Gold)</label>
                    <input type="text" className={`p-2 rounded border ${fieldClass}`} value={newVariant.colour} onChange={(e) => setNewVariant({...newVariant, colour: e.target.value})} placeholder="Color name or hex" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-700 mb-1">Size (e.g. 7)</label>
                    <input type="text" className={`p-2 rounded border ${fieldClass}`} value={newVariant.size} onChange={(e) => setNewVariant({...newVariant, size: e.target.value})} placeholder="Ring size / Dimension" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-700 mb-1">Additional Price</label>
                    <input type="number" className={`p-2 rounded border ${fieldClass}`} value={newVariant.price} onChange={(e) => setNewVariant({...newVariant, price: e.target.value})} placeholder="0.00" />
                  </div>
                  <div className="sm:col-span-4 flex justify-end gap-2 mt-2">
                    <button type="button" onClick={() => setShowVariantForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-black">Cancel</button>
                    <button type="button" onClick={() => {
                      if(newVariant.name || newVariant.colour || newVariant.size) {
                        setVariants([...variants, newVariant]);
                        setNewVariant({ name: "", colour: "", size: "", price: "" });
                        setShowVariantForm(false);
                      }
                    }} className="px-4 py-2 bg-[#d9a63d] text-white text-sm font-bold rounded-lg hover:bg-yellow-600">Save Variant</button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setShowVariantForm(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#f0dfbd] py-3 text-sm font-semibold text-[#d19b18]">
                  <img src={addIcon} alt="" className="h-4 w-4" />
                  Add New Variation
                </button>
              )}
            </div>
            <div className="flex flex-col items-center justify-end gap-4 border-t border-gray-200 pt-6 sm:flex-row">
              <button
                type="button"
                onClick={onBack}
                className="w-full rounded-2xl border border-[#1f4ed8] bg-[#eef4ff] px-8 py-3 font-semibold text-[#1f4ed8] transition-all hover:bg-[#d9a63d] hover:text-white sm:w-auto" >
                Cancel & Discard
              </button>
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d9a63d] px-8 py-3 font-semibold text-white transition-all hover:bg-[#c3922f] sm:w-auto">
                <img src={checkIcon} alt="" className="h-4 w-4" />
                {product ? "Update Product" : "Save Product & Publish"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AddProduct;

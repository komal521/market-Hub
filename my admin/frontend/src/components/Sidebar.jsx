import { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import logo from "../assets/logo.png";
import dashboardIcon from "../assets/dashboard.png";
import bookingIcon from "../assets/booking.png";
import packageIcon from "../assets/package.png";
import menuIcon from "../assets/menu.png";
import fileIcon from "../assets/file.png";
import Users from "../pages/Users";
import groupIcon from "../assets/group.png";
import informationIcon from "../assets/information.png";
import faqIcon from "../assets/faq.png";
import accountIcon from "../assets/account.png";
import settingIcon from "../assets/setting.png";
import profileImg from "../assets/ananaya.jpg";
import Dashboard from "../pages/Dashboard";
import OrderManagement from "../pages/OrderManagement";
import ProductManagement from "../pages/ProductManagement";
import Categories from "../pages/Categories";
import Reports from "../pages/Reports";
import Enquiries from "../pages/Enquiries";
import Support from "../pages/Support";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import EditSupport from "../pages/EditSupport";
import EditOrder from "../pages/EditOrder";
import EditUser from "../pages/EditUser";
import EditCategory from "../pages/EditCategory";
import EditEnquiry from "../pages/EditEnquiry";
import EditProduct from "../pages/EditProduct";
import EditProfile from "../pages/EditProfile";
import packageIcon2 from "../assets/package.png";
const SIDEBAR_W = "w-[260px]";
const menuItems = [
  {
    section: "MAIN MENU",
    items: [
      { name: "Dashboard",          icon: dashboardIcon },
      { name: "Order Management",   icon: bookingIcon },
      { name: "Product Management", icon: packageIcon },
      { name: "Categories",         icon: menuIcon },
    ],
  },
  {
    section: "ANALYTICS & PEOPLE",
    items: [
      { name: "Reports", icon: fileIcon },
      { name: "Users", icon: groupIcon },
      { name: "Enquiries", icon: informationIcon },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      { name: "Support", icon: faqIcon },
      { name: "Profile", icon: accountIcon },
      { name: "Settings", icon: settingIcon },
    ],
  },
];
const Sidebar = ({ darkMode, setDarkMode }) => {
  const [active, setActive] = useState("Dashboard");
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [adminName, setAdminName] = useState("Admin");
  const sidebarRef = useRef(null);
  useEffect(() => {
    fetch("http://localhost:5000/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings?.fullName) {
          setAdminName(data.settings.fullName);
        }
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    const handler = (e) => {
      if (open && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const handleNav = (name) => {
    setActive(name);
    setOpen(false);
  };
  return (
    <div className={`flex min-h-screen overflow-x-hidden ${darkMode ? "bg-gray-900" : "bg-[#f4f7fb]"}`}>
      <div  onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} />
      <aside ref={sidebarRef} className={`
          fixed top-0 left-0 z-50 h-screen ${SIDEBAR_W}
          bg-gray-700 border-r border-[#222] text-white flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>
        <div className="flex-1 overflow-y-auto px-4 py-5 scrollbar-hide">
          <div className="flex items-center justify-between mb-8">
           <div className="flex items-center justify-center w-full">
  <img src={logo} alt="logo" className="w-36 h-20 object-contain" />
             </div>
            <button
              onClick={() => setOpen(false)}
              className="md:hidden w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center hover:bg-[#2a2a2a] transition"  >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-7">
            {menuItems.map((menu, idx) => (
              <div key={idx}>
                <p className="text-[10px] tracking-[2px] text-gray-500 font-semibold mb-3 px-1">
                  {menu.section}
                </p>
                <div className="space-y-1">
                  {menu.items.map((item, index) => {
                    const isActive = active === item.name;
                    return (
                      <button
                        key={index}
                        onClick={() => handleNav(item.name)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 rounded-2xl
                          text-sm font-medium transition-all duration-200
                          ${isActive
                            ? "bg-[#6f4e37] text-white shadow-lg shadow-amber-900/30"
                            : "text-[#d1d1d1] hover:bg-[#1b1b1b] hover:text-white"
                          }   `}  >
                        <img  src={item.icon} alt=""
                          className={`w-5 h-5 object-contain flex-shrink-0 ${isActive ? "" : "brightness-0 invert"}`} />
                        <span className="truncate">{item.name}</span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" /> )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-[#222]">
          <div className="bg-[#1a1a1a] rounded-2xl p-3 flex items-center gap-3">
            <img src={profileImg} alt="admin"
              className="w-11 h-11 rounded-full object-cover border-2 border-[#d9a63d] flex-shrink-0"/>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold truncate">{adminName}</h3>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-green-400 flex-shrink-0" title="Online" />
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col h-screen min-w-0 md:ml-[260px] overflow-y-auto">
        <Navbar setOpen={setOpen} darkMode={darkMode} setDarkMode={setDarkMode} setActive={setActive} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {active === "Dashboard" && <Dashboard darkMode={darkMode} setActive={setActive} setEditData={setEditData} />}
          {active === "Order Management" && <OrderManagement darkMode={darkMode} setActive={setActive} setEditData={setEditData} />}
          {active === "Product Management" && <ProductManagement darkMode={darkMode} setActive={setActive} setEditData={setEditData} />}
          {active === "Users" && <Users darkMode={darkMode} setActive={setActive} setEditData={setEditData} />}
          {active === "Reports" && <Reports darkMode={darkMode} />}
          {active === "Categories" && <Categories darkMode={darkMode} setActive={setActive} setEditData={setEditData} />}
          {active === "Enquiries" && <Enquiries darkMode={darkMode} setActive={setActive} setEditData={setEditData} />}
          {active === "Support" && <Support darkMode={darkMode} setActive={setActive} setEditData={setEditData} />}
          {active === "Profile" && <Profile darkMode={darkMode} setActive={setActive} />}
          {active === "Settings" && <Settings darkMode={darkMode} />}
          {active === "Edit Profile" && <EditProfile darkMode={darkMode} setActive={setActive} />}
          {active === "Edit Support" && <EditSupport darkMode={darkMode} editData={editData} setActive={setActive} />}
          {active === "Edit Order" && <EditOrder darkMode={darkMode} editData={editData} setActive={setActive} />}
          {active === "Edit User" && <EditUser darkMode={darkMode} editData={editData} setActive={setActive} />}
          {active === "Edit Category" && <EditCategory darkMode={darkMode} editData={editData} setActive={setActive} />}
          {active === "Edit Enquiry" && <EditEnquiry darkMode={darkMode} editData={editData} setActive={setActive} />}
          {active === "Edit Product" && <EditProduct darkMode={darkMode} editData={editData} setActive={setActive} />}
          {![
            "Dashboard", "Order Management", "Product Management", "Users",
            "Categories", "Reports", "Enquiries", "Support", "Profile", "Settings",
            "Edit Profile", "Edit Support", "Edit Order", "Edit User", "Edit Category", "Edit Enquiry", "Edit Product"
          ].includes(active) && (
            <div className="p-6 md:p-10">
              <div className={`rounded-3xl min-h-[70vh] shadow-sm flex items-center justify-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <h1 className={`text-4xl font-bold ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
                  {active}
                </h1>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default Sidebar;

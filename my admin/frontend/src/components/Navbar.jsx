import { useState, useEffect, useRef } from "react";
import searchIcon from "../assets/search.png";
import sunIcon from "../assets/sun.png";
import moonIcon from "../assets/moon.png";
import notificationIcon from "../assets/notification.png";
import messageIcon from "../assets/msg.png";
import userImg from "../assets/u2.jpg";

const Navbar = ({ setOpen, darkMode, setDarkMode, setActive }) => {
  const [searchVal, setSearchVal] = useState("");
  const [adminName, setAdminName] = useState("Julian Vane");
  const [notifications, setNotifications] = useState([]);
  const [notifCount, setNotifCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

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

  // Fetch notifications from backend
  const fetchNotifications = () => {
    fetch("http://localhost:5000/api/notifications")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNotifications(data.notifications || []);
          setNotifCount(data.count || 0);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleNotifClick = (notif) => {
    setShowDropdown(false);
    if (notif.type === "order" && setActive) {
      setActive("Order Management");
    } else if (notif.type === "enquiry" && setActive) {
      setActive("Enquiries");
    }
  };

  return (
    <nav
      className={`sticky top-0 z-40 w-full border-b px-3 sm:px-5 py-3 flex items-center justify-between gap-3
        backdrop-blur-xl transition-all duration-300
        ${darkMode
          ? "bg-gray-900/95 border-gray-700 text-white"
          : "bg-white/95 border-gray-200 text-black"
        }`} >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button onClick={() => setOpen(true)}
          className={`md:hidden flex-shrink-0 flex items-center justify-center
              w-9 h-9 rounded-xl shadow-md transition-all duration-300
              ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-[#111] hover:bg-gray-800"}`}
          aria-label="Open menu">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full flex-1
            transition-all duration-300
            ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
          <img src={searchIcon} alt="search" className="w-4 h-4 opacity-60 flex-shrink-0" />
          <input type="text" value={searchVal} onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search..."
            className={`bg-transparent outline-none w-full text-sm font-medium
              ${darkMode ? "placeholder:text-gray-500 text-white" : "placeholder:text-gray-400 text-black"}`} />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {/* Theme Toggle */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button onClick={() => setDarkMode(!darkMode)}
            title="Toggle Theme"
            className={`p-2 rounded-full transition-all duration-300 shadow-md ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-yellow-100 hover:bg-yellow-200"}`}>
            <img src={darkMode ? moonIcon : sunIcon} alt="theme" className="w-4 h-4 object-contain" />
          </button>
        </div>

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`relative p-2 rounded-full transition-all duration-300 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            title="Notifications">
            <img src={notificationIcon} alt="notification" className="w-5 h-5 object-contain" />
            {/* Show badge only when there are real notifications */}
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                {notifCount > 9 ? "9+" : notifCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showDropdown && (
            <div className={`absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl border z-50 overflow-hidden
              ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              {/* Header */}
              <div className={`px-4 py-3 flex items-center justify-between border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                <div>
                  <h3 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Notifications</h3>
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {notifCount > 0 ? `${notifCount} new updates` : "No new notifications"}
                  </p>
                </div>
                {notifCount > 0 && (
                  <span className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                    {notifCount} New
                  </span>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <img src={notificationIcon} alt="" className="w-6 h-6 opacity-40" />
                    </div>
                    <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>All caught up!</p>
                    <p className={`text-xs mt-1 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>No pending orders or enquiries</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => handleNotifClick(notif)}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-all duration-200 border-b last:border-b-0
                        ${darkMode
                          ? "border-gray-700 hover:bg-gray-700"
                          : "border-gray-50 hover:bg-gray-50"}`}>
                      {/* Icon */}
                      <div className={`w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center text-lg
                        ${notif.type === "order"
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : "bg-amber-100 dark:bg-amber-900/30"}`}>
                        {notif.type === "order" ? "🛍️" : "📩"}
                      </div>
                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-semibold truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {notif.title}
                        </p>
                        <p className={`text-xs mt-0.5 truncate ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {notif.message}
                        </p>
                        <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                          {timeAgo(notif.time)}
                        </p>
                      </div>
                      {/* Status dot */}
                      <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 mt-1" />
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className={`px-4 py-3 border-t ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-100 bg-gray-50"}`}>
                <button
                  onClick={() => { setShowDropdown(false); setActive && setActive("Order Management"); }}
                  className="w-full text-center text-xs font-semibold text-[#6f4e37] hover:underline">
                  View All Orders & Enquiries →
                </button>
              </div>
            </div>
          )}
        </div>



        {/* Admin Profile */}
        <div onClick={() => setActive && setActive("Profile")}
          className={`flex items-center gap-2 pl-2 sm:pl-3 border-l cursor-pointer hover:opacity-80 transition-opacity ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="hidden sm:block text-right">
            <h3 className="text-xs sm:text-sm font-semibold whitespace-nowrap">{adminName}</h3>
            <p className={`text-[10px] sm:text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Admin Portal
            </p>
          </div>
          <div className="relative">
            <img src={userImg} alt="user"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-md" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import b3 from "../assets/b3.jpeg";
import pencil from "../assets/pencil (1).png";
import bag from "../assets/bag.webp";
import heart from "../assets/heart (1).png";
import checkout from "../assets/checkout.png";
import medal from "../assets/medal.png";
import user from "../assets/user.png";
import gmail from "../assets/gmail.png";
import phone from "../assets/phone-call.png";
import verified from "../assets/verified.png";
import location from "../assets/location.png";
import { useEffect, useState } from "react";
import notification from "../assets/notification (1).png";
import padlock from "../assets/padlock.png";
import checked from "../assets/checked.png";
import rightArrow from "../assets/right-arrow.png";
import box from "../assets/box.png";
import shoppingCart from "../assets/shopping-cart.png";
import appointment from "../assets/appointment.png";
import logout from "../assets/logout.png";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [userData, setUserData] = useState({
    id: "", fullName: "", email: "", phone: "", address: "",
    profileImage: "", username: "", });
  const [profileFile, setProfileFile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [wishlistCount] = useState(0);
  const [rewardPoints] = useState(15420);
  const [notifications, setNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedAddress, setSavedAddress] = useState({ name: "", email: "", line1: "", city: "", pincode: "", phone: "" });
  const [addressSaved, setAddressSaved] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [upiId, setUpiId] = useState("");
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUserData({
      id: storedUser.id || "",
      fullName: storedUser.fullName || "",
      email: storedUser.email || "",
      phone: storedUser.phone || "",
      address: storedUser.address || "",
      profileImage: storedUser.profileImage || "",
      username: storedUser.username || "",
    }); 
    let parsedAddress = {
      name: storedUser.fullName || "",
      email: storedUser.email || "",
      line1: "",
      city: "",
      pincode: "",
      phone: storedUser.phone || ""
    };
    if (storedUser.address) {
      const parts = storedUser.address.split(",");
      if (parts.length >= 4) {
        const namePart = parts[0].trim();
        const emailPart = parts[1] && parts[1].includes("@") ? parts[1].trim() : (storedUser.email || "");
        const offset = parts[1] && parts[1].includes("@") ? 1 : 0;
        const linePart = parts[1 + offset] ? parts[1 + offset].trim() : "";
        const cityPinPart = parts[2 + offset] ? parts[2 + offset].trim() : "";
        const phonePart = parts[3 + offset] ? parts[3 + offset].trim() : "";   
        let city = cityPinPart;
        let pincode = "";
        if (cityPinPart.includes("-")) {
          const cp = cityPinPart.split("-");
          city = cp[0].trim();
          pincode = cp[1].trim();
        }     
        let phoneVal = phonePart;
        if (phonePart.toLowerCase().startsWith("ph:")) {
          phoneVal = phonePart.substring(3).trim();
        }        
        parsedAddress = {
          name: namePart || storedUser.fullName || "",
          email: emailPart || storedUser.email || "",
          line1: linePart,
          city: city,
          pincode: pincode,
          phone: phoneVal || storedUser.phone || ""
        };
      }
    }
    setSavedAddress(parsedAddress);
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cartItems.length);
    if (storedUser.id) {
      fetchUserFromBackend(storedUser.id);
      fetchUserOrders(storedUser.email);
      fetchActivities();
    } else {
      setLoading(false);
    }
  }, []);
  const fetchUserFromBackend = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users`);
      const data = await res.json();
      let updatedData = {};
      if (data.success) {
        const found = data.users.find((u) => u.id === Number(userId));
        if (found) {
          updatedData = {
            fullName: found.fullName || found.full_name,
            email: found.email,
            phone: found.phone,
            address: found.address,
            username: found.username,
          };
        }
      }
      setUserData((prev) => ({
        ...prev,
        ...updatedData
      }));
    } catch (err) {
      console.log("Backend fetch failed:", err.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchUserOrders = async (email) => {
    if (!email) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders`);
      const data = await res.json();
      if (data.success) {
        const myOrders = data.orders.filter(
          (o) => o.email?.toLowerCase() === email?.toLowerCase()
        );
        setOrders(myOrders);
        setOrderCount(myOrders.length);
      }
    } catch (err) {
      console.log("Orders fetch failed:", err.message);
    }
  };
  const fetchActivities = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/activities");
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.log("Activities fetch failed:", err);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    navigate("/login");
  };
  const handleSaveAddress = async () => {
    if (!userData.id) { alert("Please login to save address"); return; }
    const fullAddress = `${savedAddress.name}, ${savedAddress.email}, ${savedAddress.line1}, ${savedAddress.city} - ${savedAddress.pincode}, Ph: ${savedAddress.phone}`;
    try {
      const res = await fetch(`http://localhost:5000/api/users/profile/${userData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: fullAddress }),
      });
      const data = await res.json();
      if (data.success) {
        setAddressSaved(true);
        setUserData(prev => ({ ...prev, address: fullAddress }));
        localStorage.setItem("user", JSON.stringify({ ...JSON.parse(localStorage.getItem("user")), address: fullAddress }));
        setTimeout(() => setAddressSaved(false), 3000);
      }
    } catch (err) { console.log(err); }
  };
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };
  const formatINR = (val) =>
    `₹${Number(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  const statusColor = (status) => {
    const s = (status || "Pending").toLowerCase();
    if (s === "completed") return "bg-green-100 text-green-700";
    if (s === "cancelled") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-700";
  };
  const statsCards = [
    { label: "Total Orders", value: orderCount, img: bag, bg: "bg-amber-100" },
    { label: "Wishlist Items", value: wishlistCount, img: heart, bg: "bg-orange-100" },
    { label: "Cart Items", value: cartCount, img: checkout, bg: "bg-yellow-100" },
    { label: "Reward Points", value: rewardPoints.toLocaleString("en-IN"), img: medal, bg: "bg-amber-100" },
  ];
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-850 dark:text-gray-150 transition-colors duration-300 py-10">
        <div className="max-w-6xl mx-auto px-4 pb-12">
          <div className="bg-[#c0b6af] dark:bg-gray-800 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow text-black dark:text-white">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="relative">
                {userData.profileImage ? (
                  <img src={userData.profileImage} alt=""
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-black dark:border-white" />
                ) : (
                  <img src={b3} alt=""
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-black dark:border-white" />
                )}
                {isEditing ? (
                  <label className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow cursor-pointer hover:bg-yellow-50 dark:hover:bg-gray-600 transition">
                    <img src={pencil} alt="" className="w-5 h-5 dark:invert" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setProfileFile(e.target.files[0]);
                        setUserData({ ...userData, profileImage: URL.createObjectURL(e.target.files[0]) });
                      }
                    }} />
                  </label>
                ) : (
                  <button onClick={() => navigate("/edit-profile")}
                    className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow hover:bg-yellow-50 dark:hover:bg-gray-600 transition cursor-pointer">
                    <img src={pencil} alt="" className="w-5 h-5 dark:invert" />
                  </button>
                )}
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-bold">
                  {loading ? "Loading..." : `${userData.fullName || ""} ${userData.username || ""}`.trim() || "Guest User"}
                </h2>
                <p className="text-gray-750 dark:text-gray-300 mt-1 text-sm">{userData.email}</p>
                {userData.phone && (
                  <p className="text-gray-750 dark:text-gray-300 mt-0.5 text-sm">{userData.phone}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <button onClick={() => navigate("/edit-profile")}
                className="bg-[#6f4e37] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#5a3d2b] transition">
                Edit Profile
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {statsCards.map((card, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                <div className={`w-14 h-14 ${card.bg} dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0`}>
                  <img src={card.img} alt="" className="w-7 h-7 object-contain dark:invert" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold leading-tight">{card.label}</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-white mt-0.5">{card.value}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-850 p-1 rounded-2xl">
                {["info", "orders", "activity"].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition ${activeTab === tab ? "bg-white dark:bg-gray-700 shadow text-[#6f4e37] dark:text-amber-100" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
                    {tab === "info" ? "Personal Info" : tab === "orders" ? `My Orders (${orderCount})` : "Activity Timeline"}
                  </button>   ))} </div>
              {activeTab === "info" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 dark:text-white">Personal Information</h2>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mt-0.5">Manage your contact and shipping details.</p>
                    </div>
                    <button
                      onClick={() => navigate("/edit-profile")}
                      className="focus:outline-none" >
                      <img src={pencil} alt=""
                       className="w-5 h-5 cursor-pointer opacity-60 hover:opacity-100 transition dark:invert" />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Full Name</label>
                        <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 min-h-[52px] focus-within:border-amber-400 dark:focus-within:border-amber-500 transition bg-white dark:bg-gray-900">
                          <img src={user} alt="" className="w-5 h-5 flex-shrink-0 dark:invert" />
                          {isEditing ? (
                            <input type="text" className="w-full outline-none text-gray-700 dark:text-gray-205 text-sm bg-transparent"
                              value={userData.fullName}
                              onChange={(e) => setUserData({ ...userData, fullName: e.target.value })} />
                          ) : (
                            <span className="text-gray-700 dark:text-gray-200 text-sm">{userData.fullName || "—"}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Username / Surname</label>
                        <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 min-h-[52px] focus-within:border-amber-400 dark:focus-within:border-amber-500 transition bg-white dark:bg-gray-900">
                          <img src={user} alt="" className="w-5 h-5 flex-shrink-0 dark:invert" />
                          {isEditing ? (
                            <input type="text" className="w-full outline-none text-gray-700 dark:text-gray-205 text-sm bg-transparent"
                              value={userData.username}
                              onChange={(e) => setUserData({ ...userData, username: e.target.value })} />
                          ) : (
                            <span className="text-gray-700 dark:text-gray-200 text-sm">{userData.username || "—"}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Email Address</label>
                        <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 min-h-[52px] focus-within:border-amber-400 dark:focus-within:border-amber-500 transition bg-white dark:bg-gray-900">
                          <img src={gmail} alt="" className="w-5 h-5 flex-shrink-0" />
                          {isEditing ? (
                            <input type="email" className="w-full outline-none text-gray-700 dark:text-gray-205 text-sm bg-transparent"
                              value={userData.email}
                              onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
                          ) : (
                            <span className="text-gray-700 dark:text-gray-200 text-sm break-all">{userData.email || "—"}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Phone Number</label>
                        <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 min-h-[52px] focus-within:border-amber-400 dark:focus-within:border-amber-500 transition bg-white dark:bg-gray-900">
                          <img src={phone} alt="" className="w-5 h-5 flex-shrink-0 dark:invert" />
                          {isEditing ? (
                            <input type="text" className="w-full outline-none text-gray-700 dark:text-gray-205 text-sm bg-transparent"
                              value={userData.phone}
                              onChange={(e) => setUserData({ ...userData, phone: e.target.value })} />
                          ) : (
                            <span className="text-gray-700 dark:text-gray-200 text-sm">{userData.phone || "Not provided"}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Preferred Language</label>
                        <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 min-h-[52px] bg-white dark:bg-gray-900">
                          <img src={verified} alt="" className="w-5 h-5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-200 text-sm">English (United States)</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5">
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Primary Billing Address</label>
                      <div className="flex items-start gap-3 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 min-h-[52px] focus-within:border-amber-400 dark:focus-within:border-amber-500 transition bg-white dark:bg-gray-900">
                        <img src={location} alt="" className="w-5 h-5 mt-0.5 flex-shrink-0 dark:invert" />
                        {isEditing ? (
                          <textarea className="w-full outline-none resize-none text-gray-700 dark:text-gray-205 text-sm bg-transparent"
                            value={userData.address}
                            onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                            rows="2" placeholder="Enter your address" />
                        ) : (
                          <span className="text-gray-700 dark:text-gray-200 text-sm">{userData.address || "Not provided"}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 mt-2">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                      <h2 className="text-lg font-bold text-gray-800 dark:text-white">Account Settings</h2>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Security and communication preferences.</p>
                    </div>
                    <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-4">
                        <img src={notification} alt="" className="w-5 h-5 dark:invert" />
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-white text-sm">Push Notifications</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Shipping updates and exclusive drops.</p>
                        </div>
                      </div>
                      <button onClick={() => setNotifications(!notifications)}
                        className={`relative w-14 h-7 rounded-full transition-all ${notifications ? "bg-[#6f4e37]" : "bg-gray-300 dark:bg-gray-700"}`}>
                        <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${notifications ? "right-0.5" : "left-0.5"}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-4">
                        <img src={padlock} alt="" className="w-5 h-5 dark:invert" />
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-white text-sm">Change Password</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Last updated 3 months ago.</p>
                        </div>
                      </div>
                      <button onClick={() => {
                          const newPassword = prompt("Enter new password:");
                          if(newPassword && newPassword.length >= 6) {
                              fetch(`http://localhost:5000/api/users/password/${userData.id}`, {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ password: newPassword }),
                              }).then(res => res.json()).then(data => {
                                  if(data.success) alert("Password updated successfully!");
                                  else alert("Failed to update password");
                              }).catch(err => alert("Error updating password"));
                          } else if(newPassword) {
                              alert("Password must be at least 6 characters");
                          }
                      }} className="px-4 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-655 dark:text-gray-200 transition">Manage</button>
                    </div>
                    <div className="flex items-center justify-between p-5">
                      <div className="flex items-center gap-4">
                        <img src={checked} alt="" className="w-5 h-5 dark:invert" />
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-white text-sm">Help & Support</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">24/7 VIP concierge assistance.</p>
                        </div>
                      </div>
                      <img src={rightArrow} alt="" className="w-4 h-4 cursor-pointer opacity-60 hover:opacity-100 transition dark:invert" />
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "orders" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">My Orders</h2>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Your recent purchase history</p>
                  </div>
                  {orders.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-amber-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <img src={bag} alt="" className="w-8 h-8 object-contain dark:invert" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">No orders yet</p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Your orders will appear here after checkout</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[500px]">
                        <thead className="bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          <tr>
                            <th className="px-5 py-3 text-left">Order #</th>
                            <th className="px-5 py-3 text-left">Date</th>
                            <th className="px-5 py-3 text-left">Amount</th>
                            <th className="px-5 py-3 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-750">
                          {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-750/50 transition">
                              <td className="px-5 py-4 font-semibold text-gray-800 dark:text-white text-sm">#{order.id}</td>
                              <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-sm">{formatDate(order.created_at)}</td>
                              <td className="px-5 py-4 font-bold text-gray-900 dark:text-white text-sm">{formatINR(order.total_amount)}</td>
                              <td className="px-5 py-4">
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(order.status)}`}>
                                  {order.status || "Pending"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "activity" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">Activity Timeline</h2>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Recent system activities</p>
                  </div>
                  <div className="p-6">
                    {activities.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-center">No recent activities</p>
                    ) : (
                      <div className="space-y-6 border-l-2 border-amber-200 dark:border-amber-900/50 ml-3 pl-5">
                        {activities.map((act, i) => (
                          <div key={i} className="relative">
                            <span className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-[#6f4e37] border-2 border-white dark:border-gray-800 shadow" />
                            <p className="text-sm text-gray-805 dark:text-gray-200">
                              <span className="font-semibold">{act.name}</span> {act.text}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{act.time}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "address" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">Saved Address</h2>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Add and save your delivery address</p>
                  </div>
                  <div className="p-6 space-y-4">
                    {addressSaved && <div className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 px-4 py-2 rounded-xl text-sm font-medium">✓ Address saved successfully!</div>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Full Name</label>
                        <input type="text" placeholder="Enter full name" value={savedAddress.name}
                          onChange={(e) => setSavedAddress({...savedAddress, name: e.target.value})}
                          className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 dark:focus:border-amber-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Phone</label>
                        <input type="text" placeholder="+91 XXXXX XXXXX" value={savedAddress.phone}
                          onChange={(e) => setSavedAddress({...savedAddress, phone: e.target.value})}
                          className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 dark:focus:border-amber-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Email Address</label>
                      <input type="email" placeholder="Enter email address" value={savedAddress.email}
                        onChange={(e) => setSavedAddress({...savedAddress, email: e.target.value})}
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 dark:focus:border-amber-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Address Line</label>
                      <input type="text" placeholder="Street, Apartment, Area" value={savedAddress.line1}
                        onChange={(e) => setSavedAddress({...savedAddress, line1: e.target.value})}
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 dark:focus:border-amber-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-white" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">City</label>
                        <input type="text" placeholder="City" value={savedAddress.city}
                          onChange={(e) => setSavedAddress({...savedAddress, city: e.target.value})}
                          className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 dark:focus:border-amber-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Pincode</label>
                        <input type="text" placeholder="000000" value={savedAddress.pincode}
                          onChange={(e) => setSavedAddress({...savedAddress, pincode: e.target.value})}
                          className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 dark:focus:border-amber-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-white" />
                      </div>
                    </div>
                    <button onClick={handleSaveAddress}
                      className="w-full bg-[linear-gradient(135deg,#f3d3b5,#b78457,#6f4e37)] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-md">
                      Save Address
                    </button>
                  </div>
                </div>
              )}
              {activeTab === "payment" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">Payment Methods</h2>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Choose your preferred payment option</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="border-2 rounded-2xl p-4 cursor-pointer transition border-[#6f4e37] bg-amber-50 dark:bg-amber-955/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center"><span className="text-xl">💵</span></div>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">Cash on Delivery</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Pay cash when order arrives</p>
                        </div>
                        <div className="ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center border-[#6f4e37]">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#6f4e37]" />
                        </div>
                      </div>
                    </div>
                    <button className="w-full bg-[linear-gradient(135deg,#f3d3b5,#b78457,#6f4e37)] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-md">
                       Confirm Cash on Delivery
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="lg:col-span-1">
              <h3 className="text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-4">Quick Management</h3>
              <div className="space-y-3">
                {[
                  { label: "My Orders", sub: `${orderCount} orders placed`, icon: box, onClick: () => setActiveTab("orders") },
                  { label: "My Wishlist", sub: "Items you've been eyeing", icon: heart, onClick: () => navigate("/wishlist") },
                  { label: "Saved Addresses", sub: "Manage delivery locations", icon: location, onClick: () => setActiveTab("address") },
                  { label: "Payment Methods", sub: "UPI, Cash & more", icon: appointment, onClick: () => setActiveTab("payment") },
                ].map((item, i) => (
                  <button key={i}
                    onClick={item.onClick}
                    className="w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-amber-500 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-amber-50 dark:bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                        <img src={item.icon} alt="" className="w-5 h-5 dark:invert" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-sm text-gray-800 dark:text-white">{item.label}</h4>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{item.sub}</p>
                      </div>
                    </div>
                    <img src={rightArrow} alt="" className="w-4 h-4 opacity-40 dark:invert" />
                  </button>
                ))}
                <button onClick={handleLogout}
                  className="w-full bg-[#6f4e37] hover:bg-[#5a3d2b] text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition shadow-lg">
                  <img src={logout} alt="" className="w-5 h-5 invert" />
                  LOGOUT SECURELY
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
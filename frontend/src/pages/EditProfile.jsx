import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import user from "../assets/user.png";
import gmail from "../assets/gmail.png";
import phoneIcon from "../assets/phone-call.png";
import b3 from "../assets/b3.jpeg";
import pencil from "../assets/pencil.png";
import Navbar from "../component/Navbar";
const EditProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    id: "", fullName: "", email: "", phone: "", address: "", profileImage: "", username: ""
  });
  const [profileFile, setProfileFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    if (!storedUser.id) {
      navigate("/login");
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users`);
        const data = await res.json();
        if (data.success || data.users) {
          const users = data.users || data;
          const found = users.find((u) => u.id === Number(storedUser.id));
          if (found) {
            setUserData({
              id: found.id,
              fullName: found.fullName || found.full_name || "",
              email: found.email || "",
              phone: found.phone || "",
              address: found.address || "",
              username: found.username || "",
              profileImage: found.profile_image ? `http://localhost:5000/uploads/${found.profile_image}` : storedUser.profileImage || "",
            });
          } else {
            setUserData(storedUser);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setUserData(storedUser);
      }
    };
    fetchUser();
  }, [navigate]);
  const handleSave = async (e) => {
    e.preventDefault();
    if (!userData.id) {
      setSaveMsg("User not found.");
      return;
    }
    setIsSaving(true);
    setSaveMsg("");
    try {
      const formData = new FormData();
      Object.keys(userData).forEach((key) => {
        formData.append(key, userData[key] || "");
      });
      if (profileFile) {
        formData.append("profileImage", profileFile);
      }
      const res = await fetch(`http://localhost:5000/api/users/${userData.id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setSaveMsg("✓ Profile updated successfully!");
        const updatedImage = data.profileImage ? `http://localhost:5000/uploads/${data.profileImage}` : userData.profileImage;
        const updatedUser = { ...JSON.parse(localStorage.getItem("user")), ...userData, profileImage: updatedImage };
        localStorage.setItem("user", JSON.stringify(updatedUser));  
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      } else {
        setSaveMsg("Failed to update profile.");
      }
    } catch (err) {
      setSaveMsg("Server error. Please check the backend.");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f5f0ff] via-[#faf8f4] to-[#f0f4ff] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 px-4 transition-colors duration-300">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#6f4e37] dark:text-[#d7a53f] tracking-tight">Edit Profile</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Update your photo and personal details to keep your profile fresh.</p>
            </div>
            <button onClick={() => navigate("/profile")} className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition shadow-sm">
              Back to Profile
            </button>
          </div>
          <form onSubmit={handleSave} className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gray-50 dark:bg-gray-700 p-6 rounded-3xl border border-gray-100 dark:border-gray-600 shadow-sm transition">
              <div className="relative group">
                {userData.profileImage ? (
                  <img src={userData.profileImage} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md transition-transform group-hover:scale-105" />
                ) : (
                  <img src={b3} alt="Default" className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md transition-transform group-hover:scale-105" />
                )}
                <label className="absolute bottom-0 right-0 bg-[#6f4e37] text-white rounded-full p-2.5 shadow-lg cursor-pointer hover:bg-[#5a3d2b] transition transform hover:scale-110">
                  <img src={pencil} alt="Edit" className="w-4 h-4 invert" />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProfileFile(e.target.files[0]);
                      setUserData({ ...userData, profileImage: URL.createObjectURL(e.target.files[0]) });
                    }
                  }} />
                </label>
              </div>
              <div className="text-center sm:text-left mt-2">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Profile Photo</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1.5">A picture helps people recognize you and lets you know when you’re signed in to your account.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Name</label>
                <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3.5 bg-gray-50 dark:bg-gray-700 focus-within:border-amber-400 focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:shadow-sm transition">
                  <img src={user} alt="" className="w-5 h-5 opacity-60 dark:invert" />
                  <input type="text" className="w-full outline-none text-gray-800 dark:text-white text-sm bg-transparent font-medium"
                    value={userData.fullName} placeholder="Your First Name"
                    onChange={(e) => setUserData({ ...userData, fullName: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Surname (Username)</label>
                <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3.5 bg-gray-50 dark:bg-gray-700 focus-within:border-amber-400 focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:shadow-sm transition">
                  <img src={user} alt="" className="w-5 h-5 opacity-60 dark:invert" />
                  <input type="text" className="w-full outline-none text-gray-800 dark:text-white text-sm bg-transparent font-medium"
                    value={userData.username} placeholder="Your Surname"
                    onChange={(e) => setUserData({ ...userData, username: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Email (Gmail)</label>
                <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3.5 bg-gray-50 dark:bg-gray-700 focus-within:border-amber-400 focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:shadow-sm transition">
                  <img src={gmail} alt="" className="w-5 h-5 opacity-60" />
                  <input type="email" className="w-full outline-none text-gray-800 dark:text-white text-sm bg-transparent font-medium"
                    value={userData.email} placeholder="name@example.com"
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3.5 bg-gray-50 dark:bg-gray-700 focus-within:border-amber-400 focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:shadow-sm transition">
                  <img src={phoneIcon} alt="" className="w-5 h-5 opacity-60 dark:invert" />
                  <input type="text" className="w-full outline-none text-gray-800 dark:text-white text-sm bg-transparent font-medium"
                    value={userData.phone} placeholder="+1 234 567 890"
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })} />
                </div>
              </div>
            </div>
            {saveMsg && (
              <div className={`p-4 rounded-xl text-center font-bold shadow-sm ${saveMsg.startsWith("✓") ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400" : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400"}`}>
                {saveMsg}
              </div>
            )}
            <button type="submit" disabled={isSaving}
              className="w-full bg-[#6f4e37] hover:bg-[#5a3d2b] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-amber-100/50 dark:shadow-none transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:-translate-y-0.5">
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Updates...
                </>
              ) : "Save Profile Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default EditProfile;

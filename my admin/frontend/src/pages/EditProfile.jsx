import React, { useState, useEffect } from "react";
import profileImg from "../assets/b3.jpeg";
import gmailIcon from "../assets/gmail.png";
import phoneIcon from "../assets/telephone.png";
import locationIcon from "../assets/location.png";
import pencilIcon from "../assets/pencil.png";
import accountIcon from "../assets/account.png";
import cakeIcon from "../assets/birthday-cake.png";
const EditProfile = ({ darkMode, setActive }) => {
  const [userData, setUserData] = useState({
    id: "",
    fullName: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
    profileImage: "",
  });
  const [profileFile, setProfileFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.users.length > 0) {
          const found = data.users[0];
          setUserData({
            id: found.id,
            fullName: found.full_name || found.fullName || "",
            username: found.username || "",
            email: found.email || "",
            phone: found.phone || "",
            address: found.address || "",
            dob: found.dob ? found.dob.substring(0, 10) : "",
            gender: found.gender || "",
            profileImage: found.profile_image
              ? `http://localhost:5000/uploads/${found.profile_image}`
              : "",
          });
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!userData.id) {
      setSaveMsg("User ID not found.");
      return;
    }
    setIsSaving(true);
    setSaveMsg("");

    try {
      const formData = new FormData();
      formData.append("fullName", userData.fullName);
      formData.append("username", userData.username);
      formData.append("email", userData.email);
      formData.append("phone", userData.phone);
      formData.append("address", userData.address);
      formData.append("dob", userData.dob);
      formData.append("gender", userData.gender);

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
        setTimeout(() => {
          setActive("Profile");
        }, 1500);
      } else {
        setSaveMsg(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setSaveMsg("Server error. Please check the backend connection.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={`p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#0f0f0f]" : "bg-[#f7f5f2]"
      }`}  >
      <div
        className={`max-w-4xl mx-auto rounded-[30px] p-6 md:p-8 border shadow-sm ${
          darkMode ? "bg-[#161616] border-[#262626] text-white" : "bg-white border-[#ececec] text-gray-800"
        }`} >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-6 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Edit Profile</h1>
            <p className="text-sm text-gray-500 mt-2">
              Update your administrative profile details and profile picture.
            </p>
          </div>
          <button
            onClick={() => setActive("Profile")}
            className={`px-5 py-2.5 rounded-xl font-bold transition shadow-sm ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}  >
            Back to Profile
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div
            className={`flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-[24px] border shadow-sm ${
              darkMode ? "bg-[#1c1c1c] border-[#2c2c2c]" : "bg-gray-50 border-gray-100"
            }`} >
            <div className="relative group">
              {userData.profileImage ? (
                <img
                  src={userData.profileImage}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md transition-transform group-hover:scale-105"
                />
              ) : (
                <img
                  src={profileImg}
                  alt="Default"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md transition-transform group-hover:scale-105"
                />
              )}
              <label className="absolute bottom-0 right-0 bg-[#6f4e37] text-white rounded-full p-2.5 shadow-lg cursor-pointer hover:bg-[#5a3d2b] transition transform hover:scale-110">
                <img src={pencilIcon} alt="Edit" className="w-4 h-4 invert" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProfileFile(e.target.files[0]);
                      setUserData({
                        ...userData,
                        profileImage: URL.createObjectURL(e.target.files[0]),
                      });
                    }
                  }}
                />
              </label>
            </div>
            <div className="text-center sm:text-left mt-2">
              <h3 className="text-xl font-bold">Profile Photo</h3>
              <p className="text-sm text-gray-500 mt-1.5">
                Update your profile picture to customize your Admin Portal avatar.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div
                className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#6f4e37] transition ${
                  darkMode ? "border-[#2c2c2c] bg-[#1c1c1c]" : "border-gray-200 bg-gray-50"
                }`}
              >
                <img src={accountIcon} alt="" className="w-5 h-5 opacity-60 dark:invert" />
                <input
                  type="text"
                  className="w-full outline-none text-sm bg-transparent font-medium"
                  value={userData.fullName}
                  placeholder="Your Full Name"
                  onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Username
              </label>
              <div
                className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#6f4e37] transition ${
                  darkMode ? "border-[#2c2c2c] bg-[#1c1c1c]" : "border-gray-200 bg-gray-50"
                }`}
              >
                <img src={accountIcon} alt="" className="w-5 h-5 opacity-60 dark:invert" />
                <input
                  type="text"
                  className="w-full outline-none text-sm bg-transparent font-medium"
                  value={userData.username}
                  placeholder="Your Username"
                  onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div
                className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#6f4e37] transition ${
                  darkMode ? "border-[#2c2c2c] bg-[#1c1c1c]" : "border-gray-200 bg-gray-50"
                }`}
              >
                <img src={gmailIcon} alt="" className="w-5 h-5 opacity-60" />
                <input
                  type="email"
                  className="w-full outline-none text-sm bg-transparent font-medium"
                  value={userData.email}
                  placeholder="name@example.com"
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <div
                className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#6f4e37] transition ${
                  darkMode ? "border-[#2c2c2c] bg-[#1c1c1c]" : "border-gray-200 bg-gray-50"
                }`}
              >
                <img src={phoneIcon} alt="" className="w-5 h-5 opacity-60 dark:invert" />
                <input
                  type="text"
                  className="w-full outline-none text-sm bg-transparent font-medium"
                  value={userData.phone}
                  placeholder="Your Phone Number"
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Location (Address)
              </label>
              <div
                className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#6f4e37] transition ${
                  darkMode ? "border-[#2c2c2c] bg-[#1c1c1c]" : "border-gray-200 bg-gray-50"
                }`}
              >
                <img src={locationIcon} alt="" className="w-5 h-5 opacity-60 dark:invert" />
                <input
                  type="text"
                  className="w-full outline-none text-sm bg-transparent font-medium"
                  value={userData.address}
                  placeholder="e.g. Geneva, Switzerland"
                  onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Date Of Birth
              </label>
              <div
                className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#6f4e37] transition ${
                  darkMode ? "border-[#2c2c2c] bg-[#1c1c1c]" : "border-gray-200 bg-gray-50"
                }`}
              >
                <img src={cakeIcon} alt="" className="w-5 h-5 opacity-60 dark:invert" />
                <input
                  type="date"
                  className="w-full outline-none text-sm bg-transparent font-medium dark:[color-scheme:dark]"
                  value={userData.dob}
                  onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Gender
              </label>
              <div
                className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#6f4e37] transition ${
                  darkMode ? "border-[#2c2c2c] bg-[#1c1c1c]" : "border-gray-200 bg-gray-50"
                }`} >
                <img src={accountIcon} alt="" className="w-5 h-5 opacity-60 dark:invert" />
                <select
                  className="w-full outline-none text-sm bg-transparent font-medium"
                  value={userData.gender}
                  onChange={(e) => setUserData({ ...userData, gender: e.target.value })} >
                  <option value="" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Select Gender</option>
                  <option value="Male" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Male</option>
                  <option value="Female" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Female</option>
                  <option value="Other" className={darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}>Other</option>
                </select>
              </div>
            </div>
          </div>
          {saveMsg && (
            <div
              className={`p-4 rounded-xl text-center font-bold shadow-sm ${
                saveMsg.startsWith("✓")
                  ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400"
                  : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400"
              }`}  >
              {saveMsg}
            </div>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#6f4e37] hover:bg-[#5a3d2b] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3" >
            {isSaving ? "Saving Updates..." : "Save Profile Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

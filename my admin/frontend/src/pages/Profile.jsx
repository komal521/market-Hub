import React, { useState, useEffect } from "react";
import profileImg from "../assets/b3.jpeg";
import gmailIcon from "../assets/gmail.png";
import phoneIcon from "../assets/telephone.png";
import locationIcon from "../assets/location.png";
import pencilIcon from "../assets/pencil.png";
import accountIcon from "../assets/account.png";
import cakeIcon from "../assets/birthday-cake.png";
import socialIcon from "../assets/social-media.png";
import favouriteIcon from "../assets/favourites.png";
import mobileIcon from "../assets/smartphone-call.png";
import clockIcon from "../assets/clock.png";
import rightArrow from "../assets/right-arrow.png";
import verifiedIcon from "../assets/verified.png";
import showIcon from "../assets/show.png";
const Profile = ({ darkMode, setActive }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [adminSettings, setAdminSettings] = useState({});
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setAdminSettings(data.settings);
        }
      })
      .catch(err => console.log(err));
    fetch("http://localhost:5000/api/users")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.users.length > 0) {
          setAdminUser(data.users[0]);
        }
      })
      .catch(err => console.log(err));
    fetch("http://localhost:5000/api/activities")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setActivities(data);
      })
      .catch(err => console.log(err));
  }, []);

  const name = adminSettings.fullName || (adminUser ? adminUser.fullName : "Admin");
  const email = adminSettings.email || (adminUser ? adminUser.email : "admin@example.com");
  const phone = adminSettings.phone || (adminUser ? adminUser.phone : "N/A");
  const dob = adminUser && adminUser.dob ? new Date(adminUser.dob).toLocaleDateString() : "N/A";
  const gender = adminUser ? adminUser.gender : "N/A";
  const address = adminUser && adminUser.address ? adminUser.address : "22nd Floor, Zodiac Tower, Geneva";
  const image = adminUser && adminUser.profileImage ? `http://localhost:5000/uploads/${adminUser.profileImage}` : profileImg;

  return (
    <div
      className={`p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen
      ${darkMode ? "bg-[#0f0f0f]" : "bg-[#f7f5f2]"}`} >
      <div className="bg-[linear-gradient(135deg,#f3d3b5,#b78457,#6f4e37)] rounded-[30px] p-5 md:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <img src={image} alt=""
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-[#1d1d1d]">
              {name}
              </h1>
            </div>
            <div className="flex flex-wrap gap-5 mt-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <img src={gmailIcon} alt="" className="w-4 h-4" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2">
                <img src={phoneIcon} alt="" className="w-4 h-4" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <img src={locationIcon} alt="" className="w-4 h-4" />
                <span>{address}</span>
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => setActive("Edit Profile")} className="flex items-center justify-center gap-3 bg-[#6f4e37] text-white px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300">
          <img src={pencilIcon} alt="" className="w-4 h-4 brightness-0 invert" />
          <span className="font-semibold text-sm">Edit Profile</span>
        </button>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-7">
        <div className="xl:col-span-2 space-y-6">
          <div className={`rounded-[28px] p-6 border
          ${darkMode
              ? "bg-[#161616] border-[#262626]"
              : "bg-white border-[#ececec]"}`}>
            <div className="flex items-center gap-3 mb-6">
              <img src={accountIcon} alt="" className="w-5 h-5" />
              <div>
                <h2 className="text-xl font-bold">
                  Personal Information
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update your public information and personal identity details.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <img src={accountIcon} alt="" className="w-5 h-5 mt-1" />
                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    Full Name
                  </p>
                  <h3 className="font-semibold mt-1">
                    {name}
                  </h3>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <img src={gmailIcon} alt="" className="w-5 h-5 mt-1" />
                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    Email Address
                  </p>
                  <h3 className="font-semibold mt-1">
                    {email}
                  </h3>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <img src={phoneIcon} alt="" className="w-5 h-5 mt-1" />
                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    Phone Number
                  </p>
                  <h3 className="font-semibold mt-1">
                    {phone}
                  </h3>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <img src={cakeIcon} alt="" className="w-5 h-5 mt-1" />
                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    Date Of Birth
                  </p>
                  <h3 className="font-semibold mt-1">
                    {dob}
                  </h3>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <img src={cakeIcon} alt="" className="w-5 h-5 mt-1" />
                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    Gender
                  </p>
                  <h3 className="font-semibold mt-1">
                    {gender}
                  </h3>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <img src={locationIcon} alt="" className="w-5 h-5 mt-1" />
                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    Office Address
                  </p>
                  <h3 className="font-semibold mt-1">
                    {address}
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`rounded-[28px] border overflow-hidden
            ${darkMode
                ? "bg-[#161616] border-[#262626]"
                : "bg-white border-[#ececec]"}`} >
            <div className="p-6 border-b border-[#ececec]">
              <div className="flex items-center gap-3">
                <img src={socialIcon} alt="" className="w-5 h-5" />

                <div>
                  <h2 className="text-xl font-bold">
                    Account Security & Privacy
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Manage your credentials and protect your account.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 flex items-center justify-between border-b border-[#ececec]">
              <div className="flex items-center gap-3">
                <img src={favouriteIcon} alt="" className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-gray-500">
                    Protect account with extra security layer
                  </p>
                </div>
              </div>
              <div className="w-12 h-6 bg-[#6f4e37] rounded-full flex items-center justify-end px-1">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="p-5 flex items-center justify-between border-b border-[#ececec]">
              <div className="flex items-center gap-3">
                <img src={mobileIcon} alt="" className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold">
                    Login Activity Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive alerts for account logins
                  </p>
                </div>
              </div>
              <div className="w-12 h-6 bg-[#6f4e37] rounded-full flex items-center justify-end px-1">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={clockIcon} alt="" className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold">
                    Session History
                  </h3>
                  <p className="text-sm text-gray-500">
                    Currently active sessions on devices
                  </p>
                </div>
              </div>
              <button className="flex items-center justify-center gap-3 bg-[#6f4e37] text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-all duration-300">
                <img src={showIcon} alt="" className="w-3.5 h-3.5 brightness-0 invert" />
                <span className="font-semibold text-xs">Review All</span>
              </button>
            </div>
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between
  gap-3 bg-gradient-to-r from-[#fffdf8] to-[#fff7dd]">
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-[#fff2b8] flex items-center justify-center">
      <img src={verifiedIcon} alt="" className="w-4 h-4"/>
    </div>
    <h3  className="text-black  text-sm sm:text-base  font-bold tracking-wide" >
      ACCOUNT SECURITY SCORE: 98% (EXCELLENT)
    </h3>
  </div>
  <button className="text-[#8b3dff] font-semibold text-sm hover:underline">
    Improve Score
  </button>
</div>
          </div>
        </div>
        <div className="bg-[#fff1c9] rounded-[28px] p-6 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <img src={clockIcon} alt="" className="w-5 h-5" />
            <div>
              <h2 className="text-xl font-bold">
                Activity Timeline
              </h2>
              <p className="text-sm text-gray-600">
                Recent events and security logs
              </p>
            </div>
          </div>
          <div className="space-y-5">
            {activities.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No recent activity</p>
            ) : (
              activities.slice(0, 7).map((act, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#6f4e37]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <img src={clockIcon} alt="" className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">
                      <span className="font-bold">{act.name}</span> {act.text}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="mt-8 flex items-center justify-center gap-3 bg-[#6f4e37] text-white px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 mx-auto">
            <img src={showIcon} alt="" className="w-4 h-4 brightness-0 invert" />
            <span className="font-semibold text-sm">View Complete Activity Log</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
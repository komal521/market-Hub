import { useState, useEffect } from "react";
import profileImg from "../assets/ananaya.jpg";
import accountIcon from "../assets/account.png";
import gmailIcon from "../assets/gmail.png";
import phoneIcon from "../assets/telephone (1).png";
import searchIcon from "../assets/search.png";
import verifiedIcon from "../assets/verified.png";
import lockIcon from "../assets/lock.png";
import starIcon from "../assets/star.png";
import globalIcon from "../assets/global.png";
import clockIcon from "../assets/clock.png";
import databaseIcon from "../assets/database.png";
import laptopIcon from "../assets/laptop.png";
import phoneCallIcon from "../assets/smartphone-call (1).png";
import downIcon from "../assets/down.png";
const ToggleSwitch = ({ checked, onChange }) => (
  <button type="button" onClick={() => onChange(!checked)}
    aria-pressed={checked}
    className={`relative h-5 w-9 rounded-full p-0.5 transition-colors ${
      checked ? "bg-[#d9a63d]" : "bg-gray-300"  }`}>
    <span
      className={`block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
        checked ? "translate-x-4" : "translate-x-0"
      }`}  />
  </button>
);
const IconBox = ({ icon, darkMode }) => (
  <div
    className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center ${
      darkMode ? "bg-[#111827]" : "bg-gray-100"
    }`} >
    <img src={icon} alt="" className="h-4 w-4 object-contain" />
  </div>
);
const detectBrowser = () => {
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("OPR/") || ua.includes("Opera")) return "Opera";
  if (ua.includes("Chrome") && !ua.includes("Chromium")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  return "Browser";
};
const detectDevice = () => {
  const ua = navigator.userAgent;
  let os = "Unknown OS";
  if (ua.includes("Win")) os = "Windows";
  else if (ua.includes("Mac")) os = "MacOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("like Mac")) os = "iOS";
  if (/Mobi|Android/i.test(ua)) return `Mobile (${os})`;
  if (/iPad|Tablet/i.test(ua)) return `Tablet (${os})`;
  return `Desktop (${os})`;
};

const Settings = ({ darkMode }) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [settings, setSettings] = useState({
    fullName: "",
    email: "",
    phone: "",
    language: "English (US)",
    timezone: "PST (UTC -8)",
  });
  const [devices, setDevices] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordMsg, setPasswordMsg] = useState("");
  const [signOutMsg, setSignOutMsg] = useState("");
  useEffect(() => {
    const registerDevice = async () => {
      const browser = detectBrowser();
      const device_info = detectDevice();
      try {
        await fetch("http://localhost:5000/api/settings/devices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ device_info, browser, ip_address: "127.0.0.1" }),
        });
      } catch (e) { /* ignore */ }
    };
    registerDevice();
    fetchSettings();
    fetchDevices();
  }, []);

  const fetchSettings = () => {
    fetch("http://localhost:5000/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
      })
      .catch(err => console.log(err));
  };

  const fetchDevices = () => {
    fetch("http://localhost:5000/api/settings/devices")
      .then(res => res.json())
      .then(data => {
        if (data.success) setDevices(data.devices || []);
      })
      .catch(err => console.log(err));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings })
      });
      const data = await res.json();
      if (data.success) {
        alert("Settings saved successfully! Profile updated.");
      } else {
        alert("Failed to save settings");
      }
    } catch (err) {
      console.log(err);
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  };
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg("New passwords do not match!");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordMsg("Password must be at least 6 characters!");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordMsg("✅ Password updated successfully!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setShowPasswordModal(false), 1500);
      } else {
        setPasswordMsg("❌ " + (data.message || "Failed to update password"));
      }
    } catch (err) {
      setPasswordMsg("❌ Error updating password");
    }
  };
  const handleSignOutOthers = async () => {
    if (!window.confirm("Sign out all other devices?")) return;
    try {
      const res = await fetch("http://localhost:5000/api/settings/devices/others", {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setSignOutMsg("✅ Signed out all other devices!");
        fetchDevices();
        setTimeout(() => setSignOutMsg(""), 3000);
      }
    } catch (err) {
      setSignOutMsg("❌ Failed to sign out other devices");
    }
  };
  const handleSignOut = async () => {
    try {
      const browser = detectBrowser();
      const device_info = detectDevice();
      await fetch("http://localhost:5000/api/settings/devices/signout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_info, browser }),
      });
    } catch (e) {
      console.log(e);
    }
    localStorage.clear();
    alert("Signed out successfully!");
    window.location.href = "http://localhost:5173/login";
  };
  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const pageClass = darkMode ? "bg-[#111827] text-white" : "bg-[#f4f6f8] text-[#111827]";
  const cardClass = darkMode
    ? "bg-[#1f2937] border border-gray-700"
    : "bg-white border border-gray-200";
  const fieldClass = darkMode
    ? "bg-[#111827] border border-gray-700"
    : "bg-[#f8fafc] border border-gray-200";
  const mutedText = darkMode ? "text-gray-400" : "text-gray-500";

  const DevicesList = ({ deviceList }) => (
    <>
      {deviceList.length === 0 ? (
        <div className={`text-xs ${mutedText} py-3 text-center`}>No active devices found.</div>
      ) : (
        deviceList.map((device) => (
          <div key={device.id} className={`mb-3 flex items-center justify-between gap-3 rounded-xl p-3 ${fieldClass}`}>
            <div className="flex min-w-0 items-center gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-xs font-bold">{device.device_info}</h3>
                <p className={`text-[10px] ${mutedText}`}>{device.browser?.toUpperCase()}</p>
              </div>
            </div>
            {device.is_current === 1 && (
              <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700">
                Current
              </span>
            )}
          </div>
        ))
      )}
    </>
  );

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${pageClass}`}>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-normal">Account Settings</h1>
          <p className={`mt-1 text-xs sm:text-sm ${mutedText}`}>
            Manage your personal information, security preferences, and system behavior.
          </p>
        </div>
        <div className={`flex h-10 w-full items-center gap-3 rounded-xl px-4 lg:w-[360px] ${fieldClass}`}>
          <img src={searchIcon} alt="" className="h-4 w-4 opacity-60" />
          <input
            type="text"
            placeholder="Search settings..."
            className="w-full bg-transparent text-sm outline-none"  />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          {/* Profile Information */}
          <section className={`rounded-xl p-5 shadow-sm ${cardClass}`}>
            <div className="mb-5 flex items-start gap-3">
              <img src={accountIcon} alt="" className="mt-0.5 h-5 w-5" />
              <div>
                <h2 className="text-base font-semibold">Profile Information</h2>
                <p className={`text-xs ${mutedText}`}>
                  Personal details and contact information visible across the organization.
                </p>
              </div>
            </div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <img  src={profileImg}  alt=""
                className="h-20 w-20 rounded-full border-4 border-[#d9a63d] object-cover" />
              <div className="min-w-0">
                <h3 className="text-base font-bold">{settings.fullName || "Admin"}</h3>
                <p className={`mt-1 text-xs ${mutedText}`}>
                  Change your profile picture and customize your public identity.
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button className="rounded-lg bg-[#6f4e37] px-4 py-2 text-xs font-semibold text-black">
                    Upload New
                  </button>
                  <button className="rounded-lg px-4 py-2 text-xs font-semibold text-red-500">
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold">Full Name</label>
                <div className={`flex h-10 items-center rounded-lg px-3 ${fieldClass}`}>
                  <input className="w-full bg-transparent text-sm outline-none" placeholder="Your full name" value={settings.fullName || ""} onChange={e => handleSettingsChange("fullName", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold">Email Address</label>
                <div className={`flex h-10 items-center gap-2 rounded-lg px-3 ${fieldClass}`}>
                  <img src={gmailIcon} alt="" className="h-4 w-4" />
                  <input className="w-full bg-transparent text-sm outline-none" placeholder="admin@example.com" value={settings.email || ""} onChange={e => handleSettingsChange("email", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold">Phone Number</label>
                <div className={`flex h-10 items-center gap-2 rounded-lg px-3 ${fieldClass}`}>
                  <img src={phoneIcon} alt="" className="h-4 w-4" />
                  <input className="w-full bg-transparent text-sm outline-none" placeholder="+91 9876543210" value={settings.phone || ""} onChange={e => handleSettingsChange("phone", e.target.value)} />
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => fetchSettings()} className="h-9 rounded-lg px-5 text-xs font-semibold">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="h-9 rounded-lg bg-[#6f4e37] px-5 text-xs font-semibold text-black disabled:opacity-60">
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </section>
          <section className={`rounded-xl p-5 shadow-sm ${cardClass}`}>
            <div className="mb-5 flex items-start gap-3">
              <IconBox icon={databaseIcon} darkMode={darkMode} />
              <div>
                <h2 className="text-base font-semibold">Website Statistics Controls</h2>
                <p className={`text-xs ${mutedText}`}>Manage dynamic counters shown on the Services page.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-semibold">Bookings Count</label>
                <div className={`flex h-10 items-center rounded-lg px-3 ${fieldClass}`}>
                  <input className="w-full bg-transparent text-sm outline-none" placeholder="15K+" value={settings.bookings_count || ""} onChange={e => handleSettingsChange("bookings_count", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold">Average Rating</label>
                <div className={`flex h-10 items-center rounded-lg px-3 ${fieldClass}`}>
                  <input className="w-full bg-transparent text-sm outline-none" placeholder="4.9/5" value={settings.average_rating || ""} onChange={e => handleSettingsChange("average_rating", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold">Services Count</label>
                <div className={`flex h-10 items-center rounded-lg px-3 ${fieldClass}`}>
                  <input className="w-full bg-transparent text-sm outline-none" placeholder="50+" value={settings.services_count || ""} onChange={e => handleSettingsChange("services_count", e.target.value)} />
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={handleSave} disabled={saving} className="h-9 rounded-lg bg-[#6f4e37] px-5 text-xs font-semibold text-black disabled:opacity-60">
                {saving ? "Saving..." : "Save Statistics"}
              </button>
            </div>
          </section>
          <section className={`rounded-xl p-5 shadow-sm ${cardClass}`}>
            <div className="mb-5 flex items-start gap-3">
              <img src={verifiedIcon} alt="" className="mt-0.5 h-5 w-5" />
              <div>
                <h2 className="text-base font-semibold">Security &amp; Authentication</h2>
                <p className={`text-xs ${mutedText}`}>Protect your account with modern security standards.</p>
              </div>
            </div>
            <div className={`flex flex-col gap-3 border-b py-4 sm:flex-row sm:items-center sm:justify-between ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <div className="flex items-center gap-3">
                <IconBox icon={lockIcon} darkMode={darkMode} />
                <div>
                  <h3 className="text-sm font-semibold">Two-Factor Authentication (2FA)</h3>
                  <p className={`text-xs ${mutedText}`}>Add an extra layer of security to your login process.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-start sm:self-center">
                <span className="text-xs font-semibold">{twoFactorEnabled ? "Enabled" : "Disabled"}</span>
                <ToggleSwitch checked={twoFactorEnabled} onChange={setTwoFactorEnabled} />
              </div>
            </div>
            <div className={`flex flex-col gap-3 border-b py-4 sm:flex-row sm:items-center sm:justify-between ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <div className="flex items-center gap-3">
                <IconBox icon={verifiedIcon} darkMode={darkMode} />
                <div>
                  <h3 className="text-sm font-semibold">Password Management</h3>
                  <p className={`text-xs ${mutedText}`}>Update your account password securely.</p>
                </div>
              </div>
              <button onClick={() => { setShowPasswordModal(true); setPasswordMsg(""); }} className={`h-8 rounded-lg px-4 text-xs font-semibold ${fieldClass}`}>Update Password</button>
            </div>
            <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <IconBox icon={starIcon} darkMode={darkMode} />
                <div>
                  <h3 className="text-sm font-semibold">Hardware Security Key</h3>
                  <p className={`text-xs ${mutedText}`}>Use physical keys like YubiKey for maximum security.</p>
                </div>
              </div>
              <button className="h-8 rounded-lg border border-gray-300 px-4 text-xs font-semibold">
                Enterprise Only
              </button>
            </div>
          </section>
          <section className={`rounded-xl p-5 shadow-sm ${cardClass}`}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold">Active Devices</h2>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-semibold text-gray-700">
                {devices.length} Active
              </span>
            </div>
            <DevicesList deviceList={devices} />
            <div className="pt-2">
              <button className={`flex h-9 w-full items-center justify-between rounded-lg px-3 text-xs font-semibold text-black ${
                darkMode ? "bg-[#111827]" : "bg-[#fff7df]"
              }`}>
                View Full History
                <img src={downIcon} alt="" className="h-3 w-3 opacity-80" />
              </button>
              {signOutMsg && <p className={`text-center text-xs mt-2 ${signOutMsg.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>{signOutMsg}</p>}
              <button onClick={handleSignOutOthers} className="mt-4 block w-full text-center text-xs font-semibold text-red-500 hover:underline">
                Sign Out All Other Devices
              </button>
            </div>
          </section>
        </div>
        <aside className="space-y-5">
          <section className={`rounded-xl p-5 shadow-sm ${cardClass}`}>
            <h2 className="mb-5 text-base font-semibold">System Status</h2>
            <div className="space-y-4">
              {[
                { icon: globalIcon, label: "Language", value: settings.language || "English (US)" },
                { icon: clockIcon, label: "Time Zone", value: settings.timezone || "PST (UTC -8)" },
                { icon: databaseIcon, label: "Data Center", value: "US-WEST-2" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <img src={item.icon} alt="" className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  <span className={mutedText}>{item.value}</span>
                </div>
              ))}
            </div>
            <button onClick={handleSignOut} className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white border-0 transition-colors">
              Sign Out
            </button>
          </section>
          <section className={`rounded-xl p-5 shadow-sm ${cardClass}`}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold">Active Devices</h2>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-semibold text-gray-700">
                {devices.length} Active
              </span>
            </div>
            <DevicesList deviceList={devices} />
            <div className="pt-2">
              <button className={`flex h-9 w-full items-center justify-between rounded-lg px-3 text-xs font-semibold text-[#d9a63d] ${
                darkMode ? "bg-[#111827]" : "bg-[#fff7df]"
              }`}>
                View Full History
                <img src={downIcon} alt="" className="h-3 w-3 opacity-80" />
              </button>
              <button onClick={handleSignOutOthers} className="mt-4 block w-full text-center text-xs font-semibold text-red-500 hover:underline">
                Sign Out All Other Devices
              </button>
            </div>
          </section>
        </aside>
      </div>
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={handlePasswordUpdate} className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${darkMode ? "bg-[#1f2937]" : "bg-white"}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Update Password</h2>
              <button type="button" onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-red-500 text-xl font-bold">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#6f4e37] ${darkMode ? "bg-[#111827] border-gray-700 text-white" : "border-gray-200"}`}
                  placeholder="Enter current password" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#6f4e37] ${darkMode ? "bg-[#111827] border-gray-700 text-white" : "border-gray-200"}`}
                  placeholder="Enter new password (min 6 chars)"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#6f4e37] ${darkMode ? "bg-[#111827] border-gray-700 text-white" : "border-gray-200"}`}
                  placeholder="Re-enter new password" />
              </div>
              {passwordMsg && (
                <p className={`text-sm font-medium ${passwordMsg.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>{passwordMsg}</p>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowPasswordModal(false)} className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-[#6f4e37] text-white text-sm font-semibold hover:opacity-90">Update Password</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Settings;

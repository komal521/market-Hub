import { useEffect, useMemo, useState } from "react";
import addIcon from "../assets/add.png";
import searchIcon from "../assets/search.png";
import userIcon from "../assets/user.png";
import pencilIcon from "../assets/pencil (1).png";
import binIcon from "../assets/bin.png";
import viewIcon from "../assets/view.png";
import closeIcon from "../assets/close.png";
import downloadIcon from "../assets/download.png";
import CreateUserForm from "./CreateUserForm";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const Users = ({ darkMode, setActive, setEditData }) => {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewUser, setViewUser] = useState(null);
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      console.log(err);
      alert("Error deleting user");
    }
  };

  const exportPDF = () => {
    if (users.length === 0) { alert("No data available to download"); return; }
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("User Records Full History Report", 14, 18);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}  |  Total Users: ${users.length}`, 14, 26);
    const tableColumn = ["ID", "Name", "Email", "Phone", "Gender", "Status"];
    const tableRows = users.map(u => [u.id, u.fullName, u.email, u.phone, u.gender, u.status || "Active"]);
    autoTable(doc, {
      head: [tableColumn], body: tableRows, startY: 32,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [111, 78, 55], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [252, 251, 248] },
    });
    const fileName = `Users_Full_History_${new Date().toLocaleDateString().replace(/\//g, "-")}.pdf`;
    const pdfBlob = doc.output("blob");
    const formData = new FormData();
    formData.append("report", pdfBlob, fileName);
    fetch("http://localhost:5000/api/reports/save", { method: "POST", body: formData }).catch(console.log);
    if (window.showSaveFilePicker) {
      window.showSaveFilePicker({ suggestedName: fileName, types: [{ description: "PDF Document", accept: { "application/pdf": [".pdf"] } }] })
        .then(h => h.createWritable()).then(w => { w.write(pdfBlob); w.close(); })
        .catch(err => { if (err.name !== "AbortError") doc.save(fileName); });
    } else { doc.save(fileName); }
  };

  const loadUsers = async () => {
    try {
      setLoading(true); setError("");
      const response = await fetch("http://localhost:5000/api/users");
      if (!response.ok) throw new Error("Users API failed");
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      setError("Users load nahi ho paaye. Backend start karo.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadUsers(); }, []);

  const userStats = useMemo(() => {
    const total = users.length;
    const active = users.filter(u => u.status === "Active").length;
    const pending = users.filter(u => u.status === "Pending").length;
    const blocked = users.filter(u => u.status === "Blocked").length;
    return { total, active, pending, blocked };
  }, [users]);

  const progress = (value) => {
    if (!userStats.total) return "0%";
    return `${Math.round((value / userStats.total) * 100)}%`;
  };

  const cards = [
    { title: "Total Users", value: userStats.total.toString().padStart(2, "0"), progress: "100%" },
    { title: "Active Users", value: userStats.active.toString().padStart(2, "0"), progress: progress(userStats.active) },
    { title: "Pending Users", value: userStats.pending.toString().padStart(2, "0"), progress: progress(userStats.pending) },
    { title: "Blocked Users", value: userStats.blocked.toString().padStart(2, "0"), progress: progress(userStats.blocked) },
  ];

  const filtered = users.filter(u =>
    u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${darkMode ? "bg-gray-900" : "bg-[#f8f5ef]"}`}>
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">
        <div>
          <h1 className={`text-3xl sm:text-4xl font-bold ${darkMode ? "text-white" : "text-[#5c4033]"}`}>User Management</h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">Manage all users and organization members</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          <div className={`border rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm w-full sm:w-[280px] ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-[#ececec]"}`}>
            <img src={searchIcon} alt="" className="w-4 h-4 opacity-70" />
            <input type="text" placeholder="Search users..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`bg-transparent outline-none w-full text-sm ${darkMode ? "text-white placeholder-gray-400" : ""}`} />
          </div>
          <button onClick={exportPDF}
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 ${darkMode ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : "bg-white border-gray-200 text-gray-800 hover:shadow-lg"}`}>
            <img src={downloadIcon} alt="" className={`w-4 h-4 ${darkMode ? "invert" : ""}`} />
            <span className="font-medium text-sm">Export</span>
          </button>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-3 bg-[#6f4e37] text-white px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300">
            <img src={addIcon} alt="" className="w-4 h-4 brightness-0 invert" />
            <span className="font-semibold text-sm">Add User</span>
          </button>
        </div>
      </div>
      {!showForm && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {cards.map((card, index) => (
            <div key={index} className="relative overflow-hidden rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-white/20">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#f3d3b5,#b78457,#6f4e37)]" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-xs tracking-[2px] text-white/80 font-semibold uppercase">{card.title}</p>
                  <h2 className="text-3xl font-bold text-white mt-4 leading-none">{card.value}</h2>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/90 flex items-center justify-center shadow-lg">
                  <img src={userIcon} alt="" className="w-7 h-7" />
                </div>
              </div>
              <div className="mt-6 relative z-10">
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: card.progress }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showForm && (
        <div className="mb-8">
          <CreateUserForm setShowForm={setShowForm} onUserCreated={loadUsers} editUser={null} />
        </div>
      )}
      {!showForm && (
        <div className={`rounded-[26px] p-4 shadow-sm sm:p-5 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#1f2937]"}`}>Registered Users</h2>
              <p className="text-xs text-gray-400">Photo, contact info, role, status and actions.</p>
            </div>
            <span className="text-xs text-gray-400">Showing {filtered.length} of {users.length} users</span>
          </div>
          <div className={`hidden md:grid w-full grid-cols-[64px_1fr_1fr_100px_100px_100px_120px] border-b px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-gray-400 items-center ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
            <span>Photo</span>
            <span>Name</span>
            <span>Email</span>
            <span>Phone</span>
            <span>DOB</span>
            <span>Status</span>
            <span className="text-right pr-4">Actions</span>
          </div>

          <div className="space-y-3 mt-2">
            {loading && (
              <div className={`rounded-2xl border px-4 py-8 text-center text-sm text-gray-500 ${darkMode ? "border-gray-700 bg-gray-700" : "border-gray-100 bg-[#fcfbf7]"}`}>
                Loading users...
              </div>
            )}
            {!loading && error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">{error}</div>
            )}
            {!loading && !error && filtered.length === 0 && (
              <div className={`rounded-2xl border px-4 py-8 text-center text-sm font-semibold text-gray-500 ${darkMode ? "border-gray-700 bg-gray-700" : "border-gray-100 bg-[#fcfbf7]"}`}>
                No users found.
              </div>
            )}
            {!loading && !error && filtered.map((user, index) => (
              <div key={user.id}
                className={`w-full grid grid-cols-1 md:grid-cols-[64px_1fr_1fr_100px_100px_100px_120px] gap-x-2 rounded-2xl border px-4 py-3 shadow-sm md:items-center hover:shadow-md transition-all duration-200 ${darkMode ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-[#fcfbf7] border-gray-100 hover:bg-white"}`}>
                <img
                  src={user.profileImage ? `http://localhost:5000/uploads/${user.profileImage}` : userIcon}
                  alt={user.fullName}
                  className="h-12 w-12 rounded-xl object-cover border-2 border-gray-200 bg-gray-100 p-1"
                />
                <div className="min-w-0">
                  <h3 className={`font-bold truncate ${darkMode ? "text-white" : "text-[#1f2937]"}`}>{user.fullName}</h3>
                  <p className="text-xs text-gray-400 truncate">{user.role || "Member"} · {user.department || "General"}</p>
                </div>
                <span className="text-sm text-gray-500 truncate">{user.email}</span>
                <span className="text-sm text-gray-500 truncate">{user.phone || "—"}</span>
   
                <span className="text-sm text-gray-500 truncate">{user.dob ? new Date(user.dob).toLocaleDateString() : "—"}</span>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                  user.status === "Active" ? "bg-[#c6eadf] text-[#138368]"
                  : user.status === "Blocked" ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-700"
                }`}>
                  {user.status || "Active"}
                </span>
                <div className="flex items-center gap-2 justify-end pr-2">
                  <button onClick={() => setViewUser(user)}
                      className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-blue-100 transition-all" title="View">
                      <img src={viewIcon} alt="View" className="w-4 h-4" />
                    </button>
                   <button onClick={() => {
                        setEditData({
                          ...user,
                          displayedImage: user.profileImage ? `http://localhost:5000/uploads/${user.profileImage}` : userIcon
                        });
                        setActive("Edit User");
                      }}
                      className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-amber-100 transition-all" title="Edit">
                      <img src={pencilIcon} alt="Edit" className="w-4 h-4" />
                    </button>
                  <button onClick={() => deleteUser(user.id)}
                    className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-red-100 transition-all" title="Delete">
                    <img src={binIcon} alt="Delete" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl relative ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
            <button onClick={() => setViewUser(null)} className="absolute top-4 right-4">
              <img src={closeIcon} alt="Close" className={`w-5 h-5 cursor-pointer hover:scale-110 transition-transform ${darkMode ? "invert" : ""}`} />
            </button>
            <h2 className="text-2xl font-bold mb-5 text-[#5c4033]">User Profile</h2>
            <div className="flex flex-col items-center mb-5">
              <img
                src={viewUser.profileImage ? `http://localhost:5000/uploads/${viewUser.profileImage}` : userIcon}
                alt=""
                className="w-24 h-24 rounded-full object-cover border-4 border-[#d6b08c] shadow-md bg-gray-100 p-2" />
              <h3 className={`text-lg font-bold mt-3 ${darkMode ? "text-white" : "text-[#1f2937]"}`}>{viewUser.fullName}</h3>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold mt-1 ${
                viewUser.status === "Active" ? "bg-[#c6eadf] text-[#138368]"
                : viewUser.status === "Blocked" ? "bg-red-100 text-red-600"
                : "bg-yellow-100 text-yellow-700"
              }`}>{viewUser.status || "Active"}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Username", viewUser.username],
                ["Email", viewUser.email],
                ["Phone", viewUser.phone],
                ["Gender", viewUser.gender],
                ["Date of Birth", viewUser.dob],
                ["Department", viewUser.department],
                ["Role", viewUser.role],
                ["Address", viewUser.address],
              ].map(([label, val]) => (
                <div key={label} className={`rounded-xl p-3 ${darkMode ? "bg-gray-700" : "bg-[#f8f5ef]"}`}>
                  <p className="text-xs text-gray-400 uppercase font-semibold">{label}</p>
                  <p className={`font-medium mt-0.5 truncate ${darkMode ? "text-white" : "text-gray-800"}`}>{val || "N/A"}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => {
                  const displayedImg = viewUser.profileImage ? `http://localhost:5000/uploads/${viewUser.profileImage}` : userIcon;
                  setEditData({
                    ...viewUser,
                    displayedImage: displayedImg
                  });
                  setViewUser(null);
                  setActive("Edit User");
                }}
                className="flex-1 bg-[#6f4e37] text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-[#5a3d2b] transition flex items-center justify-center gap-2">
                <img src={pencilIcon} alt="" className="w-4 h-4 brightness-0 invert" />
                Edit User
              </button>
              <button onClick={() => setViewUser(null)}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition ${darkMode ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

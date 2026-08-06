import { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import phoneCall from "../assets/phone-call.png";
import gmail from "../assets/gmail.png";
import location from "../assets/location.png";
import user from "../assets/user.png";
import copy from "../assets/copy.png";
import chat from "../assets/chat.png";
import send from "../assets/send.png";
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [userInfo, setUserInfo] = useState({ phone: "", email: "", address: "", country: "India" });
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user")) || {};
    setUserInfo({
      phone: stored.phone || "+91 98765 43210",
      email: stored.email || "support@shop.com",
      address: stored.address || "Jind, Haryana",
      country: "India",
    });
    if (stored.fullName || stored.email) {
      setFormData(prev => ({
        ...prev,
        name: stored.fullName || "",
        email: stored.email || "",
        phone: stored.phone || "",
      }));
    }
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };
  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required.";
    if (!formData.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Invalid email.";
    if (!formData.message.trim()) errs.message = "Message is required.";
    return errs;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Your message has been sent! We'll get back to you soon.");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        setErrors({});
      } else {
        setErrors({ message: data.message || "Something went wrong." });
      }
    } catch {
      setErrors({ message: "Server error. Please try again later." });
    } finally {
      setSubmitting(false);
    }
  };
  const ErrorMsg = ({ field }) =>
    errors[field] ? <p className="text-red-400 text-sm mt-1 font-medium">{errors[field]}</p> : null;
  return (
    <>
      <Navbar />
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a0a00 0%, #3b1a00 35%, #c8860a 70%, #f5c842 100%)",
          minHeight: "420px",
        }} >
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          <span className="inline-block bg-white backdrop-blur-sm border border-white/20 text-black text-sm font-semibold px-5 py-2 rounded-full mb-6 tracking-wider">
             GET IN TOUCH
          </span>
          <h1
            className="font-bold text-white leading-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }} >
           Contact 
            <span className="block" style={{ color: "#f5c842" }}> us</span>
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="#FAF9F7" />
          </svg>
        </div>
      </section>
      <section className="bg-[#FAF9F7] dark:bg-gray-900 py-0 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 -mt-6">
            {[
              {
                icon: phoneCall,
                label: "Call Us",
                value: userInfo.phone,
                sub: "Mon-Fri, 9am - 6pm",
                color: "#7c3aed",
                bg: "from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40",
              },
              {
                icon: gmail,
                label: "Email Us",
                value: userInfo.email,
                sub: "24/7 Support Available",
                color: "#d97706",
                bg: "from-amber-50 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/40",
              },
              {
                icon: location,
                label: "Visit Our Store",
                value: userInfo.address,
                sub: userInfo.country,
                color: "#059669",
                bg: "from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/40",
              },
            ].map((item) => (
              <div key={item.label}
                className={`bg-gradient-to-br ${item.bg} rounded-3xl p-6 shadow-sm border border-white dark:border-gray-700 flex items-center gap-5 hover:shadow-md transition-all duration-300 hover:-translate-y-1`}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: item.color + "20" }}>
                  <img src={item.icon} alt="" className="w-7 h-7" style={{ filter: `drop-shadow(0 0 2px ${item.color})` }} />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wider uppercase mb-0.5" style={{ color: item.color }}>{item.label}</p>
                  <p className="font-bold text-gray-900 dark:text-white text-base">{item.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#FAF9F7] dark:bg-gray-900 py-16 px-4 md:px-8 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          {successMsg && (
            <div className="mb-8 bg-green-50 border border-green-200 rounded-3xl p-5 flex items-center gap-4">
              <span className="text-3xl">✅</span>
              <div>
                <p className="font-bold text-green-800 text-lg">Message Sent!</p>
                <p className="text-green-600 text-sm mt-0.5">{successMsg}</p>
              </div>
            </div>
          )}
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 items-start">
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white mb-2"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
                Concierge Services
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg leading-relaxed">
                Our dedicated team is ready to assist you with sizing,
                styling, or order inquiries.
              </p>
              <div className="space-y-4">
                {[
                  { q: "What are your shipping options?", a: "We offer standard (5-7 days) and express (2-3 days) shipping across India. Free shipping on orders above ₹1,999." },
                  { q: "Can I return or exchange a product?", a: "Yes, we accept returns within 7 days of delivery for unused items in original packaging." },
                  { q: "How do I track my order?", a: "Once shipped, you'll receive a tracking link via email. You can also check status from your profile page." },
                ].map((faq, i) => (
                  <details key={i}
                    className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden cursor-pointer">
                    <summary className="flex items-center justify-between p-5 font-semibold text-gray-800 dark:text-white text-base list-none">
                      {faq.q}
                      <span className="text-amber-500 text-xl transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="px-5 pb-5 text-gray-500 dark:text-gray-300 text-sm leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
              <div className="mt-8 p-6 rounded-3xl"
                style={{ background: "#6f4e37" }}>
                <p className="text-white font-bold text-lg mb-1">Follow Our Journey</p>
                <p className="text-white/50 text-sm mb-5">Stay updated with new collections & offers</p>
                <div className="flex gap-3">
                  {["Instagram", "Facebook", "LinkedIn"].map((soc) => (
                    <span key={soc}
                      className="px-4 py-2 rounded-full border border-white/20 text-white/70 text-sm hover:bg-white/10 cursor-pointer transition">
                      {soc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
                Send a Message
              </h3>
              <p className="text-gray-400 dark:text-gray-300 text-base mb-8">Fill in the form — we reply within 2 hours.</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">
                      FULL NAME <span className="text-red-400">*</span>
                    </label>
                    <div className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3.5 transition-all duration-200 ${errors.name ? "border-red-400 bg-red-50 dark:bg-red-900/30" : "border-gray-200 dark:border-gray-700 focus-within:border-amber-400 bg-gray-50 dark:bg-gray-900"}`}>
                      <img src={user} alt="" className="w-5 h-5 opacity-50 flex-shrink-0 dark:invert" />
                      <input  type="text" name="name" placeholder="John Doe"
                        value={formData.name} onChange={handleChange}
                        className="w-full bg-transparent outline-none text-gray-800 dark:text-white text-base placeholder:text-gray-400" />
                    </div>
                    <ErrorMsg field="name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">
                      EMAIL ADDRESS <span className="text-red-400">*</span>
                    </label>
                    <div className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3.5 transition-all duration-200 ${errors.email ? "border-red-400 bg-red-50 dark:bg-red-900/30" : "border-gray-200 dark:border-gray-700 focus-within:border-amber-400 bg-gray-50 dark:bg-gray-900"}`}>
                      <img src={gmail} alt="" className="w-5 h-5 opacity-50 flex-shrink-0" />
                      <input type="email" name="email" placeholder="john@example.com"
                        value={formData.email} onChange={handleChange}
                        className="w-full bg-transparent outline-none text-gray-800 dark:text-white text-base placeholder:text-gray-400" />
                    </div>
                    <ErrorMsg field="email" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">
                      PHONE NUMBER
                    </label>
                    <div className="flex items-center gap-3 border-2 border-gray-200 dark:border-gray-700 focus-within:border-amber-400 rounded-xl px-4 py-3.5 bg-gray-50 dark:bg-gray-900 transition-all duration-200">
                      <img src={phoneCall} alt="" className="w-5 h-5 opacity-50 flex-shrink-0 dark:invert" />
                      <input  type="text" name="phone" placeholder="+91 98765 43210"
                        value={formData.phone} onChange={handleChange}
                        className="w-full bg-transparent outline-none text-gray-800 dark:text-white text-base placeholder:text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">
                      SUBJECT
                    </label>
                    <div className="flex items-center gap-3 border-2 border-gray-200 dark:border-gray-700 focus-within:border-amber-400 rounded-xl px-4 py-3.5 bg-gray-50 dark:bg-gray-900 transition-all duration-200">
                      <img src={copy} alt="" className="w-5 h-5 opacity-50 flex-shrink-0 dark:invert" />
                      <input type="text" name="subject" placeholder="Order Inquiry, Return, etc."
                        value={formData.subject} onChange={handleChange}
                        className="w-full bg-transparent outline-none text-gray-800 dark:text-white text-base placeholder:text-gray-400"/>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">
                    YOUR MESSAGE <span className="text-red-400">*</span>
                  </label>
                  <div className={`flex gap-3 border-2 rounded-xl p-4 transition-all duration-200 ${errors.message ? "border-red-400 bg-red-50 dark:bg-red-900/30" : "border-gray-200 dark:border-gray-700 focus-within:border-amber-400 bg-gray-50 dark:bg-gray-900"}`}>
                    <img src={chat} alt="" className="w-5 h-5 opacity-50 mt-1 flex-shrink-0 dark:invert" />
                    <textarea
                      rows="5" name="message" placeholder="Tell us how we can help you..."
                      value={formData.message} onChange={handleChange}
                      className="w-full bg-transparent outline-none resize-none text-gray-800 dark:text-white text-base placeholder:text-gray-400" />
                  </div>
                  <ErrorMsg field="message" />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-amber-500" />
                  <span className="text-sm text-gray-500">
                    I agree to the privacy policy and consent to being contacted.
                  </span>
                </label>
                <button type="submit" disabled={submitting}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 disabled:opacity-60 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.99]"
                  style={{ background: "#6f4e37", backgroundSize: "200%" }} >
                  <img src={send} alt="" className="w-5 h-5 invert" />
                  {submitting ? "Sending..." : "Submit Enquiry"}
                </button>
                <p className="text-center text-sm text-gray-400">
               Secure SSL Encryption • Privacy Guaranteed
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contact;
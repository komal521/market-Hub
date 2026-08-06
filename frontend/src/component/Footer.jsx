import facebookIcon from "../assets/facebook.png";
import instagramIcon from "../assets/instagram.png";
import twitterIcon from "../assets/twitter.png";
import youtubeIcon from "../assets/youtube.png";
import { useNavigate } from "react-router-dom";
import sendIcon from "../assets/send.png";
import { useState } from "react";
import logo from "../assets/logo.png";
const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const handleSubscribe = async () => {
    if (!email) return;
    setStatus("Sending...");
    try {
      const res = await fetch("http://localhost:5000/api/share-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("Email Sent Successfully!");
        setEmail("");
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("Failed. Try again.");
      }
    } catch (err) {
      setStatus("Error. Try again.");
    }
  };
  return (
    <footer className="bg-[#725c4c] border-t border-[#725c4c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          <div>
            <img src={logo} alt="Market Hub Logo"
              className="w-[150px] sm:w-[180px] h-[70px] sm:h-[80px] object-contain mb-4"  />
            <p className="text-gray-200 leading-7 mb-6 text-sm sm:text-base">
              Elevating your daily experience through carefully curated
              premium products and exceptional design.
            </p>
            <div className="flex gap-3 flex-wrap">
              {[facebookIcon, instagramIcon, twitterIcon, youtubeIcon].map(
                (icon, index) => (
                  <div
                    key={index}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-amber-200 flex items-center justify-center cursor-pointer hover:bg-amber-50 transition" >
                    <img src={icon} alt="" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
                  </div>
                )
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-5 text-black">
              Quick Links
            </h3>
            <ul className="space-y-3 text-gray-200 text-sm sm:text-base">
              <li
                onClick={() => navigate("/services")}
                className="hover:text-[#e9e2dd] cursor-pointer transition" >
                Products
              </li>
              <li
                onClick={() => navigate("/categories")}
                className="hover:text-[#e9e2dd] cursor-pointer transition" >
                Categories
              </li>
              <li
                onClick={() => navigate("/about")}
                className="hover:text-[#e9e2dd] cursor-pointer transition"  >
                About
              </li>
              <li
                onClick={() => navigate("/contact")}
                className="hover:text-[#e9e2dd] cursor-pointer transition"  >
                Contact
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-5 text-black">
              Complimentary
            </h3>
            <ul className="space-y-3 text-white text-sm sm:text-base">
              <li onClick={() => navigate("/categories")}
                className="hover:text-amber-200 cursor-pointer transition" >
                View All Categories
              </li>
              <li
                onClick={() => navigate("/home")}
                className="hover:text-amber-200 cursor-pointer transition" >
                Home
              </li>
              <li
                onClick={() => navigate("/about")}
                className="hover:text-amber-200 cursor-pointer transition" >
                About Us
              </li>
              <li  onClick={() => navigate("/contact")}
                className="hover:text-amber-200 cursor-pointer transition" >
                Contact
              </li>
              <li onClick={() => navigate("/privacy-policy")}
                className="hover:text-amber-200 cursor-pointer transition">
                Privacy Policy
              </li>
              <li onClick={() => navigate("/terms-conditions")}
                className="hover:text-amber-200 cursor-pointer transition">
                Terms &amp; Conditions
              </li>
              <li onClick={() => navigate("/shipping-policy")}
                className="hover:text-amber-200 cursor-pointer transition">
                Shipping Policy
              </li>
              <li onClick={() => navigate("/faq")}
                className="hover:text-amber-200 cursor-pointer transition">
                FAQ
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-5 text-gray-900">
              Subscribe
            </h3>
            <p className="text-white mb-4 sm:mb-5 text-sm sm:text-base">
              Get updates about new arrivals and exclusive offers.
            </p>
            <div className="flex border rounded-lg overflow-hidden bg-white">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 outline-none text-sm" />
              <button
                onClick={handleSubscribe}
                className="bg-[#6f4e37] hover:bg-[#5a3d2b] w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center flex-shrink-0 transition" >
                <img  src={sendIcon}
                  alt="send"
                  className="w-4 h-4 sm:w-5 sm:h-5 brightness-0 invert" />
              </button>
            </div>
            {status && (
              <p className="text-sm mt-2 text-amber-200 font-semibold">{status}</p>
            )}
            <div className="mt-5 sm:mt-6 text-white space-y-2 text-sm sm:text-base">
              <p>support@lumina.com</p>
              <p>+91 98765 43210</p>
            </div>
          </div>
        </div>
        <div className="border-t border-amber-900/40 mt-8 sm:mt-10 pt-5 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-black">
          <p className="text-center sm:text-left">© 2026 Market Hub. All Rights Reserved.</p>
          <div className="flex gap-4 sm:gap-5 flex-wrap justify-center">
            <span onClick={() => navigate("/privacy-policy")}
              className="cursor-pointer hover:text-amber-200 transition text-white" >
              Privacy Policy
            </span>
            <span onClick={() => navigate("/terms-conditions")}
              className="cursor-pointer hover:text-amber-200 transition text-white">
              Terms &amp; Conditions
            </span>
            <span onClick={() => navigate("/shipping-policy")}
              className="cursor-pointer hover:text-amber-200 transition text-white">
              Shipping Policy
            </span>
            <span onClick={() => navigate("/faq")}
              className="cursor-pointer hover:text-amber-200 transition text-white">
              FAQ
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
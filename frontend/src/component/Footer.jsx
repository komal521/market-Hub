import facebookIcon from "../assets/facebook.png";
import instagramIcon from "../assets/instagram.png";
import twitterIcon from "../assets/twitter.png";
import youtubeIcon from "../assets/youtube.png";
import arrowIcon from "../assets/right-arrow.png";
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
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
           <img src={logo} alt="Market Hub Logo"
            className="w-[180px] h-[80px] object-contain mb-4"/>
            <p className="text-gray-200 leading-7 mb-6">
              Elevating your daily experience through carefully curated
              premium products and exceptional design. </p>
            <div className="flex gap-3">
              {[facebookIcon, instagramIcon, twitterIcon, youtubeIcon].map(
                (icon, index) => (
                  <div  key={index}
                    className="w-10 h-10 rounded-full border border-amber-200 flex items-center justify-center cursor-pointer hover:bg-amber-50 transition">
                    <img src={icon} alt="" className="w-5 h-5 object-contain"  />
                  </div> )  )}
                  </div>
                   </div>
                    <div>
           <h3 className="text-xl font-semibold mb-5 text-black">
              Quick Links  </h3>
           <ul className="space-y-3 text-gray-200">
              <li onClick={() => navigate("/services")}
               className="hover:text-[#e9e2dd] cursor-pointer">
                Products</li>
              <li onClick={() => navigate("/categories")}
                className="hover:text-[#e9e2dd] cursor-pointer">
                Categories
              </li>
              <li onClick={() => navigate("/about")}
                className="hover:text-[#e9e2dd] cursor-pointer">
                About
              </li>
              <li onClick={() => navigate("/contact")}
               className="hover:text-[#e9e2dd] cursor-pointer">
                Contact
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-5 text-black">
              Complimentary
            </h3>
            <ul className="space-y-3 text-white">
              <li onClick={() => navigate("/categories")}
                className="hover:text-black cursor-pointer">
                View All Categories
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-5 text-gray-900">
              Subscribe </h3>
            <p className="text-white mb-5">
              Get updates about new arrivals and exclusive offers.
            </p>
          <div className="flex border rounded-lg overflow-hidden bg-white">
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 outline-none" />
     <button onClick={handleSubscribe}
      className="bg-[#6f4e37] hover:bg-[#5a3d2b] w-12 h-12 flex items-center justify-center flex-shrink-0">
     <img src={sendIcon} alt="send" className="w-5 h-5 brightness-0 invert mr-4"/>
      </button> </div>
            {status && <p className="text-sm mt-2 text-[#6f4e37] font-semibold">{status}</p>}
            <div className="mt-6 text-white space-y-2">
              <p>support@lumina.com</p>
              <p>+91 98765 43210</p>
            </div>
          </div>
        </div>
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-black">
          <p>© 2026 Lumina. All Rights Reserved.</p>
          <div className="flex gap-5">
            <span className="cursor-pointer hover:text-[#6f4e37]">
              Privacy Policy
            </span>
            <span className="cursor-pointer hover:text-[#6f4e37]">
              Terms & Conditions
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
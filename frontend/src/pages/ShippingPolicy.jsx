import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import carIcon from "../assets/car.png";
import clockIcon from "../assets/clock.png";
import boxIcon from "../assets/box.png";
import searchIcon from "../assets/search.png";
import globalIcon from "../assets/global.png";
import informationIcon from "../assets/information.png";
import verifiedIcon from "../assets/verified.png";
import questionIcon from "../assets/question.png";
import rightArrowIcon1 from "../assets/right-arrow (1).png";
const ShippingPolicy = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(5); 
  const cards = [
    {
      id: 0,
      title: "Order Processing",
      icon: clockIcon,
      desc: "Once your order is placed, our logistics team carefully prepares your package. All orders are typically processed within 1-2 business days, excluding weekends and public holidays."
    },
    {
      id: 1,
      title: "Shipping Time",
      icon: boxIcon,
      desc: "We offer standard delivery options across the country. Expected timelines for standard delivery range from 3-7 business days, depending on your specific location and courier availability."
    },
    {
      id: 2,
      title: "Order Tracking",
      icon: searchIcon,
      desc: "Stay informed every step of the way. Once your order is dispatched, tracking details will be shared via email and SMS so you can monitor your package's journey in real-time."
    },
    {
      id: 3,
      title: "Delivery Coverage",
      icon: globalIcon,
      desc: "Market Hub proudly delivers to multiple regions. We partner with premier logistics providers to ensure our reach extends to both urban centers and remote locations with the same level of care."
    },
    {
      id: 4,
      title: "Delayed Deliveries",
      icon: informationIcon,
      desc: "While we strive for punctuality, delivery times may vary during peak seasons, holidays, or extreme weather events. We appreciate your patience during these rare high-volume periods."
    },
    {
      id: 5,
      title: "Shipping Issues",
      icon: verifiedIcon,
      desc: "Your satisfaction is our priority. If you experience lost, damaged, or significantly delayed packages, please contact our support team immediately for a swift resolution."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <div 
        className="flex flex-col items-center text-center px-4 pt-16 pb-12 sm:pt-20 sm:pb-16"
        style={{ background: "linear-gradient(180deg, #f9f5f0 0%, #e8d5be 30%, #c49a6c 70%, #a0672c 100%)" }}
      >
        <div className="w-16 h-16 rounded-full bg-[#8b5a2b] flex items-center justify-center mb-6 shadow-md border-2 border-white/20">
          <img src={carIcon}  alt="Shipping"
            className="w-8 h-8 object-contain brightness-0 invert"  />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight font-serif">
          Shipping Policy
        </h1>
        <p className="text-gray-700 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          We strive to deliver your Market Hub treasures with the utmost care and
          efficiency. Learn about our shipping process, delivery timelines, and order
          tracking information below.
        </p>
      </div>
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {cards.map((card) => {
            const isActive = activeIndex === card.id;
            return (
              <div
                key={card.id}
                onClick={() => setActiveIndex(card.id)}
                style={isActive ? { background: "linear-gradient(135deg, #f9f5f0 0%, #e8d5be 50%, #c49a6c 100%)" } : {}}
                className={`rounded-2xl p-6 sm:p-8 cursor-pointer transition-all duration-300 ${
                  isActive 
                    ? "border border-[#c49a6c]/40 shadow-md transform scale-[1.01]" 
                    : "bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"
                }`} >
                <div className="w-11 h-11 rounded-xl bg-gray-950 flex items-center justify-center mb-5 shadow-sm">
                  <img   src={card.icon} alt={card.title}
                    className="w-5 h-5 object-contain brightness-0 invert" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-serif">
                  {card.title}
                </h2>
                <p className={`text-sm sm:text-base leading-relaxed transition-colors duration-300 ${isActive ? "text-gray-800 font-medium" : "text-gray-500"}`}>
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-12 sm:mt-16 bg-[#FAF6F0] rounded-2xl p-6 sm:p-8 border border-[#e8dcc4] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-col sm:flex-row text-center sm:text-left">
            <div className="w-14 h-14 rounded-full bg-[#8b5a2b] flex items-center justify-center shadow-sm flex-shrink-0">
              <img src={questionIcon}  alt="Help"
                className="w-7 h-7 object-contain brightness-0 invert"  />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-serif">
                Need help with your shipment?
              </h3>
              <p className="text-gray-500 text-sm sm:text-base mt-1">
                Our dedicated support team is available 24/7 to assist with your order.
              </p>
            </div>
          </div> 
          <button   onClick={() => navigate("/contact")}
            className="flex items-center gap-2 bg-[#8b5a2b] hover:bg-[#724a23] text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all duration-200 cursor-pointer w-full md:w-auto justify-center"  >
            Contact Support
            <img  src={rightArrowIcon1}  alt="Arrow"
              className="w-4 h-4 object-contain brightness-0 invert" />
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingPolicy;

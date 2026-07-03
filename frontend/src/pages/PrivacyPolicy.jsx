import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import informationIcon from "../assets/information.png";
import checkedIcon from "../assets/checked.png";
import lockIcon from "../assets/lock.png";
import phoneCallIcon from "../assets/phone-call.png";
import gmailIcon from "../assets/gmail.png";
import rightArrowIcon from "../assets/right-arrow.png";
import verifiedIcon from "../assets/verified.png";
const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div
        className="text-center px-5 py-14 sm:py-16"
        style={{ background: "linear-gradient(135deg, #8B6B4A 0%, #C49A6C 100%)" }} >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-white/85 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          At Market Hub, your privacy is our priority. This policy outlines how we
          handle your personal data with transparency, integrity, and security.
        </p>
      </div>
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-10 sm:py-14">
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 sm:p-7 mb-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-11 h-11 min-w-[44px] rounded-full bg-neutral-900 flex items-center justify-center">
              <img src={informationIcon} alt="info" className="w-5 h-5 object-contain brightness-0 invert" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-teal-700">Information We Collect</h2>
          </div>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            We collect personal identifiers such as your name, shipping address, and email when
            you create an account or make a purchase. Additionally, we automatically gather
            technical data including your IP address and browsing behavior to optimize your
            marketplace experience and ensure platform security.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 sm:p-7 mb-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-11 h-11 min-w-[44px] rounded-full bg-neutral-900 flex items-center justify-center">
              <img src={informationIcon} alt="how we use" className="w-5 h-5 object-contain brightness-0 invert" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-teal-700">How We Use Your Information</h2>
          </div>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-3">
            Market Hub utilizes your data strictly to facilitate transactions and improve our service quality.
          </p>
          <ul className="flex flex-col gap-3">
            {[
              "Processing and fulfilling your orders accurately and efficiently.",
              "Communicating essential updates regarding your account or policy changes.",
              "Personalizing your shopping feed to highlight relevant products and local sellers.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-500 text-sm sm:text-base leading-relaxed">
                <span className="w-6 h-6 min-w-[24px] rounded-full bg-teal-50 flex items-center justify-center mt-0.5">
                  <img src={checkedIcon} alt="check" className="w-3.5 h-3.5 object-contain"
                    style={{ filter: "invert(40%) sepia(80%) saturate(400%) hue-rotate(130deg)" }} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 sm:p-7 mb-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-11 h-11 min-w-[44px] rounded-full bg-neutral-900 flex items-center justify-center">
              <img src={lockIcon} alt="lock" className="w-5 h-5 object-contain brightness-0 invert" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-teal-700">Data Security</h2>
          </div>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            Your data is protected by industry-standard AES-256 encryption during transmission
            and storage. We implement strict internal access controls and conduct regular security
            audits to prevent unauthorized access, disclosure, or alteration of your personal
            information. We never store full credit card details on our local servers.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 sm:p-7 mb-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-11 h-11 min-w-[44px] rounded-full bg-neutral-900 flex items-center justify-center">
              <img src={phoneCallIcon} alt="contact" className="w-5 h-5 object-contain brightness-0 invert" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-teal-700">Contact Us</h2>
          </div>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-4">
            Have questions or concerns about your privacy rights? Our dedicated security team is
            available to assist you with data requests or policy inquiries.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button  onClick={() => (window.location.href = "mailto:privacy@markethub.com")}
              className="flex items-center gap-2 bg-[#c17f3d] hover:bg-[#a0672c] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors duration-200 cursor-pointer" >
              <img src={gmailIcon} alt="gmail" className="w-5 h-5 object-contain" />
              Email Privacy Support
            </button>
            <span className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              privacy@markethub.com
              <img src={rightArrowIcon} alt="arrow" className="w-3.5 h-3.5 object-contain opacity-50" />
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-neutral-900 text-white rounded-xl px-5 py-4 flex-wrap">
          <img src={verifiedIcon} alt="verified" className="w-5 h-5 object-contain brightness-0 invert flex-shrink-0" />
          <span className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Market Hub is compliant with global data protection standards (GDPR &amp; CCPA).
            Last updated: October 2026.
          </span>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

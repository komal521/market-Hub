import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import verifiedIcon from "../assets/verified.png";
import userIcon from "../assets/user.png";
import creditCardIcon from "../assets/credit-card (1).png";
import productReturnIcon from "../assets/product-return.png";
import rightArrowIcon from "../assets/right-arrow (1).png";
import checkMarkIcon from "../assets/check-mark.png";
import telephoneIcon from "../assets/telephone (1).png";
import gmailIcon from "../assets/gmail.png";
import fileIcon from "../assets/file (1).png";
import informationIcon from "../assets/information.png";
import sendIcon from "../assets/send.png";
const TermsConditions = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div
        className="text-center px-5 py-14 sm:py-16"
        style={{ background: "linear-gradient(180deg, #f9f5f0 0%, #e8d5be 30%, #c49a6c 70%, #a0672c 100%)" }}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Terms &amp; Conditions
        </h1>
        <p className="text-gray-700 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Please read these terms carefully before using the Market Hub platform.
          By accessing our services, you agree to be bound by the following guidelines.
        </p>
      </div>
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-7 lg:p-9 mb-5">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-11 h-11 min-w-[44px] rounded-full bg-neutral-900 flex items-center justify-center">
                <img src={verifiedIcon} alt="verified" className="w-5 h-5 object-contain brightness-0 invert" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            </div>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              By accessing and using the Market Hub website ("Site") and its related services, you
              acknowledge that you have read, understood, and agreed to be legally bound by these
              Terms and Conditions. If you do not agree to these terms, please refrain from using
              our services immediately. Market Hub reserves the right to update these terms at any
              time without prior notice.
            </p>
          </div>
          <hr className="border-gray-100 mb-8" />
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-11 h-11 min-w-[44px] rounded-full bg-neutral-900 flex items-center justify-center">
                <img src={userIcon} alt="user" className="w-5 h-5 object-contain brightness-0 invert" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">2. User Responsibilities</h2>
            </div>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-3">
              To ensure a safe and secure shopping environment for all customers, every user of
              Market Hub must adhere to the following commitments:
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "Maintain the confidentiality of your account credentials and restrict access to your computer or mobile devices.",
                "Provide accurate, current, and complete information during the registration and checkout process.",
                "Abstain from using the platform for any fraudulent activity, unauthorized commercial solicitations, or malicious interference.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-500 text-sm sm:text-base leading-relaxed">
                  <span className="w-6 h-6 min-w-[24px] rounded-full bg-teal-50 flex items-center justify-center mt-0.5">
                    <img src={checkMarkIcon} alt="check" className="w-3.5 h-3.5 object-contain"
                      style={{ filter: "invert(40%) sepia(80%) saturate(400%) hue-rotate(130deg)" }} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <hr className="border-gray-100 mb-8" />
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-11 h-11 min-w-[44px] rounded-full bg-neutral-900 flex items-center justify-center">
                <img src={creditCardIcon} alt="credit card" className="w-5 h-5 object-contain brightness-0 invert" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">3. Orders &amp; Payments</h2>
            </div>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              All orders placed through Market Hub are subject to product availability and price
              confirmation at the time of purchase. We use secure third-party payment gateways to
              process transactions. Prices are subject to change without notice, but changes will
              not affect orders that have already been confirmed. We reserve the right to refuse any
              order placed with us at our sole discretion.
            </p>
          </div>
          <hr className="border-gray-100 mb-8" />
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-11 h-11 min-w-[44px] rounded-full bg-neutral-900 flex items-center justify-center">
                <img src={productReturnIcon} alt="product return" className="w-5 h-5 object-contain brightness-0 invert" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">4. Returns &amp; Refunds</h2>
            </div>
            <div
              className="rounded-2xl px-6 py-6 sm:px-8 sm:py-7 text-sm sm:text-base leading-relaxed"
              style={{ background: "linear-gradient(135deg, #a0672c 0%, #c17f3d 100%)" }} >
              <p className="text-white font-medium mb-4">
                We strive for 100% satisfaction. If you are not happy with your purchase, you may
                return items within <strong>30 days of delivery</strong> for a full refund or exchange.
                Items must be in their original packaging, unused, and in the same condition that
                you received them. Please note that certain perishable or personalized goods are
                exempt from being returned.
              </p>
              <button
                className="flex items-center gap-2 text-white font-semibold text-sm hover:underline transition" >
                View Detailed Refund Policy
                <img src={rightArrowIcon} alt="arrow" className="w-3.5 h-3.5 object-contain brightness-0 invert" />
              </button>
            </div>
          </div>
          <hr className="border-gray-100 mb-8" />
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-11 h-11 min-w-[44px] rounded-full bg-neutral-900 flex items-center justify-center">
                <img src={checkMarkIcon} alt="check mark" className="w-5 h-5 object-contain brightness-0 invert" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">5. Limitation of Liability</h2>
            </div>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              Market Hub and its affiliates shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, including without limitation, loss of profits, data,
              use, goodwill, or other intangible losses, resulting from your access to or use of (or
              inability to access or use) the platform. Our total liability for any claim arising out
              of these terms shall not exceed the amount paid by you for the specific service or
              product in question.
            </p>
          </div>
          <hr className="border-gray-100 mb-8" />
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-11 h-11 min-w-[44px] rounded-full bg-neutral-900 flex items-center justify-center">
                <img src={telephoneIcon} alt="telephone" className="w-5 h-5 object-contain brightness-0 invert" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">6. Contact Information</h2>
            </div>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-5">
              Have questions or concerns about these terms? Reach out to our support team — we&apos;re
              here to help you every step of the way.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email Support */}
              <div className="flex flex-col gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2">
                  <img src={gmailIcon} alt="gmail" className="w-5 h-5 object-contain" />
                  <span className="font-semibold text-gray-800 text-sm">Email Support</span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">Typically replies within 24 hours</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => (window.location.href = "mailto:support@markethub.com")}
                    className="w-9 h-9 min-w-[36px] bg-[#c17f3d] hover:bg-[#a0672c] rounded-lg flex items-center justify-center transition-colors duration-200 cursor-pointer"  >
                    <img src={sendIcon} alt="send" className="w-4 h-4 object-contain brightness-0 invert" />
                  </button>
                  <span className="text-gray-700 font-semibold text-sm">support@markethub.com</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2">
                  <img  src={telephoneIcon}  alt="telephone"  className="w-5 h-5 object-contain"
                    style={{ filter: "invert(40%) sepia(80%) saturate(400%) hue-rotate(130deg)" }}  />
                  <span className="font-semibold text-gray-800 text-sm">Contact Support</span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">Mon - Fri | 9am - 6pm EST</p>
                <span className="text-[#c17f3d] font-semibold text-sm">© 2026 MARKET HUB</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-5 bg-neutral-900 text-white rounded-xl px-5 py-4 mt-2">
          <button
            onClick={() => navigate("/privacy-policy")}
            className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-amber-300 transition font-medium" >
            <img src={fileIcon} alt="file" className="w-3.5 h-3.5 object-contain brightness-0 invert opacity-70" />
            Privacy Policy
          </button>
          <span className="text-gray-600 hidden sm:inline">|</span>
          <button className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-amber-300 transition font-medium">
            <img src={verifiedIcon} alt="security" className="w-3.5 h-3.5 object-contain brightness-0 invert opacity-70" />
            Security Elements
          </button>
          <span className="text-gray-600 hidden sm:inline">|</span>
          <button className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-amber-300 transition font-medium">
            <img src={informationIcon} alt="faqs" className="w-3.5 h-3.5 object-contain brightness-0 invert opacity-70" />
            FAQs
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsConditions;

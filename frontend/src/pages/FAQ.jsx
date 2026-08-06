import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import questionIcon from "../assets/question.png";
import searchIcon from "../assets/search.png";
import downArrowIcon from "../assets/down-arrow.png";
import musicalNoteIcon from "../assets/musical-note (1).png";
import rightArrowIcon from "../assets/right-arrow (1).png";
const faqs = [
  {
    id: 0,
    question: "How do I place an order?",
    answer:
      "Placing an order is simple. Browse our curated marketplace, add your desired items to the cart, and proceed to checkout. You'll need to provide shipping details and choose your preferred payment method to finalize the purchase.",
  },
  {
    id: 1,
    question: "What payment methods are accepted?",
    answer:
      "We accept a wide range of payment methods including credit/debit cards (Visa, MasterCard, RuPay), UPI, net banking, and popular wallets. All transactions are secured with industry-standard encryption.",
  },
  {
    id: 2,
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you will receive an email and SMS with a tracking number. You can use this number on our website or the courier partner's website to track your package in real-time.",
  },
  {
    id: 3,
    question: "What is your return policy?",
    answer:
      "We offer a hassle-free 7-day return policy for most products. Items must be unused, in original packaging, and accompanied by the invoice. Please contact our support team to initiate a return request.",
  },
  {
    id: 4,
    question: "How do I contact customer support?",
    answer:
      "You can reach our dedicated support team via the Contact page, by email at support@markethub.com, or by phone at +91 98765 43210. We're available 24/7 to assist you with any queries.",
  },
];
const FAQ = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const toggleFaq = (id) => {
    setOpenIndex((prev) => (prev === id ? null : id));
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <div
        className="flex flex-col items-center text-center px-4 pt-16 pb-12 sm:pt-20 sm:pb-16"
        style={{
          background:
            "linear-gradient(180deg, #f9f5f0 0%, #e8d5be 30%, #c49a6c 70%, #a0672c 100%)",
        }}  >
        <div className="w-16 h-16 rounded-full bg-[#8b5a2b] flex items-center justify-center mb-6 shadow-md border-2 border-white/20">
          <img
            src={questionIcon}
            alt="FAQ"
            className="w-8 h-8 object-contain brightness-0 invert" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight font-serif">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-700 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Find quick answers to common questions about Market Hub and our
          shopping experience.
        </p>
      </div>
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3 gap-3 focus-within:border-[#c49a6c] focus-within:ring-2 focus-within:ring-[#c49a6c]/20 transition-all duration-200">
            <img
              src={searchIcon}
              alt="Search"
              className="w-5 h-5 object-contain opacity-50 flex-shrink-0"   />
            <input
              type="text"
              placeholder="Search your question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"/>
          </div>
        </div>
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg font-medium">No results found.</p>
              <p className="text-sm mt-1">Try searching with different keywords.</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openIndex === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "border-[#c49a6c] shadow-md"
                      : "border-gray-100 shadow-sm hover:border-gray-200 hover:shadow" }`}  >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 text-left gap-4 group cursor-pointer" >
                    <span
                      className={`text-sm sm:text-base font-semibold transition-colors duration-200 ${
                        isOpen
                          ? "text-[#8b5a2b]"
                          : "text-gray-800 group-hover:text-[#8b5a2b]"
                      }`} >
                      {faq.question}
                    </span>
                    <img src={downArrowIcon}  alt="Toggle"
                      className={`w-4 h-4 object-contain flex-shrink-0 opacity-60 transition-transform duration-300 ${
                        isOpen ? "rotate-180 opacity-100" : ""
                      }`} />
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                    } overflow-hidden`}  >
                    <p className="px-5 sm:px-6 pb-5 text-sm sm:text-base text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="mt-12 sm:mt-16 bg-[#FAF6F0] rounded-2xl p-6 sm:p-8 border border-[#e8dcc4] flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#8b5a2b] flex items-center justify-center shadow-sm">
            <img
              src={musicalNoteIcon}
              alt="Note"
              className="w-7 h-7 object-contain brightness-0 invert" />
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-serif">
              Still have questions?
            </h3>
            <p className="text-gray-500 text-sm sm:text-base mt-1 max-w-sm mx-auto">
              Can't find the answer you're looking for? Please chat with our
              friendly team.
            </p>
          </div>
          <button
            onClick={() => navigate("/contact")}
            className="flex items-center gap-2 bg-[#8b5a2b] hover:bg-[#724a23] text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all duration-200 cursor-pointer mt-1" >
            Contact Support
            <img  src={rightArrowIcon}
              alt="Arrow"
              className="w-4 h-4 object-contain brightness-0 invert"  />
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;

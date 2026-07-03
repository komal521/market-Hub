import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import a1 from "../assets/a1.webp";
import a2 from "../assets/a2.png";
import targetIcon from "../assets/target.png";
import visionIcon from "../assets/light-bulb.png";
import trustIcon from "../assets/checked.png";
import qualityIcon from "../assets/medal.png";
import innovationIcon from "../assets/star (1).png";
import supportIcon from "../assets/musical-note (1).png";
import u1 from "../assets/u1.avif";
import u2 from "../assets/u2.webp";
import u3 from "../assets/u3.avif";
import twitterIcon from "../assets/twitter.png";
import starIcon from "../assets/star (1).png";
import React, { useState } from "react";
const About = () => {
  const [activeCard, setActiveCard] = useState(0);
  const cards = [
  {
    icon: trustIcon,
    title: "Unyielding Trust",
    description:
      "Our commitment to security and transparency ensures your business data and goals are always protected.",
  },
  {
    icon: qualityIcon,
    title: "Premium Quality",
    description:
      "We don't settle for good enough. Every pixel and line of code is meticulously inspected for perfection.",
  },
  {
    icon: innovationIcon,
    title: "Rapid Innovation",
    description:
      "Agile methodologies allow us to push cutting-edge solutions faster than the competition.",
  },
  {
    icon: supportIcon,
    title: "Elite Support",
    description:
      "Our support team is always available to assist with technical queries or strategic plans.",
  },
];
const [activeLeader, setActiveLeader] = useState(1);
const leaders = [
  {
    img: u1,
    name: "Alexander Sterling",
    role: "CEO & Founder",
    desc: "A former tech executive with 15 years of experience in high-end digital strategy.",
  },
  {
    img: u2,
    name: "Isabella Rossi",
    role: "Creative Director",
    desc: "Award-winning designer known for minimalist yet luxurious aesthetics.",
  },
  {
    img: u3,
    name: "Sophie Chen",
    role: "Head of Strategy",
    desc: "A systems architect who believes every pixel should enhance performance.",
  },
];
  return (
    <>
      <Navbar />
      <div className="bg-[#f8f5f2] dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="bg-gradient-to-r from-[#5a3d2b] via-[#6f4e37] to-[#b78457] rounded-3xl p-6 md:p-10 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl animate-fade-in-down">
            <div className="text-white max-w-xl animate-fade-in-left delay-200">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Crafting Premium Digital
                <span className="text-black dark:text-amber-100">
                  {" "}Experiences
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-100 mb-8">
                We create premium digital experiences that blend
                creativity, innovation, and elegance to deliver
                exceptional value to our customers.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => (window.location.href = "/services")}
                  className="bg-white dark:bg-gray-800 text-black dark:text-white px-6 py-3 rounded-full font-semibold hover:scale-105 active:scale-95 duration-200 transition">
                  Explore Products
                </button>
                <button className="bg-white dark:bg-gray-800 text-[#6f4e37] dark:text-[#d7a53f] px-6 py-3 rounded-full font-semibold hover:scale-105 active:scale-95 duration-200 transition">
                  Our Legacy
                </button>
              </div>
            </div>
            <div className="w-full lg:w-auto animate-fade-in-right delay-200">
              <img src={a1} alt="About"
                className="w-full lg:w-[500px] h-[250px] md:h-[350px] object-cover rounded-2xl shadow-lg hover:scale-102 transition-transform duration-500" />
            </div>
          </div>
        </section>
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="animate-zoom-in">
              <img src={a2} alt="Our Story"
                className="w-full h-[300px] md:h-[500px] object-cover rounded-2xl shadow-lg hover:scale-102 transition-transform duration-500" />
            </div>
            <div className="animate-fade-in-right delay-200">
              <span className="text-[#6f4e37] dark:text-[#d7a53f] font-semibold uppercase tracking-wider">
                About Us </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mt-3 mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg mb-4">
                The journey of a thousand miles began with a
                single stitch of perfection. We started with
                a vision to bring premium quality products and
                unforgettable experiences to our customers.
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg mb-8">
                Founded in the heart of innovation, our brand
                continues to evolve while staying true to our
                values of excellence, craftsmanship, and trust.
              </p>
              <div className="flex flex-wrap gap-8 md:gap-12">
                <div>
                  <h3 className="text-4xl font-bold text-[#6f4e37] dark:text-[#d7a53f]">
                    28+
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Years Experience
                  </p>
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-[#6f4e37] dark:text-[#d7a53f]">
                    50K+
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Happy Customers
                  </p>
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-[#6f4e37] dark:text-[#d7a53f]">
                    Global
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Presence
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
<section className="bg-[#f3f3f3] dark:bg-gray-800 transition-colors duration-300 py-12 md:py-16">
  <div className="max-w-7xl mx-auto px-4 md:px-6">
    <div className="grid md:grid-cols-2 gap-6 mb-12">
      <div className="bg-[#6f4e37] dark:bg-[#5a3d2b] border border-gray-300 dark:border-gray-600 rounded-lg p-6 shadow-sm">
        <div className="w-12 h-12 bg-[#6f4e37] dark:bg-[#4a2d1b] rounded-lg flex items-center justify-center mb-4">
          <img src={targetIcon} alt="" className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-[#ffffff] mb-3">
          Our Mission
        </h3>
        <p className="text-white leading-relaxed">
          To redefine luxury shopping by merging timeless elegance
          with modern convenience, ensuring every customer feels
          empowered and distinguished by their choices.
        </p>
      </div>
      <div className="bg-[#6f4e37] dark:bg-[#5a3d2b] border border-gray-300 dark:border-gray-600 rounded-lg p-6 shadow-sm">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
          <img src={visionIcon} alt="" className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-[#ffffff] mb-3">
          Our Vision
        </h3>
        <p className="text-white leading-relaxed">
          To be the global benchmark for digital craftsmanship,
          where technology becomes invisible and only the seamless,
          luxurious user experience remains.
        </p>
      </div>
    </div>
    <div className="bg-white dark:bg-gray-700 dark:border-gray-600 rounded-xl p-6 md:p-10 shadow-sm border">
      <h2 className="text-3xl md:text-5xl font-bold text-center text-black dark:text-white mb-4">
        Why Choose Aura Digital
      </h2>
      <p className="text-center text-[#6f4e37] dark:text-[#d7a53f] text-base md:text-lg mb-10 max-w-4xl mx-auto">
        We combine artistic intuition with data-driven strategy
        to deliver results that exceed expectations.
      </p>
   <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
  {cards.map((card, index) => (
    <div
      key={index}
      onClick={() => setActiveCard(index)}
      className={`p-5 rounded-lg cursor-pointer transition-all duration-300 ${
        activeCard === index
          ? "bg-[#6f4e37]"
          : "bg-white dark:bg-gray-800 border dark:border-gray-600 hover:border-gray-400" }`}>
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
          activeCard === index
            ? "bg-white"
            : "bg-[#6f4e37]" }`} >
        <img  src={card.icon}  alt=""  className="w-6 h-6 object-contain" />
      </div>
      <h4 className={`font-bold mb-2 ${   activeCard === index
            ? "text-white"
            : "text-black dark:text-white"  }`}>
        {card.title}
      </h4>
      <p className={`text-sm ${   activeCard === index
            ? "text-white"
            : "text-gray-600 dark:text-gray-400"  }`} >
        {card.description}
      </p>
    </div>
  ))}
</div></div>
  </div>
</section>
<section className="py-14 bg-[#f8f5f2] dark:bg-gray-900 transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-4 md:px-6">
    <h2 className="text-3xl md:text-5xl font-bold text-center text-black dark:text-white mb-3">
      Meet the Leadership
    </h2>
    <p className="text-center text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10">
      The visionaries steering Aura Digital toward the next frontier
      of digital innovation.
    </p>
    <div className="grid md:grid-cols-3 gap-6">
  {leaders.map((leader, index) => (
    <div
      key={index}
      onClick={() => setActiveLeader(index)}
      className={`rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
        activeLeader === index
          ? "bg-[#6f4e37] text-white shadow-lg"
          : "bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-lg"
      }`} >
      <img  src={leader.img}  alt=""
        className={`w-24 h-24 rounded-full object-cover mx-auto mb-4 ${
          activeLeader === index
            ? "border-4 border-white"
            : ""
        }`} />
      <h3 className={`text-xl font-bold ${activeLeader === index ? "text-white" : "text-black dark:text-white"}`}>
        {leader.name}
      </h3>
      <p className={`text-sm font-semibold mb-3 ${
          activeLeader === index
            ? "text-amber-100"
            : "text-[#6f4e37] dark:text-[#d7a53f]"
        }`}  >
        {leader.role}
      </p>
      <p  className={`text-sm mb-4 ${
          activeLeader === index
            ? "text-gray-200"
            : "text-gray-600 dark:text-gray-400"
        }`}>
        {leader.desc}
      </p>
      <div className="flex justify-center gap-3">
        <img src={starIcon} alt="" className="w-5 h-5" />
        <img src={twitterIcon} alt="" className="w-5 h-5" />
      </div>
    </div>
  ))}
</div>
  </div>
</section>
<section className="py-14 bg-[#f8f5f2] dark:bg-gray-900 transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="bg-black dark:bg-gray-800 rounded-3xl p-8 md:p-14 text-center text-white border dark:border-gray-700">
      	<h2 className="text-3xl md:text-5xl font-bold mb-5">
        Join Our Shopping Journey
      </h2>
      <p className="max-w-2xl mx-auto text-gray-200 mb-8">
        Experience the pinnacle of luxury commerce. Create an
        account today for exclusive early access to our seasonal
        collections.
      </p>
      <button
        onClick={() => (window.location.href = "/categories")}
        className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:scale-105 hover:bg-gray-200 transition" >
        Shop Now
      </button>
    </div>
  </div>
</section>
      <Footer />
    </>
  );
};
export default About;
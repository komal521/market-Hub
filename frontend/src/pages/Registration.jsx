import userIcon from "../assets/user.png";
import handleIcon from "../assets/smartphone-call.png";
import gmailIcon from "../assets/gmail.png";
import phoneIcon from "../assets/phone-call.png";
import calendarIcon from "../assets/calendar.png";
import lockIcon from "../assets/padlock.png";
import arrowIcon from "../assets/right-arrow.png";
import googleIcon from "../assets/google (1).png";
import appleIcon from "../assets/mobile-phone.png";
import facebookIcon from "../assets/facebook.png";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
const Registration = () => {
   const [formData, setFormData] = useState({
  fullName: "",
  username: "",
  email: "",
  phone: "",
  gender: "",
  dob: "",
  password: "",
  confirmPassword: "",
});
const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
const handleSubmit = async (e) => {
  e.preventDefault();
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  try {
    const fd = new FormData();
    fd.append("fullName", formData.fullName);
    fd.append("username", formData.username);
    fd.append("email", formData.email);
    fd.append("phone", formData.phone);
    fd.append("gender", formData.gender);
    fd.append("dob", formData.dob);
    fd.append("password", formData.password);
    fd.append("confirmPassword", formData.confirmPassword);
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    if (response.data.success && response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    alert(response.data.message);
    navigate("/home"); 
  } catch (error) {
    console.error(error);
    if (error.response && error.response.data && error.response.data.errors) {
      const errMsgs = Object.values(error.response.data.errors).join("\n");
      alert(errMsgs);
    } else if (error.response && error.response.data && error.response.data.message) {
      alert(error.response.data.message);
    } else {
      alert("Registration Failed. Please try again.");
    }
  }
};
const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f6f6f6] dark:bg-gray-900 transition-colors duration-300 flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-[750px] bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 md:p-10 border border-transparent dark:border-gray-700">
        <h1 className="text-3xl font-bold text-[#222] dark:text-white">
          Create Your Account  </h1>
        <p className="text-gray-500 dark:text-gray-300 mt-2 text-sm">
          Please provide your professional credentials to begin. </p>
        <div className="flex items-center gap-2 mt-8 mb-5">
          <img src={userIcon} alt="" className="w-5 h-5 dark:invert" />
          <h2 className="uppercase text-sm font-semibold tracking-wide dark:text-white">
            Personal Profile
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium dark:text-gray-200">
              Full Name
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-full px-4 h-12 mt-2">
              <img src={userIcon} alt="" className="w-4 h-4 dark:invert" />
              <input type="text" name="fullName" placeholder="Name" onChange={handleChange}
            className="w-full ml-3 outline-none text-sm bg-transparent dark:text-white"/>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium dark:text-gray-200">
              Username / Surname </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-full px-4 h-12 mt-2">
              <img src={userIcon} alt="" className="w-4 h-4 dark:invert" />
              <input type="text" name="username" placeholder="e.g. john_doe" onChange={handleChange}
                 className="w-full ml-3 outline-none text-sm bg-transparent dark:text-white"/>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium dark:text-gray-200">
              Email Address </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-full px-4 h-12 mt-2">
              <img src={gmailIcon} alt="" className="w-4 h-4 dark:invert" />
             <input type="email" name="email" placeholder="name@.com" onChange={handleChange}
             className="w-full ml-3 outline-none text-sm bg-transparent dark:text-white"/>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium dark:text-gray-200">
              Phone Number
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-full px-4 h-12 mt-2">
              <img src={phoneIcon} alt="" className="w-4 h-4 dark:invert" />
             <input type="text" name="phone" placeholder="+1 (555) 000-0000" onChange={handleChange}
            className="w-full ml-3 outline-none text-sm bg-transparent dark:text-white"/>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          <div>
            <label className="text-sm font-medium dark:text-gray-200">
              Gender Identity
            </label>
            <div className="space-y-3 mt-3">
             <div className="space-y-3 mt-3">
      <label className="flex items-center gap-2 text-sm dark:text-gray-300">
    <input type="radio" name="gender" value="Male" onChange={handleChange} />
    Male
  </label>
  <label className="flex items-center gap-2 text-sm dark:text-gray-300">
    <input type="radio" name="gender" value="Female" onChange={handleChange} />
    Female
  </label>
  <label className="flex items-center gap-2 text-sm dark:text-gray-300">
    <input type="radio" name="gender" value="Other" onChange={handleChange} />
    Other
  </label>
          </div>
            </div>
          </div>
          <div>
           <label className="text-sm font-medium dark:text-gray-200">
  Date of Birth
</label>
<div className="flex items-center border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-full px-4 h-12 mt-2">
  <img src={calendarIcon} alt="" className="w-4 h-4 dark:invert" />
  <input type="date" name="dob" value={formData.dob} onChange={handleChange}
    className="w-full ml-3 outline-none text-sm bg-transparent dark:text-white [color-scheme:light] dark:[color-scheme:dark]"/>
</div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-8 mb-5">
          <img src={lockIcon} alt="" className="w-5 h-5 dark:invert" />
          <h2 className="uppercase text-sm font-semibold tracking-wide dark:text-white">
            Security Settings
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
  <label className="text-sm font-medium dark:text-gray-200">Password</label>
  <div className="flex items-center border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-full px-4 h-12 mt-2">
    <img src={lockIcon} alt="" className="w-4 h-4 dark:invert" />
    <input  type="password"  name="password"  placeholder="Password"  onChange={handleChange}
      className="w-full ml-3 outline-none text-sm bg-transparent dark:text-white" />
  </div>
</div>
         <div>
  <label className="text-sm font-medium dark:text-gray-200">Confirm Password</label>
  <div className="flex items-center border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-full px-4 h-12 mt-2">
    <img src={lockIcon} alt="" className="w-4 h-4 dark:invert" />
    <input type="password" name="confirmPassword" placeholder="Confirm Password"
      onChange={handleChange}
      className="w-full ml-3 outline-none text-sm bg-transparent dark:text-white" />
  </div>
</div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 mt-8">
          <label className="flex gap-3 text-sm">
            <input type="checkbox" className="mt-1" />
            <span className="text-gray-600 dark:text-gray-300">
              I accept the Terms of Service and Privacy Policy.
            </span>
          </label>
        </div>
       <button  type="button"  onClick={handleSubmit}
  className="w-full mt-8 h-14 rounded-full bg-[#6f4e37] text-white font-semibold flex items-center justify-center gap-3 hover:opacity-95 transition">
  Create My Premium Account
  <img src={arrowIcon} alt="" className="w-5 h-5" />
       </button>
        <div className="flex items-center my-7">
          <div className="flex-1 border-t"></div>
          <span className="px-4 text-xs text-gray-500 font-medium">
            OR REGISTER WITH
          </span>
          <div className="flex-1 border-t"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button className="border border-gray-300 dark:border-gray-600 dark:text-white h-12 rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <img src={googleIcon} alt="Google" className="w-5 h-5"  />
            Google
          </button>
          <button className="border border-gray-300 dark:border-gray-600 dark:text-white h-12 rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <img src={appleIcon} alt="Apple" className="w-5 h-5 dark:invert"/>
            Apple
          </button>
          <button className="border border-gray-300 dark:border-gray-600 dark:text-white h-12 rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <img src={facebookIcon} alt="Facebook" className="w-5 h-5"/>
            Facebook
          </button>
        </div>
        <p className="text-center text-sm mt-6 text-gray-600 dark:text-gray-400">
          Already a member?
          <Link to="/login" className="font-semibold ml-1 cursor-pointer text-black dark:text-white hover:text-[#6f4e37] dark:hover:text-[#d7a53f] transition">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Registration;
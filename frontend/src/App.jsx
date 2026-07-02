import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registration from "./pages/Registration";
import Home from "./pages/Home";
import About from "./pages/About";
import ProductPage from "./pages/ProductPage";
import Services from "./pages/Services";
import Categories from "./pages/Categories";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import OrderConfirmation from "./pages/OrderConfirmation";
import EditProfile from "./pages/EditProfile";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
         <Route path="/product" element={<ProductPage />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/contact" element={<Contact />}/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
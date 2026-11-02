import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import { useTheme } from "./context/ThemeContext";

// Code Splitting & Performance Optimization using React.lazy (Manual Step 16)
const Registration = lazy(() => import("./pages/Registration"));
const Confirmation = lazy(() => import("./pages/Confirmation"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const MyRegistrations = lazy(() => import("./pages/MyRegistrations"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const { theme } = useTheme();

  return (
    <div className={theme} style={{ minHeight: "100vh" }}>
      <Navbar />
      <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Loading resource...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;

import { Outlet,useLocation  } from "react-router-dom";
import { useState,useEffect } from "react";
import Rolebasednavbar from "../components/common/Rolebasednavbar";
import { useNavigate } from "react-router-dom";
import { getSocket  } from '../../socket'
import { useAuth } from "../components/context/AuthContext";
import { useDispatch } from "react-redux";
import { setDeliveryAddress } from "../redux/cartSlice";
function CustomerLayout() {
   const navigate = useNavigate();
     const { user,loading,customerAddress, customerMobile  } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
 const location = useLocation();
 const dispatch = useDispatch();
useEffect(() => {
  if (!loading && !user) {
    navigate("/"); // go to login page
  }
}, [user, loading, navigate]);

useEffect(() => {
  if (customerAddress?.length > 0) {
    dispatch(setDeliveryAddress({
      address: customerAddress[0],
      mobile: customerMobile
    }));
  }
}, [customerAddress, customerMobile, dispatch]);
  // Hide navbar on product details page
  const hideNavbar  =location.pathname.startsWith("/customer/product/");
  useEffect(() => {
  const handler = (e) => {
    // Ctrl + A opens Admin Login
    if (e.ctrlKey && e.key.toLowerCase() === "a") {
      e.preventDefault(); // prevents browser "select all"
      navigate("login/admin");
    }
  };

  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, [navigate]);
//////soket
 useEffect(() => {
   const socket = getSocket();
    if (user) {
      socket.connect();
      console.log(" Customer socket connected");
    }

    return () => {
      socket.disconnect();
      console.log(" Customer socket disconnected");
    };
  }, [user]);
  return (
    <>
    <div className="flex w-full min-h-screen bg-(--primary) text-(--text) overflow-hidden">


      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
     {!hideNavbar  && <Rolebasednavbar

          setMobileOpen={setMobileOpen}
        />}

        <main className="flex-1 min-w-0 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
    <footer class="bg-gray-900 text-gray-300">
  <div class="max-w-7xl mx-auto px-6 py-12">


    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">


      <div>
        <h2 class="text-4xl font-bold text-white mb-4">Naik's Shop</h2>

      </div>



      <div>
        <h3 class="text-lg font-semibold text-white mb-4">Quick Links</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="#" class="hover:text-white transition">Home</a></li>
          <li><a href="#" class="hover:text-white transition">About Us</a></li>
          <li><a href="#" class="hover:text-white transition">Services</a></li>
          <li><a href="#" class="hover:text-white transition">Contact</a></li>
        </ul>
      </div>


      <div>
        <h3 class="text-lg font-semibold text-white mb-4">Support</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="#" class="hover:text-white transition">FAQs</a></li>
          <li><a href="#" class="hover:text-white transition">Privacy Policy</a></li>
          <li><a href="#" class="hover:text-white transition">Terms & Conditions</a></li>
          <li><a href="#" class="hover:text-white transition">Help Center</a></li>
        </ul>
      </div>

      <div>

        <p class="text-sm leading-relaxed">
          We provide high-quality products tailored to your needs. Discover the world with confidence.
        </p>
      </div>


    </div>


    <div class="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
      © 2026 Naik's Shop. All rights reserved.
    </div>

  </div>
</footer>
</>
  );
}

export default CustomerLayout;

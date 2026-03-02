import React, {useState,useEffect} from "react";
import { NavLink } from "react-router-dom";
import api from '../../api'
import {
  HomeIcon,CheckCircleIcon,XMarkIcon ,ShoppingBagIcon,
  ClipboardDocumentListIcon,NoSymbolIcon,ExclamationTriangleIcon,ClipboardDocumentCheckIcon,PowerIcon,ChartBarIcon,ChevronDownIcon
} from "@heroicons/react/24/outline";
import {useAuth} from '../context/AuthContext'
import {useNavigate} from 'react-router-dom'

function VendorSidebar({ collapsed, mobileOpen, setMobileOpen }) {
  const [lowStockcount, setLowStockcount] = useState(0);
   const { user,setUser, loading }= useAuth();
   const navigate = useNavigate();

  const menuItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 text-base font-medium transition
     ${
       isActive
         ? "bg-(--accent) text-(--primary)"
         : "text-(--text) hover:bg-(--secondary) hover:text-(--accent)"
     }`;
     /////get low stock count
     useEffect(() => {
  const fetchLowStockcount = async () => {
    const res = await api.get("/vendor/lowstock");
    setLowStockcount(res.data.lowStockcount);
  };

  fetchLowStockcount();
  const interval = setInterval(fetchLowStockcount, 30000); // refresh

  return () => clearInterval(interval);
}, []);
  const handlelogout =async()=>{

    await api.post("/users/logout");
    setUser(null);
    navigate("/login/vendor");
  }
  const [productOpen, setProductOpen] = useState(false);
  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
         className={`
    fixed md:static z-50
     bg-(--secondary) border-r border-slate-200
    transform transition-all duration-300 ease-in-out
    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
   ${collapsed ? "md:w-20" : "md:w-80"} w-80
  `}
>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5">
          <div className="flex items-center gap-2">

            <span className="text-lg font-bold font-serif">
                Naik's <span className="text-(--accent)">Shop</span>
              </span>

          </div>

          {/* Close Button (Mobile) */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        {/* Menu */}
        <nav className="py-4 space-y-5">
          <NavLink to="/vendor" end className={menuItemClass} onClick={() => setMobileOpen(false)}>
            <HomeIcon className="w-6 h-6" />
            {!collapsed && "Dashboard"}
          </NavLink>

        {/* <NavLink to="/vendor/productlist" end className={menuItemClass} onClick={() => setMobileOpen(false)}>
            <ClipboardDocumentListIcon className="w-6 h-6" />
            {!collapsed && "MY Product List"}
          </NavLink>
           <NavLink to="/vendor/blockedlist" end className={menuItemClass} onClick={() => setMobileOpen(false)}>
            <NoSymbolIcon  className="w-6 h-6" />
            {!collapsed && "Blocked Products"}
          </NavLink>
           <NavLink to="/vendor/lowstock" end className={menuItemClass} onClick={() => setMobileOpen(false)}>
            <ExclamationTriangleIcon   className={`w-6 h-6 ${
      lowStockcount > 0 ? "text-red-400 animate-pulse" : ""
    }`} />
            {!collapsed && (
    <span
      className={`${
        lowStockcount > 0 ? "text-red-400 font-semibold animate-pulse" : ""
      }`}
    >
      Low Stock Alerts
    </span>
  )}
           {!collapsed && lowStockcount > 0 && (
    <span className="ml-auto relative flex h-5 w-5 items-center justify-center">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-white text-xs font-semibold">
        {lowStockcount}
      </span>
    </span>
  )}
          </NavLink> */}
          <div>
  {/* Parent Menu */}
  <button
    onClick={() => setProductOpen(!productOpen)}
    className={`${menuItemClass} w-full flex items-center justify-between`}
  >
    <div className="flex items-center gap-2">
      <ShoppingBagIcon className="w-6 h-6" />
      {!collapsed && "Products"}
    </div>

    {!collapsed && (
      <ChevronDownIcon
        className={`w-4 h-4 transition-transform ${
          productOpen ? "rotate-180" : ""
        }`}
      />
    )}
  </button>

  {/* Sub Menu */}
  {productOpen && !collapsed && (
    <div className="ml-8 mt-2 space-y-2">      <NavLink
        to="/vendor/productlist"
        end
        className={menuItemClass}
        onClick={() => setMobileOpen(false)}
      >
        <ClipboardDocumentListIcon className="w-5 h-5" />
        My Product List
      </NavLink>

      <NavLink
        to="/vendor/blockedlist"
        end
        className={menuItemClass}
        onClick={() => setMobileOpen(false)}
      >
        <NoSymbolIcon className="w-5 h-5" />
        Blocked Products
      </NavLink>

      <NavLink
        to="/vendor/lowstock"
        end
        className={menuItemClass}
        onClick={() => setMobileOpen(false)}
      >
        <ExclamationTriangleIcon
          className={`w-5 h-5 ${
            lowStockcount > 0 ? "text-white-400" : ""
          }`}
        />

        <span
          className={`${
            lowStockcount > 0
              ? "text-white-400 font-semibold"
              : ""
          }`}
        > Low Stock Alerts
        </span>

        {lowStockcount > 0 && (
          <span className="ml-auto relative flex h-5 w-5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-white text-xs font-semibold">
              {lowStockcount}
            </span>
          </span>
        )}
      </NavLink>
    </div>
  )}
</div>
              <NavLink to="/vendor/vendororder" end className={menuItemClass} onClick={() => setMobileOpen(false)}>
            <ClipboardDocumentCheckIcon className="w-6 h-6" />
            {!collapsed && "Update OrderStatus"}
          </NavLink>
           <NavLink to="/vendor/reports" className={menuItemClass} onClick={() => setMobileOpen(false)}>
                      <ChartBarIcon className="w-6 h-6" />
                      {!collapsed && "Reports"}
                    </NavLink>
     <button onClick={handlelogout} className="text-red-500 md:hidden text-xl p-6 flex items-center gap-3"><PowerIcon className="w-8 h-8" ></PowerIcon><span>Logout</span></button>

        </nav>
      </aside>
    </>
  );
}

export default VendorSidebar;

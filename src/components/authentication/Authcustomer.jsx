import React, { useState } from "react";
import api from "../../api";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function Authcustomer() {
  const navigate = useNavigate();
  const [showpassword, setShowpassword] = useState(true);
  const [signup, setSignup] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    customername: "",
    mobile: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const inputclass =
    "w-full px-4 py-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-(--accent)";
  const { setUser, fetchuser } = useAuth();

  const [errors, setErrors] = useState({});
  const [servermessage, setServermessage] = useState("");
  const [loading, setLoading] = useState(false);
  /////get textbox value
  const handlechange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
    setServermessage("");
  };
  const validation = () => {
    const newErrors = {};
    if (signup && !form.username.trim()) {
      newErrors.username = "username is required";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }
    if (signup) {
      if (!form.customername.trim()) {
        newErrors.customername = "customername is required";
      }
      if (!form.mobile.trim()) {
        newErrors.mobile = "mobile is required";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    if (!validation()) {
      return;
    }
    try {
      setLoading(true);
      const data = signup
        ? {
            username: form.username,
            email: form.email,
            password: form.password,
            customerName: form.customername,
            mobile: form.mobile,
            address: [
              {
                street: form.street,
                city: form.city,
                state: form.state,
                pincode: form.pincode,
              },
            ],
          }
        : {
            email: form.email,
            password: form.password,
          };

      let uri = "/users/login";
      if (signup) {
        uri = "/users/register/customer";
      }
      const response = await api.post(uri, data);
      setServermessage(response.data.message);
      setForm({
        username: "",
        email: "",
        password: "",
        customername: "",
        mobile: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
      });

      if (!signup && response.status === 200) {
        if (response.data.user.role !== "customer") {
          setServermessage("Access denied. Not an customer .");
        } else {
          await fetchuser();
          navigate("/");
        }
      }
    } catch (error) {
      setServermessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative p-4 min-h-screen overflow-hidden bg-blue-200">
      {/* Card */}
      <div
        className="relative z-10 min-h-screen flex items-center
        justify-center md:justify-center px-6"
      >
        <div className="w-full md:w-1/2 flex justify-center">
          <div
            className="w-full max-w-md rounded-xl shadow-2xl
            bg-(--secondary) p-6"
          >
            <h2 className="text-2xl font-semibold text-(--text) mb-1">
              {signup ? "Customer Signup" : "Customer Login"}
            </h2>

            <p className="text-sm text-gray-600 mb-5">
              {signup
                ? "Register to access customer dashboard"
                : "Login to your account"}
            </p>

            <form onSubmit={handlesubmit} className="space-y-4">
              {signup && (
                <>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    placeholder="Username"
                    onChange={handlechange}
                    required
                    className={inputclass}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username}</p>
                  )}

                  <input
                    type="text"
                    name="customername"
                    placeholder="Customer Name"
                    value={form.customername}
                    onChange={handlechange}
                    className={inputclass}
                  />

                  <input
                    type="text"
                    name="mobile"
                    placeholder="Mobile Number"
                    value={form.mobile}
                    onChange={handlechange}
                    className={inputclass}
                  />

                  <input
                    type="text"
                    name="street"
                    placeholder="Street"
                    value={form.street}
                    onChange={handlechange}
                    className={inputclass}
                  />

                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handlechange}
                    className={inputclass}
                  />

                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={form.state}
                    onChange={handlechange}
                    className={inputclass}
                  />

                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={form.pincode}
                    onChange={handlechange}
                    className={inputclass}
                  />
                </>
              )}

              <input
                type="email"
                name="email"
                value={form.email}
                placeholder="email"
                onChange={handlechange}
                required
                className={inputclass}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
              <div className="relative w-full">
                <input
                  type={showpassword ? "password" : "text"}
                  name="password"
                  value={form.password}
                  placeholder="Password"
                  onChange={handlechange}
                  required
                  className={inputclass}
                />
                <button
                  type="button"
                  onClick={() => setShowpassword(!showpassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700"
                >
                  {showpassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-(--accent) px-4 py-3 rounded-md focus:outline-none text-(--secondary) hover:opacity-90 cursor-pointer"
              >
                {loading ? "Please wait..." : signup ? "Signup" : "Login"}
              </button>
              {servermessage && (
                <div className="text-green-600 text-sm text-center bg-green-50 py-2 rounded-md">
                  {servermessage}
                </div>
              )}
            </form>

            <div className="text-center mt-6 text-sm text-gray-700">
              {signup ? "Already have an account?" : "Don't have an account?"}
              <button
                type="button"
                onClick={() => {
                  setSignup((prev) => !prev);
                  setServermessage("");
                  setErrors({});
                }}
                className="ml-2 text-(--accent) font-semibold cursor-pointer"
              >
                {signup ? "Login" : "Signup"}
              </button>
            </div>
            <div className="grid grid-cols-1 justify-items-center gap-2 mt-4">
              <Link to="vendor/">
                <button className="text-sm text-emerald-700 cursor-pointer">
                  Want to sell products? Become a Vendor{" "}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Authcustomer;

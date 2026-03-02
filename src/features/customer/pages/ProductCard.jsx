import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector  } from "react-redux";
import { addToCart,updateQty  } from "../../../redux/cartSlice";
import {useAuth} from '../../../components/context/AuthContext'
import Swal from "sweetalert2";
import { HeartIcon as HeartOutline} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import api from '../../../api'

////share wh
function ProductCard({ product }) {

  const [wishlisted, setWishlisted] = useState(false);
const wishlist = async (id) => {
  try {
    if (wishlisted) {
      await api.delete(`/customer/wishlist/${id}`);
    } else {
      console.log(id);
      await api.post(`/customer/wishlist`, { productId: id });
    }
    setWishlisted(!wishlisted);
  } catch (err) {
    console.log(err);
  }
};
  const outOfStock = product.stock === 0;
  const navigate = useNavigate();
const {user,customerId}  =useAuth();
const dispatch =useDispatch();
const cart = useSelector((state) => state.cart.cart);

const getId = (p) => (typeof p === "object" ? p._id : p);

const cartItem = cart?.items?.find(
  (i) => getId(i.product_id) === product._id
);
const handleNotloggedIn = () => {
  Swal.fire({
    title: "User Not logged in..!!",
    text: "You need to login before this action.",
    icon: "warning",
    showCancelButton: false,
    confirmButtonColor: "#d33",
    // cancelButtonColor: "#3085d6",
    confirmButtonText: "Go to Login Page!"
  }).then((result) => {
    if (result.isConfirmed) {
      navigate(`/login?redirect=${location.pathname}`);
    }
  });
};
const qty = cartItem ? cartItem.quantity : 0;
const handleAdd = (e) => {
  e.stopPropagation();
  if(!user){
    handleNotloggedIn();

    return false;
  }
  dispatch(addToCart({
    user_id: user.user_id,
    customer_id: customerId,
    vendor_id: product.vendor_id,
    product_id: product._id,
    quantity: 1,
     price: product.discountedPrice,
    productName: product.name,
    images: product.images,
  }));
};

const increaseQty = (e) => {
  e.stopPropagation();
  dispatch(updateQty({
    user_id: user.user_id,
    product_id: product._id,
    quantity: qty + 1,
  }));
};

const decreaseQty = (e) => {
  e.stopPropagation();

    dispatch(updateQty({
      user_id: user.user_id,
      product_id: product._id,
      quantity: qty - 1,
    }));

};

  return (

    <div
      className={`bg-white  rounded-2xl shadow-sm p-3 group transition-all duration-300
      ${outOfStock ? "opacity-60 grayscale pointer-events-none" : "hover:shadow-xl hover:-translate-y-1"}`}
    >
      {/* image + discount */}
      <div className="relative overflow-hidden rounded-xl">
        {product.discountPercent > 0 && (
          <span className="absolute top-1 left-1 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-md z-10 shadow">
            {product.discountPercent}% OFF
          </span>
        )}

        {outOfStock && (
          <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-sm">
            Out of Stock
          </span>
        )}

        <img
          src={product.images[0].url || product.images[0]}
          alt={product.name}
          className="h-45 w-full object-cover group-hover:scale-110 transition "
        />
        { user ? (
        <button onClick={() => wishlist(product._id)} className="cursor-pointer text-2xl z-99999 absolute right-2 top-2 bg-white rounded-full px-1 py-1">
          {wishlisted ? (
            <HeartSolid className="w-7 h-7 text-red-500" />
          ) : (
            <HeartOutline className="w-7 h-7 text-gray-600" />
          )}
        </button>
        ) : ( '' ) }
      </div>

      <h3 className="mt-3 font-semibold text-(--dark-teal) line-clamp-2 min-h-12"  onClick={()=>navigate(`/customer/product/${product._id}`)}>
        {product.name}
      </h3>

      <div className="mt-2 flex items-center gap-2">
        <span className="text-lg font-bold text-(--mid-teal)">
          ₹{product.discountedPrice}
        </span>
        {product.discountPercent > 0 && (
          <span className="text-sm text-gray-400 line-through">
            ₹{product.price}
          </span>
        )}
      </div>

      <div className="mt-3">
        {outOfStock ? (
          <button className="w-full bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed">
            Stock Not Available
          </button>
        ) : qty === 0 ? (
         <button onClick={handleAdd} className="w-full bg-(--dark-teal) text-white py-2 rounded-lg">
    Add to Cart
  </button>
        ) : (
          <>
   <div className="flex items-center justify-between border rounded-xl overflow-hidden">
    <button onClick={decreaseQty} className="flex-1 py-2 bg-red-100">−</button>
    <span className="w-12 text-center font-semibold">{qty}</span>
    <button onClick={increaseQty} className="flex-1 py-2 bg-green-100">+</button>
  </div>
<button onClick={() => navigate('/customer/product/cart')} className="w-full bg-(--dark-teal) text-white py-2 rounded-lg mt-3">
    View Cart
  </button>
</>

        )}
      </div>
    </div>

  );
}


export default ProductCard;

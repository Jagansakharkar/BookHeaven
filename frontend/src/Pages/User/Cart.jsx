import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FiShoppingBag } from "react-icons/fi";
import { useSelector, useDispatch } from 'react-redux';
import BackButton from '../../Components/common/BackButton';
import Swal from 'sweetalert2';
import { updateQuantity, removeItem } from '../../store/Cart/cartSlice';
import { fetchCart } from '../../store/Cart/cartThunks';
import Loader from '../../Components/common/Loader';
import { useRemoveFromCart, useUpdateQuantity } from '../../hooks/Cart';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState(null);

  const { cartItems, loading } = useSelector((state) => state.cart);

  const updateItemMutation = useUpdateQuantity();
  const removeFromCartMutation = useRemoveFromCart();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const deleteItem = useCallback(async (bookId) => {
    const result = await Swal.fire({
      title: 'Remove this item?',
      text: "This will remove the book from your cart",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    removeFromCartMutation.mutate(bookId, {
      onSuccess: () => {
        dispatch(removeItem(bookId));
        dispatch(fetchCart());
        Swal.fire({
          icon: 'success',
          title: 'Removed!',
          text: 'The item has been removed from your cart.',
          timer: 1500,
          showConfirmButton: false
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error?.message || 'Failed to remove item',
        });
      }
    });
  }, [dispatch]);

  const handleQuantityChange = useCallback(async (bookId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 5) return;
console.log("quantity:",newQuantity);

    setUpdatingId(bookId);

    updateItemMutation.mutate(
      { bookId, quantity: newQuantity },
      {
        onSuccess: () => {
          dispatch(updateQuantity({ bookId, quantity: newQuantity }));
          dispatch(fetchCart());
          setUpdatingId(null);
        },
        onError: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error?.response?.data?.message || "Failed to update quantity",
          });
          setUpdatingId(null);
        }
      }
    );
  }, [dispatch]);

  const total = cartItems.reduce(
    (acc, item) => acc + item.priceAtAdded * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="bg-gray-900 min-h-screen px-6 py-8">
        <BackButton to="/books" text="Continue Shopping" />
        <div className="flex flex-col items-center justify-center mt-16 text-center">
          <FiShoppingBag className="text-gray-400 text-6xl mb-4" />
          <h1 className="text-3xl font-semibold text-gray-300 mb-2">Your Cart is Empty</h1>
          <p className="text-gray-400 mb-6 max-w-md">
            Looks like you haven't added anything to your cart yet
          </p>
          <button
            onClick={() => navigate('/books')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <BackButton to="/books" text="Continue Shopping" />

        <h1 className="text-3xl font-bold text-gray-100 mb-8">Your Shopping Cart</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-gray-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center"
              >

                {/* Prevent crash if item.book is null */}
                <img
                  src={item.book?.url || "/placeholder.png"}
                  alt={item.book?.title || "Book"}
                  className="w-24 h-32 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-100 line-clamp-2">
                    {item.book?.title || "Unknown Book"}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {item.book?.author || "Unknown Author"}
                  </p>
                  <p className="text-blue-400 font-medium mt-2">
                    ₹{item.priceAtAdded}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.book._id, Number(e.target.value))
                    }
                    className="bg-gray-700 text-white px-3 py-1 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500"
                    disabled={updatingId === item.book._id}
                  >
                    {[1, 2, 3, 4, 5].map(qty => (
                      <option key={qty} value={qty}>{qty}</option>
                    ))}
                  </select>

                  {updatingId === item.book._id ? (
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <button
                      onClick={() => deleteItem(item.book._id)}
                      className="text-red-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-700 transition-colors"
                      aria-label="Remove item"
                    >
                      <MdOutlineDeleteOutline size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}

          </div>

          {/* Order Summary */}
          <div className="bg-gray-800 rounded-xl p-6 h-fit sticky top-4">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal ({cartItems.length} items)</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span className="text-green-400">FREE</span>
              </div>
              <div className="border-t border-gray-700 pt-4 flex justify-between text-lg font-semibold text-gray-100">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/address-confirmation")}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              disabled={updatingId !== null}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

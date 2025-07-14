import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import {
  updateQuantity,
  removeItem
} from '../../store/Cart/cartSlice';

import axios from 'axios';
import { fetchCart } from '../../store/Cart/cartThunks';

export const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userid, token } = useSelector((state) => state.auth);
  const { cartItems, message, loading } = useSelector((state) => state.cart);

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])
  const total = (cartItems || []).reduce((acc, item) => acc + item.price * item.quantity, 0);

  console.log("cartitem", cartItems);

  const deleteItem = async (bookid) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Remove this book from Cart?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Remove it!'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.put(
        `http://localhost:3000/api/cart/remove-from-cart/${bookid}`,
        {},
        headers
      );
      Swal.fire({ icon: 'success', text: "Book removed successfully" });
      dispatch(removeItem(bookid));
      dispatch(fetchCart())
    } catch (error) {
      Swal.fire({ icon: 'error', text: "Error removing book" });
    }
  };

  const handleQuantityChange = (bookid, quantity) => {
    dispatch(updateQuantity({ bookid, quantity }));
    // Optional: You can also sync this with backend here
  };

  return (
    <div className='bg-zinc-900 min-h-screen px-6 py-6'>
    <BackButton to={'/all-books'} text='Back' />

      {loading ? (
        <p className='text-white'>Loading cart...</p>
      ) : cartItems.length === 0 || undefined ? (
        <div className='flex flex-col items-center justify-center mt-32'>
          <h1 className='text-5xl lg:text-6xl font-semibold text-zinc-400'>Empty Cart</h1>
          <img src="/empty-cart.png" alt="empty cart" className='lg:h-[50vh] mt-6' />
        </div>
      ) : (
        <>
          <h1 className='text-4xl font-semibold text-zinc-300 mb-6'>Your Cart</h1>


          {cartItems.map((item) => (
            <div key={item.bookid._id} className='w-full my-4 rounded flex p-4 bg-zinc-800 justify-between items-center'>
              <img src={item.bookid.url} alt='book' className='h-[10vh] object-cover rounded' />

              <div className='w-[50%] px-4'>
                <h1 className='text-2xl text-zinc-100 font-semibold'>{item.bookid.title}</h1>
                <p className='text-sm text-zinc-300'>{item.bookid.desc?.slice(0, 100)}...</p>
              </div>

              <div className='flex items-center gap-4'>
                <select
                  className='bg-zinc-700 text-white px-2 py-1 rounded'
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.bookid._id, Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map(qty => (
                    <option key={qty} value={qty}>{qty}</option>
                  ))}
                </select>

                <h2 className='text-zinc-100 text-xl font-semibold'>
                  ₹{item.price * item.quantity}
                </h2>

                <button
                  className='bg-red-100 text-red-700 border border-red-700 rounded p-2'
                  onClick={() => deleteItem(item.bookid._id)}
                >
                  <MdOutlineDeleteOutline />
                </button>
              </div>
            </div>
          ))}

          <div className='mt-8 w-full flex justify-end'>
            <div className='p-4 bg-zinc-800 rounded w-full max-w-md'>
              <h1 className='text-3xl text-zinc-200 font-semibold mb-2'>Total Amount</h1>
              <div className='flex justify-between text-xl text-zinc-200 mb-4'>
                <h2>{cartItems.length} items</h2>
                <h1>₹{total}</h1>
              </div>
              <button
                className='w-full py-2 px-4 bg-green-500 text-white font-semibold rounded hover:bg-green-600'
                onClick={() => navigate("/address-confirmation")}
              >
                Place your order
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

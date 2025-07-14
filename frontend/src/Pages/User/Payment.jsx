import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import { clearCart } from '../../store/Cart/cartSlice';

export const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Auth info from Redux
  const { userid, token } = useSelector(state => state.auth);

  //  Address & form state
  const [userAddress, setUserAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  //  Axios headers
  const headers = {
    Authorization: `Bearer ${token}`,
    userid,
    'Content-Type': 'application/json',
  };

  // Fetch address on mount
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/get-user-address",
          { headers }
        );
        const data = response.data.data;

        setUserAddress({
          name: data.fullname,
          phone: data.address.phone,
          street: data.address.street,
          city: data.address.city,
          state: data.address.state,
          pincode: data.address.pincode
        });
      } catch (err) {
        console.error("Failed to fetch address", err);
      }
    };

    fetchAddress();
  }, []);

  //  Handle payment submission
  const handlePayment = async () => {
    //  Validate payment method
    if (!paymentMethod) {
      return Swal.fire({
        icon: 'warning',
        title: 'Select Payment Method',
        text: 'Please select a payment method to continue.',
        confirmButtonColor: '#3b82f6',
      });
    }

    //  Validate address
    const isAddressValid = Object.values(userAddress).every(val => val.trim());
    if (!isAddressValid) {
      return Swal.fire({
        icon: 'warning',
        title: 'Incomplete Address',
        text: 'Please ensure all address fields are filled.',
        confirmButtonColor: '#3b82f6',
      });
    }

    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:3000/api/order/place-order',
        { paymentMethod },
        { headers }
      );

      Swal.fire({
        icon: 'success',
        title: 'Payment Successful',
        text: `Your payment via ${paymentMethod} is confirmed!`,
        confirmButtonColor: '#3b82f6',
      }).then(() => {
        dispatch(clearCart());
        navigate(`/order-summary/${res.data.orders[0]._id}`);
      });
    } catch (error) {
      console.error("Payment error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: error.response?.data?.message || error.message,
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-zinc-800 text-white p-6 mt-10 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Complete Your Payment</h2>

      {/* 🏦 Payment Options */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Select Payment Method:</h4>
        <div className="space-y-2">
          {['COD', 'UPI', 'Card'].map(method => (
            <label key={method} className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              {method}
            </label>
          ))}
        </div>
      </div>

      {/* 💳 Submit Button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

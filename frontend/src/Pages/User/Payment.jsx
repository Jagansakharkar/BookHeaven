import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetUserAddress } from "../../hooks/User";
import { usePlaceOrder } from "../../hooks/Order";
import Swal from 'sweetAlert2'
import { useLocation } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, isLoading } = useSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const { address } = location.state || {};
  const placeOrderMutation = usePlaceOrder()
  // const { mutate: placeOrder, isLoading } = usePlaceOrder()
  let [userAddress, setUserAddress] = useState({})
  userAddress = address ? address : []

  // Calculate order total
  const orderTotal = cartItems.reduce(
    (total, item) => total + item.priceAtAdded * item.quantity,
    0
  );

  const handlePayment = async () => {
    // Validate address
    if (!userAddress.street || !userAddress.city || !userAddress.state || !userAddress.pincode || !userAddress.phone) {
      return Swal.fire({ icon: 'error', text: "Please fill in all userAddress fields" });
    }

    try {
      placeOrderMutation.mutate(paymentMethod, address, {
        onSuccess: (response) => {
          const orderId = response.orders[0]._id;
          Swal.fire({ icon: 'success', text: "Order placed successfully!" });
          navigate(`/order-summary/${orderId}`);
        },
        onError: (response) => {
          Swal.fire({ icon: 'error', text: response.message || "Failed to place order" });
        }
      })
    } catch (error) {
      console.error("Error placing order:", error);
      Swal.fire({ icon: 'error', text: error.response?.data?.message || "Failed to place order" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Payment Form */}
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Order</h2>

          {/* Address Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              <span className="text-blue-500 mr-2">📍</span>
              Delivery Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={address.street}
                  onChange={(e) => setUserAddress({ ...address, street: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={address.city}
                  onChange={(e) => setUserAddress({ ...address, city: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={address.state}
                  onChange={(e) => setUserAddress({ ...address, state: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={address.pincode}
                  onChange={(e) => setUserAddress({ ...address, pincode: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={address.phone}
                  onChange={(e) => setUserAddress({ ...address, phone: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              <span className="text-green-500 mr-2">💳</span>
              Payment Method
            </h3>

            <div className="space-y-3">
              {[
                { value: "COD", label: "Cash on Delivery", icon: "💰" },
                { value: "Card", label: "Credit/Debit Card", icon: "💳" },
                { value: "UPI", label: "UPI Payment", icon: "📱" }
              ].map((method) => (
                <div
                  key={method.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === method.value ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
                  onClick={() => setPaymentMethod(method.value)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{method.icon}</span>
                    <div>
                      <h4 className="font-medium">{method.label}</h4>
                      {method.value === "COD" && (
                        <p className="text-sm text-gray-500">Pay when you receive your order</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className={`w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors flex items-center justify-center ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-3">🔄</span>
                Processing Order...
              </>
            ) : (
              "Place Order"
            )}
          </button>
        </div>

        {/* Right Column - Order Summary */}
        <div className="md:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Order Summary</h3>

            {/* Cart Items */}
            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold text-blue-600">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{orderTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₹{(orderTotal * 0.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2">
                <span>Total</span>
                <span>₹{(orderTotal * 1.18).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Payment
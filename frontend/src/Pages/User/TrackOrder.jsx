import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiHome,
  FiPhone,
  FiCalendar,
  FiDollarSign,
  FiShoppingBag,
  FiXCircle
} from 'react-icons/fi';
import { MdOutlineLocalShipping } from 'react-icons/md';

// Components
import Loader from '../../Components/common/Loader';
import BackButton from '../../Components/common/BackButton';
import { useTrackOrder } from '../../hooks/Order';

const TrackOrder = () => {
  const { orderId, bookId } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useTrackOrder(orderId, bookId)

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Out for Delivery': return 'bg-orange-100 text-orange-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString) => {
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100 text-red-500 mb-4">
            <FiXCircle size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/profile/orders')}
            className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const statusSteps = [
    { id: 1, name: 'Placed', icon: <FiPackage />, description: 'Order confirmed' },
    { id: 2, name: 'Shipped', icon: <FiTruck />, description: 'Packed and dispatched' },
    { id: 3, name: 'Out for Delivery', icon: <MdOutlineLocalShipping />, description: 'On its way to you' },
    { id: 4, name: 'Delivered', icon: <FiCheckCircle />, description: 'Successfully delivered' },
  ];

  const currentStatusIndex = statusSteps.findIndex(
    step => step.name === order.data.itemStatus
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <BackButton
          to="/profile/orderHistory"
          text="Back to Orders"
          className="mb-6"
        />

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          {/* Order Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(order.data.itemStatus)}`}>
                    {order.data.itemStatus === 'Delivered' ? <FiCheckCircle size={20} /> :
                      order.data.itemStatus === 'Shipped' ? <FiTruck size={20} /> :
                        order.data.itemStatus === 'Out for Delivery' ? <MdOutlineLocalShipping size={20} /> :
                          order.data.itemStatus === 'Cancelled' ? <FiXCircle size={20} /> :
                            <FiClock size={20} />}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Order #{order.trackingId}</h1>
                    <p className="text-blue-100 mt-1">
                      Placed on {formatDate(order.data.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                <p className="font-medium text-lg">
                  ₹{(order.data.price * order.data.quantity).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Item Details</h2>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="relative">
                <img
                  src={order.data.book.url}
                  alt={order.data.book.title}
                  className="w-32 h-40 object-cover rounded-lg border border-gray-200 shadow-sm"
                />
                {order.data.itemStatus === 'Delivered' && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-md">
                    <FiCheckCircle size={16} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Link
                  to={`/view-book-details/${order.data.book._id}`}
                  className="text-xl font-semibold text-gray-800 hover:text-indigo-600 transition-colors"
                >
                  {order.data.book.title}
                </Link>
                <p className="text-gray-600 mt-1">{order.data.book.author}</p>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                    <FiDollarSign className="text-gray-500" />
                    <span>Price: ₹{order.data.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                    <FiShoppingBag className="text-gray-500" />
                    <span>Quantity: {order.data.quantity}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiHome className="text-indigo-500" /> Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Delivery Address</h3>
                <p className="text-gray-600">
                  {order.address?.name}<br />
                  {order.address?.street}<br />
                  {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Contact</h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <FiPhone className="text-indigo-500" /> {order.address?.phoneno}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Payment Method</h3>
                  <p className="text-gray-600">
                    {order.paymentMethod} ({order.paymentStatus})
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Tracker */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Order Status
            </h2>

            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-5 top-4 h-[calc(100%-2rem)] w-1 bg-gray-200 rounded-full">
                <div
                  className={`absolute top-0 left-0 w-1 rounded-full ${order.data.itemStatus === 'Cancelled' ? 'bg-red-500' : 'bg-indigo-500'
                    }`}
                  style={{
                    height: `${order.data.itemStatus === 'Cancelled' ? '100%' :
                      (currentStatusIndex / (statusSteps.length - 1)) * 100}%`
                  }}
                ></div>
              </div>

              {/* Status Steps */}
              <div className="space-y-8">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  const isCancelled = order.data.itemStatus === 'Cancelled';
                  const isLastStep = index === statusSteps.length - 1;

                  return (
                    <div key={step.id} className="flex gap-4 relative pl-10">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full shadow-sm ${isCancelled ? 'bg-red-100' :
                        isCompleted ? 'bg-indigo-100' : 'bg-gray-100'
                        }`}>
                        <div className={`text-xl ${isCancelled ? 'text-red-500' :
                          isCompleted ? 'text-indigo-500' : 'text-gray-400'
                          }`}>
                          {step.icon}
                        </div>
                      </div>
                      <div className={`pb-6 ${!isLastStep && 'border-b border-gray-100'}`}>
                        <div className="flex items-center gap-2">
                          <h3 className={`font-medium ${isCurrent ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                            {step.name}
                          </h3>
                          {isCurrent && (
                            <span className={`text-xs px-2 py-1 rounded-full ${isCancelled ? 'bg-red-100 text-red-800' : 'bg-indigo-100 text-indigo-800'
                              }`}>
                              {isCancelled ? 'Cancelled' : 'Current'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                        {isCurrent && (
                          <p className="text-sm mt-2">
                            {order.data.itemStatus === 'Delivered' ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <FiCheckCircle size={14} /> Delivered on {formatDate(order.data.updatedAt)}
                              </span>
                            ) : order.data.itemStatus === 'Cancelled' ? (
                              <span className="text-red-600">Order was cancelled</span>
                            ) : (
                              <span className="text-indigo-600">Expected soon</span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about your order, our customer service team is happy to help.
          </p>
          <button className="px-6 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};
export default TrackOrder
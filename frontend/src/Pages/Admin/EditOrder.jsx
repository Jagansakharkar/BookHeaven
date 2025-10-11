import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';

import BackButton from '../../Components/common/BackButton';
import { InputField } from '../../Components/common/InputField';
import { TextAreaField } from '../../Components/common/TextAreaField';
import { SelectField } from '../../Components/common/SelectField';
import { FiPackage, FiCreditCard, FiTruck, FiCheckCircle, FiUser } from 'react-icons/fi';
import { FaBoxOpen, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { useFetchOrderById } from '../../hooks/Order';
import { useUpdateBook } from '../../hooks/Book';
import Loader from '../../Components/common/Loader';

const EditOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const { data: fetchOrders, isLoading, isError } = useFetchOrderById()
  const updateOrderMutation = useUpdateBook()
  // const { mutate: updateOrder, isLoading } = useUpdateBook()

  // useEffect(() => {
  //   const fetchOrder = async () => {
  //     try {
  //       fetchOrders(orderid,
  //         {
  //           onSuccess: (response) => {
  //             setOrderData(response.data);
  //           },
  //           onError: (response) => {
  //             Swal.fire({
  //               icon: 'error',
  //               text: `Failed to fetch order: ${response.message}`,
  //               background: '#1f2937',
  //               color: '#fff',
  //               confirmButtonColor: '#3b82f6'
  //             });
  //           }
  //         }
  //       )

  //     } catch (error) {
  //       Swal.fire({
  //         icon: 'error',
  //         text: `Failed to fetch order: ${error.message}`,
  //         background: '#1f2937',
  //         color: '#fff',
  //         confirmButtonColor: '#3b82f6'
  //       });
  //     }
  //   };
  //   fetchOrder();
  // }, [orderid]);

  const handleChange = (field, value) => {
    setOrderData({ ...orderData, [field]: value });
  };

  const handleUpdate = async () => {
    try {
      updateOrderMutation.mutate(orderId, orderData, {
        onSuccess: (response) => {
          Swal.fire({
            icon: 'success',
            text: response.data.message,
            background: '#1f2937',
            color: '#fff',
            confirmButtonColor: '#3b82f6'
          });
          navigate('/admin/dashboard/orders');
        },
        onError: (response) => {
          Swal.fire({
            icon: 'error',
            text: response.data.message,
            background: '#1f2937',
            color: '#fff',
            confirmButtonColor: '#3b82f6'
          });
        }
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        text: `Error updating order: ${error.message}`,
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  if(isLoading){
    return <Loader/>
  }
  if (!orderData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const address = orderData.address || {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton to="/admin/dashboard/orders" text="Back to Orders" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Order Details</h2>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md overflow-hidden">
          {/* Order Summary */}
          <div className="p-6 border-b border-gray-200 dark:border-zinc-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FiPackage className="text-blue-500 text-xl" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Order Information</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ID: {orderData._id}</p>
                  </div>
                </div>
                <InputField
                  label="User ID"
                  value={orderData.user?._id || ''}
                  disabled
                  icon={<FiUser className="text-gray-400" />}
                />
                <InputField
                  label="Total Amount"
                  value={`₹${orderData.totalAmount.toLocaleString('en-IN')}`}
                  disabled
                  icon={<FiCreditCard className="text-gray-400" />}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaBoxOpen className="text-blue-500 text-xl" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Delivery Details</h3>
                </div>
                <TextAreaField
                  label="Address"
                  value={`${address.name}\n${address.street}\n${address.city}, ${address.state} - ${address.pincode}`}
                  disabled
                  icon={<FaMapMarkerAlt className="text-gray-400" />}
                />
                <InputField
                  label="Phone Number"
                  value={address.phoneno}
                  disabled
                  icon={<FaPhoneAlt className="text-gray-400" />}
                />
                <InputField
                  label="Payment Method"
                  value={orderData.paymentMethod}
                  disabled
                  icon={<FiCreditCard className="text-gray-400" />}
                />
              </div>
            </div>
          </div>

          {/* Order Status Controls */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectField
                label="Payment Status"
                name="paymentStatus"
                value={orderData.paymentStatus}
                onChange={(e) => handleChange('paymentStatus', e.target.value)}
                options={[
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Paid', label: 'Paid' },
                  { value: 'Failed', label: 'Failed' },
                ]}
                icon={<FiCreditCard className="text-gray-400" />}
              />

              <SelectField
                label="Order Status"
                name="status"
                value={orderData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                options={[
                  { value: 'Placed', label: 'Placed' },
                  { value: 'Processing', label: 'Processing' },
                  { value: 'Shipped', label: 'Shipped' },
                  { value: 'Delivered', label: 'Delivered' },
                  { value: 'Cancelled', label: 'Cancelled' },
                ]}
                icon={<FiTruck className="text-gray-400" />}
              />

              <SelectField
                label="Delivery Acceptance"
                name="acceptedDelivery"
                value={orderData.acceptedDelivery ? 'true' : 'false'}
                onChange={(e) => handleChange('acceptedDelivery', e.target.value === 'true')}
                options={[
                  { value: 'false', label: 'Not Accepted' },
                  { value: 'true', label: 'Accepted' },
                ]}
                icon={<FiCheckCircle className="text-gray-400" />}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {updateOrderMutation.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiPackage />
                    Update Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditOrder
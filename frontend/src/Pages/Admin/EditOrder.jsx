import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BackButton } from '../../Components/common/BackButton';
import InputField from '../../Components/common/InputField';
import TextAreaField from '../../Components/common/TextAreaField';
import SelectField from '../../Components/common/SelectField';

export const EditOrder = () => {
  const { orderid } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const { userid, token } = useSelector(state => state.auth);

  const headers = {
    userid,
    authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/admin/order/get-order-byId/${orderid}`,
          { headers }
        );
        setOrderData(response.data.data);
      } catch (error) {
        Swal.fire({ icon: 'error', text: `Failed to fetch order: ${error.message}` });
      }
    };
    fetchOrder();
  }, [orderid]);

  const handleChange = (field, value) => {
    setOrderData({ ...orderData, [field]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/admin/edit-order/${orderid}`,
        {
          status: orderData.status,
          paymentStatus: orderData.paymentStatus,
          acceptedDelivery: orderData.acceptedDelivery,
        },
        { headers }
      );

      if (response.data.success) {
        Swal.fire({ icon: 'success', text: response.data.message });
        navigate('/admin/dashboard/orders');
      } else {
        Swal.fire({ icon: 'error', text: response.data.message });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', text: `Error updating order: ${error.message}` });
    }
  };

  if (!orderData) return <div className="text-white p-4">Loading...</div>;

  const address = orderData.address || {};

  return (
    <div className="text-white p-6 max-w-3xl mx-auto">
      <BackButton to="/admin/dashboard/orders" text="Back" />
      <h2 className="text-2xl font-bold mb-6">Edit Order</h2>

      <InputField label="Order ID" value={orderData._id} disabled />
      <InputField label="User ID" value={orderData.userid?._id || ''} disabled />
      <InputField label="Total Amount" value={`₹${orderData.totalAmount}`} disabled />
      <TextAreaField
        label="Address"
        value={`${address.name}, ${address.street}, ${address.city}, ${address.state} - ${address.pincode}`}
        disabled
      />
      <InputField label="Phone Number" value={address.phoneno} disabled />
      <InputField label="Payment Method" value={orderData.paymentMethod} disabled />

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
      />

      <SelectField
        label="Accepted Delivery"
        name="acceptedDelivery"
        value={orderData.acceptedDelivery ? 'true' : 'false'}
        onChange={(e) => handleChange('acceptedDelivery', e.target.value === 'true')}
        options={[
          { value: 'false', label: 'Not Accepted' },
          { value: 'true', label: 'Accepted' },
        ]}
      />

      <button
        onClick={handleUpdate}
        className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
      >
        Update Order
      </button>
    </div>
  );
};

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";

export const useFetchOrderById = (orderId) => {
  const { token } = useSelector(state => state.auth);
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/order/${orderId}`,
        { headers }
      );
      return response.data;
    },
    enabled: !!orderId && !!token
  });
};

export const useHandleOrderUpdate = () => {
  const { token } = useSelector(state => state.auth);
  return useMutation({
    mutationFn: async ({ orderId, orderData }) => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/order/${orderId}`,
        {
          status: orderData.status,
          paymentStatus: orderData.paymentStatus,
          acceptedDelivery: orderData.acceptedDelivery,
        },
        { headers }
      );
      return response.data;
    }
  });
};

export const useFetchOrders = () => {
  const { token } = useSelector(state => state.auth);
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/order`,
        { headers }
      );
      return response.data.data;
    },
    enabled: !!token
  });
};

export const useDeleteOrder = () => {
  const { token } = useSelector(state => state.auth);
  return useMutation({
    mutationFn: async (orderId) => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/order/${orderId}`,
        { headers }
      );
      return response.data.data;
    }
  });
};

export const useChangeOrderStatus = () => {
  const { token } = useSelector(state => state.auth);
  return useMutation({
    mutationFn: async ({ orderId, newStatus }) => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/order/change-order-status/${orderId}`,
        { status: newStatus },
        { headers }
      );
      return response.data.data;
    }
  });
};

export const useHandlePaymentStatusChange = () => {
  const { token } = useSelector(state => state.auth);
  return useMutation({
    mutationFn: async ({ orderId, newStatus }) => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/order/change-payment-status/${orderId}`,
        { paymentStatus: newStatus },
        { headers }
      );
      return response.data.data;
    }
  });
};

export const usePlaceOrder = () => {
  const { token, userId } = useSelector(state => state.auth);
  return useMutation({
    mutationFn: async ({ paymentMethod, address }) => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/place-order/${userId}`,
        { paymentMethod, address },
        { headers }
      );
      return response.data;
    }
  });
};

export const useTrackOrder = (orderId, bookId) => {
  const { token } = useSelector(state => state.auth);
  return useQuery({
    queryKey: ['track-order', orderId, bookId],
    queryFn: async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/track/${orderId}?bookId=${bookId}`,
        { headers }
      );
      return response.data;
    },
    enabled: !!orderId && !!bookId && !!token
  });
};

export const useGetOrderHistory = () => {
  const { token, userId } = useSelector(state => state.auth);
  return useQuery({
    queryKey: ['order-history', userId],
    queryFn: async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/${userId}`,
        { headers }
      );
      return response.data.data;
    },
    enabled: !!userId && !!token
  });
};
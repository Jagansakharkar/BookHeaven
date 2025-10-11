import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useFetchOrderById = (orderId) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/order/${orderId}`,
      );
      return response.data;
    },
    enabled: !!orderId
  });
};

export const useHandleOrderUpdate = () => {
  return useMutation({
    mutationFn: async ({ orderId, orderData }) => {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/order/${orderId}`,
        {
          status: orderData.status,
          paymentStatus: orderData.paymentStatus,
          acceptedDelivery: orderData.acceptedDelivery,
        },
      );
      return response.data;
    }
  });
};

export const useFetchOrders = () => {
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/order`,
      );
      return response.data.data;
    },

  });
};

export const useDeleteOrder = () => {
  return useMutation({
    mutationFn: async (orderId) => {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/order/${orderId}`,
      );
      return response.data.data;
    }
  });
};

export const useChangeOrderStatus = () => {
  return useMutation({
    mutationFn: async ({ orderId, newStatus }) => {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/order/change-order-status/${orderId}`,
        { status: newStatus },
      );
      return response.data.data;
    }
  });
};

export const useHandlePaymentStatusChange = () => {
  return useMutation({
    mutationFn: async ({ orderId, newStatus }) => {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/order/change-payment-status/${orderId}`,
        { paymentStatus: newStatus },
      );
      return response.data.data;
    }
  });
};

export const usePlaceOrder = () => {
  return useMutation({
    mutationFn: async ({ paymentMethod, address }) => {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/place-order`,
        { paymentMethod, address },
      );
      return response.data;
    }
  });
};

export const useTrackOrder = (orderId, bookId) => {
  return useQuery({
    queryKey: ['track-order', orderId, bookId],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/track/${orderId}?bookId=${bookId}`,
      );
      return response.data;
    },
    enabled: !!orderId && !!bookId
  });
};

export const useGetOrderHistory = () => {
  return useQuery({
    queryKey: ['order-history'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/order`,
      );
      return response.data.data;
    },
  });
};
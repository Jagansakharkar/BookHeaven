import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// Add to Cart
export const useAddToCart = () => {
  const { token, userId } = useSelector(state => state.auth);

  return useMutation({
    mutationFn: async ({ bookId, price }) => {
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add/${userId}/${bookId}`,
        { price },
        { headers }
      );
      return response.data;
    }
  });
};

// Update Quantity
export const useUpdateQuantity = () => {
  const { token } = useSelector(state => state.auth);

  return useMutation({
    mutationFn: async ({ bookId, newQuantity }) => {
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/update-quantity/${bookId}`,
        { quantity: newQuantity },
        { headers }
      );
      return response.data;
    }
  });
};

// Remove from Cart
export const useRemoveFromCart = () => {
  const { token, userId } = useSelector(state => state.auth);

  return useMutation({
    mutationFn: async (bookId) => {
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/remove/${userId}/${bookId}`,
        { headers }
      );
      return response.data;
    }
  });
};

// Get Cart Items
export const useGetCartItems = () => {
  const { token, userId } = useSelector(state => state.auth);

  return useQuery({
    queryKey: ['cart', userId],
    queryFn: async () => {
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/${userId}`,
        { headers }
      );
      return response.data;
    },
    enabled: !!userId && !!token
  });
};
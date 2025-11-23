import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// Add to Cart
export const useAddToCart = () => {
  return useMutation({
    mutationFn: async ({ bookId, price }) => {
      const response = await axios.put(
        `${import.meta.env.REACT_APP_API_URL}/api/cart/${bookId}`,
        { price },
      );
      return response.data;
    }
  });
};

// Update Quantity
export const useUpdateQuantity = () => {

  return useMutation({
    mutationFn: async ({ bookId, newQuantity }) => {


      const response = await axios.put(
        `${import.meta.env.REACT_APP_API_URL}/api/cart/update-quantity/${bookId}`,
        { quantity: newQuantity },
      );
      return response.data;
    }
  });
};

// Remove from Cart
export const useRemoveFromCart = () => {

  return useMutation({
    mutationFn: async (bookId) => {

      const response = await axios.delete(
        `${import.meta.env.REACT_APP_API_URL}/api/cart/${bookId}`,
      );
      return response.data;
    }
  });
};

// Get Cart Items
export const useGetCartItems = () => {

  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {


      const response = await axios.get(
        `${import.meta.env.REACT_APP_API_URL}/api/cart`,
        
      );
      return response.data;
    },
    enabled:  !!token
  });
};
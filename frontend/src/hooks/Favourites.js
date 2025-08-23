import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";

export const useFavouriteBooks = () => {
  const { token, userId } = useSelector(state => state.auth);

  return useQuery({
    queryKey: ['favourite-books', userId],
    queryFn: async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/favourite/${userId}`,
        { headers }
      );
      return response.data.data;
    },
    enabled: !!userId && !!token
  });
};

export const useAddFavouriteBook = () => {
  const { token, userId } = useSelector(state => state.auth);

  return useMutation({
    mutationFn: async (bookId) => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/favourite/add/${userId}/${bookId}`,
        {},
        { headers }
      );
      return response.data;
    }
  });
};

export const useRemoveFromFravourite = () => {
  const { token, userId } = useSelector(state => state.auth);

  return useMutation({
    mutationFn: async (bookId) => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/favourite/${userId}/${bookId}`,
        { headers }
      );
      return response.data;
    }
  });
};
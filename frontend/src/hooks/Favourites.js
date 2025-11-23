import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";

export const useFavouriteBooks = () => {

  return useQuery({
    queryKey: ['favourite-books'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.REACT_APP_API_URL}/api/favourite`,
      );
      return response.data.data;
    },
    enabled: !!token
  });
};

export const useAddFavouriteBook = () => {

  return useMutation({
    mutationFn: async (bookId) => {
      const response = await axios.put(
        `${import.meta.env.REACT_APP_API_URL}/api/favourite/add/${bookId}`,
        {},
      );
      return response.data;
    }
  });
};

export const useRemoveFromFravourite = () => {

  return useMutation({
    mutationFn: async (bookId) => {
      const response = await axios.delete(
        `${import.meta.env.REACT_APP_API_URL}/api/favourite/${bookId}`,
      );
      return response.data;
    }
  });
};
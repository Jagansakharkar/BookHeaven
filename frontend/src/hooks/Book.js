import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useBookById = (bookId) => {
  return useQuery({
    queryKey: ['book', bookId],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/books/${bookId}`,
      );
      return response.data.data;
    },
    enabled: !!bookId
  });
};

export const useAddBook = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/books`,
        data,
      );
      return response.data;
    }
  });
};

export const useUpdateBook = () => {
  return useMutation({
    mutationFn: async ({ bookId, data }) => {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/books/${bookId}`,
        data,
      );
      return response.data;
    }
  });
};

export const useDeleteBook = () => {
  return useMutation({
    mutationFn: async (bookId) => {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/books/${bookId}`,
      );
      return response.data;
    }
  });
};

export const useBookFilter = () => {
  return useMutation({
    mutationFn: async (params) => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/books/filter`,
        { params }
      );
      return response.data.data;
    },
  });
};

export const useBookSearch = () => {
  return useMutation({
    mutationFn: async (query) => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/books/search`,
        {
          params: { query: query.trim() }
        }
      );
      console.log("book search:", response.data.data);

      return response.data.data;
    },
  });
};
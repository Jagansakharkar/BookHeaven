import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';

export const useAddBook = () => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(
        `${import.meta.env.REACT_APP_API_URL}/api/admin/books`,
        data,
        { headers }
      );
      return res.data;
    }
  });
};

export const useBookById = (bookId) => {
  return useQuery({
    queryKey: ['book', bookId],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.REACT_APP_API_URL}/api/books/${bookId}`,
      );
      console.log("response",response)
      return response.data.data;
    },
    // enabled: !!bookId
  });
};

export const useUpdateBook = () => {
  return useMutation({
    mutationFn: async ({ bookId, data }) => {
      const response = await axios.put(
        `${import.meta.env.REACT_APP_API_URL}/api/admin/books/${bookId}`,
        data,
        { headers }
      );
      return response.data;
    }
  });
};

export const useDeleteBook = () => {
  return useMutation({
    mutationFn: async (bookId) => {
      const response = await axios.delete(
        `${import.meta.env.REACT_APP_API_URL}/api/admin/books/${bookId}`,
      );
      return response.data;
    }
  });
};

export const useBookFilter = (params) => {
  return useQuery({
    queryKey: ['bookFiltered', params],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.REACT_APP_API_URL}/api/books/books_filter`,
        {
          params
        }
      );
      return response.data;
    },
    enabled: !!params
  });
};

export const useBookSearch = (query) => {
  return useQuery({
    queryKey: ['bookSearched', query],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.REACT_APP_API_URL}/api/books/search`,
        {
          params: { query: query.trim() }
        }
      );
      return response.data;
    },
    enabled: !!query && query.trim().length > 0
  });
};
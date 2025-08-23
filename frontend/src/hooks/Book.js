import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';

export const useAddBook = () => {
  const { token } = useSelector(state => state.auth);
  return useMutation({
    mutationFn: async (data) => {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/books`,
        data,
        { headers }
      );
      return res.data;
    }
  });
};

export const useBookById = (bookId) => {
  const { token } = useSelector(state => state.auth);
  return useQuery({
    queryKey: ['book', bookId],
    queryFn: async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/books/${bookId}`,
        { headers }
      );
      return response.data.data;
    },
    enabled: !!bookId
  });
};

export const useUpdateBook = () => {
  const { token } = useSelector(state => state.auth);
  return useMutation({
    mutationFn: async ({ bookId, data }) => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/books/${bookId}`,
        data,
        { headers }
      );
      return response.data;
    }
  });
};

export const useDeleteBook = () => {
  const { token } = useSelector(state => state.auth);
  return useMutation({
    mutationFn: async (bookId) => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/books/${bookId}`,
        { headers }
      );
      return response.data;
    }
  });
};

export const useBookFilter = (params) => {
  const { token } = useSelector(state => state.auth);
  return useQuery({
    queryKey: ['bookFiltered', params],
    queryFn: async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/books/books_filter`,
        {
          headers,
          params
        }
      );
      return response.data;
    },
    enabled: !!params
  });
};

export const useBookSearch = (query) => {
  const { token } = useSelector(state => state.auth);
  return useQuery({
    queryKey: ['bookSearched', query],
    queryFn: async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/books/search`,
        {
          headers,
          params: { query: query.trim() }
        }
      );
      return response.data;
    },
    enabled: !!query && query.trim().length > 0
  });
};
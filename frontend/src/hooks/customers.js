import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useAllUsers = () => {
  return useQuery({
    queryKey: ['all-Users'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/user/all`,
      );
      console.log("users:", response.data.data)
      return response.data.data;
    },
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/user`,
      );
      return response.data;
    }
  });
};

export const useFilterByGender = () => {
  return useMutation({
    mutationFn: async (genderValue) => {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/user/filter-gender`,
        { gender: genderValue },
      );
      return response.data;
    }
  });
};

export const useSearchUser = (searchTerm) => {
  return useQuery({
    queryKey: ['user-search', searchTerm],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/user/search`,
        {
          params: { term: searchTerm }
        }
      );
      return response.data;
    },
    enabled: !!searchTerm && searchTerm.trim().length > 0
  });
};

export const useFetchUserById = (userId) => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/user`, { params: { userId } }
      );
      return response.data.data;
    },
    enabled:!!userId
  });
};

export const useUpdateUser = () => {

  return useMutation({
    mutationFn: async ({ userId, customerData }) => {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/update-customer`,
        { userId, ...customerData },
      );
      return response.data;
    }
  });
};
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";

export const useAllCustomers = () => {
  const { token } = useSelector(state => state.auth);
  
  return useQuery({
    queryKey: ['all-customers'],
    queryFn: async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/user`, 
        { headers }
      );
      return response.data;
    },
    enabled: !!token
  });
};

export const useDeleteCustomer = () => {
  const { token } = useSelector(state => state.auth);
  
  return useMutation({
    mutationFn: async (userId) => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/user/${userId}`, 
        { headers }
      );
      return response.data;
    }
  });
};

export const useFilterByGender = () => {
  const { token } = useSelector(state => state.auth);
  
  return useMutation({
    mutationFn: async (genderValue) => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/user/filter-gender`,
        { gender: genderValue },
        { headers }
      );
      return response.data;
    }
  });
};

export const useSearchUser = (searchTerm) => {
  const { token } = useSelector(state => state.auth);
  
  return useQuery({
    queryKey: ['user-search', searchTerm],
    queryFn: async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/user/search`,
        {
          headers,
          params: { term: searchTerm }
        }
      );
      return response.data;
    },
    enabled: !!searchTerm && searchTerm.trim().length > 0
  });
};

export const useFetchCustomerById = (userId) => {
  const { token } = useSelector(state => state.auth);
  
  return useQuery({
    queryKey: ['customer', userId],
    queryFn: async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/user/get-customer-byId/${userId}`,
        { headers }
      );
      return response.data.data[0];
    },
    enabled: !!userId && !!token
  });
};

export const useUpdateCustomer = () => {
  const { token } = useSelector(state => state.auth);
  
  return useMutation({
    mutationFn: async ({ userId, customerData }) => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/update-customer`,
        { ...customerData, userId },
        { headers }
      );
      return response.data;
    }
  });
};
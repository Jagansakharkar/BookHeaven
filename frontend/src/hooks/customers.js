import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useAllCustomers = () => {
  return useQuery({
    queryKey: ['all-customers'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.REACT_APP_API_URL}/api/admin/user`,
      );
      return response.data.data;
    },
  });
};

export const useDeleteCustomer = () => {

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete(
        `${import.meta.env.REACT_APP_API_URL}/api/admin/user`,
      );
      return response.data;
    }
  });
};

export const useFilterByGender = () => {

  return useMutation({
    mutationFn: async (genderValue) => {
      const response = await axios.post(
        `${import.meta.env.REACT_APP_API_URL}/api/admin/user/filter-gender`,
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
        `${import.meta.env.REACT_APP_API_URL}/api/admin/user/search`,
        {
          params: { term: searchTerm }
        }
      );
      return response.data;
    },
    enabled: !!searchTerm && searchTerm.trim().length > 0
  });
};

export const useFetchCustomerById = () => {

  return useQuery({
    queryKey: ['customer'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.REACT_APP_API_URL}/api/admin/user/get-customer-byId`,
      );
      return response.data.data[0];
    },
  });
};

export const useUpdateCustomer = () => {

  return useMutation({
    mutationFn: async ({ customerData }) => {
      const response = await axios.put(
        `${import.meta.env.REACT_APP_API_URL}/api/admin/update-customer`,
        { ...customerData },
      );
      return response.data;
    }
  });
};
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetUserAddress = () => {

  return useQuery({
    queryKey: ['user-address'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/address`,
      );
      return response.data.data;
    },

  });
};

export const useGetUserInfo = () => {

  return useQuery({
    queryKey: ['user-info'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user`,
      );
      return response.data.data;
    },

  });
};

export const useUpdateUserProfile = () => {

  return useMutation({
    mutationFn: async (updateData) => {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile`,
        updateData,
      );
      return response.data;
    }
  });
};

export const useUpdateUserAddress = () => {
  return useMutation({
    mutationFn: async (updateAddress) => {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/address`,
        updateAddress,
      );
      return response.data;
    }
  })
}
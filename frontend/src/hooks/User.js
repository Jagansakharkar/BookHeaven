import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";

export const useGetUserAddress = () => {
  const { token, userId } = useSelector(state => state.auth);

  return useQuery({
    queryKey: ['user-address', userId],
    queryFn: async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/address/${userId}`,
        { headers }
      );
      return response.data.data;

    },

    enabled: !!userId && !!token
  });
};

export const useGetUserInfo = () => {
  const { token, userId } = useSelector(state => state.auth);

  return useQuery({
    queryKey: ['user-info', userId],
    queryFn: async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/${userId}`,
        { headers }
      );
      return response.data.data;
    },
    enabled: !!userId && !!token
  });
};

export const useUpdateUserProfile = () => {
  const { token, userId } = useSelector(state => state.auth);

  return useMutation({
    mutationFn: async (updateData) => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile/${userId}`,
        updateData,
        { headers }
      );
      return response.data;
    }
  });
};

export const useUpdateUserAddress = () => {
  const { token, userId } = useSelector(state => state.auth);
  return useMutation({
    mutationFn: async (updateAddress) => {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/address/${userId}`,
        updateAddress,
        { headers }
      );

      return response.data;
    }
  })
}
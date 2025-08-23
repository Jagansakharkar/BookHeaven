import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";

export const useAddCategory = () => {
  const { token } = useSelector(state => state.auth);
  
  return useMutation({
    mutationFn: async (categoryName) => {
      const headers = { 
        Authorization: `Bearer ${token}` 
      };
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/category`,
        { name: categoryName },
        { headers }
      );
      return response.data;
    }
  });
};
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";

export const useAddCategory = () => {
  
  return useMutation({
    mutationFn: async (categoryName) => {
    
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/category`,
        { name: categoryName },
      );
      return response.data;
    }
  });
};
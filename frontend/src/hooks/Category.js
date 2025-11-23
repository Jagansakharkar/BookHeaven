import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useAddCategory = () => {
  
  return useMutation({
    mutationFn: async (categoryName) => {
    
      
      const response = await axios.post(
        `${import.meta.env.REACT_APP_API_URL}/api/admin/category`,
        { name: categoryName },
      );
      return response.data;
    }
  });
};
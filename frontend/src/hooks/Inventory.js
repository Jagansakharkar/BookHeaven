import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useInventorySummary = () => {
  
  return useQuery({
    queryKey: ['inventory-summary'],  
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.REACT_APP_API_URL}/api/admin/inventory/summary`,
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,  
    retry: 2  
  });
};
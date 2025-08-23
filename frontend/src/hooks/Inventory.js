import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";

export const useInventorySummary = () => {
  const { token } = useSelector(state => state.auth);
  
  return useQuery({
    queryKey: ['inventory-summary'],  // Added proper query key
    queryFn: async () => {
      const headers = { 
        Authorization: `Bearer ${token}` 
      };
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/inventory/summary`,
        { headers }
      );
      return response.data;
    },
    enabled: !!token,  // Only fetch if token exists
    staleTime: 5 * 60 * 1000,  // Data stays fresh for 5 minutes
    retry: 2  // Will retry failed requests 2 times
  });
};
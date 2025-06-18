import { useQuery } from "@tanstack/react-query";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { getFetch2 } from "../../api/fetch";
import { isSpokeChain } from "../../constants/config/chains";
import { GasResult } from "../../constants/types/gasResult";

type ChainType = "arb" | "op";

interface UseGetGasParams {
  messageType: number;
  chainType: ChainType;
  query: Record<string, string | number | string[]>;
}

// const buildQuery = (query: Record<string, string | number | string[]>) => {
//   const params = new URLSearchParams();
//   Object.entries(query).forEach(([key, value]) => {
//     if (value !== undefined && value !== null) {
//       params.append(key, String(value));
//     }
//   });
//   return params.toString();
// };

const buildQuery = (query: Record<string, string | number | string[] | boolean>) => {
  const params = new URLSearchParams();
  
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    
    if (Array.isArray(value)) {
      value.forEach(item => {
        params.append(key, item);
      });
    } else {
      // Handle primitive values (string, number, boolean)
      params.append(key, String(value));
    }
  });
  
  return params.toString();
};

const useGetGas = ({ messageType, chainType, query }: UseGetGasParams) => {
  const { chainId } = useWeb3ModalAccount();
  const isSpoke = chainId && isSpokeChain(chainId);

  return useQuery({
    queryKey: ["getGasPrice", messageType, chainType, query],
    queryFn: async () => {
      if (!isSpoke) throw new Error("Not a spoke chain");
      
      // Ensure proper URL construction
      const queryString = buildQuery(query);
      const endpoint = `/gas-price/${messageType}/${chainType}`;
      const url = `${endpoint}?${queryString}`;
      
      // console.log("Fetching gas price from:", url); 
      
      const response = await getFetch2<GasResult>(url);
      
      if (!response) {
        throw new Error("Empty response from gas service");
      }
      
      return response;
    },
    enabled: false, // Disable automatic fetching
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export default useGetGas;
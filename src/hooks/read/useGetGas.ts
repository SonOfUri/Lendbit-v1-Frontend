import { useQuery } from "@tanstack/react-query";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { getFetch2 } from "../../api/fetch";
import { isSpokeChain } from "../../constants/config/chains";
import { useMemo } from "react";
import { GasResult } from "../../constants/types/gasResult";

type ChainType = "arb" | "op";


interface UseGetGasParams {
  messageType: number;
  chainType: ChainType;
  query: Record<string, string | number>;
}

const buildQuery = (query: Record<string, string | number>) =>
  new URLSearchParams(query as Record<string, string>).toString();

const useGetGas = ({ messageType, chainType, query }: UseGetGasParams) => {
  const { chainId } = useWeb3ModalAccount();

  const isSpoke = chainId && isSpokeChain(chainId);

  const enabled = useMemo(() => !!chainId && isSpokeChain(chainId), [chainId]);

  return useQuery<GasResult>({
    queryKey: ["getGasPrice", messageType, chainType, query],
    queryFn: async () => {
      if (!isSpoke) throw new Error("Not a spoke chain"); 
      const queryString = buildQuery(query);
      const url = `/get-price/${messageType}/${chainType}?${queryString}`;
      return await getFetch2<GasResult>(url);
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

export default useGetGas;
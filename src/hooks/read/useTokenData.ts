import { useQuery } from '@tanstack/react-query';
import { TokenData } from '../../constants/types/tokenData';
import { getFetch2 } from '../../api/fetch';
import { useTokenStore } from '../../stores/useTokenStore';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';


const AVALANCHE_CHAIN_ID = 43113;


const useTokenData = () => {
  const { tokenData, setTokenData } = useTokenStore();
  const {chainId} = useWeb3ModalAccount()
  
    const { data, isLoading, error } = useQuery<TokenData[]>({
      queryKey: ['tokens'],
      queryFn: () => getFetch2<TokenData[]>(`/token/all`),
      staleTime: 1000 * 60 * 5, 
      select: (tokens: TokenData[]) => {
        if (!chainId) return tokens;
  
        return tokens.filter((token) => {
          if (chainId === AVALANCHE_CHAIN_ID) {
            // Remove ETH on Avalanche
            return token.symbol.toUpperCase() !== 'ETH';
          } else {
            // Remove AVAX on non-Avalanche chains
            return token.symbol.toUpperCase() !== 'AVAX';
          }
        });
      },
      meta: {
        onSuccess: (filteredTokens: TokenData[]) => {
          setTokenData(filteredTokens);
        },
      },
    });
  


  console.log('useTokenData', data);
  
 return {
    tokenData: tokenData ?? data,
    tokenDataLoading: isLoading,
    tokenDataError: error,
  };
};

export default useTokenData;
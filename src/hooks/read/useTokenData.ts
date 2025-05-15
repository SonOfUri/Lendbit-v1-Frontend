import { useQuery } from '@tanstack/react-query';
import { TokenData } from '../../constants/types/tokenData';
import { getFetch2 } from '../../api/fetch';
import { useTokenStore } from '../../stores/useTokenStore';

const useTokenData = () => {
  const { tokenData, setTokenData } = useTokenStore();
  
    const { data, isLoading, error } = useQuery<TokenData[]>({
      queryKey: ['tokens'],
      queryFn: () => getFetch2<TokenData[]>(`/token/all`),
      staleTime: 1000 * 60 * 5, 
      meta: {
        onSuccess: (data: TokenData[]) => {
          setTokenData(data);
        },
      },
    });


 return {
    tokenData: tokenData ?? data,
    tokenDataLoading: isLoading,
    tokenDataError: error,
  };
};

export default useTokenData;
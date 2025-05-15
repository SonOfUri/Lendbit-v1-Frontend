import { useQuery } from '@tanstack/react-query';
import { getFetch } from '../../api/fetch';
import { TokenData } from '../../constants/types/tokenData';

const useTokenData = () => {
  const {
    data: tokenData,
    isLoading: tokenDataLoading,
    error: tokenDataError,
  } = useQuery({
    queryKey: ['tokens'],
    queryFn: () => getFetch<TokenData[]>('/token/all'),
    select: (res) => res.data,
    staleTime: 60 * 1000,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    tokenData,
    tokenDataLoading,
    tokenDataError,
  };
};

export default useTokenData;
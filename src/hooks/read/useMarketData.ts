import { useQuery } from '@tanstack/react-query';
import { getFetch } from '../../api/fetch';
import { MarketData } from '../../constants/types/marketData';


const useMarketData = () => {
  const { data: marketData, isLoading: marketDataLoading, error: marketDataError } = useQuery({
    queryKey: ['market'],
    queryFn: () => getFetch<MarketData>('/market'),
    select: (res) => res.data,
    staleTime: 60 * 1000, // optional: data is considered fresh for 1 min
    refetchInterval: 30 * 1000, // refetch every 30 seconds
    refetchOnWindowFocus: false, // optional: disable refetch on tab focus
  });

    return {
    marketData,
    marketDataLoading,
    marketDataError,
  };
};

export default useMarketData;
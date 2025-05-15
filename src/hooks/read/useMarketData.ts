import { useQuery } from '@tanstack/react-query';
import { getFetch2 } from '../../api/fetch';
import { MarketData } from '../../constants/types/marketData';
import { usemarketStore } from '../../stores/useMarketStore';


const useMarketData = () => {
  // const { data: marketData, isLoading: marketDataLoading, error: marketDataError } = useQuery({
  //   queryKey: ['market'],
  //   queryFn: () => getFetch<MarketData>('/market'),
  //   select: (res) => res.data,
  //   // staleTime: 60 * 1000,
  //   refetchInterval: 30 * 10000,
  //   refetchOnWindowFocus: false, // optional: disable refetch on tab focus
  // });

  //   return {
  //   marketData,
  //   marketDataLoading,
  //   marketDataError,
  // };
  

  const { marketData, setmarketData } = usemarketStore()
  
  const { data, isLoading, error } = useQuery<MarketData>({
      queryKey: ['market'],
      queryFn: () => getFetch2<MarketData>(`/market`),
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      meta: {
        onSuccess: (data: MarketData) => {
          setmarketData(data);
        },
      },
    });
  
    return {
      marketData: marketData ?? data,
      marketDataLoading: isLoading,
      marketDataError: error,
    };

};

export default useMarketData;
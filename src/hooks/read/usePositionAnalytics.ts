import { useQuery } from '@tanstack/react-query';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { getFetch2 } from '../../api/fetch';
import { AnalyticsData } from '../../constants/types/analyticsData';
import { useAnalyticsStore } from '../../stores/useAnalyticsStore';

const usePositionAnalytics = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { analyticsData, setAnalyticsData } = useAnalyticsStore();
  
    const { data, isLoading, error } = useQuery<AnalyticsData>({
      queryKey: ['positionAnalytics', address],
      queryFn: () => getFetch2<AnalyticsData>(`/position/analytics/${address}`),
      enabled: isConnected && !!address && !analyticsData,
      staleTime: 1000 * 60 * 5, 
      meta: {
        onSuccess: (data: AnalyticsData) => {
            setAnalyticsData(data);
        },
      },
    });

    console.log('usePositionAnalyticsData', data);

 return {
    analyticsData: analyticsData ?? data,
    analyticsDataLoading: isLoading,
    analyticsDataError: error,
    isWalletConnected: isConnected && !!address,
  };
};

export default usePositionAnalytics;
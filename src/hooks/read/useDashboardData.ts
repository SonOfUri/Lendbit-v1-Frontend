import { useQuery } from '@tanstack/react-query';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { getFetch2 } from '../../api/fetch';
import { DashboardData } from '../../constants/types/dashboardData';
import { useDashboardStore } from '../../stores/useDashboardStore';

const useDashboardData = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { dashboardData, setDashboardData } = useDashboardStore();

  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboard', address],
    queryFn: () => getFetch2<DashboardData>(`/dashboard/${address}`),
    enabled: isConnected && !!address && !dashboardData,
    staleTime: 1000 * 60 * 5, 
    meta: {
      onSuccess: (data: DashboardData) => {
        setDashboardData(data);
      },
    },
  });

  return {
    dashboardData: dashboardData ?? data,
    dashboardDataLoading: isLoading,
    dashboardDataError: error,
    isWalletConnected: isConnected && !!address,
  };
};

export default useDashboardData;
import { useQuery } from '@tanstack/react-query';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { getFetch } from '../../api/fetch';
import { DashboardData } from '../../constants/types/dashboardData';

const useDashboardData = () => {
  const { address, isConnected } = useWeb3ModalAccount();

  const { data: dashboardData, isLoading: dashboardDataLoading, error: dashboardDataError } = useQuery({
    queryKey: ['dashboard', address],
    queryFn: () => getFetch<DashboardData>(`/dashboard/${address}`),
    enabled: isConnected && !!address,
    select: (res) => res.data,
  });

  return {
    dashboardData,
    dashboardDataLoading,
    dashboardDataError,
    isWalletConnected: isConnected && !!address,
  };
};

export default useDashboardData;
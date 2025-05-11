import { useQuery } from '@tanstack/react-query';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { getFetch } from '../../api/fetch';
import { PositionData } from '../../constants/types/positionData';

const usePositionData = () => {
  const { address, isConnected } = useWeb3ModalAccount();

  const {
    data: positionData,
    isLoading: positionDataLoading,
    error: positionDataError,
  } = useQuery({
    queryKey: ['position', address],
    queryFn: () => getFetch<PositionData>(`/position/${address}`),
    enabled: isConnected && !!address,
    select: (res) => res.data,
    // refetchInterval: 30 * 1000, 
  });

  return {
    positionData,
    positionDataLoading,
    positionDataError,
    isWalletConnected: isConnected && !!address,
  };
};

export default usePositionData;
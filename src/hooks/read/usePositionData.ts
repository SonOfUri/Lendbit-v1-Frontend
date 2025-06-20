import { useQuery } from '@tanstack/react-query';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { getFetch2 } from '../../api/fetch';
import { PositionData } from '../../constants/types/positionData';
import { usePositionStore } from '../../stores/usePositionStore';

const usePositionData = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { positionData, setPositionData } = usePositionStore();
  
    const { data, isLoading, error } = useQuery<PositionData>({
      queryKey: ['position', address],
      queryFn: () => getFetch2<PositionData>(`/position/${address}`),
      enabled: isConnected && !!address && !positionData,
      staleTime: 1000 * 60 * 5, 
      meta: {
        onSuccess: (data: PositionData) => {
          setPositionData(data);
        },
      },
    });


 return {
    positionData: positionData ?? data,
    positionDataLoading: isLoading,
    positionDataError: error,
    isWalletConnected: isConnected && !!address,
  };
};

export default usePositionData;
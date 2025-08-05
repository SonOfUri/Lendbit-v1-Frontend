import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { toast } from 'sonner';
import { 
  getQuote, 
  checkAllowance, 
  getApprovalTransaction, 
  getSwapTransaction, 
  isChainSupported 
} from '../services/okxDexService';

interface SwapParams {
  fromTokenAddress: string;
  toTokenAddress: string;
  amount: string;
  slippage: string;
}

interface SwapState {
  isLoading: boolean;
  error: string | null;
  quote: any | null;
  allowance: any | null;
  approvalTx: any | null;
  swapTx: any | null;
}

export const useOkxDexSwap = () => {
  const { address, chainId } = useWeb3ModalAccount();
  const [swapState, setSwapState] = useState<SwapState>({
    isLoading: false,
    error: null,
    quote: null,
    allowance: null,
    approvalTx: null,
    swapTx: null
  });

  // Get quote for swap
  const getSwapQuote = async (params: SwapParams) => {
    if (!chainId || !isChainSupported(chainId)) {
      const errorMsg = 'Chain not supported for OKX DEX';
      setSwapState(prev => ({ ...prev, error: errorMsg }));
      toast.error(errorMsg);
      return;
    }

    setSwapState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const quote = await getQuote(
        chainId,
        params.fromTokenAddress,
        params.toTokenAddress,
        params.amount,
        params.slippage
      );

      setSwapState(prev => ({ ...prev, quote, isLoading: false }));
      return quote;
    } catch (error) {
      const fullErrorMessage = error instanceof Error ? error.message : 'Failed to get quote';
      const truncatedError = fullErrorMessage.length > 100 ? fullErrorMessage.substring(0, 100) + '...' : fullErrorMessage;
      console.error('Quote failed:', fullErrorMessage);
      setSwapState(prev => ({ ...prev, error: truncatedError, isLoading: false }));
      toast.error(`Quote failed: ${truncatedError}`);
      throw error;
    }
  };

  // Check token allowance
  const checkTokenAllowance = async (tokenAddress: string, spenderAddress: string) => {
    if (!chainId || !address) {
      setSwapState(prev => ({ ...prev, error: 'Chain ID or wallet address not available' }));
      return;
    }

    setSwapState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const allowance = await checkAllowance(
        tokenAddress,
        address,
        spenderAddress
      );

      setSwapState(prev => ({ ...prev, allowance, isLoading: false }));
      return allowance;
    } catch (error) {
      const fullErrorMessage = error instanceof Error ? error.message : 'Failed to check allowance';
      const truncatedError = fullErrorMessage.length > 100 ? fullErrorMessage.substring(0, 100) + '...' : fullErrorMessage;
      console.error('Allowance check failed:', fullErrorMessage);
      setSwapState(prev => ({ ...prev, error: truncatedError, isLoading: false }));
      throw error;
    }
  };

  // Get approval transaction
  const getApprovalTx = async (tokenAddress: string, amount: string) => {
    if (!chainId) {
      setSwapState(prev => ({ ...prev, error: 'Chain ID not available' }));
      return;
    }

    setSwapState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const approvalTx = await getApprovalTransaction(
        chainId,
        tokenAddress,
        amount
      );

      setSwapState(prev => ({ ...prev, approvalTx, isLoading: false }));
      return approvalTx;
    } catch (error) {
      const fullErrorMessage = error instanceof Error ? error.message : 'Failed to get approval transaction';
      const truncatedError = fullErrorMessage.length > 100 ? fullErrorMessage.substring(0, 100) + '...' : fullErrorMessage;
      console.error('Approval transaction failed:', fullErrorMessage);
      setSwapState(prev => ({ ...prev, error: truncatedError, isLoading: false }));
      throw error;
    }
  };

  // Get swap transaction
  const getSwapTx = async (params: SwapParams) => {
    if (!chainId || !address) {
      setSwapState(prev => ({ ...prev, error: 'Chain ID or wallet address not available' }));
      return;
    }

    setSwapState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('Getting swap transaction with params:', {
        chainId,
        fromTokenAddress: params.fromTokenAddress,
        toTokenAddress: params.toTokenAddress,
        amount: params.amount,
        slippage: params.slippage,
        userWalletAddress: address
      });

      const swapTx = await getSwapTransaction(
        chainId,
        params.fromTokenAddress,
        params.toTokenAddress,
        params.amount,
        params.slippage,
        address
      );

      console.log('Swap transaction received:', swapTx);
      console.log('Full swap response structure:', JSON.stringify(swapTx, null, 2));
      setSwapState(prev => ({ ...prev, swapTx, isLoading: false }));
      return swapTx;
    } catch (error) {
      const fullErrorMessage = error instanceof Error ? error.message : 'Failed to get swap transaction';
      const truncatedError = fullErrorMessage.length > 100 ? fullErrorMessage.substring(0, 100) + '...' : fullErrorMessage;
      console.error('Swap transaction failed:', fullErrorMessage);
      setSwapState(prev => ({ ...prev, error: truncatedError, isLoading: false }));
      throw error;
    }
  };

  // Execute approval transaction
  const executeApproval = async (tokenAddress: string, amount: string) => {
    if (!address) {
      const errorMsg = 'Wallet not connected';
      setSwapState(prev => ({ ...prev, error: errorMsg }));
      toast.error(errorMsg);
      return;
    }

    setSwapState(prev => ({ ...prev, isLoading: true, error: null }));
    const toastId = toast.loading('Approving tokens...');

    try {
      // Get approval transaction data
      const approvalTx = await getApprovalTx(tokenAddress, amount);
      
      if (!approvalTx) {
        throw new Error('Failed to get approval transaction data');
      }

      // Use default gas limit for approval
      const gasLimit = '100000'; // Default gas limit for approvals

      console.log('Approval transaction data:', approvalTx);
      
      // Create transaction - use dexContractAddress if 'to' is not provided
      const toAddress = approvalTx.to || approvalTx.dexContractAddress;
      if (!toAddress) {
        throw new Error('No destination address found in approval transaction');
      }
      
      const tx = {
        to: toAddress,
        data: approvalTx.data,
        gasLimit: ethers.parseUnits(gasLimit, 0),
        value: ethers.parseUnits(approvalTx.value || '0', 0)
      };
      
      console.log('Created approval transaction:', tx);
      console.log('Approval transaction details:');
      console.log('- To address:', tx.to);
      console.log('- Is contract deployment?', tx.to === '0x0000000000000000000000000000000000000000' ? 'YES - WRONG!' : 'NO - Correct');

      // Get provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();

      // Send transaction
      const transaction = await signer.sendTransaction(tx);
      const receipt = await transaction.wait();

      setSwapState(prev => ({ ...prev, isLoading: false }));
      toast.success('Token approval successful!', { id: toastId });
      return receipt;
    } catch (error) {
      const fullErrorMessage = error instanceof Error ? error.message : 'Failed to execute approval';
      const truncatedError = fullErrorMessage.length > 100 ? fullErrorMessage.substring(0, 100) + '...' : fullErrorMessage;
      console.error('Approval execution failed:', fullErrorMessage);
      setSwapState(prev => ({ ...prev, error: truncatedError, isLoading: false }));
      toast.error(`Approval failed: ${truncatedError}`, { id: toastId });
      throw error;
    }
  };

  // Execute swap transaction
  const executeSwap = async (params: SwapParams) => {
    if (!address) {
      const errorMsg = 'Wallet not connected';
      setSwapState(prev => ({ ...prev, error: errorMsg }));
      toast.error(errorMsg);
      return;
    }

    setSwapState(prev => ({ ...prev, isLoading: true, error: null }));
    const toastId = toast.loading('Processing swap...');

    try {
      // Get swap transaction data
      const swapTx = await getSwapTx(params);
      
      if (!swapTx) {
        throw new Error('Failed to get swap transaction data');
      }

            // Simulate transaction first (optional - skip if fails)
      // console.log('Simulating transaction...');
      // try {
      //   // Get the correct transaction data for simulation
      //   let simTxData;
      //   if (swapTx && swapTx.tx) {
      //     simTxData = swapTx.tx;
      //   } else if (swapTx && swapTx.to && swapTx.data) {
      //     simTxData = swapTx;
      //   } else {
      //     console.warn('Invalid swap transaction structure for simulation, skipping simulation');
      //     return; // Skip simulation instead of throwing
      //   }
      //   
      //   // Get the correct 'to' address for simulation
      //   let simToAddress = simTxData.to;
      //   if (!simToAddress) {
      //     simToAddress = swapTx.routerResult?.router || '0x0000000000000000000000000000000000000000';
      //   }
      //   
      //   const simulation = await simulateTransaction(
      //     chainId!,
      //     address,
      //     simToAddress,
      //     simTxData.value || '0',
      //     simTxData.data
      //   );
      //   
      //   if (simulation.failReason) {
      //     console.warn(`Transaction simulation warning: ${simulation.failReason}`);
      //   } else {
      //     console.log('Transaction simulation successful');
      //   }
      // } catch (simulationError) {
      //   console.warn('Transaction simulation failed, proceeding with swap:', simulationError);
      //   // Continue with swap even if simulation fails
      // }

      // Get gas limit (with fallback)
      // let gasLimit;
      // try {
      //   // Get the correct transaction data for gas estimation
      //   let gasTxData;
      //   if (swapTx && swapTx.tx) {
      //     gasTxData = swapTx.tx;
      //   } else if (swapTx && swapTx.to && swapTx.data) {
      //     gasTxData = swapTx;
      //   } else {
      //     console.warn('Invalid swap transaction structure for gas estimation, using default gas limit');
      //     gasLimit = '300000'; // Default gas limit
      //   }
      //   
      //   if (gasTxData) {
      //     // Get the correct 'to' address for gas estimation
      //     let gasToAddress = gasTxData.to;
      //     if (!gasToAddress) {
      //       gasToAddress = swapTx.routerResult?.router || '0x0000000000000000000000000000000000000000';
      //     }
      //     
      //     gasLimit = await getGasLimit(
      //       chainId!,
      //       address,
      //       gasToAddress,
      //       gasTxData.value || '0',
      //       gasTxData.data
      //     );
      //     console.log('Gas limit received:', gasLimit);
      //   }
      // } catch (gasError) {
      //   console.warn('Failed to get gas limit from OKX, using default:', gasError);
      //   // Use a default gas limit if OKX gas estimation fails
      //   gasLimit = '300000'; // Default gas limit
      // }

      // Create transaction using OKX-provided parameters
      console.log('Creating transaction with swapTx:', swapTx);
      
      // Handle different response structures
      let txData;
      if (swapTx && swapTx.tx) {
        // If response has a nested tx object
        txData = swapTx.tx;
        console.log('Using nested tx object:', txData);
      } else if (swapTx && swapTx.to && swapTx.data) {
        // If response has direct to/data properties
        txData = swapTx;
        console.log('Using direct tx properties:', txData);
      } else {
        console.error('Invalid swap transaction structure:', swapTx);
        throw new Error(`Invalid swap transaction structure received: ${JSON.stringify(swapTx)}`);
      }
      
      // Use OKX-provided parameters instead of defaults
      const gasLimit = txData.gas || '300000';
      const gasPrice = txData.gasPrice || undefined;
      const maxPriorityFeePerGas = txData.maxPriorityFeePerGas || undefined;
      const maxFeePerGas = txData.maxFeePerGas || undefined;
      
      // Validate required fields
      if (!txData.data) {
        console.error('Missing required transaction data field:', { data: txData.data });
        throw new Error(`Missing required transaction data field: data=${txData.data}`);
      }
      
      console.log('Debug - ethers:', ethers);
      console.log('Debug - gasLimit:', gasLimit);
      console.log('Debug - txData.value:', txData.value);
      console.log('Debug - gasPrice:', gasPrice);
      console.log('Debug - maxPriorityFeePerGas:', maxPriorityFeePerGas);
      
      // Create transaction with OKX parameters
      const tx: any = {
        to: txData.to,
        data: txData.data,
        gasLimit: ethers.parseUnits(gasLimit, 0),
        value: ethers.parseUnits(txData.value || '0', 0)
      };
      
      // Add gas price parameters if provided by OKX
      if (gasPrice) {
        tx.gasPrice = ethers.parseUnits(gasPrice, 0);
      }
      if (maxPriorityFeePerGas) {
        tx.maxPriorityFeePerGas = ethers.parseUnits(maxPriorityFeePerGas, 0);
      }
      if (maxFeePerGas) {
        tx.maxFeePerGas = ethers.parseUnits(maxFeePerGas, 0);
      }
      
      console.log('Created transaction:', tx);
             console.log('Transaction details:');
       console.log('- To address:', tx.to);
       console.log('- Amount (value):', tx.value.toString());
       console.log('- Gas limit:', tx.gasLimit.toString());
       console.log('- Data length:', tx.data.length);
       console.log('- Original amount from params:', params.amount);
       console.log('- Is contract deployment?', tx.to === '0x0000000000000000000000000000000000000000' ? 'YES - WRONG!' : 'NO - Correct');

      // Get provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();

      // Send transaction
      const transaction = await signer.sendTransaction(tx);
      const receipt = await transaction.wait();

      setSwapState(prev => ({ ...prev, isLoading: false }));
      toast.success('Swap completed successfully!', { id: toastId });
      return receipt;
    } catch (error) {
      const fullErrorMessage = error instanceof Error ? error.message : 'Failed to execute swap';
      const truncatedError = fullErrorMessage.length > 100 ? fullErrorMessage.substring(0, 100) + '...' : fullErrorMessage;
      console.error('Swap execution failed:', fullErrorMessage);
      setSwapState(prev => ({ ...prev, error: truncatedError, isLoading: false }));
      toast.error(`Swap failed: ${truncatedError}`, { id: toastId });
      throw error;
    }
  };

  // Complete swap process (quote -> check allowance -> approve if needed -> swap)
  const performSwap = async (params: SwapParams) => {
    if (!address || !chainId) {
      const errorMsg = 'Wallet not connected or chain not supported';
      setSwapState(prev => ({ ...prev, error: errorMsg }));
      toast.error(errorMsg);
      return;
    }

    setSwapState(prev => ({ ...prev, isLoading: true, error: null }));
    const toastId = toast.loading('Preparing swap...');

    try {
      // Step 1: Get quote
      const quote = await getSwapQuote(params);
      console.log('Swap Quote:', quote);

      // Step 2: Check allowance (only for ERC-20 tokens, not ETH)
      if (params.fromTokenAddress !== '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
        try {
          const allowance = await checkTokenAllowance(
            params.fromTokenAddress,
            quote.spenderAddress || quote.routerAddress
          );
          console.log('Token Allowance:', allowance);

          // Step 3: Approve if needed
          if (allowance && ethers.parseUnits(allowance.allowance, 0) < ethers.parseUnits(params.amount, 0)) {
            console.log('Approval needed, executing approval...');
            toast.loading('Approving tokens...', { id: toastId });
            await executeApproval(params.fromTokenAddress, params.amount);
            console.log('Approval completed');
          }
        } catch (allowanceError) {
          console.warn('Allowance check failed, proceeding with swap:', allowanceError);
          // Continue with swap even if allowance check fails
        }
      }

      // Step 4: Execute swap
      console.log('Executing swap...');
      toast.loading('Executing swap...', { id: toastId });
      const swapReceipt = await executeSwap(params);
      console.log('Swap completed:', swapReceipt);

      setSwapState(prev => ({ ...prev, isLoading: false }));
      toast.success('Swap completed successfully!', { id: toastId });
      return swapReceipt;
    } catch (error) {
      const fullErrorMessage = error instanceof Error ? error.message : 'Failed to perform swap';
      const truncatedError = fullErrorMessage.length > 100 ? fullErrorMessage.substring(0, 100) + '...' : fullErrorMessage;
      console.error('Swap operation failed:', fullErrorMessage);
      setSwapState(prev => ({ ...prev, error: truncatedError, isLoading: false }));
      toast.error(`Swap failed: ${truncatedError}`, { id: toastId });
      throw error;
    }
  };

  // Clear swap state
  const clearSwapState = () => {
    setSwapState({
      isLoading: false,
      error: null,
      quote: null,
      allowance: null,
      approvalTx: null,
      swapTx: null
    });
  };

  return {
    ...swapState,
    getSwapQuote,
    checkTokenAllowance,
    getApprovalTx,
    getSwapTx,
    executeApproval,
    executeSwap,
    performSwap,
    clearSwapState,
    isChainSupported: chainId ? isChainSupported(chainId) : false
  };
}; 
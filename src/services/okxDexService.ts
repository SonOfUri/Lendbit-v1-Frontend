import axios from 'axios';
import CryptoJS from 'crypto-js';

// OKX DEX API Configuration
const OKX_API_CONFIG = {
  apiKey: '4d9701f4-89f7-4dd2-addd-584eee4e6a3c',
  secretKey: 'C60897BB103D889E5D7026AB131E0973',
  apiPassphrase: 'Exodus31vs1,2&3',
  projectId: 'd80dd278664a753ce90ad0e9dc4d93c3',
  baseUrl: 'https://web3.okx.com/api/v5/'
};

// Chain ID mapping
const CHAIN_ID_MAP = {
  8453: '8453',    // Base Mainnet
  42161: '42161',  // Arbitrum Mainnet
  10: '10'         // Optimism Mainnet
};

// Generate authentication headers
function getHeaders(timestamp: string, method: string, requestPath: string, queryString = "", bodyString = "") {
  const { apiKey, secretKey, apiPassphrase, projectId } = OKX_API_CONFIG;
  
  const stringToSign = timestamp + method + requestPath + queryString + bodyString;
  
  return {
    "Content-Type": "application/json",
    "OK-ACCESS-KEY": apiKey,
    "OK-ACCESS-SIGN": CryptoJS.enc.Base64.stringify(
      CryptoJS.HmacSHA256(stringToSign, secretKey)
    ),
    "OK-ACCESS-TIMESTAMP": timestamp,
    "OK-ACCESS-PASSPHRASE": apiPassphrase,
    "OK-ACCESS-PROJECT": projectId,
  };
}

// Get quote for a token swap
export const getQuote = async (
  chainId: number,
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: string,
  slippage: string = '0.005'
) => {
  try {
    const path = 'dex/aggregator/quote';
    const url = `${OKX_API_CONFIG.baseUrl}${path}`;
    const params = {
      chainIndex: CHAIN_ID_MAP[chainId as keyof typeof CHAIN_ID_MAP] || chainId.toString(),
      fromTokenAddress,
      toTokenAddress,
      amount,
      slippage
    };

    const timestamp = new Date().toISOString();
    const requestPath = `/api/v5/${path}`;
    const queryString = "?" + new URLSearchParams(params).toString();
    const headers = getHeaders(timestamp, 'GET', requestPath, queryString);

    console.log('OKX Quote Request:', { url, params });
    
    const response = await axios.get(url, { params, headers });
    
    console.log('OKX Quote Response:', response.data);
    
    if (response.data.code === '0') {
      return response.data.data[0];
    } else {
      throw new Error(`OKX API Error: ${response.data.msg || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Failed to get quote:', error);
    throw error;
  }
};

// Check token allowance
export const checkAllowance = async (
  chainId: number,
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string
) => {
  try {
    // For now, return a mock allowance since the OKX API doesn't seem to have a direct allowance endpoint
    // In a real implementation, you would check the allowance on-chain using the ERC20 contract
    console.log('Checking allowance for:', { tokenAddress, ownerAddress, spenderAddress });
    
    // Return a mock allowance that will trigger approval
    return {
      allowance: '0',
      spenderAddress: spenderAddress
    };
  } catch (error) {
    console.error('Failed to check allowance:', error);
    throw error;
  }
};

// Get approval transaction data
export const getApprovalTransaction = async (
  chainId: number,
  tokenAddress: string,
  amount: string
) => {
  try {
    const path = 'dex/aggregator/approve-transaction';
    const url = `${OKX_API_CONFIG.baseUrl}${path}`;
    const params = {
      chainIndex: CHAIN_ID_MAP[chainId as keyof typeof CHAIN_ID_MAP] || chainId.toString(),
      tokenContractAddress: tokenAddress,
      approveAmount: amount
    };

    const timestamp = new Date().toISOString();
    const requestPath = `/api/v5/${path}`;
    const queryString = "?" + new URLSearchParams(params).toString();
    const headers = getHeaders(timestamp, 'GET', requestPath, queryString);

    console.log('OKX Approval Request:', { url, params });
    
    const response = await axios.get(url, { params, headers });
    
    console.log('OKX Approval Response:', response.data);
    
    if (response.data.code === '0') {
      return response.data.data[0];
    } else {
      throw new Error(`OKX API Error: ${response.data.msg || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Failed to get approval transaction:', error);
    throw error;
  }
};

// Get swap transaction data
export const getSwapTransaction = async (
  chainId: number,
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: string,
  slippage: string = '0.005',
  userWalletAddress: string
) => {
  try {
    const path = 'dex/aggregator/swap';
    const url = `${OKX_API_CONFIG.baseUrl}${path}`;
    const params = {
      chainIndex: CHAIN_ID_MAP[chainId as keyof typeof CHAIN_ID_MAP] || chainId.toString(),
      fromTokenAddress,
      toTokenAddress,
      amount,
      slippage,
      userWalletAddress
    };

    const timestamp = new Date().toISOString();
    const requestPath = `/api/v5/${path}`;
    const queryString = "?" + new URLSearchParams(params).toString();
    const headers = getHeaders(timestamp, 'GET', requestPath, queryString);

    console.log('OKX Swap Transaction Request:', { url, params });
    
    const response = await axios.get(url, { params, headers });
    
    console.log('OKX Swap Transaction Response:', response.data);
    
    if (response.data.code === '0') {
      return response.data.data[0];
    } else {
      throw new Error(`OKX API Error: ${response.data.msg || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Failed to get swap transaction:', error);
    throw error;
  }
};

// Get gas limit for transaction
export const getGasLimit = async (
  chainId: number,
  fromAddress: string,
  toAddress: string,
  txAmount: string = '0',
  inputData: string = ''
) => {
  try {
    const path = 'dex/pre-transaction/gas-limit';
    const url = `${OKX_API_CONFIG.baseUrl}${path}`;

    const body = {
      chainIndex: CHAIN_ID_MAP[chainId as keyof typeof CHAIN_ID_MAP] || chainId.toString(),
      fromAddress,
      toAddress,
      txAmount,
      extJson: {
        inputData
      }
    };

    const bodyString = JSON.stringify(body);
    const timestamp = new Date().toISOString();
    const requestPath = `/api/v5/${path}`;
    const headers = getHeaders(timestamp, 'POST', requestPath, "", bodyString);

    const response = await axios.post(url, body, { headers });
    
    if (response.data.code === '0') {
      return response.data.data[0].gasLimit;
    } else {
      throw new Error(`OKX API Error: ${response.data.msg || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Failed to get gas limit:', error);
    throw error;
  }
};

// Simulate transaction
export const simulateTransaction = async (
  chainId: number,
  fromAddress: string,
  toAddress: string,
  txAmount: string = '0',
  inputData: string = ''
) => {
  try {
    const path = 'dex/pre-transaction/simulate';
    const url = `${OKX_API_CONFIG.baseUrl}${path}`;

    const body = {
      chainIndex: CHAIN_ID_MAP[chainId as keyof typeof CHAIN_ID_MAP] || chainId.toString(),
      fromAddress,
      toAddress,
      txAmount,
      extJson: {
        inputData
      }
    };

    const bodyString = JSON.stringify(body);
    const timestamp = new Date().toISOString();
    const requestPath = `/api/v5/${path}`;
    const headers = getHeaders(timestamp, 'POST', requestPath, "", bodyString);

    console.log('OKX Simulation Request:', { url, body });
    
    const response = await axios.post(url, body, { headers });
    
    console.log('OKX Simulation Response:', response.data);
    
    if (response.data.code === '0') {
      return response.data.data[0];
    } else {
      throw new Error(`OKX API Error: ${response.data.msg || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Failed to simulate transaction:', error);
    throw error;
  }
};

// Check if chain is supported by OKX DEX
export const isChainSupported = (chainId: number): boolean => {
  return Object.keys(CHAIN_ID_MAP).includes(chainId.toString());
}; 
import axios from 'axios';

// Base URLs for different networks
const DEXSCREENER_BASE_URLS = {
  'base': 'https://api.dexscreener.com/tokens/v1/base/',
  'arbitrum': 'https://api.dexscreener.com/tokens/v1/arbitrum/',
  'optimism': 'https://api.dexscreener.com/tokens/v1/optimism/'
};

// Axios configuration (removed User-Agent header as browsers don't allow it)
const axiosConfig = {
  headers: {
    // Browser will automatically set appropriate headers
  }
};

// Get the appropriate DexScreener URL based on chain ID
const getDexScreenerUrl = (chainId: number): string => {
  const chainMap: Record<number, keyof typeof DEXSCREENER_BASE_URLS> = {
    8453: 'base',      // Base Mainnet
    42161: 'arbitrum', // Arbitrum Mainnet
    10: 'optimism'     // Optimism Mainnet
  };
  
  return DEXSCREENER_BASE_URLS[chainMap[chainId]] || DEXSCREENER_BASE_URLS.base;
};

// Get token price from DexScreener
export const getTokenPrice = async (contractAddress: string, chainId: number): Promise<number | null> => {
  try {
    const baseUrl = getDexScreenerUrl(chainId);
    const response = await axios.get(`${baseUrl}${contractAddress}`, axiosConfig);
    
    if (response.data && response.data.length > 0) {
      const tokenData = response.data[0];
      return parseFloat(tokenData.priceUsd);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching price for token: ${contractAddress}`, error);
    return null;
  }
};

// Get token image from DexScreener
export const getTokenImage = async (contractAddress: string, chainId: number): Promise<string | null> => {
  try {
    const baseUrl = getDexScreenerUrl(chainId);
    const response = await axios.get(`${baseUrl}${contractAddress}`, axiosConfig);
    
    if (response.data && response.data.length > 0) {
      const tokenData = response.data[0];
      
      // DexScreener doesn't provide image URLs in this format, so return null
      return null;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching image for token: ${contractAddress}`, error);
    return null;
  }
};

// Get complete token details (price, image, name, symbol)
export const getTokenDetails = async (contractAddress: string, chainId: number) => {
  try {
    const baseUrl = getDexScreenerUrl(chainId);
    console.log('DexScreener API Call:', {
      baseUrl,
      contractAddress,
      chainId,
      fullUrl: `${baseUrl}${contractAddress}`
    });

    const response = await axios.get(`${baseUrl}${contractAddress}`, axiosConfig);
    console.log('DexScreener Response:', {
      status: response.status,
      dataLength: response.data?.length,
      data: response.data
    });
    
         if (response.data && response.data.length > 0) {
       const tokenData = response.data[0];
       console.log('Token Data from DexScreener:', tokenData);
       
       // Find the token information from baseToken or quoteToken
       let tokenInfo = null;
       if (tokenData.baseToken && tokenData.baseToken.address.toLowerCase() === contractAddress.toLowerCase()) {
         tokenInfo = tokenData.baseToken;
       } else if (tokenData.quoteToken && tokenData.quoteToken.address.toLowerCase() === contractAddress.toLowerCase()) {
         tokenInfo = tokenData.quoteToken;
       }
       
       console.log('Found Token Info:', tokenInfo);
       
       if (tokenInfo) {
         const result = {
           price: parseFloat(tokenData.priceUsd),
           image: null, // DexScreener doesn't provide image URLs in this format
           name: tokenInfo.name,
           symbol: tokenInfo.symbol
         };
         
         console.log('Processed Token Details:', result);
         return result;
       }
       
       console.log('Token not found in baseToken or quoteToken');
       return null;
     }
    
    console.log('No token data found in DexScreener response');
    return null;
  } catch (error) {
    console.error(`Error fetching details for token: ${contractAddress}`, error);
    return null;
  }
};

// Get exchange rate between two tokens
export const getExchangeRate = async (fromTokenAddress: string, toTokenAddress: string, chainId: number): Promise<number | null> => {
  try {
    const [fromPrice, toPrice] = await Promise.all([
      getTokenPrice(fromTokenAddress, chainId),
      getTokenPrice(toTokenAddress, chainId)
    ]);
    
    if (fromPrice && toPrice && fromPrice > 0) {
      return toPrice / fromPrice;
    }
    return null;
  } catch (error) {
    console.error('Error calculating exchange rate:', error);
    return null;
  }
};

// Check if a chain is supported by DexScreener
export const isChainSupported = (chainId: number): boolean => {
  const supportedChains = [8453, 42161, 10]; // Base, Arbitrum, Optimism
  return supportedChains.includes(chainId);
}; 
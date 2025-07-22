import { TokenData } from "../types/tokenData";

export const getTokenAddressByChain = (token: TokenData | null, chainId?: number): string => {
    if (!token || !chainId) return "";
    switch (chainId) {
      case 84532: return token.address;
      case 421614: return token.address_arb;
      case 11155420: return token.address_op;
      case 43113: return token.address_avax;
      default: return token.address;
    }
  };
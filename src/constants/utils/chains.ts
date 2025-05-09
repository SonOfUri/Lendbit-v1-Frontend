import { SUPPORTED_CHAIN_ID } from "../../api/connection";


export const isSupportedChain = (
  chainId: number | undefined
): chainId is number =>
  chainId !== undefined && Number(chainId) === SUPPORTED_CHAIN_ID;


// export const isSupportedChain = (
//   chainId: number | undefined
// ): boolean => chainId !== undefined && SUPPORTED_CHAIN_ID.includes(chainId);
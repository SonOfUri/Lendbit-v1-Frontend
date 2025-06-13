// import { SUPPORTED_CHAIN_ID } from "../../api/connection";
import { SUPPORTED_CHAINS_ID } from "../config/chains";


// export const isSupportedChain = (
//   chainId: number | undefined
// ): chainId is number =>
//   chainId !== undefined && Number(chainId) === SUPPORTED_CHAIN_ID;


export const isSupportedChains = (
  chainId: number | undefined
): boolean => chainId !== undefined && SUPPORTED_CHAINS_ID.includes(chainId);
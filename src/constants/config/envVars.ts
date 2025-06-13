export const envVars = {
    projectID: import.meta.env.VITE_PROJECT_ID,

    lendbitHubContractAddress: import.meta.env.VITE_LENDBIT_HUB_CONTRACT_ADDRESS,

    lendbitArbSpokeContractAddress: import.meta.env.VITE_LENDBIT_ARB_SPOKE_CONTRACT_ADDRESS,

    lendbitAvaxSpokeContractAddress: import.meta.env.VITE_LENDBIT_AVAX_SPOKE_CONTRACT_ADDRESS,

    httpHubRPC: import.meta.env.VITE_HTTP_BASE_SEPOLIA_RPC,

    httpArbSpokeRPC: import.meta.env.VITE_HTTP_ARBITRUM_SEPOLIA_RPC,

    httpAvaxSpokeRPC: import.meta.env.VITE_HTTP_AVAX_SEPOLIA_RPC,

    webSocketUrl: import.meta.env.VITE_WEBSOCKET_BASE_SEPOLIA_RPC,

    api: import.meta.env.VITE_API_BASE_URL,

    multicallContract: import.meta.env.VITE_MULTICALL_ADDRESS,
};
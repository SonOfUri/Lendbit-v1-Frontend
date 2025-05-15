export const getTokenLogo = (symbol: string) => {
	const logos: Record<string, string> = {
		USDC: "/Token-Logos/usdc-base.svg",
		USDT: "/Token-Logos/usdt-base.svg",
		DAI: "/Token-Logos/dai-base.svg",
		WETH: "/Token-Logos/weth-base.svg",
		ETH: "/Token-Logos/eth-base.svg",
		LINK: "/Token-Logos/link-base.svg",
	};
	return logos[symbol] || "/Token-Logos/default-base.svg";
};

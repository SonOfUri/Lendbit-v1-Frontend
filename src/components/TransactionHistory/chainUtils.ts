export function getExplorerLink(chain: string, hash: string) {
    const baseUrls: Record<string, string> = {
        Base: "https://basescan.org/tx/",
        Optimism: "https://optimistic.etherscan.io/tx/",
        Ethereum: "https://etherscan.io/tx/",
        // Add more
    };
    return `${baseUrls[chain] || "#"}${hash}`;
}

export function getChainIcon(chain: string) {
    const icons: Record<string, string> = {
        Base: "/Token-Logos/base-base.svg",
        Optimism: "/Token-Logos/op-op.svg",
        Ethereum: "/Token-Logos/lisk-lisk.svg",
        // etc.
    };
    return icons[chain] || "/Token-Logos/base-base.svg";
}

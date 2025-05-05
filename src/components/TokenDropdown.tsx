import React, { useState } from "react";
import TokenTagSm from "./TokenTagSm";

type TokenItem = {
    symbol: string;
    icon: string;
};

const tokenList: TokenItem[] = [
    { symbol: "All Tokens", icon: "" },
    { symbol: "USDC", icon: "/Token-Logos/usdc-base.svg" },
    { symbol: "USDT", icon: "/Token-Logos/usdt-base.svg" },
    { symbol: "ETH", icon: "/Token-Logos/eth-base.svg" },
    { symbol: "WETH", icon: "/Token-Logos/weth-base.svg" },
];

type Props = {
    selected: string;
    setSelected: (val: string) => void;
};

const TokenDropdown: React.FC<Props> = ({ selected, setSelected }) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedItem = tokenList.find((t) => t.symbol === selected) || tokenList[0];

    return (
        <div className="relative w-[160px]">
            {/* Selected Display */}
            <div
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center justify-between bg-black border border-whitegray-600 px-3 py-2 rounded cursor-pointer  max-h-[300px]"
            >
                {selectedItem.symbol === "All Tokens" ? (
                    <span className="text-white text-sm">All Tokens</span>
                ) : (
                    <TokenTagSm icon={selectedItem.icon} symbol={selectedItem.symbol} />
                )}
                <span className="text-white text-sm">▼</span>
            </div>

            {/* Dropdown Items */}
            {isOpen && (
                <div className="absolute mt-2 w-full bg-black border border-white rounded shadow-md z-50">
                    {tokenList.map((token) => (
                        <div
                            key={token.symbol}
                            onClick={() => {
                                setSelected(token.symbol);
                                setIsOpen(false);
                            }}
                            className="px-3 py-2 hover:bg-[#181919] cursor-pointer flex items-center"
                        >
                            {token.symbol === "All Tokens" ? (
                                <span className="text-white text-sm">All Tokens</span>
                            ) : (
                                <TokenTagSm icon={token.icon} symbol={token.symbol} />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TokenDropdown;

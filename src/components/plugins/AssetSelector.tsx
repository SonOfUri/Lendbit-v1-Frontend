import React, { useEffect, useState } from "react";

type TokenType = {
    token: string;
    icon: string;
    tokenPrice: number;
};

type AssetSelectorProps = {
    onTokenSelect: (token: string, price: number) => void;
    onAssetValueChange: (value: string) => void;
    assetValue: string;
    userAddress: string;
    actionType: "supply" | "withdraw" | "borrow";
};

// 🧪 Dummy Token Data
const dummyTokenData: TokenType[] = [
    {
        token: "ETH",
        icon: "/Token-Logos/eth-base.svg",
        tokenPrice: 2500,
    },
    {
        token: "USDC",
        icon: "/Token-Logos/usdc-base.svg",
        tokenPrice: 1,
    },
    {
        token: "USDT",
        icon: "/Token-Logos/usdt-base.svg",
        tokenPrice: 1,
    },
    {
        token: "WETH",
        icon: "/Token-Logos/weth-base.svg",
        tokenPrice: 2500,
    },
];

// 🧪 Dummy Hooks and Balance Fetchers
const useGetValueAndHealth = () => ({
    etherPrice: 2500,
    linkPrice: 1,
    AVA: "10.5",  // ETH available balance
    AVA2: "2000", // USDC available balance
});

const getEthBalance = async () => "10.543";
const getUsdcBalance = async () => "1500.00";

const AssetSelector: React.FC<AssetSelectorProps> = ({
                                                         onTokenSelect,
                                                         onAssetValueChange,
                                                         assetValue,
                                                         userAddress,
                                                         actionType,
                                                     }) => {
    const { etherPrice, linkPrice, AVA, AVA2 } = useGetValueAndHealth();
    const [selectedToken, setSelectedToken] = useState(dummyTokenData[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [walletBalance, setWalletBalance] = useState("0");
    const [availableBal, setAvailableBalance] = useState("0");

    // Update token prices
    useEffect(() => {
        dummyTokenData.forEach((token) => {
            if (token.token === "ETH") token.tokenPrice = etherPrice;
            else if (token.token === "USDC") token.tokenPrice = linkPrice;
        });

        const updated = dummyTokenData.find((t) => t.token === selectedToken.token);
        if (updated) setSelectedToken({ ...updated });
    }, [etherPrice, linkPrice]);

    // Fetch balances
    useEffect(() => {
        const fetchBalance = async () => {
            if (!userAddress) return;
            if (selectedToken.token === "ETH") {
                setAvailableBalance(AVA);
                setWalletBalance((await getEthBalance()) || "0");
            } else if (selectedToken.token === "USDC") {
                setAvailableBalance(AVA2);
                setWalletBalance((await getUsdcBalance()) || "0");
            }
        };
        fetchBalance();
    }, [selectedToken, userAddress]);

    // Handlers
    const handleTokenSelect = (token: string) => {
        const selected = dummyTokenData.find((t) => t.token === token);
        if (selected) {
            setSelectedToken(selected);
            onTokenSelect(selected.token, selected.tokenPrice);
        }
        setIsDropdownOpen(false);
    };

    const [inputValue, setInputValue] = useState(assetValue || "");

// Sync local state when parent value changes
    useEffect(() => {
        setInputValue(assetValue || "");
    }, [assetValue]);

    const handleAssetValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const regex = /^\d*\.?\d{0,5}$/;
        if (regex.test(value)) {
            setInputValue(value);
            onAssetValueChange(value);
        }
    };

    const handleMaxClick = () => {
        const maxVal =
            actionType === "withdraw" || actionType === "borrow"
                ? (Number(availableBal) * 0.79).toFixed(5)
                : walletBalance;
        setInputValue(maxVal); // immediate update
        onAssetValueChange(maxVal); // update parent
    };


    const fiatEquivalent = (parseFloat(inputValue || "0") * selectedToken.tokenPrice).toFixed(2);

    return (
        <div className="bg-[#191818] rounded-lg p-4 w-full max-w-md shadow">
            <div className="flex justify-between items-center mb-3">
                {/* Token Dropdown */}
                <div
                    className="relative bg-[#050505] text-white rounded-md p-2 flex items-center gap-2 cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <img src={selectedToken.icon} alt={selectedToken.token} width={18} height={18} />
                    <span className="text-xs">{selectedToken.token}</span>
                    <span className="text-xs">▼</span>
                    {isDropdownOpen && (
                        <div className="absolute left-0 top-full mt-2 bg-[#050505] w-[100px] rounded z-10">
                            {dummyTokenData.map((token) => (
                                <div
                                    key={token.token}
                                    onClick={() => handleTokenSelect(token.token)}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 cursor-pointer"
                                >
                                    <img src={token.icon} alt={token.token} width={14} height={14} />
                                    <span className="text-xs">{token.token}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Amount Input + Max */}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleAssetValueChange}
                        placeholder="Enter amount"
                        className="text-right w-28 border-b-2 border-gray-300 focus:outline-none focus:border-white"
                    />

                    <button
                        onClick={handleMaxClick}
                        className="ml-2 bg-[#050505] 0hover:bg-[#000000] text-white px-2 py-1 rounded text-sm"
                    >
                        Max
                    </button>
                </div>
            </div>

            {/* Wallet Info */}
            <p className="text-xs text-gray-500 mb-2 text-left">
                {actionType === "withdraw" || actionType === "borrow" ? "Available Balance: " : "Wallet Balance: "}
                {actionType === "withdraw" || actionType === "borrow"
                    ? (Number(availableBal) * 0.79).toFixed(2)
                    : walletBalance}{" "}
                {selectedToken.token}
            </p>

            {/* Fiat value display */}
            <div className="text-xs text-white flex justify-between">
                <p>1 {selectedToken.token} = ${selectedToken.tokenPrice}</p>
                <p className="font-bold">≈ ${fiatEquivalent}</p>
            </div>
        </div>
    );
};

export default AssetSelector;

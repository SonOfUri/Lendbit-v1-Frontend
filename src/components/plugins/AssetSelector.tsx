import React, { useEffect, useState } from "react";
import { TokenData } from "../../constants/types/tokenData";
import { getEthBalance, getTokenBalance } from "../../constants/utils/getBalances";
import { formatMoney2 } from "../../constants/utils/formatMoney";
import { getTokenAddressByChain } from "../../constants/utils/getTokenAddressByChain";

type AssetSelectorProps = {
  onTokenSelect: (token: TokenData) => void;
  onAssetValueChange: (value: string) => void;
  assetValue: string;
  userAddress: string | undefined;
  actionType: "supply" | "withdraw" | "borrow" | "deposit";
  tokenData: TokenData[];
  selectedToken: TokenData | null;
  availableBal: number | null;
  chainId: number | undefined;
};

const AssetSelector: React.FC<AssetSelectorProps> = ({
  onTokenSelect,
  onAssetValueChange,
  assetValue,
  userAddress,
  actionType,
  tokenData,
  selectedToken,
  availableBal,
  chainId,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState("0");
  const [inputValue, setInputValue] = useState(assetValue || "");

  // Sync local state when parent value changes
  useEffect(() => {
    setInputValue(assetValue || "");
  }, [assetValue]);

  // Fetch balances when token or address changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (!userAddress || !selectedToken || !chainId) return;
      
      try {
        let balance;
        if (selectedToken.symbol === "ETH") {
          balance = await getEthBalance(userAddress, chainId);
        } else {
          const resolvedTokenAddress = selectedToken ? getTokenAddressByChain(selectedToken, chainId) : "";
          balance = await getTokenBalance(
            userAddress,
            resolvedTokenAddress,
            selectedToken.decimals,
            chainId
          );
        }
        setWalletBalance(balance || "0");

      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, [selectedToken, userAddress, chainId]);

  const handleTokenSelect = (token: TokenData) => {
    onTokenSelect(token);
    setIsDropdownOpen(false);
  };

  const handleAssetValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^\d*\.?\d{0,5}$/; // Allows numbers with up to 5 decimal places
    if (regex.test(value)) {
      setInputValue(value);
      onAssetValueChange(value);
    }
  };

  const handleMaxClick = () => {
    if (!selectedToken) return;
    
    const maxVal =
      actionType === "withdraw" || actionType === "borrow"
        ? (Number(availableBal) * 0.99999).toFixed(5)
        : walletBalance;
        
    setInputValue(maxVal);
    onAssetValueChange(maxVal);
  };

  if (!selectedToken) return null;

  const fiatEquivalent = (
    parseFloat(inputValue || "0") * selectedToken.price
  );

  return (
    <div className="bg-[#191818] rounded-lg p-4 w-full max-w-md shadow">
      <div className="flex justify-between items-center mb-3">
        {/* Token Dropdown */}
        <div className="relative">
          <div
            className="bg-[#050505] text-white rounded-md p-2 flex items-center gap-2 cursor-pointer min-w-[100px]"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img
              src={`/Token-Logos/${selectedToken.symbol.toLowerCase()}-base.svg`}
              alt={selectedToken.symbol}
              width={18}
              height={18}
              className="flex-shrink-0"
            //   onError={(e) => {
            //     (e.target as HTMLImageElement).src = '/Token-Logos/default-token.svg';
            //   }}
            />
            <span className="text-xs truncate">{selectedToken.symbol}</span>
            <span className="text-xs">▼</span>
          </div>
          
          {isDropdownOpen && (
            <div className="absolute left-0 top-full mt-1 bg-[#050505] w-full rounded z-10 max-h-60 overflow-y-auto">
              {tokenData.map((token) => (
                <div
                  key={token.address}
                  onClick={() => handleTokenSelect(token)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-[#1a1a1a] cursor-pointer"
                >
                  <img
                    src={`/Token-Logos/${token.symbol.toLowerCase()}-base.svg`}
                    alt={token.symbol}
                    width={14}
                    height={14}
                    className="flex-shrink-0"
                  />
                  <span className="text-xs truncate">{token.symbol}</span>
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
            placeholder="0.00"
            className="text-right w-28 bg-transparent text-white border-b-2 border-gray-300 focus:outline-none focus:border-white"
          />
          <button
            onClick={handleMaxClick}
            className="ml-2 bg-[#050505] hover:bg-[#000000] text-white px-2 py-1 rounded text-sm"
            disabled={!userAddress}
          >
            Max
          </button>
        </div>
      </div>

      {/* Balance Info */}
      <p className="text-xs text-gray-500 mb-2 text-left">
        {actionType === "withdraw" || actionType === "borrow"
          ? "Available: "
          : "Wallet: "}
        {actionType === "withdraw" || actionType === "borrow"
          ? (`${formatMoney2(availableBal?.toString())}`)
          : (`${formatMoney2(walletBalance)} ${selectedToken.symbol}`)
        }
      </p>

      {/* Fiat value display */}
      <div className="text-xs text-white flex justify-between">
        <p>
          1 {selectedToken.symbol} = ${formatMoney2(selectedToken.price)}
        </p>
        <p className="font-bold">≈ ${formatMoney2(fiatEquivalent)}</p>
      </div>
    </div>
  );
};

export default AssetSelector;
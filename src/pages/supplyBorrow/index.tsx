import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import useSupplyLiquidity from "../../hooks/write/useSupplyLiquidity";
import useCreatePositionPool from "../../hooks/write/useCreatePositionPool";
import useDashboardData from "../../hooks/read/useDashboardData";
import useTokenData from "../../hooks/read/useTokenData";
import { isSupportedChains } from "../../constants/utils/chains";
import { getEthBalance, getTokenBalance } from "../../constants/utils/getBalances";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import LoadingState from "../../components/shared/LoadingState";
import ConnectPrompt from "../../components/shared/ConnectPrompt";
import { TokenData } from "../../constants/types/tokenData";
import { formatMoney2 } from "../../constants/utils/formatMoney";
import { getTokenAddressByChain } from "../../constants/utils/getTokenAddressByChain";


const percentages = [25, 50, 75, 100];

const SupplyBorrow = () => {

    const location = useLocation();
    const state = useMemo(() => location.state || {}, [location.state]);

    const { dashboardData, isWalletConnected, dashboardDataLoading } = useDashboardData();
    const { tokenData, tokenDataLoading } = useTokenData();
    const { chainId, address, isConnected } = useWeb3ModalAccount();

    const { lending } = dashboardData || {};
    const { availableBorrow = 0 } = lending || {};

    const [mode, setMode] = useState<"supply" | "borrow">(state?.mode || "supply");
    const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);
    const [assetValue, setAssetValue] = useState<number | null>(null);
    const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [availableBal, setAvailableBal] = useState(availableBorrow || 0);

    

    useEffect(() => {
        if (tokenData && tokenData.length > 0) {
            const tokenMatch = tokenData.find(
                (t) =>
                    t.symbol.toLowerCase() === state?.tokenType?.toLowerCase()
            );
            setSelectedToken(tokenMatch || tokenData[0]);
        }
    }, [tokenData, state?.tokenType]);

    useEffect(() => {
        setAvailableBal(availableBorrow || 0);
    }, [availableBorrow]);

    useEffect(() => {
        const fetchBalance = async () => {
            if (isWalletConnected && address && isSupportedChains(chainId) && selectedToken && chainId !== undefined) {
                try {
                    let fetchBal;
                    if (selectedToken.name === "Ether") {
                        fetchBal = await getEthBalance(address, chainId);
                    } else {
                        const resolvedTokenAddress = selectedToken ? getTokenAddressByChain(selectedToken, chainId) : "";
                        
                        fetchBal = await getTokenBalance(
                            address,
                            resolvedTokenAddress,
                            selectedToken.decimals,
                            chainId
                        );
                    }
                    setWalletBalance(Number(fetchBal));
                } catch (error) {
                    console.error("Error fetching balance:", error);
                }
            }
        };
        fetchBalance();
    }, [address, chainId, isWalletConnected, selectedToken]);

    const resolvedTokenAddress = selectedToken ? getTokenAddressByChain(selectedToken, chainId) : "";
    
    const fiatEquivalent =
        selectedToken && assetValue !== null
            ? (assetValue * selectedToken.price).toFixed(2)
            : "0.00";

    const bal = mode === "borrow" ? availableBal : walletBalance;

    const handlePercentageClick = (percent: number) => {
        const value = (bal * percent) / 100;
        setAssetValue(value);
        setSelectedPercentage(percent);
    };

    const supplyLiquidity = useSupplyLiquidity(
        String(assetValue),
        resolvedTokenAddress,
        selectedToken?.decimals || 18,
        selectedToken?.name || ""
    );

    const createBorrowPosition = useCreatePositionPool();

    if ((dashboardDataLoading || tokenDataLoading) && (!dashboardData) ) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <LoadingState />
            </div>
        );
    }

    if (!isWalletConnected && !isConnected) {
        return (
            <div className="font-kaleko py-6 h-screen">
                <div className="w-full m-auto">
                    <h3 className="text-lg text-white px-2 mb-2">
                        {mode == "supply" ? "Supply Liquidity" : "Borrow Assets"}
                    </h3>
                    <ConnectPrompt />
                </div>
            </div>
        );
    }

    if (!tokenData || tokenData.length === 0 || !selectedToken) {
        return (
			<div className="w-full h-screen flex items-center justify-center">
				<LoadingState />
				<div className="mt-6">Error: Refetching available tokens...</div>
			</div>)
    }

    return (
        <div className="min-h-screen flex items-center lg:items-start justify-center p-4 lg:pt-36 lg:px-4">
            <div className="max-w-4xl w-full">
                {/* Mode Toggle */}
                <div className="flex mb-4 bg-[#050505] w-fit p-2 noise rounded">
                    <button
                        onClick={() => setMode("supply")}
                        className={`px-4 py-1 rounded ${
                            mode === "supply" ? "bg-[#DD4f00] text-white" : " text-white"
                        }`}
                    >
                        Supply
                    </button>
                    <button
                        onClick={() => setMode("borrow")}
                        className={`px-4 py-1 rounded ${
                            mode === "borrow" ? "bg-[#DD4f00] text-white" : " text-white"
                        }`}
                    >
                        Borrow
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Panel */}
                    <div className="bg-[#050505] p-4 rounded-xl shadow-1 h-fit">
                        <p className="text-gray-500 mb-2 text-left">
                            {mode === "supply" ? "I will supply" : "I will borrow"}
                        </p>

                        <div className="bg-[#181919] noise-no-overflow rounded-md p-2">
                            <div className="flex items-center mb-4 justify-between">
                                <input
                                    type="number"
                                    value={assetValue ?? ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setAssetValue(value === "" ? null : Number(value));
                                    }}
                                    className="border-b-2 border-gray-400 focus:outline-none focus:border-black text-lg w-28"
                                />
                                <div
                                    className={`relative mb-4 cursor-pointer`}
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={`/Token-Logos/${selectedToken.symbol.toLowerCase()}-base.svg`}
                                            alt="token"
                                            className="w-6 h-6"
                                        />
                                        <span>{selectedToken.symbol}</span>
                                        <img
                                            src="/arrows.svg"
                                            alt="dropdown arrow"
                                            className="w-4 h-4"
                                        />
                                    </div>
                                    {dropdownOpen && (
                                        <div className="top-full absolute mt-2 bg-[#181919] rounded shadow w-32 z-20">
                                            {tokenData.map((token) => (
                                                <div
                                                    key={token.address}
                                                    className="p-2 hover:bg-[#050505] flex gap-2 items-center"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedToken(token);
                                                        setDropdownOpen(false);
                                                        setAssetValue(0);
                                                        setSelectedPercentage(null);
                                                    }}
                                                >
                                                    <img
                                                        src={`/Token-Logos/${token.symbol.toLowerCase()}-base.svg`}
                                                        className="w-5 h-5"
                                                        alt={token.symbol}
                                                    />
                                                    <span>{token.symbol}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center mb-4 justify-between">
                                <p className="text-sm ml-2 text-gray-500 text-left">
                                    Bal: {formatMoney2(bal)}
                                </p>
                                <p className="text-sm text-gray-600 mb-4 text-left">~ ${fiatEquivalent}</p>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {percentages.map((p) => (
                                    <button
                                        key={p}
                                        className={`border px-2 py-1 rounded ${
                                            selectedPercentage === p ? "border-black" : "border-gray-300"
                                        }`}
                                        onClick={() => handlePercentageClick(p)}
                                    >
                                        {p}%
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="bg-[#050505] p-4 rounded-xl noise shadow-1">
                        <p className="text-gray-500 mb-2 text-left">Overview</p>

                        <div className="bg-[#181919] rounded-md p-2">
                            <div className="flex items-center justify-between border-y border-black py-4">
                                <div className="flex gap-3 items-center">
                                    <img
                                        src={`/Token-Logos/${selectedToken.symbol.toLowerCase()}-base.svg`}
                                        className="w-8 h-8"
                                        alt="token"
                                    />
                                    <div className="text-left">
                                        <p className="text-sm font-semibold">{selectedToken.name}</p>
                                        <p className="text-white">{assetValue}</p>
                                        <p className="text-xs">${fiatEquivalent}</p>
                                    </div>
                                </div>
                                <img src="/icons/low-risk.svg" className="w-8 h-6" alt="meter" />
                            </div>

                            <div className="mt-4 text-left">
                                <p className="text-sm text-gray-500 mb-1">
                                    {mode === "supply" ? "Supply APY" : "Borrow APR"}
                                </p>
                                <p className="text-xl text-white">
                                    {mode === "supply"
                                        ? `${selectedToken.apy}%`
                                        : `${selectedToken.apr}%`}
                                </p>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-1 text-left">
                                    {mode === "supply" ? "Monthly Yield" : "Monthly Cost"}
                                </p>
                                <p className="text-xl text-white text-left">
                                    $
                                    {mode === "supply"
                                        ? (
                                            (Math.pow(1 + selectedToken.apy, 1 / 12) - 1) *
                                            Number(fiatEquivalent)
                                        ).toFixed(2)
                                        : ((selectedToken.apr * Number(fiatEquivalent)) / 12).toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {mode === "supply" && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    supplyLiquidity();
                                    setDropdownOpen(false);
                                    setAssetValue(0);
                                    setSelectedPercentage(null);
                                }}
                                disabled={!assetValue || assetValue <= 0}
                                className={`w-full mt-6 bg-[#DD4f00] hover:bg-[#DD4f00] text-white font-bold py-2 cursor-pointer rounded ${
                                    !assetValue || assetValue <= 0 ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            >
                                Start Earning
                            </button>
                        )}

                        {mode === "borrow" && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    createBorrowPosition(
                                        String(assetValue),
                                        resolvedTokenAddress,
                                        selectedToken.decimals,
                                        selectedToken.name
                                    );
                                    setDropdownOpen(false);
                                    setAssetValue(0);
                                    setSelectedPercentage(null);
                                }}
                                disabled={!assetValue || assetValue <= 0}
                                className={`w-full mt-6 bg-[#DD4f00] hover:bg-[#DD4f00] text-white font-bold py-2 cursor-pointer rounded ${
                                    !assetValue || assetValue <= 0 ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            >
                                Borrow Now
                            </button>
                        )}
                    </div>
                </div>
            </div>


        </div>

    );
};

export default SupplyBorrow;

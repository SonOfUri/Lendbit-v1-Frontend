import { useState } from "react";

const dummyTokens = [
    {
        token: "USDC",
        name: "USD Coin",
        icon: "/Token-Logos/usdc-base.svg",
        price: 1.0,
        balance: 1000,
    },
    {
        token: "WETH",
        name: "Wrapped Ether",
        icon: "/Token-Logos/weth-base.svg",
        price: 2800,
        balance: 2,
    },
];

const percentages = [25, 50, 75, 100];

const SupplyBorrow = () => {
    const [mode, setMode] = useState<"supply" | "borrow">("supply");
    const [selectedToken, setSelectedToken] = useState(dummyTokens[0]);
    const [assetValue, setAssetValue] = useState<number>(0);
    const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const fiatEquivalent = (assetValue * selectedToken.price).toFixed(2);
    const availableBal = mode === "borrow" ? 500 : selectedToken.balance; // Dummy available

    const handlePercentageClick = (percent: number) => {
        const value = (availableBal * percent) / 100;
        setAssetValue(value);
        setSelectedPercentage(percent);
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            {/* Mode Toggle */}
            <div className="flex gap-4 mb-4">
                <button onClick={() => setMode("supply")} className={`px-4 py-1 rounded ${mode === "supply" ? "bg-[#DD4f00] text-white" : "bg-gray-800 text-gray-400"}`}>
                    Supply
                </button>
                <button onClick={() => setMode("borrow")} className={`px-4 py-1 rounded ${mode === "borrow" ? "bg-[#DD4f00] text-white" : "bg-gray-800 text-gray-400"}`}>
                    Borrow
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Panel */}
                <div className="bg-black p-4 rounded-xl h-fit noise shadow-1">
                    <p className="text-gray-500 mb-2 text-left">{mode === "supply" ? "I will deposit" : "I will borrow"}</p>

                    <div className="bg-[#181919] rounded-md p-2">
                    <div className="flex items-center mb-4 justify-between">
                        <input
                            type="number"
                            value={assetValue}
                            onChange={(e) => setAssetValue(Number(e.target.value))}
                            className="border-b-2 border-gray-400 focus:outline-none focus:border-black text-lg w-28"
                        />
                        <div className={`relative mb-4 ${mode === "borrow" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`} onClick={() => mode === "supply" && setDropdownOpen(!dropdownOpen)}>
                            <div className="flex items-center gap-2">
                                <img src={selectedToken.icon} alt="token" className="w-6 h-6" />
                                <span>{selectedToken.token}</span>
                                <span><img src="/arrows.svg" alt="dropdown arrow" className="items-center w-4 h-4"/></span>
                            </div>
                            {dropdownOpen && (
                                <div className="absolute top-10 bg-[#181919] rounded shadow w-32 z-10">
                                    {dummyTokens.map((token) => (
                                        <div
                                            key={token.token}
                                            className="p-2 hover:bg-black flex gap-2 items-center"
                                            onClick={() => {
                                                setSelectedToken(token);
                                                setDropdownOpen(false);
                                                setAssetValue(0);
                                                setSelectedPercentage(null);
                                            }}
                                        >
                                            <img src={token.icon} className="w-5 h-5" alt={token.token} />
                                            <span>{token.token}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center mb-4 justify-between">
                        <p className="text-sm ml-2 text-gray-500 text-left">Bal: {availableBal}</p>
                        <p className="text-sm text-gray-600 mb-4 text-left">~ ${fiatEquivalent}</p>
                    </div>


                    <div className="grid grid-cols-4 gap-2">
                        {percentages.map((p) => (
                            <button
                                key={p}
                                className={`border px-2 py-1 rounded ${selectedPercentage === p ? "border-black" : "border-gray-300"}`}
                                onClick={() => handlePercentageClick(p)}
                            >
                                {p}%
                            </button>
                        ))}
                    </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="bg-black p-4 rounded-xl noise shadow-1">
                    <p className="text-gray-500 mb-2 text-left">Overview</p>

                    <div className="bg-[#181919] rounded-md p-2">

                    <div className="flex items-center justify-between border-y border-black py-4">
                        <div className="flex gap-3 items-center">
                            <img src={selectedToken.icon} className="w-8 h-8" alt="token" />
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
                        <p className="text-xl text-white">{mode === "supply" ? "6.5%" : "5.3%"}</p>
                    </div>

                    <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-1 text-left">
                            {mode === "supply" ? "Monthly Yield" : "Monthly Cost"}
                        </p>
                        <p className="text-xl text-white text-left">
                            ${mode === "supply"
                            ? ((Math.pow(1 + 0.065, 1 / 12) - 1) * Number(fiatEquivalent)).toFixed(2)
                            : ((0.053 * Number(fiatEquivalent)) / 12).toFixed(2)}
                        </p>
                    </div>

                    </div>

                    <button className="w-full mt-6 bg-[#DD4f00] hover:bg-[#DD4f00] text-white font-bold py-2 rounded">
                        {mode === "supply" ? "Start Earning" : "Borrow Now"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SupplyBorrow;

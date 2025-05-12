import TokenTagSm from "./TokenTagSm.tsx";
import CustomBtn1 from "./CustomBtn1.tsx";

const LiquiditySuppliesTable = () => {
    const data = [
        {
            icon: "/Token-Logos/usdc-base.svg",
            symbol: "USDC",
            amount: "9.1K",
            usd: "$9.1k",
            apy: "6.46%",
            interest: "$3.50",
            date: "1/2/2025",
        },
        {
            icon: "/Token-Logos/usdt-base.svg",
            symbol: "USDT",
            amount: "9.1K",
            usd: "$9.1k",
            apy: "5.31%",
            interest: "$12.50",
            date: "1/2/2025",
        },
        {
            icon: "/Token-Logos/weth-base.svg",
            symbol: "WETH",
            amount: "12",
            usd: "$21.5k",
            apy: "5.30%",
            interest: "$6.50",
            date: "1/2/2025",
        },
        {
            icon: "/Token-Logos/eth-base.svg",
            symbol: "ETH",
            amount: "3",
            usd: "$5.3k",
            apy: "4.57%",
            interest: "$316.00",
            date: "1/2/2025",
        },
    ];

    return (
        <div className="w-full ">
            <h2 className="text-xl font-bold text-left py-4">Supplies</h2>

            <div className="grid grid-cols-6 gap-4 p-4 bg-[#191818] rounded-t-md font-semibold text-sm text-left text-white noise shadow-1 ">
                <span>Assets</span>
                <span>Amount</span>
                <span>APY</span>
                <span>Accrued Interest</span>
                <span>Supplied Since</span>
                <span>Actions</span>
            </div>

            <div className="bg-black p-4 rounded-b-md overflow-x-scroll noise shadow-1">
                {data.map(({ icon, symbol, amount, usd, apy, interest, date }) => (
                    <div
                        key={symbol}
                        className="grid grid-cols-6 gap-4 py-3 text-sm items-center text-left"
                    >
                        <TokenTagSm icon={icon} symbol={symbol} />

                        <div className="flex flex-col">
                            <span className="font-bold">{amount}</span>
                            <span className="text-xs text-gray-400">{usd}</span>
                        </div>

                        <div className="font-semibold">{apy}</div>
                        <div className="text-white">{interest}</div>
                        <div className="text-white">{date}</div>

                        <div className="flex gap-2 justify-start">
                            <CustomBtn1 label="Supply" variant="primary" />
                            <CustomBtn1 label="Close" variant="secondary" />
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
};

export default LiquiditySuppliesTable;

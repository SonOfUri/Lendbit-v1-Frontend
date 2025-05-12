import TokenTagSm from "./TokenTagSm.tsx";
import CustomBtn1 from "./CustomBtn1.tsx";

const LiquidityBorrowsTable = () => {
    const data = [
        {
            icon: "/Token-Logos/usdc-base.svg",
            symbol: "USDC",
            amount: "9.1K",
            usd: "$9.1k",
            apr: "6.46%",
            cost: "$3.50",
            date: "1/2/2025",
        },
        {
            icon: "/Token-Logos/usdt-base.svg",
            symbol: "USDT",
            amount: "9.1K",
            usd: "$9.1k",
            apr: "5.31%",
            cost: "$12.50",
            date: "1/2/2025",
        },
        {
            icon: "/Token-Logos/weth-base.svg",
            symbol: "WETH",
            amount: "12",
            usd: "$21.5k",
            apr: "5.30%",
            cost: "$6.50",
            date: "1/2/2025",
        },
        {
            icon: "/Token-Logos/eth-base.svg",
            symbol: "ETH",
            amount: "3",
            usd: "$5.3k",
            apr: "4.57%",
            cost: "$316.00",
            date: "1/2/2025",
        },
    ];

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-left py-4">Borrows</h2>

            <div className="grid grid-cols-6 gap-4  font-semibold text-sm text-left text-white p-4 bg-[#181919] rounded-t-md noise shadow-1">
                <span>Assets</span>
                <span>Amount</span>
                <span>APR</span>
                <span>Accrued Cost</span>
                <span>Borrowed Since</span>
                <span>Actions</span>
            </div>

            <div className="bg-[#050505] rounded-b-md p-4 overflow-x-scroll noise shadow-1">
                {data.map(({ icon, symbol, amount, usd, apr, cost, date }) => (
                    <div
                        key={symbol}
                        className="grid grid-cols-6 gap-4 py-3 text-sm items-center text-left"
                    >
                        <TokenTagSm icon={icon} symbol={symbol} />

                        <div className="flex flex-col">
                            <span className="font-bold">{amount}</span>
                            <span className="text-xs text-gray-400">{usd}</span>
                        </div>

                        <div className="font-semibold">{apr}</div>
                        <div className="text-white">{cost}</div>
                        <div className="text-white">{date}</div>

                        <div className="flex gap-2 justify-start">
                            <CustomBtn1 label="Borrow" variant="primary" />
                            <CustomBtn1 label="Repay" variant="secondary" />
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
};

export default LiquidityBorrowsTable;

import TokenTagSm from "./TokenTagSm.tsx";
import CustomBtn1 from "./CustomBtn1.tsx";

const DashboardBorrowsTable = () => {
    const data = [
        {
            icon: "/Token-Logos/usdc-base.svg",
            symbol: "USDC",
            amount: "9.1K",
            usd: "$9.1k",
            apr: "6.46%",
            collateral: ["/Token-Logos/usdc-base.svg", "/Token-Logos/usdt-base.svg"],
            dueIn: "-",
        },
        {
            icon: "/Token-Logos/usdt-base.svg",
            symbol: "USDT",
            amount: "9.1K",
            usd: "$9.1k",
            apr: "5.31%",
            collateral: ["/Token-Logos/usdt-base.svg", "/Token-Logos/eth-base.svg"],
            dueIn: "12 Day(s)",
        },
        {
            icon: "/Token-Logos/weth-base.svg",
            symbol: "WETH",
            amount: "12",
            usd: "$21.5k",
            apr: "5.30%",
            collateral: ["/Token-Logos/usdc-base.svg", "/Token-Logos/weth-base.svg", "/Token-Logos/eth-base.svg"],
            dueIn: "-",
        },
        {
            icon: "/Token-Logos/eth-base.svg",
            symbol: "ETH",
            amount: "3",
            usd: "$5.3k",
            apr: "4.57%",
            collateral: ["/Token-Logos/eth-base.svg", "/Token-Logos/weth-base.svg"],
            dueIn: "2 Day(s)",
        },
        {
            icon: "/Token-Logos/usdc-base.svg",
            symbol: "USDC",
            amount: "3",
            usd: "$5.3k",
            apr: "4.57%",
            collateral: ["/Token-Logos/usdc-base.svg", "/Token-Logos/usdt-base.svg"],
            dueIn: "64 Day(s)",
        },
        {
            icon: "/Token-Logos/usdc-base.svg",
            symbol: "USDC",
            amount: "3",
            usd: "$5.3k",
            apr: "4.57%",
            collateral: ["/Token-Logos/usdt-base.svg", "/Token-Logos/eth-base.svg"],
            dueIn: "365 Day(s)",
        },
    ];

    return (
        <div className="text-white w-full">
            <h2 className="text-xl font-bold mb-2 text-left">Borrows</h2>

            <div className="bg-black rounded-md p-4">
                <div className="grid grid-cols-6 gap-4 py-2 font-semibold text-sm text-left">
                    <span>Assets</span>
                    <span>Borrow</span>
                    <span>APR</span>
                    <span>Collateral</span>
                    <span>Due In</span>
                    <span>Action</span>
                </div>

                {data.map(({ icon, symbol, amount, usd, apr, collateral, dueIn }, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-6 gap-4 py-3 items-center text-left "
                    >
                        <TokenTagSm icon={icon} symbol={symbol} />

                        <div className="flex flex-col">
                            <span className="font-bold text-sm">{amount}</span>
                            <span className="text-xs text-gray-400">{usd}</span>
                        </div>

                        <div className="font-semibold text-sm">{apr}</div>

                        <div className="flex -space-x-2">
                            {collateral.map((src, j) => (
                                <img
                                    key={j}
                                    src={src}
                                    alt={`collateral-${j}`}
                                    width={20}
                                    height={20}
                                    className=""
                                    style={{ marginLeft: j === 0 ? "0" : "-1px" }}
                                />
                            ))}
                        </div>

                        <div className="text-sm text-gray-300">{dueIn}</div>

                        <div className="flex justify-start">
                            <CustomBtn1 label="Repay" variant="secondary" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardBorrowsTable;

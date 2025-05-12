import { useEffect, useState } from "react";
import CustomBtn1 from "../plugins/CustomBtn1";
import TokenTagSm from "../plugins/TokenTagSm";
import { formatMoney, formatMoney2 } from "../../constants/utils/formatMoney";


interface Asset {
    asset: string;
    amount: number;
    value: number;
    isCollateral: boolean;
    apy: number | null;
}

interface DashboardPortfolioTableProps {
  portfolio: {
    totalValue: number;
    assets: Asset[];
  };
  maxWithdrawal: {
    total: number;
    assets: {
      asset: string;
      amount: number;
    }[];
  };
}


const DashboardPortfolioTable = ({ portfolio, maxWithdrawal }: DashboardPortfolioTableProps) => {
	const [assets, setAssets] = useState<Asset[]>([]);

    useEffect(() => {
        setAssets(portfolio.assets);
    }, [portfolio.assets]);

    const toggleCollateral = (symbol: string) => {
        setAssets(prev =>
            prev.map(asset =>
                asset.asset === symbol
                    ? { ...asset, isCollateral: !asset.isCollateral }
                    : asset
            )
        );
    };



    const getIconPath = (symbol: string) =>
        `/Token-Logos/${symbol.toLowerCase()}-base.svg`;

    return (
        <div className="text-white w-full h-full">
            <div className="flex justify-between items-center mb-2 px-2">
                <h2 className="text-xl font-bold">My Portfolio</h2>
            </div>

            <div className="noise shadow-1 rounded-md">
                <div className="text-sm text-gray-300 flex justify-between p-4 rounded-t-md bg-[#050505] noise shadow-1 ">
                    <div>Total Balance: <span className="font-semibold text-white">${formatMoney2(portfolio.totalValue)}</span></div>
                    <div>Max Withdrawal: <span className="font-semibold text-white">${formatMoney2(maxWithdrawal.total)}</span></div>
                </div>

                <div className="border-t border-gray-700 p-4 bg-[#050505] rounded-b-md overflow-x-auto overflow-y-auto max-h-[300px]">
                    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.5fr] gap-4 py-2 font-semibold text-sm text-left">
                        <span>Assets</span>
                        <span>Deposit</span>
                        <span>APY</span>
                        <span>Collateral</span>
                        <span>Actions</span>
                    </div>

                    {assets.map(({ asset, amount, value, apy, isCollateral }) => (
                        <div
                            key={asset}
                            className="grid grid-cols-[1fr_1fr_1fr_1fr_1.5fr] gap-4 py-3 items-center text-left"
                        >
                            <TokenTagSm icon={getIconPath(asset)} symbol={asset} />

                            <div className="flex flex-col">
                                <span className="font-bold text-sm">{formatMoney(amount)}</span>
                                <span className="text-xs text-gray-400">${formatMoney(value)}</span>
                            </div>

                            <div className="font-semibold text-sm">{apy !== null ? `${apy.toFixed(2)}%` : "0.00%"}</div>

                            <button onClick={() => toggleCollateral(asset)}>
                                <img
                                    src={isCollateral ? "/toggle-on.svg" : "/toggle-off.svg"}
                                    alt="Toggle"
                                    width={28}
                                    height={28}
                                />
                            </button>

                            <div className="flex gap-2 justify-start">
                                <CustomBtn1 label="Withdraw" variant="secondary" />
                                <CustomBtn1
                                    label={isCollateral ? "Deposit" : "Supply"}
                                    variant="primary"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardPortfolioTable;
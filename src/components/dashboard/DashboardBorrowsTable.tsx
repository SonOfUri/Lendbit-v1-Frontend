import { useEffect, useState } from "react";
import CustomBtn1 from "../plugins/CustomBtn1";
import TokenTagSm from "../plugins/TokenTagSm";
import { formatDueDate } from "../../constants/utils/formatDate";
import { formatMoney } from "../../constants/utils/formatMoney";
import useTokenData from "../../hooks/read/useTokenData";
import { useNavigate } from "react-router-dom";

interface Borrow {
  asset: string;
  amount: number;
  apr: number;
  dueDate?: string;
  source: string;
  collateralTokens?: string[];
}

interface DashboardBorrowsTableProps {
  dashboardData: {
    lending?: {
      borrows?: Borrow[];
    };
    portfolio?: {
      assets?: Array<{
        asset: string;
        value: number;
        isCollateral: boolean;
        amount: number;
      }>;
    };
  };
  isLoading?: boolean;
}

interface RowData {
  icon: string;
  symbol: string;
  amount: string;
  usdValue: string;
  apr: string;
  dueIn: string;
  collateralIcons: string[];
  source: string;
}

const DashboardBorrowsTable = ({ 
  dashboardData, 
  isLoading = false 
}: DashboardBorrowsTableProps) => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<RowData[]>([]);
  const { tokenData } = useTokenData();

  useEffect(() => {
    if (!dashboardData || isLoading || !tokenData) return;

    const { lending, portfolio } = dashboardData;
    const borrows = lending?.borrows || [];
    const assets = portfolio?.assets || [];

    const tokenPriceBySymbol = tokenData.reduce((acc, token) => {
        acc[token.symbol.toUpperCase()] = token.price;
        return acc;
    }, {} as Record<string, number>);

    const availableCollateral = assets
        .filter(asset => asset.isCollateral && asset.amount > 0)
        .map(asset => asset.asset);

    const processedRows = borrows.map((borrow) => {
        const tokenPrice = tokenPriceBySymbol[borrow.asset.toUpperCase()] || 0;
        const usdValue = borrow.amount * tokenPrice;
        
        const collateralAssets = borrow.collateralTokens?.length 
            ? borrow.collateralTokens 
            : availableCollateral;

        return {
            icon: `/Token-Logos/${borrow.asset.toLowerCase()}-base.svg`,
            symbol: borrow.asset,
            amount: formatMoney(borrow.amount),
            usdValue: `$${formatMoney(usdValue)}`,
            apr: `${(borrow.apr).toFixed(2)}%`,
            dueIn: borrow.dueDate ? formatDueDate(borrow.dueDate) : "-",
            collateralIcons: collateralAssets
                .map(asset => `/Token-Logos/${asset.toLowerCase()}-base.svg`),
            source: borrow.source
        };
    });

    setRows(processedRows);
}, [dashboardData, tokenData, isLoading]);

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-8 h-[310px]">
      <p className="text-gray-400 text-center">
        You have no active borrows
      </p>
    </div>
  );

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-8 h-[310px]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4"></div>
      <p className="text-gray-400">Loading borrows...</p>
    </div>
  );

  const handleRepayClick = (source: string) => {
    navigate('/positions', {
        state: { 
            activeBorrowTab: source === 'LP' ? 'liquidity' : 'p2p',
            shouldScrollToBorrows: true 
        }
    });
  };

  return (
    <div className="text-white w-full h-full">
      <h2 className="text-xl font-bold mb-2 text-left px-2">Borrows</h2>

      <div className="bg-[#050505] rounded-md overflow-hidden shadow-1 noise">
        {rows.length > 0 && (
          <div className="grid grid-cols-6 gap-4 py-3 px-4 font-semibold text-sm text-left">
            <span>Assets</span>
            <span>Borrow</span>
            <span>APR</span>
            <span>Collateral</span>
            <span>Due In</span>
            <span>Action</span>
          </div>
        )}

        <div className="overflow-y-auto max-h-[310px] bg-[#050505]">
          {isLoading ? (
            renderLoadingState()
          ) : rows.length === 0 ? (
            renderEmptyState()
          ) : (
            rows.map((row, i) => (
              <div
                key={`${row.symbol}-${i}-${row.source}`}
                className="grid grid-cols-6 gap-4 py-3 px-4 items-center text-left border-t border-gray-800"
              >
                <TokenTagSm icon={row.icon} symbol={row.symbol} />

                <div className="flex flex-col">
                  <span className="font-bold text-sm">{row.amount}</span>
                  <span className="text-xs text-gray-400">{row.usdValue}</span>
                </div>

                <div className="font-semibold text-sm">{row.apr}</div>

                <div className="flex -space-x-2">
                  {row.collateralIcons.map((src, j) => (
                    <img
                      key={`${row.symbol}-collateral-${j}`}
                      src={src}
                      alt={`${row.symbol}-collateral`}
                      width={24}
                      height={24}
                      className="rounded-full border border-gray-700"
                      style={{ marginLeft: j === 0 ? "0" : "-6px" }}
                    />
                  ))}
                </div>

                <div className="text-sm text-gray-300">{row.dueIn}</div>

                <div className="flex justify-start">
                  <CustomBtn1 
                    label="Repay" 
                    variant="secondary" 
                    onClick={() => handleRepayClick(row.source)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardBorrowsTable;
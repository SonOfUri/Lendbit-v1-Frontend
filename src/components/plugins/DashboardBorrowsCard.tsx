import TokenTagSm from "./TokenTagSm.tsx";
import CustomBtn1 from "./CustomBtn1.tsx";
import { useWeb3Modal } from "@web3modal/ethers/react";

const DashboardBorrowsTable = () => {
  const data = [
    {
      icon: "/Token-Logos/usdc-base.svg",
      symbol: "USDC",
      amount: "0",
			usd: "$0k",
      apr: "6.46%",
      collateral: ["/Token-Logos/usdc-base.svg", "/Token-Logos/usdt-base.svg"],
      dueIn: "-",
    },
    {
      icon: "/Token-Logos/usdt-base.svg",
      symbol: "USDT",
      amount: "0",
			usd: "$0.00k",
      apr: "5.31%",
      collateral: ["/Token-Logos/usdt-base.svg", "/Token-Logos/eth-base.svg"],
      dueIn: "12 Day(s)",
    },
    {
      icon: "/Token-Logos/weth-base.svg",
      symbol: "WETH",
      amount: "0",
			usd: "$0.00k",
      apr: "5.30%",
      collateral: ["/Token-Logos/usdc-base.svg", "/Token-Logos/weth-base.svg", "/Token-Logos/eth-base.svg"],
      dueIn: "-",
    },
    {
      icon: "/Token-Logos/eth-base.svg",
      symbol: "ETH",
      amount: "0",
			usd: "$0.00k",
      apr: "4.57%",
      collateral: ["/Token-Logos/eth-base.svg", "/Token-Logos/weth-base.svg"],
      dueIn: "2 Day(s)",
    },
    {
      icon: "/Token-Logos/usdc-base.svg",
      symbol: "USDC",
      amount: "0",
			usd: "$0.00k",
      apr: "4.57%",
      collateral: ["/Token-Logos/usdc-base.svg", "/Token-Logos/usdt-base.svg"],
      dueIn: "64 Day(s)",
    },
    {
      icon: "/Token-Logos/usdc-base.svg",
      symbol: "USDC",
      amount: "0",
			usd: "$0.00k",
      apr: "4.57%",
      collateral: ["/Token-Logos/usdt-base.svg", "/Token-Logos/eth-base.svg"],
      dueIn: "365 Day(s)",
    },
  ];

  const { open } = useWeb3Modal();
  const walletConnect = () => {
    open();
  };

  return (
    <div className="text-white w-full h-full">
      <h2 className="text-xl font-bold mb-2 text-left px-2">Borrows</h2>

      <div className="bg-[#050505] rounded-md overflow-hidden shadow-1 noise ">
        <div className="grid grid-cols-6 gap-4 py-3 px-4 font-semibold text-sm text-left">
          <span>Assets</span>
          <span>Borrow</span>
          <span>APR</span>
          <span>Collateral</span>
          <span>Due In</span>
          <span>Action</span>
        </div>

        <div className="overflow-y-hidden max-h-[310px] relative">
          <div className="absolute inset-0 bg-[#87878720] bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <img onClick={walletConnect} src="/connect.svg" alt="Connect Icon" className="w-20 h-20 cursor-pointer" />
          </div>
          {data.map(({ icon, symbol, amount, usd, apr, collateral, dueIn }, i) => (
            <div
              key={i}
              className="grid grid-cols-6 gap-4 py-3 px-4 items-center text-left"
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
                    className="rounded-full"
                    style={{ marginLeft: j === 0 ? "0" : "-6px" }}
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
    </div>
  );
};

export default DashboardBorrowsTable;
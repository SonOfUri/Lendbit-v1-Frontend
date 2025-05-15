// import TokenTagLg from "./TokenTagLg.tsx";
// import CustomBtn1 from "./CustomBtn1.tsx";
//
// type Props = {
// 	tokenName: string;
// 	tokenSymbol: string;
// 	icon: string;
// 	riskLevel: "low" | "mid" | "high" | "medium";
// 	totalSupplied: string;
// 	supplyApy: string;
// 	totalBorrowed: string;
// 	borrowApr: string;
// 	onSupplyClick?: () => void;
// 	onBorrowClick?: () => void;
// };
//
// const LiquidityPoolCard: React.FC<Props> = ({
// 	tokenName,
// 	tokenSymbol,
// 	icon,
// 	riskLevel,
// 	totalSupplied,
// 	supplyApy,
// 	totalBorrowed,
// 	borrowApr,
// 	onSupplyClick,
// 	onBorrowClick,
// }) => {
// 	const getRiskIcon = () => {
// 		switch (riskLevel) {
// 			case "low":
// 				return "/icons/low-risk.svg";
// 			case "mid":
//             case "medium":
// 				return "/icons/mid-risk.svg";
// 			case "high":
// 				return "/icons/high-risk.svg";
// 			default:
// 				return "";
// 		}
// 	};
//
// 	return (
// 		<div className="bg-[#050505] text-white rounded-xl p-4 w-full max-w-sm flex flex-col justify-between shadow-md noise shadow-1">
// 			<div className="flex justify-between items-start mb-4">
// 				<TokenTagLg icon={icon} name={tokenName} symbol={tokenSymbol} />
// 			</div>
//
// 			<div className="text-sm space-y-2 mb-6">
// 				<div className="flex justify-between items-center">
// 					<span className="text-gray-400">Risk Level</span>
// 					<div className="flex flex-col items-center text-right">
// 						<img
// 							src={getRiskIcon()}
// 							alt={`${riskLevel} risk`}
// 							width={20}
// 							height={20}
// 						/>
// 						<span className="text-[7.5px] text-gray-300 mt-1 uppercase">
// 							{riskLevel} Risk
// 						</span>
// 					</div>
// 				</div>
//
// 				<div className="flex justify-between">
// 					<span className="text-gray-400">Total Supplied</span>
// 					<span className="font-semibold">{totalSupplied}</span>
// 				</div>
//
// 				<div className="flex justify-between">
// 					<span className="text-gray-400">Supply APY</span>
// 					<span className="font-semibold">{supplyApy}</span>
// 				</div>
//
// 				<div className="flex justify-between">
// 					<span className="text-gray-400">Total Borrowed</span>
// 					<span className="font-semibold">{totalBorrowed}</span>
// 				</div>
//
// 				<div className="flex justify-between">
// 					<span className="text-gray-400">Borrow APR</span>
// 					<span className="font-semibold">{borrowApr}</span>
// 				</div>
// 			</div>
//
// 			<div className="flex gap-4 justify-center">
// 				<CustomBtn1 label="Supply" variant="primary" onClick={onSupplyClick} />
// 				<CustomBtn1
// 					label="Borrow"
// 					variant="secondary"
// 					onClick={onBorrowClick}
// 				/>
// 			</div>
// 		</div>
// 	);
// };
//
// export default LiquidityPoolCard;


import { useNavigate } from "react-router-dom";
import TokenTagLg from "./TokenTagLg.tsx";
import CustomBtn1 from "./CustomBtn1.tsx";

type Props = {
	tokenName: string;
	tokenSymbol: string;
	icon: string;
	riskLevel: "low" | "mid" | "high" | "medium";
	totalSupplied: string;
	supplyApy: string;
	totalBorrowed: string;
	borrowApr: string;
	onSupplyClick?: () => void;
	onBorrowClick?: () => void;
};

const LiquidityPoolCard: React.FC<Props> = ({
												tokenName,
												tokenSymbol,
												icon,
												riskLevel,
												totalSupplied,
												supplyApy,
												totalBorrowed,
												borrowApr,
											}) => {
	const navigate = useNavigate();

	const getRiskIcon = () => {
		switch (riskLevel) {
			case "low":
				return "/icons/low-risk.svg";
			case "mid":
			case "medium":
				return "/icons/mid-risk.svg";
			case "high":
				return "/icons/high-risk.svg";
			default:
				return "";
		}
	};

	const handleSupplyClick = () => {
		navigate(
			`/supply-borrow?mode=supply&symbol=${encodeURIComponent(
				tokenSymbol
			)}&name=${encodeURIComponent(tokenName)}`
		);
	};

	const handleBorrowClick = () => {
		navigate(
			`/supply-borrow?mode=borrow&symbol=${encodeURIComponent(
				tokenSymbol
			)}&name=${encodeURIComponent(tokenName)}`
		);
	};

	return (
		<div className="bg-[#050505] text-white rounded-xl p-4 w-full max-w-sm flex flex-col justify-between shadow-md noise shadow-1">
			<div className="flex justify-between items-start mb-4">
				<TokenTagLg icon={icon} name={tokenName} symbol={tokenSymbol} />
			</div>

			<div className="text-sm space-y-2 mb-6">
				<div className="flex justify-between items-center">
					<span className="text-gray-400">Risk Level</span>
					<div className="flex flex-col items-center text-right">
						<img
							src={getRiskIcon()}
							alt={`${riskLevel} risk`}
							width={20}
							height={20}
						/>
						<span className="text-[7.5px] text-gray-300 mt-1 uppercase">
							{riskLevel} Risk
						</span>
					</div>
				</div>

				<div className="flex justify-between">
					<span className="text-gray-400">Total Supplied</span>
					<span className="font-semibold">{totalSupplied}</span>
				</div>

				<div className="flex justify-between">
					<span className="text-gray-400">Supply APY</span>
					<span className="font-semibold">{supplyApy}</span>
				</div>

				<div className="flex justify-between">
					<span className="text-gray-400">Total Borrowed</span>
					<span className="font-semibold">{totalBorrowed}</span>
				</div>

				<div className="flex justify-between">
					<span className="text-gray-400">Borrow APR</span>
					<span className="font-semibold">{borrowApr}</span>
				</div>
			</div>

			<div className="flex gap-4 justify-center">
				<CustomBtn1 label="Supply" variant="primary" onClick={handleSupplyClick} />
				<CustomBtn1 label="Borrow" variant="secondary" onClick={handleBorrowClick} />
			</div>
		</div>
	);
};

export default LiquidityPoolCard;

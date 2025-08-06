import React from 'react';

interface SwapButtonProps {
	onClick: () => void;
	isLoading: boolean;
	disabled: boolean;
	isTestnet?: boolean;
	chainName?: string;
}

const SwapButton: React.FC<SwapButtonProps> = ({ onClick, isLoading, disabled, isTestnet, chainName }) => {
	return (
		<button
			onClick={onClick}
			disabled={disabled || isLoading}
			className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
				disabled
					? 'bg-gray-600 text-gray-400 cursor-not-allowed'
					: isLoading
					? 'bg-[#DD4F00] text-white cursor-wait'
					: 'bg-[#DD4F00] hover:bg-black text-white cursor-pointer transform hover:scale-[1.02]'
			}`}
		>
			{isLoading ? (
				<div className="flex items-center justify-center space-x-2">
					<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
					<span>Swapping...</span>
				</div>
			) : isTestnet ? (
				`Switch to ${chainName || 'Mainnet'} Mainnet`
			) : (
				'Swap'
			)}
		</button>
	);
};

export default SwapButton; 
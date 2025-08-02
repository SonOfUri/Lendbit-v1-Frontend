import React from 'react';

interface SwapButtonProps {
	onClick: () => void;
	isLoading: boolean;
	disabled: boolean;
}

const SwapButton: React.FC<SwapButtonProps> = ({ onClick, isLoading, disabled }) => {
	return (
		<button
			onClick={onClick}
			disabled={disabled || isLoading}
			className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
				disabled
					? 'bg-gray-600 text-gray-400 cursor-not-allowed'
					: isLoading
					? 'bg-blue-600 text-white cursor-wait'
					: 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer transform hover:scale-[1.02]'
			}`}
		>
			{isLoading ? (
				<div className="flex items-center justify-center space-x-2">
					<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
					<span>Swapping...</span>
				</div>
			) : (
				'Swap'
			)}
		</button>
	);
};

export default SwapButton; 
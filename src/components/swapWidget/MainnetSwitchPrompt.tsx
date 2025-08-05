import React from 'react';
import { getChainName, getMainnetChainId } from '../../constants/utils/chainMapping';

interface MainnetSwitchPromptProps {
	onSwitchToMainnet: () => void;
	onCancel: () => void;
	currentChainId: number;
}

const MainnetSwitchPrompt: React.FC<MainnetSwitchPromptProps> = ({
	onSwitchToMainnet,
	onCancel,
	currentChainId
}) => {
	const mainnetChainName = getChainName(parseInt(getMainnetChainId(currentChainId)));

	return (
		<div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
			<div className="text-center space-y-4">
				{/* Icon */}
				<div className="flex justify-center">
					<div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-blue-500">
							<path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							<path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							<path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</div>
				</div>

				{/* Title */}
				<h3 className="text-white text-lg font-semibold">
					Switch to Mainnet
				</h3>

				{/* Description */}
				<p className="text-gray-400 text-sm leading-relaxed">
					To execute swaps, you need to switch to {mainnetChainName} mainnet. 
					This ensures your transactions are executed on the live network.
				</p>

				{/* Warning */}
				<div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
					<div className="flex items-center space-x-2">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
							<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							<line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							<line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
						<span className="text-yellow-500 text-xs">
							Mainnet transactions use real tokens and real costs
						</span>
					</div>
				</div>

				{/* Buttons */}
				<div className="flex space-x-3 pt-2">
					<button
						onClick={onSwitchToMainnet}
						className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
					>
						Switch to {mainnetChainName}
					</button>
					<button
						onClick={onCancel}
						className="flex-1 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white py-3 px-4 rounded-lg font-medium transition-colors"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default MainnetSwitchPrompt; 
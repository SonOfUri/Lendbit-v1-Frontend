import React from 'react';
import { TokenItem } from '../../constants/types';
import TokenAddressInput from './TokenAddressInput';

interface TokenSelectorProps {
	tokens: TokenItem[];
	onSelect: (token: TokenItem) => void;
	onClose: () => void;
	chainId?: number;
	isToField?: boolean; // Add prop to determine if this is for "To" field
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ tokens, onSelect, onClose, chainId, isToField = false }) => {
	const [showImportModal, setShowImportModal] = React.useState(false);

	const handleImportToken = (importedToken: TokenItem) => {
		onSelect(importedToken);
		setShowImportModal(false);
	};

	return (
		<>
			<div className="absolute top-full left-0 mt-2 w-80 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
				<div className="p-2">
					{/* Import Token Option - Only show for "To" field */}
					{isToField && (
						<button
							onClick={() => setShowImportModal(true)}
							className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-[#2A2A2A] rounded-lg transition-colors border-b border-[#2A2A2A] mb-2 pb-2"
						>
							<div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white">
									<path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</div>
							<span className="text-blue-400 font-medium">Import Token</span>
						</button>
					)}

					{tokens.map((token) => (
						<button
							key={token.symbol}
							onClick={() => onSelect(token)}
							className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
						>
							<img
								src={token.icon}
								alt={token.symbol}
								className="w-6 h-6 rounded-full"
							/>
							<span className="text-white font-medium">{token.symbol}</span>
						</button>
					))}
				</div>
			</div>

			{showImportModal && (
				<TokenAddressInput
					onTokenFound={handleImportToken}
					onClose={() => setShowImportModal(false)}
					chainId={chainId}
				/>
			)}
		</>
	);
};

export default TokenSelector; 
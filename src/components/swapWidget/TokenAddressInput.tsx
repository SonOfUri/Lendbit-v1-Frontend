import React, { useState } from 'react';
import { TokenItem } from '../../constants/types';
import { getTokenDetails, isChainSupported } from '../../services/dexscreenerService';

interface TokenAddressInputProps {
	onTokenFound: (token: TokenItem) => void;
	onClose: () => void;
	chainId?: number;
}

const TokenAddressInput: React.FC<TokenAddressInputProps> = ({ onTokenFound, onClose, chainId }) => {
	const [address, setAddress] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleAddressSubmit = async () => {
		if (!address.trim()) {
			setError('Please enter a token address');
			return;
		}

		// Basic address validation
		if (!/^0x[a-fA-F0-9]{40}$/.test(address.trim())) {
			setError('Please enter a valid Ethereum address');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			// Fetch token details from DexScreener
			if (!chainId || !isChainSupported(chainId)) {
				setError('Chain not supported for token import');
				return;
			}

			console.log('=== TOKEN IMPORT DEBUG ===');
			console.log('Address:', address.trim());
			console.log('Chain ID:', chainId);
			console.log('Is Chain Supported:', isChainSupported(chainId));

			const tokenDetails = await getTokenDetails(address.trim(), chainId);
			console.log('Token Details Response:', tokenDetails);
			
			if (tokenDetails && tokenDetails.symbol && tokenDetails.name) {
				console.log('Token Import Success:', {
					symbol: tokenDetails.symbol,
					name: tokenDetails.name,
					image: tokenDetails.image,
					price: tokenDetails.price
				});

				const importedToken: TokenItem = {
					symbol: tokenDetails.symbol,
					icon: '/Token-Logos/default-base.svg', // Use default since DexScreener doesn't provide images
					address: address.trim() // Include the contract address
				};

				onTokenFound(importedToken);
				onClose();
			} else {
				console.log('Token Import Failed - Missing Data:', {
					hasTokenDetails: !!tokenDetails,
					symbol: tokenDetails?.symbol,
					name: tokenDetails?.name,
					price: tokenDetails?.price,
					image: tokenDetails?.image
				});
				
				// Provide more specific error messages
				if (!tokenDetails) {
					setError('Token not found on this network. Please check the address and try again.');
				} else if (!tokenDetails.symbol) {
					setError('Token found but missing symbol. This token may not be supported.');
				} else if (!tokenDetails.name) {
					setError('Token found but missing name. This token may not be supported.');
				} else {
					setError('Token data is incomplete. Please try again.');
				}
			}
		} catch (err) {
			console.error('Token Import Error:', err);
			setError('Failed to fetch token details. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handlePaste = async () => {
		try {
			const text = await navigator.clipboard.readText();
			setAddress(text);
		} catch (err) {
			setError('Failed to paste from clipboard');
		}
	};

	return (
		<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
			<div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 w-full max-w-md mx-4">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-white text-lg font-semibold">Import Token</h3>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-white transition-colors"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
							<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</button>
				</div>

				<div className="space-y-4">
					<div>
						<label className="block text-gray-400 text-sm mb-2">
							Token Contract Address
						</label>
						<div className="flex space-x-2">
							<input
								type="text"
								value={address}
								onChange={(e) => setAddress(e.target.value)}
								placeholder="0x..."
								className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2 text-white text-sm outline-none focus:border-blue-500"
							/>
							<button
								onClick={handlePaste}
								className="px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-gray-400 hover:text-white transition-colors text-sm"
							>
								Paste
							</button>
						</div>
					</div>

					{error && (
						<div className="text-red-400 text-sm">
							{error}
						</div>
					)}

					<div className="flex space-x-3">
						<button
							onClick={handleAddressSubmit}
							disabled={isLoading || !address.trim()}
							className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:text-gray-400 text-white py-2 px-4 rounded transition-colors"
						>
							{isLoading ? (
								<div className="flex items-center justify-center space-x-2">
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
									<span>Loading...</span>
								</div>
							) : (
								'Import Token'
							)}
						</button>
						<button
							onClick={onClose}
							className="flex-1 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white py-2 px-4 rounded transition-colors"
						>
							Cancel
						</button>
					</div>

					<div className="text-xs text-gray-500">
						Enter the token contract address to import a custom token. The token details will be fetched automatically.
					</div>
				</div>
			</div>
		</div>
	);
};

export default TokenAddressInput; 
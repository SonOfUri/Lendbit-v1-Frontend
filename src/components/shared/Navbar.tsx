
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { isSupportedChains, isSupportedChainsIncludingMainnet } from "../../constants/utils/chains";
import {
	useSwitchNetwork,
	useWalletInfo,
	useWeb3Modal,
	useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { useSwapContext } from "../../contexts/SwapContext";
import { getEthBalance } from "../../constants/utils/getBalances";
import { formatAddress } from "../../constants/utils/formatAddress";
import ChainSelector from "./ChainSelector.tsx";
import { CHAIN_NATIVE_SYMBOLS, SUPPORTED_CHAINS_ID } from "../../constants/config/chains.ts";
import { navLinks } from "../../constants/utils/navLink.ts";

const Navbar = () => {
	const { open } = useWeb3Modal();
	const { isConnected, chainId, address } = useWeb3ModalAccount();
	const { walletInfo } = useWalletInfo();
	const { switchNetwork } = useSwitchNetwork();
	const { isOnSwapPage } = useSwapContext();

	const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [balance, setBalance] = useState<string | null>(null);
	const walletDropdownRef = useRef<HTMLDivElement>(null);
	const mobileMenuRef = useRef<HTMLDivElement>(null);
	const [isChainOpen, setIsChainOpen] = useState(false);

	
	const walletConnect = () => {
		if (!isConnected) {
			open();
		} else if (isConnected && !isSupportedChainsIncludingMainnet(chainId, isOnSwapPage)) {
			switchNetwork(SUPPORTED_CHAINS_ID[0]);
			setIsWalletDropdownOpen(false);
		} else {
			setIsWalletDropdownOpen((prev) => !prev);
		}

		setIsMobileMenuOpen(false);
		setIsChainOpen(false)

	};

	const handleSignout = () => {
		setIsWalletDropdownOpen(false);
		setIsMobileMenuOpen(false)
		setIsChainOpen(false)
		open();
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(prev => !prev);
		setIsWalletDropdownOpen(false);
		setIsChainOpen(false)
	};


	const handleChainSwitch = (targetChainId: number) => {
		if (chainId !== targetChainId) {
		  switchNetwork(targetChainId);
		}
	};

	// Ensure Base is selected by default when user connects
	useEffect(() => {
		if (isConnected && (!chainId || !isSupportedChainsIncludingMainnet(chainId, isOnSwapPage))) {
			switchNetwork(SUPPORTED_CHAINS_ID[0]); // Switch to Base
		}
	}, [isConnected, chainId, isOnSwapPage, switchNetwork]);

	useEffect(() => {
		const fetchBalance = async () => {
			if (isConnected && address && chainId !== undefined) {
				try {
					const bal = await getEthBalance(address, chainId);
					setBalance(bal);
				} catch (error) {
					console.error("Error fetching balance:", error);
				}
			}
		};
		fetchBalance();
	}, [isConnected, address, chainId]);


	return (
		<div className="relative custom-corner-header">
			<nav className="w-full bg-[#050505] px-4 py-5 flex items-center justify-between text-white">
				{/* Logo and Mobile Menu Button */}
				<div className="flex items-center gap-6">
					<a href="https://www.lendbit.finance/" target="_blank" rel="noopener noreferrer">
						<div className="flex items-center gap-2">
							<img
								src="/logo-icon.svg"
								alt="Lendbit Icon"
								className="w-10 h-10"
							/>
							<img
								src="/logo-text.svg"
								alt="Lendbit Text"
								className="hidden md:block w-[90px]"
							/>
						</div>
					</a>


					<button
						className="lg:hidden text-white cursor-pointer"
						onClick={toggleMobileMenu}
						aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
						aria-expanded={isMobileMenuOpen}
					>
						{isMobileMenuOpen ? (
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						) : (
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						)}
					</button>
				</div>

				{/* Desktop Nav Links */}
				<div className="hidden lg:flex gap-6 text-sm u-class-nav">
					{navLinks.map(({ to, label }) => (
						<NavLink
							key={to}
							to={to}
							className={({ isActive }) =>
								`no-underline transition-colors ${
									isActive
										? "text-orange-500 font-semibold"
										: "text-white hover:text-gray-300"
								}`
							}
						>
							{label}
						</NavLink>
					))}
				</div>

				{/* Right Side */}
				<div className="flex items-center gap-2">
					
					{isSupportedChainsIncludingMainnet(chainId, isOnSwapPage) &&
						(<ChainSelector
							selectedChainId={chainId || SUPPORTED_CHAINS_ID[0]}
							onSwitchChain={handleChainSwitch}
							open={isChainOpen}
							setOpen={setIsChainOpen}
							setIsWalletDropdownOpen ={setIsWalletDropdownOpen}
							setIsMobileMenuOpen={setIsWalletDropdownOpen}
					/>)
					}
					{/* Connect Button */}
					<main className="relative cursor-pointer" ref={walletDropdownRef}>
						<button
							onClick={walletConnect}
							className="bg-[#1a1a1a] text-orange-500 px-1.5 md:px-4 py-1 rounded-md text-sm flex items-center gap-1 cursor-pointer"
						>
							{!isConnected ? (
								<p>Connect</p>
							) : !isSupportedChainsIncludingMainnet(chainId, isOnSwapPage) ? (
								<p className="leading-tight">Switch Network</p>
							) : (
								<p className="">
									{address ? formatAddress(address) : "Address"}
								</p>
							)}
							<img src="/connect.svg" alt="arrow" className="w-8 h-8" />
						</button>

						{isWalletDropdownOpen && (
							<aside className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md text-black rounded-lg z-50">
								<section className="p-4 flex flex-col items-center gap-2 border-b">
									<img
										src={walletInfo?.icon || "/"}
										alt="Wallet Icon"
										className="w-6 h-6 object-cover"
									/>
									<span className="text-black text-xs md:text-sm">
										{address ? formatAddress(address) : "Address"}
									</span>
									<span className="text-black text-xs md:text-sm">
									{balance ? `${balance} ${CHAIN_NATIVE_SYMBOLS[chainId ?? 0] || "ETH"}` : "wallet balance..."}
									</span>
									<button
										className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-[#FF4D00] transition-colors text-xs md:text-sm"
										onClick={handleSignout}
									>
										Wallet Actions
									</button>
								</section>
							</aside>
						)}
					</main>
				</div>
			</nav>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div
					ref={mobileMenuRef}
					className="lg:hidden absolute top-full left-0 w-full bg-[#050505] z-50 shadow-lg"
				>
					<div className="flex flex-col p-4 space-y-4">
						{navLinks.map(({ to, label }) => (
							<NavLink
								key={to}
								to={to}
								className={({ isActive }) =>
									`no-underline transition-colors py-2 px-3 rounded ${
										isActive
											? "bg-[#1a1a1a] text-orange-500 font-semibold"
											: "text-white hover:bg-[#1a1a1a]"
									}`
								}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{label}
							</NavLink>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default Navbar;

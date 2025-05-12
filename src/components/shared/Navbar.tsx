import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { isSupportedChain } from "../../constants/utils/chains";
import { SUPPORTED_CHAIN_ID } from "../../api/connection";
import {
	useSwitchNetwork,
	useWalletInfo,
	useWeb3Modal,
	useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { getEthBalance } from "../../constants/utils/getBalances";
import { formatAddress } from "../../constants/utils/formatAddress";

const Navbar = () => {
	const { open } = useWeb3Modal();
	const { isConnected, chainId, address } = useWeb3ModalAccount();
	const { walletInfo } = useWalletInfo();
	const { switchNetwork } = useSwitchNetwork();

	const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
	const [balance, setBalance] = useState<string | null>(null);
	const walletDropdownRef = useRef<HTMLDivElement>(null);

	const walletConnect = () => {
		if (!isConnected) {
			open();
		} else if (isConnected && !isSupportedChain(chainId)) {
			switchNetwork(SUPPORTED_CHAIN_ID);
			setIsWalletDropdownOpen(false);
		} else {
			setIsWalletDropdownOpen((prev) => !prev);
		}
	};

	const handleSignout = () => {
		setIsWalletDropdownOpen(false);
		open();
	};

	useEffect(() => {
		const fetchBalance = async () => {
			if (isConnected && address) {
				try {
					const bal = await getEthBalance(address);
					setBalance(bal);
				} catch (error) {
					console.error("Error fetching balance:", error);
				}
			}
		};
		fetchBalance();
	}, [isConnected, address]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				walletDropdownRef.current &&
				!walletDropdownRef.current.contains(event.target as Node)
			) {
				setIsWalletDropdownOpen(false);
			}
		};

		if (isWalletDropdownOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isWalletDropdownOpen]);

	return (
		<div className="relative custom-corner-header">
			<nav className="w-full bg-[#050505] px-4 py-3 flex items-center justify-between text-white">
				{/* Logo */}
				<div className="flex items-center gap-2">
					<img src="/logo-icon.svg" alt="Lendbit Icon" className="w-10 h-10" />
					<img
						src="/logo-text.svg"
						alt="Lendbit Text"
						className="hidden md:block w-[90px]"
					/>
				</div>

				{/* Nav Links */}
				<div className="hidden md:flex gap-6 text-sm u-class-nav">
					{[
						{ to: "/", label: "Dashboard" },
						{ to: "/markets", label: "Markets" },
						{ to: "/positions", label: "Positions" },
						{ to: "/transact", label: "Supply/Borrow" },
						{ to: "/create/lend", label: "Create" },
					].map(({ to, label }) => (
						<NavLink
							style={{ color: "white" }}
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
					{isConnected && isSupportedChain(chainId) && (
						<div className="hidden md:flex items-center gap-2 bg-[#1a1a1a] px-3 py-1 rounded-md">
							<img
								src="/Token-Logos/eth-base.svg"
								alt="Base"
								className="w-10 h-10"
							/>
							<span className="text-white text-lg">Base</span>
						</div>
					)}

					{/* Connect Button */}
					<main className="relative" ref={walletDropdownRef}>
						<button
							onClick={walletConnect}
							className="bg-[#1a1a1a] text-orange-500 px-4 py-1 rounded-md text-lg flex items-center gap-1"
						>
							{!isConnected ? (
								<p>Connect</p>
							) : !isSupportedChain(chainId) ? (
								<p className="leading-tight">Switch Network</p>
							) : (
								<p>{address ? formatAddress(address) : "Address"}</p>
							)}
							<img src="/connect.svg" alt="arrow" className="w-10 h-10" />
						</button>

						{isWalletDropdownOpen && (
							<aside className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md text-black rounded-lg z-50">
								{/* Wallet Info Section */}
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
										{balance ? `${balance} ETH` : "wallet balance..."}
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
		</div>
	);
};

export default Navbar;

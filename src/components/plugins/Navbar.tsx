import { useState } from "react";
import { NavLink } from "react-router-dom";

const chainOptions = [
    { label: "Base", value: "base", icon: "/Token-Logos/eth-base.svg" },
    { label: "Ethereum", value: "ethereum", icon: "/Token-Logos/eth-base.svg" },
    { label: "Arbitrum", value: "arbitrum", icon: "/Token-Logos/eth-base.svg" },
];

const Navbar = () => {
    const [selectedChain, setSelectedChain] = useState(chainOptions[0]);

    const handleChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newChain = chainOptions.find((c) => c.value === e.target.value);
        if (newChain) setSelectedChain(newChain);
    };

    return (
        <nav className="w-full bg-black px-4 py-3 flex items-center justify-between text-white">
            {/* Logo */}
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

            {/* Nav Links */}
            <div className="hidden md:flex gap-6 text-sm u-class-nav">
                {[
                    { to: "/", label: "Dashboard" },
                    { to: "/markets", label: "Markets" },
                    { to: "/positions", label: "Positions" },
                    { to: "/transact", label: "Supply/Borrow" },
                    { to: "/create", label: "Create" },
                ].map(({ to, label }) => (
                    <NavLink
                        style={{ color: 'white' }}
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `no-underline transition-colors ${
                                isActive ? "text-orange-500 font-semibold" : "text-white hover:text-gray-300"
                            }`
                        }
                    >
                        {label}
                    </NavLink>
                ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
                {/* Chain Selector with icons */}
                <div className="relative hidden md:block">
                    <select
                        value={selectedChain.value}
                        onChange={handleChainChange}
                        className="appearance-none bg-[#1a1a1a] text-white pl-14 pr-4 py-1 rounded-md text-lg h-12"
                    >
                        {chainOptions.map((chain) => (
                            <option key={chain.value} value={chain.value}>
                                {chain.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10">
                        <img
                            src={selectedChain.icon}
                            alt={selectedChain.label}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Connect Button */}
                <button className="bg-[#1a1a1a] text-orange-500 px-4 py-1 rounded-md text-lg flex items-center gap-1">
                    Connect
                    <img src="/connect.svg" alt="arrow" className="w-10 h-10" />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

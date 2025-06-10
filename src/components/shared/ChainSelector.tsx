import { useState } from "react";

const chains = [
    {
        name: "Base",
        icon: "/Token-Logos/base-base.svg",
        type: "hub" as const,
    },
    {
        name: "Optimism",
        icon: "/Token-Logos/op-op.svg",
        type: "spoke" as const,
    },
    {
        name: "Unichain",
        icon: "/Token-Logos/uni-uni.svg",
        type: "spoke" as const,
    },
    {
        name: "Avalanche",
        icon: "/Token-Logos/avax-avax.svg",
        type: "spoke" as const,
    },
    {
        name: "Lisk",
        icon: "/Token-Logos/lisk-lisk.svg",
        type: "spoke" as const,
    },
];

const ChainSelector = () => {
    const [selectedChain, setSelectedChain] = useState("Base");
    const [open, setOpen] = useState(false);

    const handleSelect = (name: string) => {
        setSelectedChain(name);
        setOpen(false);
        // Add chain switching logic here
    };

    const selected = chains.find((c) => c.name === selectedChain);

    return (
        <div className="relative text-white no-clip-path ">
            {/* Trigger Button */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1 rounded-md no-clip-path cursor-pointer"
            >
                <img src={selected?.icon} alt={selected?.name} className="w-5 h-5" />
                <span className="hidden md:block">{selected?.name}</span>
                {selected?.type === "hub" && (
                    <span className="text-xs bg-[#333] px-2 py-[2px] rounded-md hidden md:block">Hub</span>
                )}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute top-full right-0 mt-2 w-52  bg-[#050505] border border-[#1a1a1a] p-4 z-50 ">
                    <div>
                        <h4 className="text-sm text-zinc-400 mb-2">Hub</h4>
                        {chains
                            .filter((c) => c.type === "hub")
                            .map((c) => (
                                <div
                                    key={c.name}
                                    onClick={() => handleSelect(c.name)}
                                    className="flex items-center justify-between px-3 py-2 hover:bg-zinc-800 rounded-md cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <img src={c.icon} alt={c.name} className="w-5 h-5" />
                                        <span>{c.name}</span>
                                    </div>
                                    <span className="text-xs bg-[#333] px-2 py-[2px] rounded-md">Hub</span>
                                </div>
                            ))}
                    </div>

                    <div className="mt-4">
                        <h4 className="text-sm text-zinc-400 mb-2">Spoke</h4>
                        {chains
                            .filter((c) => c.type === "spoke")
                            .map((c) => (
                                <div
                                    key={c.name}
                                    onClick={() => handleSelect(c.name)}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-800 rounded-md cursor-pointer"
                                >
                                    <img src={c.icon} alt={c.name} className="w-5 h-5" />
                                    <span>{c.name}</span>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChainSelector;

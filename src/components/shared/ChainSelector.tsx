import { chains } from "../../constants/config/chains";


type ChainSelectorProps = {
    selectedChainId: number;
    onSwitchChain: (chainId: number) => void;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsWalletDropdownOpen : React.Dispatch<React.SetStateAction<boolean>>;
    setIsMobileMenuOpen : React.Dispatch<React.SetStateAction<boolean>>;
  };
  
const ChainSelector = (
    { selectedChainId,
        onSwitchChain,
        open,
        setOpen,
        setIsWalletDropdownOpen,
        setIsMobileMenuOpen,
    }: ChainSelectorProps) => {
   
    const selected = chains.find((c) => c.chainId === selectedChainId);
  
    const handleSelect = (chainId: number) => {
      onSwitchChain(chainId);
      setOpen(false);
    };
  
    return (
      <nav className="relative text-white no-clip-path">
        <button
            onClick={() => {
                setIsWalletDropdownOpen(false)
                setIsMobileMenuOpen(false)
                setOpen((prev) => !prev)
            }}
          className="flex items-center gap-2 bg-[#1a1a1a] px-2.5 md:px-3 py-[0.6rem] rounded-md"
        >
          <img src={selected?.icon} alt={selected?.name} className="w-5 h-5" />
          <span className="hidden md:block">{selected?.name}</span>
          {selected?.type === "hub" && (
            <span className="text-xs bg-[#333] px-2 py-[2px] rounded-md hidden md:block">Hub</span>
          )}
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
  
        {open && (
          <div className="absolute top-full left-0 mt-2 w-52 bg-[#050505] border border-[#1a1a1a] p-4 z-50">
            <div>
              <h4 className="text-sm text-zinc-400 mb-2">Hub</h4>
              {chains
                .filter((c) => c.type === "hub")
                .map((c) => (
                  <div
                    key={c.name}
                    onClick={() => handleSelect(c.chainId)}
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
                    onClick={() => handleSelect(c.chainId)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-800 rounded-md cursor-pointer"
                  >
                    <img src={c.icon} alt={c.name} className="w-5 h-5" />
                    <span>{c.name}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </nav>
    );
  };
  
  export default ChainSelector;

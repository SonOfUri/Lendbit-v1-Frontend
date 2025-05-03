import React from "react";

type TokenTagSmProps = {
    icon: string;
    symbol: string;
};

const TokenTagSm: React.FC<TokenTagSmProps> = ({ icon, symbol }) => {
    return (
        <div className="flex items-center gap-2 brounded-full px-2 py-1">
            <img src={icon} alt={symbol} className="w-10 h-10 " />
            <span className="text-white text-sm font-semibold">{symbol}</span>
        </div>
    );
};

export default TokenTagSm;

import React from "react";

type TokenTagLgProps = {
    icon: string;
    name: string;
    symbol: string;
};

const TokenTagLg: React.FC<TokenTagLgProps> = ({ icon, name, symbol }) => {
    return (
        <div className="flex items-center gap-2">
            <img src={icon} alt={symbol} className="w-8 h-8" />
            <div className="flex flex-col leading-tight">
                <span className="text-white text-sm font-bold uppercase">{name}</span>
                <span className="text-gray-400 text-xs uppercase text-left">{symbol}</span>
            </div>
        </div>
    );
};

export default TokenTagLg;

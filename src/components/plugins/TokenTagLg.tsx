import React from "react";

type TokenTagLgProps = {
    icon: string;
    name: string;
    symbol: string;
};

const TokenTagLg: React.FC<TokenTagLgProps> = ({ icon, name, symbol }) => {
    return (
        <div className="flex items-center gap-2">
            <img src={icon} alt={symbol} className="w-15 h-15" />
            <div className="flex flex-col leading-tight">
                <span className="text-white text-lg font-bold uppercase">{name}</span>
                <span className="text-gray-400 text-sm uppercase text-left">{symbol}</span>
            </div>
        </div>
    );
};

export default TokenTagLg;

import React from 'react';

const OkxPoweredBy: React.FC = () => {
  return (
    <div className="flex bg-white items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-400 transition-colors duration-300 animate-pulse">
      <span>Powered by</span>
      <a 
        href="https://www.okx.com/web3/dex" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-1 hover:scale-105 transition-transform duration-200"
      >
        <img 
          src="/okx.png" 
          alt="OKX" 
          className="h-14 w-auto opacity-80 hover:opacity-100 transition-opacity duration-200"
        />
        <span className="font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200">
          Dex API
        </span>
      </a>
    </div>
  );
};

export default OkxPoweredBy; 
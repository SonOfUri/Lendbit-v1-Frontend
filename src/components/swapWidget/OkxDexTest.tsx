import React, { useState } from 'react';
import { useOkxDexSwap } from '../../hooks/useOkxDexSwap';

const OkxDexTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const { getSwapQuote, isChainSupported } = useOkxDexSwap();

  const testQuote = async () => {
    try {
      setTestResult('Testing OKX DEX quote...');
      
      // Test parameters for Base chain
      const testParams = {
        fromTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH
        toTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC
        amount: '1000000000000000000', // 1 ETH in wei
        slippage: '0.005'
      };

      const quote = await getSwapQuote(testParams);
      setTestResult(`Quote received: ${JSON.stringify(quote, null, 2)}`);
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
      <h3 className="text-white text-lg font-semibold">OKX DEX API Test</h3>
      
      <div className="space-y-2">
        <p className="text-gray-400 text-sm">
          Chain Supported: {isChainSupported ? 'Yes' : 'No'}
        </p>
        
        <button
          onClick={testQuote}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Test Quote
        </button>
      </div>

      {testResult && (
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
          <h4 className="text-white text-sm font-medium mb-2">Test Result:</h4>
          <pre className="text-xs text-gray-300 whitespace-pre-wrap overflow-auto">
            {testResult}
          </pre>
        </div>
      )}
    </div>
  );
};

export default OkxDexTest; 
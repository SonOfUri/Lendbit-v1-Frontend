import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SwapContextType {
	isOnSwapPage: boolean;
	setIsOnSwapPage: (value: boolean) => void;
}

const SwapContext = createContext<SwapContextType | undefined>(undefined);

export const useSwapContext = () => {
	const context = useContext(SwapContext);
	if (context === undefined) {
		throw new Error('useSwapContext must be used within a SwapProvider');
	}
	return context;
};

interface SwapProviderProps {
	children: ReactNode;
}

export const SwapProvider: React.FC<SwapProviderProps> = ({ children }) => {
	const [isOnSwapPage, setIsOnSwapPage] = useState(false);

	return (
		<SwapContext.Provider value={{ isOnSwapPage, setIsOnSwapPage }}>
			{children}
		</SwapContext.Provider>
	);
}; 
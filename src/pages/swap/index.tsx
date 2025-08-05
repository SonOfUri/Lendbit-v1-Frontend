import { SwapWidget } from "../../components/swapWidget";
import { useSwapContext } from "../../contexts/SwapContext";
import { useEffect } from "react";

const Swap = () => {
	const { setIsOnSwapPage } = useSwapContext();

	useEffect(() => {
		setIsOnSwapPage(true);
		return () => setIsOnSwapPage(false);
	}, [setIsOnSwapPage]);

	return (
		<div className="w-full py-2 px-4">
			<div className="max-w-md mx-auto">
				<SwapWidget />
			</div>
		</div>
	);
};

export default Swap; 
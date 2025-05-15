import { useLocation, useNavigate } from "react-router-dom";
import RangeSlider from "../../components/plugins/RangeSlider";
import { useState, useEffect, useMemo } from "react";
import useCreateLoanListingOrder from "../../hooks/write/useCreateLoanListing";
import { toast } from "sonner";
import {formatMoney2 } from "../../constants/utils/formatMoney";

const Allocation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Memoize the state to prevent unnecessary recalculations
  const state = useMemo(() => location.state || {}, [location.state]);

  // Get values from state with proper fallbacks
  const maxLimit = Number(state?._amount) || 1000;
  const tokenType = state?.tokenSymbol || "Token";
  const isDecimal = !Number.isInteger(maxLimit);
  const stepSize = isDecimal ? 0.01 : 1;

  // Initialize min/max allocation based on maxLimit
  const [minAllocation, setMinAllocation] = useState(0);
  const [maxAllocation, setMaxAllocation] = useState(maxLimit);

  // Calculate initial values for RangeSlider (20% and 80% of max)
  const initialMin = useMemo(() => Math.floor(maxLimit * 0), [maxLimit]);
  const initialMax = useMemo(() => Math.floor(maxLimit * 1), [maxLimit]);

  // Handle slider changes
  const handleRangeChange = ({ min, max }: { min: number; max: number }) => {
    setMinAllocation(min);
    setMaxAllocation(max);
  };

  // Initialize loan listing order hook
  const loanListingOrder = useCreateLoanListingOrder(
    String(state?._amount),
    String(minAllocation),
    String(maxAllocation),
    Number(state?._interest),
    state?._returnDate,
    state?.tokenTypeAddress,
    state?.tokenDecimal,
    state?.tokenName,
    state?.whiteList
  );

  // Validate state on mount
  useEffect(() => {
    if (!state?._amount) {
      toast.error("Missing order details");
      navigate("/create/lend");
    }
  }, [state, navigate]); // Now state is stable between renders

  return (
    <div className="min-h-screen flex items-center lg:items-start justify-center p-4 lg:pt-36 lg:px-4">
      <div className="max-w-[450px] w-full bg-[#050505] rounded-xl py-6 noise">
        <div className="max-w-[400px] mx-auto px-6">
          <div className="flex flex-col items-start w-full">
            <div
              className="my-4 flex items-center gap-2 px-2"
              onClick={() => navigate(-1)}
              style={{ cursor: "pointer" }}
            >
              <img src="/round-arrow.svg" alt="back" className="w-5 h-5" />
              <span className="font-semibold text-white">Back</span>
            </div>

            <div className="w-full">
              <p className="font-semibold mb-1 text-white tracking-wider">
                Customize {tokenType} order Volume per User
              </p>
            </div>

            <div className="my-4 w-full">
              <RangeSlider
                min={0}
                max={maxLimit}
                initialMin={initialMin}
                initialMax={initialMax}
                step={stepSize}
                onChange={handleRangeChange}
              />
            </div>

            <div className="w-full mt-4 text-white text-sm">
              <p>Total Volume: {maxLimit} {tokenType}</p>
              <p>Minimum Allocation: {formatMoney2(minAllocation)} {tokenType}</p>
              <p>Maximum Allocation: {formatMoney2(maxAllocation)} {tokenType}</p>
            </div>
          </div>
        </div>

        <div className="px-6 mt-4">
          <button
            className={`w-full rounded-md px-6 py-2 text-center cursor-pointer bg-[#FF4D00CC] text-black font-semibold tracking-widest capitalize`}
            onClick={loanListingOrder}
            disabled={minAllocation >= maxAllocation}
          >
            Create {state?.type} Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Allocation;
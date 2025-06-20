import React, { useState } from "react";
import TokenTagSm from "./TokenTagSm";
import CustomBtn1 from "./CustomBtn1";
import useRequestLoanFromListing from "../../hooks/write/useRequestLoanFromListing";
import useServiceRequest from "../../hooks/write/useServiceRequest";
import { toast } from "sonner";
import { formatMoney } from "../../constants/utils/formatMoney";
import BorrowFromLendOrder from "./BorrowSpecifications";

type Props = {
    icon: string;
    symbol: string;
    amount: string;
    usd: string;
    apr: string;
    poolId: string;
    statusPercent: number;
    expiry: string;
    type: "lend" | "borrow";
    tokenAddress?: string;
    tokenDecimals?: number;
    minAmount?: number;
    maxAmount?: number;
};

const getBatterySvg = (percent: number) => {
    if (percent <= 25) return "/battery-25.svg";
    if (percent <= 50) return "/battery-50.svg";
    if (percent <= 75) return "/battery-75.svg";
    return "/battery-100.svg";
};

const LendBorrowRow: React.FC<Props> = ({
    icon,
    symbol,
    amount,
    usd,
    apr,
    poolId,
    statusPercent,
    expiry,
    type,
    tokenAddress,
    tokenDecimals,
    minAmount,
    maxAmount,
}) => {
    const [showBorrowModal, setShowBorrowModal] = useState(false);
    const batteryIcon = getBatterySvg(statusPercent);

    // State for request loan parameters
    const [requestLoanParams, setRequestLoanParams] = useState({
        poolId: 0,
        borrowAmount: "",
        tokenDecimals: 18
    });

    // State for service request parameters
    const [serviceRequestParams, setServiceRequestParams] = useState({
        amount: "",
        poolId: 0,
        tokenAddress: ""
    });

    // Initialize hooks with state-managed parameters
    const requestLoan = useRequestLoanFromListing(
        requestLoanParams.poolId,
        requestLoanParams.borrowAmount,
        requestLoanParams.tokenDecimals
    );

    const serviceRequest = useServiceRequest(
        serviceRequestParams.amount,
        serviceRequestParams.poolId,
        serviceRequestParams.tokenAddress
    );

    const handleBorrowSubmit = (borrowAmount: number) => {
        if (!tokenAddress || tokenDecimals === undefined) {
            toast.error("Token information incomplete");
            return;
        }

        // Update params before calling the hook
        setRequestLoanParams({
            poolId: Number(poolId),
            borrowAmount: borrowAmount.toString(),
            tokenDecimals: tokenDecimals
        });

        // Trigger the request loan action
        requestLoan();
        setShowBorrowModal(false);
    };

    const handleBorrowAction = () => {
        setShowBorrowModal(true);
    };

    const handleFundAction = () => {
        if (!tokenAddress || tokenDecimals === undefined) {
            toast.error("Token information incomplete");
            return;
        }

        // Update params before calling the hook
        setServiceRequestParams({
            amount: amount,
            poolId: Number(poolId),
            tokenAddress: tokenAddress
        });

        // Trigger the service request action
        serviceRequest();
    };

    return (
        <>
            <div className="grid grid-cols-7 gap-4 p-4 items-center text-left text-white text-sm relative group">
                {/* Assets */}
                <TokenTagSm icon={icon} symbol={symbol} />

                {/* Amount */}
                <div className="flex flex-col">
                    <span className="font-bold text-sm">{formatMoney(amount)}</span>
                    <span className="text-xs text-gray-400">{usd}</span>
                </div>

                {/* APR */}
                <div className="font-semibold">{apr}</div>

                {/* Pool ID */}
                <div className="text-xs text-gray-400">{poolId}</div>

                {/* Status */}
                {type === "lend" ? (
                    <div className="relative flex items-center">
                        <img src={batteryIcon} alt="status" className="w-10 h-10" />
                        {/* Tooltip */}
                        <span className="absolute top-full mt-1 left-0 text-[10px] bg-[#050505] text-white px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {statusPercent}%
                        </span>
                    </div>
                ) : (
                    <span className="font-semibold text-sm text-white">Open</span>
                )}

                {/* Duration / Expiry */}
                <div className="font-semibold whitespace-nowrap">{expiry}</div>

                {/* Action */}
                <CustomBtn1
                    label={type === "lend" ? "Borrow Now" : "Fund Loan"}
                    variant="primary"
                    onClick={type === "lend" ? handleBorrowAction : handleFundAction}
                />
            </div>

            {/* Borrow Modal */}
            {showBorrowModal && (
                <div className="fixed inset-0 bg-[rgba(221,79,0,0.03)] filter backdrop-blur-md bg-opacity-90 flex items-center justify-center z-50">
                    <BorrowFromLendOrder
                        tokenSymbol={symbol}
                        tokenIcon={icon}
                        maxAmount={maxAmount || 0}
                        minAmount={minAmount || 0}
                        apr={parseFloat(apr)}
                        duration={expiry}
                        onSubmit={handleBorrowSubmit}
                        onClose={() => setShowBorrowModal(false)}
                    />
                </div>
            )}
        </>
    );
};

export default LendBorrowRow;
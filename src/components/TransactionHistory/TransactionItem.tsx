import { Clipboard, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { TransactionStatusPill } from "./TransactionStatusPill";
import {getChainIcon, getExplorerLink} from "./chainUtils.ts";

type Props = {
    type: string;
    status: "Pending" | "Success" | "Failed";
    amount: number;
    asset: string;
    chain: string;
    hash: string;
    date: Date;
};

export default function TransactionItem({
                                            type,
                                            status,
                                            amount,
                                            asset,
                                            chain,
                                            hash,
                                            date,
                                        }: Props) {
    const copyHash = () => navigator.clipboard.writeText(hash);



    return (
        <div className=" w-full border rounded-xl p-4 bg-card/30 flex flex-col sm:flex-row justify-between gap-4 sm:items-center hover:shadow-sm transition ">
            {/* Left Section: Icon + Type + Amount */}
            <div className="flex items-center gap-3 min-w-40">
                <img
                    src={getChainIcon(chain)}
                    alt={chain}
                    className="w-6 h-6 rounded-full border"
                />
                <div className="text-sm font-medium">
                    {type} {amount} {asset}
                </div>
            </div>

            {/* Center: Date + Hash */}
            <div className="flex flex-col text-xs text-muted-foreground gap-1">
                <span>{format(date, "dd MMM yyyy, hh:mm a")}</span>
                <div className="flex gap-2 items-center">
                    <button onClick={copyHash} title="Copy hash">
                        <Clipboard size={14} />
                    </button>
                    <a
                        href={getExplorerLink(chain, hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View on Explorer"
                    >
                        <ExternalLink size={14} />
                    </a>
                </div>
            </div>

            {/* Right: Status */}
            <div className="sm:ml-auto">
                <TransactionStatusPill status={status} />
            </div>
        </div>
    );
}

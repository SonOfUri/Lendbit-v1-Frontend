import  { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Clipboard, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { TransactionStatusPill } from "./TransactionStatusPill";
import {getChainIcon, getExplorerLink} from "./chainUtils.ts";

import EmptyState from "./EmptyState";

type Transaction = {
    id: string;
    hash: string;
    type: "Deposit" | "Withdraw" | "Borrow" | "Repay";
    status: "Pending" | "Success" | "Failed";
    amount: number;
    asset: string;
    chain: string;
    date: Date;
};

type Props = {
    transactions: Transaction[];
    hasMore: boolean;
    fetchMore: () => void;
};

export default function TransactionsPanel({ transactions, hasMore, fetchMore }: Props) {
    const { ref, inView } = useInView({ threshold: 1 });

    useEffect(() => {
        if (inView && hasMore) fetchMore();
    }, [inView, hasMore]);

    const copyHash = (hash: string) => navigator.clipboard.writeText(hash);

    if (transactions.length === 0) return <EmptyState />;

    return (
        <div className="space-y-3 w-full">
            {transactions.map((tx) => (
                <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 bg-card border rounded-xl hover:shadow-sm transition bg-[#050505] noise"
                >
                    <div className="flex items-center gap-3">
                        <img
                            src={getChainIcon(tx.chain)}
                            alt={tx.chain}
                            className="w-6 h-6 rounded-full border"
                        />

                        <div className="space-y-0.5">
                            <div className="text-sm font-medium">
                                {tx.type} {tx.amount} {tx.asset}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {format(tx.date, "dd MMM yyyy, hh:mm a")}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <button onClick={() => copyHash(tx.hash)} title="Copy hash">
                                    <Clipboard size={14} className="text-muted-foreground" />
                                </button>
                                <a
                                    href={getExplorerLink(tx.chain, tx.hash)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="View on Explorer"
                                >
                                    <ExternalLink size={14} className="text-muted-foreground" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <TransactionStatusPill status={tx.status} />
                </div>
            ))}

            {hasMore && (
                <div
                    ref={ref}
                    className="flex justify-center py-4 text-sm text-muted-foreground"
                >
                    Loading more...
                </div>
            )}
        </div>
    );
}

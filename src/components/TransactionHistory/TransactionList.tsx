import { useInView } from "react-intersection-observer";
import TransactionItem from "./TransactionItem";
import EmptyState from "./EmptyState";
import React from "react";

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

export default function TransactionList({ transactions, hasMore, fetchMore }: Props) {
    const { ref, inView } = useInView({ threshold: 1 });

    // Fetch more when scrolled to bottom
    React.useEffect(() => {
        if (inView && hasMore) fetchMore();
    }, [inView, hasMore]);

    if (transactions.length === 0) return <EmptyState />;

    return (
        <div className="space-y-2">
            {transactions.map((tx) => (
                <TransactionItem key={tx.id} {...tx} />
            ))}
            {hasMore && (
                <div ref={ref} className="flex justify-center py-4 text-sm text-muted-foreground">
                    Loading more...
                </div>
            )}
        </div>
    );
}

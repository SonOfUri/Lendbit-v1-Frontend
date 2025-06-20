import FilterPanel from "../../components/TransactionHistory/FilterPanel.tsx";
import TransactionsPanel from "../../components/TransactionHistory/TransactionPanel.tsx";
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


const dummyData: Transaction[] = [
    {
        id: "1",
        hash: "0xabc123def456",
        type: "Deposit",
        status: "Success",
        amount: 250,
        asset: "USDC",
        chain: "Base",
        date: new Date("2025-06-01T14:00:00"),
    },
    {
        id: "2",
        hash: "0xdef789abc012",
        type: "Borrow",
        status: "Pending",
        amount: 100,
        asset: "DAI",
        chain: "Optimism",
        date: new Date("2025-06-05T10:30:00"),
    },
    {
        id: "3",
        hash: "0xaaa111bbb222",
        type: "Withdraw",
        status: "Failed",
        amount: 50,
        asset: "ETH",
        chain: "Ethereum",
        date: new Date("2025-06-06T20:45:00"),
    },
    {
        id: "4",
        hash: "0xaaa111bbb222",
        type: "Withdraw",
        status: "Failed",
        amount: 50,
        asset: "ETH",
        chain: "Ethereum",
        date: new Date("2025-06-06T20:45:00"),
    },
];

const TransactionHistory = () => {
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

    const [, setTransactions] = React.useState<Transaction[]>([]);
    const [page, setPage] = React.useState(1);
    const [hasMore, setHasMore] = React.useState(true);

    const fetchMore = async () => {
        const res = await fetch(`/api/transactions?page=${page}`);
        const data = await res.json();

        setTransactions((prev) => [...prev, ...data.transactions]);
        setPage((prev) => prev + 1);
        setHasMore(data.hasMore);
    };

    // Initial load
    React.useEffect(() => {
        fetchMore();
    }, []);


    return (
        <>
      <FilterPanel />

    <div className="p-6 max-w-4xl mx-auto">
        {/*<h1 className="text-xl font-bold mb-4">Transaction History</h1>*/}
        <TransactionsPanel
            transactions={dummyData}
            hasMore={hasMore}
            fetchMore={fetchMore}
        />
    </div>
        </>
    );


};

export default TransactionHistory;

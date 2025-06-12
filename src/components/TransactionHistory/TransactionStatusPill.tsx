type StatusProps = {
    status: "Pending" | "Success" | "Failed";
};

export function TransactionStatusPill({ status }: StatusProps) {
    const base = "px-3 py-1 text-xs rounded-full font-medium";

    const statusClasses = {
        Pending: "bg-yellow-100 text-yellow-800",
        Success: "bg-green-100 text-green-800",
        Failed: "bg-red-100 text-red-800",
    };

    return (
        <span className={`${base} ${statusClasses[status]}`}>
      {status}
    </span>
    );
}

import { FileX2 } from "lucide-react";

export default function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <FileX2 size={48} className="mb-2" />
            <p className="text-sm">No transactions found for the selected filters.</p>
        </div>
    );
}

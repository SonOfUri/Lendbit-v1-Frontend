import { useState } from "react";

const DateRangeAndSearch = ({
                                onDateChange,
                            }: {
    onDateChange: (range: { from: string; to: string }) => void;
}) => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");



    const handleDateChange = () => {
        if (fromDate && toDate) {
            onDateChange({ from: fromDate, to: toDate });
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end w-full">
            <div className="flex items-end justify-center gap-2">
                <div className="flex flex-col">
                    <label className="text-sm text-gray-400">From</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="bg-black text-white border border-gray-700 px-3 py-2 rounded-md"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm text-gray-400">To</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="bg-black text-white border border-gray-700 px-3 py-2 rounded-md"
                    />
                </div>

                <button
                    onClick={handleDateChange}
                    className="bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-md mt-1"
                >
                    Apply
                </button>
            </div>




        </div>
    );
};

export default DateRangeAndSearch;

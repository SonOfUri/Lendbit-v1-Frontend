import {useState} from "react";
import PillFilters from "../../components/TransactionHistory/PillFilters.tsx";
import DateRange from "../../components/TransactionHistory/DateRange.tsx";
import Search from "../../components/TransactionHistory/Search.tsx";
import { Calendar, Search as SearchIcon, Filter } from "lucide-react";

const FilterPannel = () => {
    const filterOptions = ["All", "Borrow", "Lend", "Swap", "Bridge"];
    const [activeFilter, setActiveFilter] = useState("All");

    const handleSearch = (term: string) => {
        console.log("Search Term:", term);
        // Apply search filtering logic here
    };

    const handleDateChange = (range: { from: string; to: string }) => {
        console.log("Date Range:", range);
        // Apply date filtering logic here
    };

    return (
        <div className="p-6 rounded-2xl shadow-sm border border-[#1a1a1a] space-y-6 w-full bg-[#050505] noise-2 mt-4">
            <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                {/* Section Label */}
                <h2 className="text-base font-semibold flex items-center gap-2 text-primary">
                    <Filter size={18} />
                    Filters
                </h2>

                {/* Pills */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        Filter by Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                        <PillFilters
                            options={filterOptions}
                            selected={activeFilter}
                            onSelect={setActiveFilter}
                            className="text-sm"
                        />
                    </div>
                </div>
            </div>


            {/* Date + Search Filters */}
            <div className="flex flex-wrap items-center justify-between space-y-4 w-full">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <Calendar size={16} /> Date Range
                    </label>
                    <DateRange onDateChange={handleDateChange} />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <SearchIcon size={16} /> Search Transactions
                    </label>
                    <Search onSearch={handleSearch} />
                </div>
            </div>
        </div>
    );


};

export default FilterPannel;

import { useState } from "react";

const Search = ({
                                onSearch,

                            }: {
    onSearch: (term: string) => void;
}) => {
    const [searchTerm, setSearchTerm] = useState("");


    const handleSearch = () => {
        onSearch(searchTerm);
    };



    return (
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end w-full">


            <div className="flex gap-2 w-full">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tx hash, token, amount..."
                    className="flex-grow w-[75%] bg-black text-white border border-gray-700 px-3 py-2 rounded-md"
                />
                <button
                    onClick={handleSearch}
                    className="w-[25%] bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-md"
                >
                    Search
                </button>
            </div>
        </div>
    );
};

export default Search;

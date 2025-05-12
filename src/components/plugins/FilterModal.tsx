type Props = {
    onClose: () => void;
};

const FilterModal: React.FC<Props> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-[#050505] bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-[#111] p-6 rounded-md w-[400px] text-white">
                <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-bold">Filter Options</h3>
                    <button onClick={onClose} className="text-gray-400">✕</button>
                </div>

                <div className="flex flex-col gap-4">
                    <input type="text" placeholder="Min Token Amount" className="bg-[#050505] border border-gray-700 rounded px-3 py-2" />
                    <input type="text" placeholder="Min USD Value" className="bg-[#050505] border border-gray-700 rounded px-3 py-2" />
                    <input type="text" placeholder="Min APR/APY %" className="bg-[#050505] border border-gray-700 rounded px-3 py-2" />
                    <input type="text" placeholder="Duration (in days)" className="bg-[#050505] border border-gray-700 rounded px-3 py-2" />

                    <button className="bg-white text-black px-4 py-2 mt-2 rounded w-full font-semibold">
                        Apply Filter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;

interface DateInputFieldProps {
	dateValue: string;
    setDateValue: (value: string) => void;
    text: string;
}

export const DateInputField = ({ dateValue, setDateValue, text }: DateInputFieldProps) => {
	const handleClear = () => {
		setDateValue("");
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDateValue(e.target.value);
	};

	return (
		<div className="w-full max-w-md">
			<label className="text-white font-semibold mb-2 block text-left">
				{text}
			</label>

			<div className="relative">
				<input
					type="date"
					value={dateValue}
					onChange={handleChange}
					className="w-full bg-[#191818] border border-gray-600 text-white rounded-md px-3 py-2 outline-none cursor-pointer"
				/>
				{dateValue && (
					<button
						type="button"
						onClick={handleClear}
						className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 text-lg"
					>
						✕
					</button>
				)}
			</div>
		</div>
	);
};